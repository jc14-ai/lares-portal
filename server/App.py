from flask import Flask, jsonify, request
from flask_cors import CORS
from google.oauth2.service_account import Credentials
import gspread
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

    spreadsheet_id = "1FSY9iphvfd4OixE8NpnH7_Zi-W62Sxo0CJPibWgUCww"
    sheet = client.open_by_key(spreadsheet_id)

    worksheet = sheet.worksheet("eSP Rebuild SOW4")

    global data
    
    data = worksheet.get_all_records()

    return jsonify({"message": "Initialized successfully"})

@app.route("/data", methods=["GET"])
def get_data():
    
    return jsonify(data)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
    