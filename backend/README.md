# CSV Analyzer Backend

A Flask backend for the CSV Analyzer application with Gemini AI integration for column analysis.

## Setup

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Set up environment variables:**
   Create a `.env` file in the backend directory with your Gemini API key:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Run the application:**
   ```bash
   python app.py
   ```

## API Endpoints

- `POST /upload` - Upload and analyze CSV files
- `POST /login` - User authentication
- `POST /get_column_description` - Get AI description for a specific column

## Environment Variables

- `GEMINI_API_KEY` - Your Google Gemini API key (required for AI column analysis)

## Security

- The `.env` file is excluded from Git commits to protect your API keys
- Never commit API keys to version control 