from flask import Flask, jsonify, request
from flask_cors import CORS
from google.oauth2.service_account import Credentials
import gspread
from dotenv import load_dotenv
import os

load_dotenv("credentials/.env")

app = Flask(__name__)

CORS(app)

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
        worksheet = sheet.worksheet("eSP Rebuild SOW4")

    global data
    if worksheet:
        data = worksheet.get_all_records()
    else:
        data = []


    return jsonify({"message": "Initialized successfully"})


@app.route("/data", methods=["GET"])
def get_data():
    records = [
        {
            'id': row.get('#', ''),
            'activity': row.get("Activity", ""), 
            'owner': row.get('Owner', ""),
            'planStart': row.get('Plan Start', ""),
            'planEnd': row.get('Plan End', ""),
            'actualStart': row.get('Actual Start', ""),
            'actualEnd': row.get('Actual End', ""),
            'status': row.get('Status', ""),
            'comments': row.get('Comments', "")
        } for row in data]
    
    return jsonify(records)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
    