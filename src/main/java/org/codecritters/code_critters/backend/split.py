import fitz  # PyMuPDF
import os
import re

# Path to your PDF
pdf_path = '/Users/amirwessam/Desktop/Dsa.pdf'
output_dir = './textbook_splits'

# Create output directory if it doesn't exist
os.makedirs(output_dir, exist_ok=True)

# Function to extract text from the specified page range of the PDF
def extract_text_from_pdf(pdf_path, start_page):
    doc = fitz.open(pdf_path)
    text = ""
    for page_num in range(start_page, len(doc)):
        page = doc.load_page(page_num)
        text += page.get_text("text")
    return text

# Function to split the extracted text into chapters and sections
def split_into_chapters(text):
    chapters = {}
    current_chapter = None
    current_section = None
    section_pattern = re.compile(r'(\d+\.\d+) (.*)')

    for line in text.split('\n'):
        chapter_match = re.match(r'Chapter (\d+)', line.strip())
        section_match = section_pattern.match(line.strip())

        if chapter_match:
            current_chapter = f"Chapter {chapter_match.group(1)}"
            chapters[current_chapter] = []
            current_section = None  # Reset section when starting a new chapter
        elif section_match:
            current_section = f"{section_match.group(1)} {section_match.group(2)}"
            if current_chapter and current_section:
                chapters[current_chapter].append({current_section: []})
        elif current_chapter and current_section:
            # Ensure that the section has been initialized before appending
            if chapters[current_chapter]:
                chapters[current_chapter][-1][current_section].append(line.strip())

    return chapters

# Function to save each chapter and section into separate text files
def save_chapters(chapters):
    for chapter, sections in chapters.items():
        for section in sections:
            for section_title, content in section.items():
                # Create a safe filename
                filename = f"{chapter}_{section_title}.txt".replace(' ', '_').replace('.', '-')
                filepath = os.path.join(output_dir, filename)
                
                # Save the file
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(section_title + '\n')
                    f.write('\n'.join(content))

# Extract the text starting from page 12 (page 11 in 0-indexed counting)
start_page = 11
text = extract_text_from_pdf(pdf_path, start_page)

# Split the text into chapters and sections
chapters = split_into_chapters(text)

# Save the chapters and sections to separate text files
save_chapters(chapters)

print(f"Chapters and sections have been split and saved in {output_dir}")
