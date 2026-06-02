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
    history = data.get('messages', [])

    if not prompt or len(prompt.strip()) < 5:
        return jsonify({'error': 'Você precisa inserir mais de 5 caracteres.', 'code': 400}), 400
    try:
        messages = []
        for msg in history:
            role = 'model' if msg['role'] == 'assistant' else 'user'
            messages.append(
                {
                    'role': role,
                    'parts': [
                        {
                            'text': msg['content']
                        }
                    ]
                }
            )
        response = client.models.generate_content(model='gemini-2.5-flash', contents=messages)
        generated_text = response.text
        return jsonify({'generated_text': generated_text, 'code': 200}), 200
    except Exception as e:
        logging.error(f"Error generating response: {e}")
        status_code = getattr(e, 'code', 500)
        message = "Erro interno no servidor."

        if status_code == 429:
            message = "Limite de requisições diárias atingido. Tente novamente mais tarde."
        elif status_code == 503:
            message = "O serviço do Gemini está indisponível no momento. Tente novamente em alguns segundos."
        elif hasattr(e, 'message'):
            message = e.message

        return jsonify({'error': message, 'code': status_code}), status_code


if __name__ == '__main__':
    app.run(debug=True)
