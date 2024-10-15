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
import PyPDF2
import json
import re

def extract_text_from_pdf(pdf_file):
    """Extract text from a PDF file."""
    text = ""
    with open(pdf_file, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        for page in reader.pages:
            text += page.extract_text() + "\n"
    return text

def parse_mcq(text):
    """Parse multiple-choice questions from the extracted text."""
    mcqs = []
    
    # Regular expressions to identify questions and options
    question_pattern = re.compile(r'^\d+\.\s+(.*?)(?=\s*[A-D]\.\s)')  # Matches lines like "1. Which if the following is/are the levels of implementation of data structure"
    option_pattern = re.compile(r'^\s*([A-D])\.\s+(.*)')  # Matches lines like "A) Option text"

    lines = text.split('\n')
    current_question = None
    current_options = []

    for line in lines:
        # Check if the line is a question
        question_match = question_pattern.match(line.strip())
        if question_match:
            if current_question:  # Save the previous question
                mcqs.append({
                    "question": current_question,
                    "options": current_options
                })
            current_question = question_match.group(1).strip()  # Get the question text
            current_options = []  # Reset options for the new question
        
        # Check if the line is an option
        option_match = option_pattern.match(line.strip())
        if option_match:
            current_options.append(option_match.group(2).strip())  # Get the option text

    # Append the last question if present
    if current_question:
        mcqs.append({
            "question": current_question,
            "options": current_options
        })

    return mcqs

def save_to_json(data, filename):
    """Save the parsed MCQs to a JSON file."""
    with open(filename, 'w') as f:
        json.dump(data, f, indent=4)

if __name__ == "__main__":
    # Specify the path to your PDF file
    pdf_file_path = "/Users/amirwessam/Desktop/417352754-300-TOP-DATA-STRUCTURES-and-ALGORITHMS-Multiple-Choice-Questions-and-Answers.pdf"
    
    # Step 1: Extract text from the PDF
    pdf_text = extract_text_from_pdf(pdf_file_path)  # Extract text from the PDF

    # Step 2: Parse MCQs from the extracted text
    mcq_data = parse_mcq(pdf_text)  # Parse multiple-choice questions

    # Step 3: Save the MCQs to a JSON file
    save_to_json(mcq_data, 'mcq_dataset.json')  # Save the dataset to a JSON file
    print("MCQ dataset created successfully and saved to 'mcq_dataset.json'")
