from flask import Flask, jsonify, request
from flask_cors import CORS
from google.oauth2.service_account import Credentials
import gspread
from dotenv import load_dotenv
import os

load_dotenv("credentials/.env")

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
        "credentials/lares-dashboard-bebe72285595.json",
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

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
    