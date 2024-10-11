/*-
 * #%L
 * Code Critters
 * %%
 * Copyright (C) 2019 - 2024 Michael Gruber
 * %%
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public
 * License along with this program.  If not, see
 * <http://www.gnu.org/licenses/gpl-3.0.html>.
 * #L%
 */
async function sendPrompt() {
    const prompt = document.getElementById('promptInput').value;  // Get the user input
    const loadingText = document.getElementById('loading');       // Get the loading text element
    const responseOutput = document.getElementById('responseOutput'); // Get the response output element

    loadingText.style.display = 'block'; // Show loading text
    responseOutput.innerText = ''; // Clear previous response

    try {
        const response = await fetch('http://localhost:8000/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt })  // Send the prompt in the request body
        });

        if (!response.ok) {  // Check if the response status is OK
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const data = await response.json();  // Parse the JSON response
        responseOutput.innerText = data.response;  // Display the response in HTML
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);  // Log any errors
        responseOutput.innerText = 'Error: ' + error.message;  // Display error in HTML
    } finally {
        loadingText.style.display = 'none'; // Hide loading text regardless of success or error
    }
}
