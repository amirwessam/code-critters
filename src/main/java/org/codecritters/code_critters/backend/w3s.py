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
# Web scraping from W3Schools DSA section

from urllib.request import urlopen as get
from bs4 import BeautifulSoup
import os
import re

# Base URL and navigation URLs
b_url = 'https://www.w3schools.com/dsa/'
n_url = 'dsa_intro.php'  # Starting with the introduction page
s_url = 'dsa_exam.php'  # The stop URL

# Counter for pages
page_count = 0

# Create output directory if it doesn't exist
output_dir = "data"
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

def sanitize_filename(filename):
    """Sanitize filename by replacing invalid characters."""
    return re.sub(r'[<>:"/\\|?*]', '_', filename)

def start(base_url, next_url, stop_url):
    global page_count
    print('Getting URL...')
    full_url = base_url + next_url
    print(f'Looking into {full_url}')
    
    try:
        html_doc = get(full_url)
        soup = BeautifulSoup(html_doc.read(), 'html.parser')
    except Exception as e:
        print(f"Failed to retrieve {full_url}. Error: {e}")
        return

    print('Cleaning page...')
    heading = soup.find('h1')
    header = heading.text.strip()

    nav = soup.find('div', {'class': 'w3-clear nextprev'})
    url_save = [a.get("href") for a in nav.findAll('a')] if nav else []

    u_d = soup.find('div', {'id': 'main'})
    
    # Remove unwanted sections
    if soup.find('div', {'id': 'mainLeaderboard'}):
        soup.find('div', {'id': 'mainLeaderboard'}).decompose()
    for div in soup.findAll('div', {'class': 'w3-clear nextprev'}):
        div.decompose()

    # Prepare content for file
    page = f'{header}\n\n{u_d.text.strip()}'
    
    page_count += 1
    print('Writing to file...')
    
    # Sanitize the header for filename
    sanitized_header = sanitize_filename(header)
    filename = f"{output_dir}/{page_count}_{sanitized_header}.txt"
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(page)

    print(f'{header} page saved.\nNumber of saved pages: {page_count}\n')

    # Continue to the next URL if it’s not the stop URL
    if len(url_save) > 1 and url_save[1] != stop_url:
        start(base_url, url_save[1], stop_url)

# Start the scraping process
start(b_url, n_url, s_url)

#https://gist.github.com/mkx775
