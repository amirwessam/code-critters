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
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
# 
# You should have received a copy of the GNU General Public
# License along with this program.  If not, see
# <http://www.gnu.org/licenses/gpl-3.0.html>.
# #L%
###
import requests
import fitz  # PyMuPDF
import json
import tiktoken
import re

# Step 1: Extract Information from PDF
def extract_text_from_pdf(url):
    response = requests.get(url)
    pdf_document = fitz.open(stream=response.content, filetype="pdf")
    
    text = ""
    for page in pdf_document:
        text += page.get_text()
    return text

# Step 2: Break it Down into Chunks
def split_text_into_chunks(text, outline, max_tokens=512):
    tokenizer = tiktoken.get_encoding("cl100k_base")
    chunks = []
    
    for section in outline:
        # Use regex to find sections more flexibly
        pattern = re.escape(section) + r'.*?(?=\n\d|$)'  # Match until the next section or end of text
        matches = re.findall(pattern, text, re.DOTALL)
        
        for match in matches:
            section_text = match.strip()

            # Split section text into manageable chunks
            sentences = section_text.split('. ')
            current_chunk = []
            current_length = 0

            for sentence in sentences:
                token_count = len(tokenizer.encode(sentence))
                if current_length + token_count > max_tokens:
                    chunks.append(' '.join(current_chunk))
                    current_chunk = [sentence]
                    current_length = token_count
                else:
                    current_chunk.append(sentence)
                    current_length += token_count

            if current_chunk:
                chunks.append(' '.join(current_chunk))
                
    return chunks

# Step 3: Save to JSON File
def save_chunks_to_json(chunks, filename='textbook_chunks.json'):
    with open(filename, 'w') as json_file:
        json.dump(chunks, json_file, indent=4)

# Example Usage
url = "https://www.mta.ca/~rrosebru/oldcourse/263114/Dsa.pdf"  # Replace with your textbook PDF URL
text = extract_text_from_pdf(url)

# Define the outline of the textbook
outline = [
    "1 Introduction",
    "1.1 What this book is, and what it isn’t",
    "1.2 Assumed knowledge",
    "1.2.1 Big Oh notation",
    "1.2.2 Imperative programming language",
    "1.2.3 Object oriented concepts",
    "1.3 Pseudocode",
    "1.4 Tips for working through the examples",
    "1.5 Book outline",
    "1.6 Testing",
    "1.7 Where can I get the code?",
    "1.8 Final messages",
    "I Data Structures",
    "2 Linked Lists",
    # Add the rest of your outline here
]

chunks = split_text_into_chunks(text, outline)
save_chunks_to_json(chunks)
