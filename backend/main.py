# Import necessary libraries

from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from google import genai
import logging
import os
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)
logging.basicConfig(level=logging.INFO)
load_dotenv()
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
client = genai.Client(api_key=GEMINI_API_KEY)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/generate', methods=['POST'])
def generate():
    data = request.get_json()
    prompt = data.get('prompt', '')
    if not prompt or len(prompt.strip()) < 5:
        return jsonify({'error': 'Prompt is required and must be at least 5 characters long', 'code': 400}), 400
    try:
        response = client.models.generate_content(model='gemini-2.5-flash', contents=prompt)
        generated_text = response.text
        return jsonify({'generated_text': generated_text, 'code': 200}), 200
    except Exception as e:
        logging.error(f"Error generating response: {e}")
        return jsonify({'error': str(e), 'code': 500}), 500


if __name__ == '__main__':
    app.run(debug=True)
