from flask import Flask, jsonify, request
from flask_cors import CORS
from google.oauth2.service_account import Credentials
import gspread
from dotenv import load_dotenv
import os

load_dotenv("credentials/.env")
credentials_path = os.getenv("CREDENTIALS_PATH")
port = os.getenv("FLASK_PORT")

app = Flask(__name__)

CORS(app)

data = []

@app.route("/", methods=["POST"])
def init():
    
    res = request.get_json()
    if not res:
        return jsonify({"error": "No JSON data provided"}), 400
    
    project = res.get('project')
    if not project:
        return jsonify({"error": "Project name is required"}), 400

    
    scope = ["https://www.googleapis.com/auth/spreadsheets.readonly"]

    creds = Credentials.from_service_account_file(
        credentials_path,
        scopes=scope
    )

    client = gspread.authorize(creds)

    spreadsheet_id = os.getenv("SPREADSHEET_ID")
    sheet = client.open_by_key(spreadsheet_id)
    
    worksheet = None
    if str(project) == "eSerbisyo Portal":
        worksheet = sheet.worksheet("eSP Workplan SOW 4")

    global data
    if worksheet:
        def is_not_int(value):
            try:
                int(value)
                return False
            except ValueError:
                return True

        data = worksheet.get_all_values()[7:]
        data = [row[:11] for row in data]
        data = [row[1:11] for row in data]
        data = [row for row in data if is_not_int(row[0])]
        data.pop(1)
        data.pop(1)
    else:
        data = []


    return jsonify({"message": "Initialized successfully"})


@app.route("/data", methods=["GET"])
def get_data():
    if not data:
        return jsonify([])
        
    headers = data[0]
    rows = data[1:]

    records = [
        {headers[i]: row[i] for i in range(len(headers))}
        for row in rows
    ]
    
    return jsonify([
        {
            "wbsNumber": record.get("WBS NUMBER"),
            "taskTitle": record.get("TASK TITLE"),
            "taskOwner": record.get("TASK OWNER"),
            "startDate": record.get("START DATE"),
            "dueDate": record.get("DUE DATE"),
            "planStartDate": record.get("PLAN START DATE"),
            "planEndDate": record.get("PLAN END DATE"),
            "progressStatus": record.get("PROGRESS STATUS"),
            "duration": record.get("DURATION"),
            "pct": record.get("PCT OF COMPLETED TASKS")
            } 
        for record in records])

@app.route("/api/leaves", methods=["GET"])
def get_leaves():
    scope = ["https://www.googleapis.com/auth/spreadsheets.readonly"]
    try:
        creds = Credentials.from_service_account_file(
            credentials_path,
            scopes=scope
        )
        client = gspread.authorize(creds)
        spreadsheet_id = "1l5kLk59-f0C2cBquDda5TU_9ncKjibSY5Tn8a-BrYZc"
        sheet = client.open_by_key(spreadsheet_id)
        worksheet = sheet.worksheet("Leave Calendar FY2026")
        raw_data = worksheet.get_all_values()
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    leave_data = raw_data[10:]

    legends = {
        "PTA": "Planned Time Away (Planned Leaves/Offset - Not Yet Approved)",
        "VL": "Vacation Leave (Approved)",
        "SL": "Sick Leave",
        "EL": "Emergency Leave",
        "HD": "Half Day",
        "TSW": "Training/ Seminar/ Workshop",
        "OW": "OT Weekend",
        "OH": "OT Holiday",
        "OS": "Offset",
        "ML": "Maternity Leave",
        "WFH": "Work From Home",
        "WOS": "Required to Work On Site",
        "HQ": "Home Quarantine",
        "LWOP": "Leave Without Pay",
        "PL": "Paternity Leave",
        "HOL": "Official Holiday",
        "SNWD": "Special Non Working Day",
        "CRD": "Change Rest Day"
    }

    months_data = {}
    month_names = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    holiday_codes = {"HOL", "SNWD", "HOLIDAY"}

    i = 0
    while i < len(leave_data):
        row = leave_data[i]
        month_match = None
        for m in month_names:
            text_to_check = " ".join([cell.strip() for cell in row[:3] if cell])
            if m in text_to_check:
                has_numeric_id = len(row) > 1 and row[1].strip().isdigit()
                if not has_numeric_id:
                    month_match = m
                    break

        if month_match:
            current_month = month_match
            if i + 2 >= len(leave_data):
                break
            header_days_row = leave_data[i + 1]
            day_numbers_row = leave_data[i + 2]

            days_of_week = [val.strip() for val in header_days_row[3:] if val.strip()]
            day_numbers = [val.strip() for val in day_numbers_row[3:] if val.strip()]
            num_days = len(day_numbers)

            months_data[current_month] = {
                "days_of_week": days_of_week[:num_days],
                "day_numbers": day_numbers,
                "employees": []
            }

            i += 3
            current_dept = ""

            while i < len(leave_data):
                emp_row = leave_data[i]
                is_next_month = False
                for m in month_names:
                    text_to_check = " ".join([cell.strip() for cell in emp_row[:3] if cell])
                    if m in text_to_check:
                        has_numeric_id = len(emp_row) > 1 and emp_row[1].strip().isdigit()
                        if not has_numeric_id:
                            is_next_month = True
                            break
                if is_next_month:
                    i -= 1
                    break

                if len(emp_row) > 2 and emp_row[1].strip().isdigit():
                    dept = emp_row[0].strip()
                    if dept:
                        current_dept = dept
                    emp_id = str(len(months_data[current_month]["employees"]) + 1)
                    emp_name = emp_row[2].strip()

                    statuses = [emp_row[idx].strip() for idx in range(3, min(3 + num_days, len(emp_row)))]
                    if len(statuses) < num_days:
                        statuses += [""] * (num_days - len(statuses))
                        
                    statuses = [s if s.upper() != "HOLIDAY" else "HOL" for s in statuses]

                    months_data[current_month]["employees"].append({
                        "department": current_dept,
                        "id": emp_id,
                        "name": emp_name,
                        "statuses": statuses
                    })
                i += 1

            employees = months_data[current_month]["employees"]
            holiday_days = []
            for day_idx in range(num_days):
                is_holiday = any(
                    emp["statuses"][day_idx].upper() in holiday_codes
                    for emp in employees
                )
                if is_holiday:
                    holiday_days.append(day_idx)
            months_data[current_month]["holiday_days"] = holiday_days

        i += 1

    return jsonify({
        "legends": legends,
        "months": months_data
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=port, debug=True)