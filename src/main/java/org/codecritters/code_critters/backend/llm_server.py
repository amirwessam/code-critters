from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests
import glob
from transformers import AutoTokenizer

app = Flask(__name__)
CORS(app)

# Set your Hugging Face API token
API_TOKEN = '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'  # Replace with your Hugging Face API token
MODEL_NAME = 'gpt2'  # The model you want to use

# Directory to save uploaded files
UPLOAD_FOLDER = 'uploads'
DATA_FOLDER = 'data'  # The folder containing your web scraped data
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Load text data from files into memory
def load_text_data(data_folder):
    text_data = {}
    for filename in glob.glob(os.path.join(data_folder, '*.txt')):
        with open(filename, 'r', encoding='utf-8') as file:
            content = file.read()
            text_data[os.path.basename(filename)] = content
    return text_data

text_data = load_text_data(DATA_FOLDER)

# Load the tokenizer for the model
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)

# Function to generate text from a given prompt using the Hugging Face Inference API
def generate_text(prompt, context):
    headers = {
        'Authorization': f'Bearer {API_TOKEN}',
        'Content-Type': 'application/json'
    }

    # Combine prompt and context
    combined_input = f"{context}\n\n{prompt}" if context else prompt

    # Token length check using the tokenizer
    input_tokens = tokenizer(combined_input, return_tensors='pt')
    total_tokens = input_tokens['input_ids'].shape[1]
    max_input_length = 1024 - 100  # Keep space for new tokens

    # Truncate if necessary
    if total_tokens > max_input_length:
        combined_input = tokenizer.decode(input_tokens['input_ids'][0][:max_input_length], skip_special_tokens=True)

    payload = {
        "inputs": combined_input,
        "parameters": {
            "max_length": 100,  # Adjust this as needed for desired length
            "do_sample": False
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

    # Retrieve relevant context from text data
    context = retrieve_relevant_context(prompt)

    # Generate the response for the prompt with context
    response = generate_text(prompt, context)
    return jsonify({'response': response})

# Function to retrieve relevant context based on the prompt
def retrieve_relevant_context(prompt):
    # Implement a simple keyword matching to find relevant files
    relevant_context = ""
    keywords = prompt.split()  # Split prompt into keywords
    for filename, content in text_data.items():
        if any(keyword.lower() in filename.lower() for keyword in keywords):
            relevant_context += content + "\n"  # Add relevant content
    return relevant_context

# Route to handle file uploads
@app.route('/upload', methods=['POST'])
def upload_files():
    uploaded_files = request.files.getlist('files')
    file_paths = []

    for file in uploaded_files:
        if file:
            file_path = os.path.join(UPLOAD_FOLDER, file.filename)
            file.save(file_path)  # Save the file
            file_paths.append(file_path)

    return jsonify({"filePaths": file_paths})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
