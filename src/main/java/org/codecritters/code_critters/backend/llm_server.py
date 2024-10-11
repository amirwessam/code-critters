###
# #%L
# Code Critters
# %%
# Copyright (C) 2019 - 2024 Michael Gruber
# %%
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as
# published by the Free Software Foundation, either version 3 of the
# License, or (at your option) any later version.
# 
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See
# the GNU General Public License for more details.
# 
# You should have received a copy of the GNU General Public
# License along with this program.  If not, see
# <http://www.gnu.org/licenses/gpl-3.0.html>.
# #L%
###
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import requests

app = Flask(__name__)
CORS(app)

# Set your Hugging Face API token
API_TOKEN = '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'  # Replace with your Hugging Face API token
MODEL_NAME = 'meta-llama/Llama-3.2-1B'  # The LLaMA model you want to use


# Function to generate text from a given prompt using the Hugging Face Inference API
def generate_text(prompt):

    headers = {
        'Authorization': f'Bearer {API_TOKEN}',
        'Content-Type': 'application/json'
    }
    
    payload = {
        "inputs": prompt,
        "parameters": {
            "max_length": 300000,  # Adjust as needed for desired length
            "do_sample": True
        }
    }
    
    # Send POST request to Hugging Face Inference API
    response = requests.post(f'https://api-inference.huggingface.co/models/{MODEL_NAME}', 
                             headers=headers, json=payload)
    
    if response.status_code == 200:
        return response.json()[0]['generated_text']
    else:
        return f"Error: {response.status_code} - {response.text}"

# API route to receive prompt and return generated text
@app.route('/generate', methods=['POST'])
def generate():
    data = request.json
    prompt = data.get('prompt', '').strip()
    
    if not prompt:
        return jsonify({'response': "Error"}), 400
    
    # Generate the response for the prompt
    response = generate_text(prompt)
    return jsonify({'response': response})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
