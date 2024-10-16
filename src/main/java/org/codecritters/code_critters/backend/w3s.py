from urllib.request import urlopen as get
from bs4 import BeautifulSoup
import os
import re

# Base URL and navigation URLs
b_url = 'https://www.w3schools.com/dsa/'
n_url = 'dsa_intro.php'  # Starting with the introduction page
s_url = 'dsa_exam.php'  # The stop URL

# Create output directory if it doesn't exist
output_dir = "data"
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

def sanitize_filename(url):
    """Sanitize a URL to be used as a filename by replacing invalid characters and slashes with underscores."""
    return url.replace('https://', 'https_').replace('/', '_')

def clean_soup(soup):
    """Remove unnecessary parts from the soup."""
    # Remove scripts, styles, footers, navs, and ads
    for tag in soup(['script', 'style', 'footer', 'nav', 'aside']):
        tag.decompose()

    # Remove specific unwanted sections like "W3schools Pathfinder" and "Log in/Sign Up"
    unwanted_phrases = [
        'Run the simulation', 'Speed:', 'Start the Exercise', 'Submit Answer', 'Try Yourself', 'Game',
        'Bubble Sort game', 'Run Example', 'Play', 'See how it works', 'Simulation', 'Run',
        'W3schools Pathfinder', 'Track your progress', 'Log in', 'Sign Up'
    ]
    
    # Remove any sections containing unwanted phrases
    for phrase in unwanted_phrases:
        for tag in soup.find_all(string=lambda text: text and phrase in text):
            parent_tag = tag.find_parent()
            if parent_tag:
                parent_tag.decompose()

    # Remove interactive elements like buttons, dynamic placeholders, or forms
    unwanted_classes = ['mainLeaderboard', 'log-in', 'signup', 'button', 'tryit', 'w3-code', 'w3-clear nextprev']
    for unwanted in unwanted_classes:
        for tag in soup.find_all(class_=unwanted):
            tag.decompose()

    return soup

def format_text(text):
    """Reformat text to improve readability by removing extra newlines and fixing spacing."""
    # Remove extra newlines
    text = re.sub(r'\n+', '\n\n', text)
    return text.strip()

def start(base_url, next_url, stop_url):
    print('Getting URL...')
    full_url = base_url + next_url
    print(f'Looking into {full_url}')
    
    try:
        html_doc = get(full_url)
        soup = BeautifulSoup(html_doc.read(), 'html.parser')
    except Exception as e:
        print(f"Failed to retrieve {full_url}. Error: {e}")
        return

    # Find the next page link before cleaning
    nav = soup.find('div', {'class': 'w3-clear nextprev'})
    
    if nav:
        links = nav.find_all('a')
        next_link = None
        
        # Look for the "Next ❯" button explicitly
        for link in links:
            if 'Next ❯' in link.text:
                next_link = link.get("href")
                break
    else:
        print('No navigation found.')
        return

    # Clean the page after extracting navigation
    soup = clean_soup(soup)

    print('Cleaning page...')
    heading = soup.find('h1')
    header = heading.text.strip() if heading else 'No Title'
    
    u_d = soup.find('div', {'id': 'main'})
    
    # Prepare content for file
    page = f'## {header}\n\n{u_d.text.strip()}' if u_d else "No content found"
    
    # Format the text to remove extra newlines
    formatted_page = format_text(page)

    print('Writing to file...')
    
    # Sanitize the full URL for filename
    sanitized_filename = sanitize_filename(full_url)
    filename = f"{output_dir}/{sanitized_filename}.txt"
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(formatted_page)

    print(f'{header} page saved as {filename}.\n')

    # Move to the next page
    if next_link and next_link != stop_url:
        print(f'Moving to next page: {next_link}')
        start(base_url, next_link, stop_url)
    else:
        print('No more pages to scrape or reached stop URL.')

# Start the scraping process
start(b_url, n_url, s_url)
