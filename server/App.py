from flask import Flask, jsonify, request
from flask_cors import CORS
from google.oauth2.service_account import Credentials
import gspread
from dotenv import load_dotenv
import os

load_dotenv("credentials/.env")

app = Flask(__name__)

CORS(app)

@app.route("/")
def init():
    scope = ["https://www.googleapis.com/auth/spreadsheets.readonly"]

    creds = Credentials.from_service_account_file(
        "credentials/lares-dashboard-bebe72285595.json",
        scopes=scope
    )

    client = gspread.authorize(creds)

    spreadsheet_id = os.getenv("SPREADSHEET_ID")
    sheet = client.open_by_key(spreadsheet_id)

    worksheet = sheet.worksheet("eSP Rebuild SOW4")

    global data
    
    data = worksheet.get_all_records()

    return jsonify({"message": "Initialized successfully"})

@app.route("/data", methods=["GET"])
def get_data():
    records = [
        {
            'id': row['#'],
            'activity': row["Activity"], 
            'owner': row['Owner'],
            'planStart': row['Plan Start'],
            'planEnd': row['Plan End'],
            'actualStart': row['Actual Start'],
            'actualEnd': row['Actual End'],
            'status': row['Status'],
            'comments': row['Comments']
        } for row in data]
    
    return jsonify(records)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
    