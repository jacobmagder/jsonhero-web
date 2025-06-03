document.addEventListener('DOMContentLoaded', () => {
    // DOM Element References
    const themeToggleButton = document.getElementById('theme-toggle-button');
    const processJsonButton = document.getElementById('process-json-button');
    const saveJsonButton = document.getElementById('save-json-button'); // For optional step
    const jsonInput = document.getElementById('json-input');
    const jsonTreeDisplay = document.getElementById('json-tree-display');
    const selectedPathDisplay = document.getElementById('selected-path-display');
    const copyPathButton = document.getElementById('copy-path-button');

    // --- Global State (Simplified) ---
    let currentSelectedPath = '';
    let currentSelectedValue = undefined; // To store the actual selected value

    // --- Helper for Highlighting ---
    let currentlySelectedElement = null;

    function highlightSelectedNode(element) {
        if (currentlySelectedElement) {
            currentlySelectedElement.classList.remove('selected-node');
        }
        if (element) {
            element.classList.add('selected-node');
            currentlySelectedElement = element;
        } else {
            currentlySelectedElement = null;
        }
    }

    // Helper to remove all children from a DOM element
    function clearElement(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }

    // --- Theme Toggle Functionality ---
    function applyTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    }

    function toggleTheme() {
        const currentIsDark = document.body.classList.contains('dark-theme');
        const newTheme = currentIsDark ? 'light' : 'dark';
        applyTheme(newTheme);
        try {
            localStorage.setItem('theme', newTheme);
        } catch (e) {
            console.warn('LocalStorage not available for theme saving.', e);
        }
    }

    // Load saved theme or default
    try {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            applyTheme(savedTheme);
        } else {
            // Optional: Check system preference if no saved theme
            // if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            //     applyTheme('dark');
            // } else {
            //     applyTheme('light'); // Default
            // }
            applyTheme('light'); // Default to light if no saved theme & not checking system pref
        }
    } catch (e) {
        console.warn('LocalStorage not available for theme loading.', e);
        applyTheme('light'); // Default if localStorage fails
    }


    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', toggleTheme);
    }

    // --- Selected Path Display & Copy ---
    // updateSelectedPathDisplay is defined after renderJsonTree in the prompt,
    // but it's used by it. So, ensure its definition is hoisted or moved before.
    // For simplicity here, assuming it's accessible as defined later in the original script structure.
    // Actual `updateSelectedPathDisplay` function from previous step is fine.
    // function updateSelectedPathDisplay(path, value) { ... }


    // Main recursive function to render the JSON tree
    function renderJsonTree(data, parentElement, currentPathStr) {
        if (parentElement.id === 'json-tree-display') { // Root call
            clearElement(parentElement);
        }

        if (data === null) {
            const valueElement = document.createElement('span');
            valueElement.className = 'json-value null';
            valueElement.textContent = 'null';
            valueElement.addEventListener('click', (e) => {
                e.stopPropagation();
                updateSelectedPathDisplay(currentPathStr, data); // Assumes updateSelectedPathDisplay is in scope
                highlightSelectedNode(e.target);
            });
            parentElement.appendChild(valueElement);
            return;
        }

        const type = typeof data;

        if (type === 'string' || type === 'number' || type === 'boolean') {
            const valueElement = document.createElement('span');
            valueElement.className = `json-value ${type}`;
            valueElement.textContent = type === 'string' ? `"${data}"` : String(data);
            valueElement.addEventListener('click', (e) => {
                e.stopPropagation();
                updateSelectedPathDisplay(currentPathStr, data);
                highlightSelectedNode(e.target);
            });
            parentElement.appendChild(valueElement);
            return;
        }

        if (Array.isArray(data)) {
            const nodeContainer = document.createElement('div');
            nodeContainer.className = 'json-node';

            const lineHeader = document.createElement('div');
            lineHeader.style.cursor = 'pointer';

            const toggle = document.createElement('span');
            toggle.className = 'json-toggle';
            toggle.textContent = '▼ ';

            const openingBracket = document.createElement('span');
            openingBracket.textContent = '[';

            const childrenContainer = document.createElement('div');
            childrenContainer.className = 'json-node-container';

            const summary = document.createElement('span');
            summary.textContent = ` ... ${data.length} item(s) ... `;
            summary.style.display = 'none';
            summary.className = 'json-summary';

            lineHeader.appendChild(toggle);
            lineHeader.appendChild(openingBracket);
            lineHeader.appendChild(summary); // Summary for collapsed view

            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                const isHidden = childrenContainer.style.display === 'none';
                childrenContainer.style.display = isHidden ? '' : 'none';
                summary.style.display = isHidden ? 'none' : 'inline';
                toggle.textContent = isHidden ? '▼ ' : '▶ ';
                // Ensure closing bracket is visible/hidden with children if it's part of childrenContainer
                const closingBracketElem = childrenContainer.querySelector('.closing-bracket-array');
                if(closingBracketElem) closingBracketElem.style.display = isHidden ? '' : 'none';

            });

            lineHeader.addEventListener('click', (e) => {
                if (e.target === toggle) return;
                e.stopPropagation();
                updateSelectedPathDisplay(currentPathStr, data);
                highlightSelectedNode(lineHeader);
            });

            nodeContainer.appendChild(lineHeader);
            nodeContainer.appendChild(childrenContainer);

            data.forEach((item, index) => {
                const itemPath = `${currentPathStr}[${index}]`;
                const itemDiv = document.createElement('div');
                itemDiv.style.display = 'flex'; // Align index and value

                const indexSpan = document.createElement('span');
                indexSpan.className = 'json-key';
                indexSpan.textContent = `${index}: `;
                indexSpan.style.cursor = 'pointer';
                indexSpan.addEventListener('click', (e) => {
                    e.stopPropagation();
                    updateSelectedPathDisplay(itemPath, item);
                    highlightSelectedNode(indexSpan);
                });

                itemDiv.appendChild(indexSpan);
                renderJsonTree(item, itemDiv, itemPath);
                childrenContainer.appendChild(itemDiv);
            });

            const closingBracket = document.createElement('span');
            closingBracket.textContent = ']';
            closingBracket.className = 'closing-bracket-array'; // For toggle visibility
            childrenContainer.appendChild(closingBracket);

            parentElement.appendChild(nodeContainer);
            return;
        }

        if (type === 'object') {
            const nodeContainer = document.createElement('div');
            nodeContainer.className = 'json-node';

            const lineHeader = document.createElement('div');
            lineHeader.style.cursor = 'pointer';

            const toggle = document.createElement('span');
            toggle.className = 'json-toggle';
            toggle.textContent = '▼ ';

            const openingBrace = document.createElement('span');
            openingBrace.textContent = '{';

            const childrenContainer = document.createElement('div');
            childrenContainer.className = 'json-node-container';

            const keys = Object.keys(data);
            const summary = document.createElement('span');
            summary.textContent = ` ... ${keys.length} key(s) ... `;
            summary.style.display = 'none';
            summary.className = 'json-summary';

            lineHeader.appendChild(toggle);
            lineHeader.appendChild(openingBrace);
            lineHeader.appendChild(summary);

            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                const isHidden = childrenContainer.style.display === 'none';
                childrenContainer.style.display = isHidden ? '' : 'none';
                summary.style.display = isHidden ? 'none' : 'inline';
                toggle.textContent = isHidden ? '▼ ' : '▶ ';
                // Ensure closing brace is visible/hidden with children
                const closingBraceElem = childrenContainer.querySelector('.closing-brace-object');
                if(closingBraceElem) closingBraceElem.style.display = isHidden ? '' : 'none';
            });

            lineHeader.addEventListener('click', (e) => {
                if (e.target === toggle) return;
                e.stopPropagation();
                updateSelectedPathDisplay(currentPathStr, data);
                highlightSelectedNode(lineHeader);
            });

            nodeContainer.appendChild(lineHeader);
            nodeContainer.appendChild(childrenContainer);

            keys.forEach(key => {
                const propertyPath = `${currentPathStr}.${key}`; // Simpler path for objects
                const propertyDiv = document.createElement('div');
                propertyDiv.style.display = 'flex'; // Align key and value

                const keySpan = document.createElement('span');
                keySpan.className = 'json-key';
                keySpan.textContent = `"${key}": `;
                keySpan.style.cursor = 'pointer';
                keySpan.addEventListener('click', (e) => {
                    e.stopPropagation();
                    updateSelectedPathDisplay(propertyPath, data[key]);
                    highlightSelectedNode(keySpan);
                });

                propertyDiv.appendChild(keySpan);
                renderJsonTree(data[key], propertyDiv, propertyPath);
                childrenContainer.appendChild(propertyDiv);
            });

            const closingBrace = document.createElement('span');
            closingBrace.textContent = '}';
            closingBrace.className = 'closing-brace-object'; // For toggle visibility
            childrenContainer.appendChild(closingBrace);

            parentElement.appendChild(nodeContainer);
            return;
        }
    }

    // --- Selected Path Display & Copy ---
    // Moved updateSelectedPathDisplay here to ensure it's defined before renderJsonTree uses it.
    function updateSelectedPathDisplay(path, value) {
        currentSelectedPath = path;
        currentSelectedValue = value; // Store the actual value
        if (selectedPathDisplay) {
            selectedPathDisplay.textContent = path;
        }
    }

    if (copyPathButton) {
        copyPathButton.addEventListener('click', () => {
            if (currentSelectedPath) {
                navigator.clipboard.writeText(currentSelectedPath)
                    .then(() => {
                        // Optional: Visual feedback
                        const originalText = copyPathButton.textContent;
                        copyPathButton.textContent = 'Copied!';
                        setTimeout(() => {
                            copyPathButton.textContent = originalText;
                        }, 1500);
                    })
                    .catch(err => {
                        console.error('Failed to copy path: ', err);
                        alert('Failed to copy path.');
                    });
            } else {
                alert('No path selected to copy.');
            }
        });
    }

    // --- JSON Processing ---
    function displayError(message) {
        if (jsonTreeDisplay) {
            jsonTreeDisplay.innerHTML = ''; // Clear previous content
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = message;
            jsonTreeDisplay.appendChild(errorDiv);
        }
    }

    if (processJsonButton && jsonInput && jsonTreeDisplay) {
        processJsonButton.addEventListener('click', () => {
            const jsonString = jsonInput.value;
            if (!jsonString.trim()) {
                displayError('JSON input cannot be empty.');
                return;
            }

            try {
                const parsedData = JSON.parse(jsonString);
                jsonTreeDisplay.innerHTML = ''; // Clear previous tree or error
                updateSelectedPathDisplay('', null); // Reset path display on new JSON
                highlightSelectedNode(null); // <<< ADD THIS LINE to clear previous highlight
                renderJsonTree(parsedData, jsonTreeDisplay, '$'); // This line should now call the new function

            } catch (error) {
                displayError(`Invalid JSON: ${error.message}`);
                highlightSelectedNode(null); // <<< ADD THIS LINE to clear highlight on error
                console.error('JSON Parsing Error:', error);
            }
        });
    }

    // --- Save JSON Button (Optional Step 5) ---
    if (saveJsonButton && jsonInput) {
        saveJsonButton.addEventListener('click', () => {
            const jsonString = jsonInput.value;
            if (!jsonString.trim()) {
                alert('Nothing to save. JSON input is empty.');
                return;
            }
            try {
                // Validate JSON before saving
                JSON.parse(jsonString);

                const blob = new Blob([jsonString], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'data.json';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            } catch (error) {
                alert(`Cannot save invalid JSON: ${error.message}`);
            }
        });
    }

}); // End of DOMContentLoaded
