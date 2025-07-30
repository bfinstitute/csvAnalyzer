from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import pandas as pd
import requests
import json
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Gemini API Configuration
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', '')
GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent"

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)
    # --- CSV Summary ---
    try:
        df = pd.read_csv(filepath)
        summary = {
            'filename': file.filename,
            'num_rows': len(df),
            'num_columns': len(df.columns),
            'columns': list(df.columns),
            'sample': df.head(5).to_dict(orient='records')
        }
    except Exception as e:
        return jsonify({'error': f'Failed to process CSV: {str(e)}'}), 500
    # --- Column Annotation with Gemini AI ---
    columns_list = list(df.columns)
    annotations = {}
    
    # Get sample data for context
    sample_data = df.head(3).to_dict(orient='records')
    sample_text = "\n".join([f"Row {i+1}: {json.dumps(row)}" for i, row in enumerate(sample_data)])
    
    # Create prompt for all columns at once
    prompt = f"""
You are a data expert. The following CSV file has these column headers:

{', '.join(columns_list)}

Here are a few sample rows:

{sample_text}

Please analyze the column names and give a description of what each one likely refers to or means.
Output your answer as a JSON object where keys are column names and values are descriptions.
Example format: {{"column1": "description1", "column2": "description2"}}

Only return the JSON object, no other text.
"""
    
    try:
        # Call Gemini API
        headers = {
            'Content-Type': 'application/json',
        }
        
        data = {
            "contents": [{
                "parts": [{
                    "text": prompt
                }]
            }]
        }
        
        response = requests.post(
            f"{GEMINI_URL}?key={GEMINI_API_KEY}",
            headers=headers,
            json=data,
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            if 'candidates' in result and len(result['candidates']) > 0:
                ai_response = result['candidates'][0]['content']['parts'][0]['text']
                try:
                    # Try to parse as JSON
                    ai_annotations = json.loads(ai_response)
                    annotations = ai_annotations
                except json.JSONDecodeError:
                    # Fallback to human descriptions
                    annotations = {col: human_column_description(col) for col in columns_list}
            else:
                annotations = {col: human_column_description(col) for col in columns_list}
        else:
            print(f"Gemini API error: {response.status_code} - {response.text}")
            annotations = {col: human_column_description(col) for col in columns_list}
            
    except Exception as e:
        print(f"Error calling Gemini API: {str(e)}")
        annotations = {col: human_column_description(col) for col in columns_list}
    return jsonify({
        'message': 'File uploaded successfully',
        'summary': summary,
        'annotations': annotations
    }), 200

@app.route('/get_column_description', methods=['POST'])
def get_column_description():
    data = request.get_json()
    column_name = data.get('column_name')
    sample_data = data.get('sample_data', [])
    
    if not column_name:
        return jsonify({'error': 'Column name is required'}), 400
    
    # Create prompt for single column
    sample_text = "\n".join([f"Row {i+1}: {json.dumps(row)}" for i, row in enumerate(sample_data[:3])])
    
    prompt = f"""
You are a data expert. I have a CSV column named "{column_name}".

Here are a few sample rows from the dataset:

{sample_text}

Please provide a clear, concise description of what this column likely represents or contains.
Focus on the business meaning and purpose of this data field.
"""
    
    try:
        headers = {
            'Content-Type': 'application/json',
        }
        
        data = {
            "contents": [{
                "parts": [{
                    "text": prompt
                }]
            }]
        }
        
        response = requests.post(
            f"{GEMINI_URL}?key={GEMINI_API_KEY}",
            headers=headers,
            json=data,
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            if 'candidates' in result and len(result['candidates']) > 0:
                description = result['candidates'][0]['content']['parts'][0]['text']
                return jsonify({'description': description}), 200
            else:
                return jsonify({'description': human_column_description(column_name)}), 200
        else:
            return jsonify({'description': human_column_description(column_name)}), 200
            
    except Exception as e:
        return jsonify({'description': human_column_description(column_name)}), 200

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    # Dummy credentials for demonstration
    if email == 'test@example.com' and password == 'password123':
        return jsonify({'success': True, 'message': 'Login successful'}), 200
    else:
        return jsonify({'success': False, 'message': 'Invalid credentials'}), 401

# Add this function to provide human-readable descriptions

def human_column_description(col):
    col = col.lower()
    if 'id' in col and 'client' in col:
        return 'Unique identifier for the client or requester.'
    if 'id' in col and 'case' in col:
        return 'Unique identifier for each case or service request.'
    if 'date' in col and 'open' in col:
        return 'Date when the case was opened.'
    if 'date' in col and 'close' in col:
        return 'Date when the case was closed.'
    if 'sla' in col:
        return 'Service Level Agreement (SLA) related date or days.'
    if 'late' in col:
        return 'Indicates if the case was resolved late.'
    if 'subject' in col:
        return 'Department or subject area handling the case.'
    if 'source' in col:
        return 'Source of the case (e.g., phone, web, app).'
    if 'desc' in col:
        return 'Description or address related to the case.'
    if 'district' in col:
        return 'City council district where the case occurred.'
    if 'coord' in col:
        return 'Coordinate for the case location.'
    if 'lat' in col:
        return 'Latitude coordinate of the case location.'
    if 'long' in col:
        return 'Longitude coordinate of the case location.'
    if 'duration' in col:
        return 'Duration of the case.'
    if 'day' in col:
        return 'Day related to the case.'
    if 'month' in col:
        return 'Month related to the case.'
    if 'year' in col:
        return 'Year related to the case.'
    if 'hour' in col:
        return 'Hour related to the case.'
    if 'fiscal' in col:
        return 'Fiscal year in which the case was opened.'
    if 'week' in col:
        return 'Weekly weather or environmental data.'
    if 'prcp' in col:
        return 'Precipitation (rainfall) data.'
    if 'snow' in col:
        return 'Snowfall data.'
    if 'tfrz' in col:
        return 'Number of freezing temperature days.'
    if 'tmax' in col:
        return 'Maximum temperature.'
    if 'tmin' in col:
        return 'Minimum temperature.'
    if 'tavg' in col:
        return 'Average temperature.'
    if 'tdif' in col:
        return 'Temperature difference.'
    if 'cases' == col:
        return 'Number of cases.'
    return 'No description available.'

if __name__ == '__main__':
    app.run(debug=True) 