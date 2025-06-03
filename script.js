// Get DOM elements
const jsonInput = document.getElementById('json-input');
const jsonFileInput = document.getElementById('json-file-input');
const treeDisplay = document.getElementById('tree-display');
const searchInput = document.getElementById('search-input');
const expandAllButton = document.getElementById('expand-all-button');
const collapseAllButton = document.getElementById('collapse-all-button');
const saveButton = document.getElementById('save-button');
const convertButton = document.getElementById('convert-button'); // Get convert button

// 1. Add event listener for JSON text input
jsonInput.addEventListener('input', (event) => {
    const jsonString = event.target.value;
    parseAndRenderJson(jsonString);
});

// 2. Add event listener for JSON file input
jsonFileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const jsonString = e.target.result;
            parseAndRenderJson(jsonString);
        };
        reader.readAsText(file);
    }
});

// 3. Create the parseAndRenderJson(jsonString) function
function parseAndRenderJson(jsonString) {
    treeDisplay.innerHTML = ''; // Clear previous tree or error message
    try {
        if (jsonString.trim() === '') {
            // If input is empty, do nothing further
            return;
        }
        const jsonObject = JSON.parse(jsonString);
        generateTree(jsonObject, treeDisplay);
    } catch (error) {
        if (error instanceof SyntaxError) {
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.textContent = `Invalid JSON: ${error.message}`;
            treeDisplay.appendChild(errorMessage);
        } else {
            // Handle other potential errors
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.textContent = `An unexpected error occurred: ${error.message}`;
            treeDisplay.appendChild(errorMessage);
            console.error("Error parsing/rendering JSON:", error);
        }
    }
}

// 4. Create the generateTree(data, parentElement) function (recursive)
function generateTree(data, parentElement) {
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const value = data[key];
            const nodeDiv = document.createElement('div');
            // Ensure a common class for all items, and specific classes for type
            nodeDiv.className = 'tree-node-item tree-node';

            if (typeof value === 'object' && value !== null) {
                nodeDiv.classList.add('tree-node-internal');

                const toggle = document.createElement('span');
                toggle.className = 'toggle-icon expanded-icon';
                nodeDiv.appendChild(toggle);

                const keySpan = document.createElement('span');
                keySpan.className = 'key';
                keySpan.textContent = `${key}: `;
                nodeDiv.appendChild(keySpan);

                const valueHintSpan = document.createElement('span'); // Placeholder for object/array indication
                valueHintSpan.textContent = Array.isArray(value) ? '[Array]' : '{Object}';
                valueHintSpan.style.marginLeft = '5px'; // Spacing after key
                nodeDiv.appendChild(valueHintSpan);

                const childrenContainer = document.createElement('div');
                childrenContainer.className = 'tree-node-children-container';
                // The 'tree-node' class on children will provide indentation via its margin-left
                // childrenContainer.style.marginLeft = '20px'; // Indentation for children container itself if needed

                generateTree(value, childrenContainer);
                nodeDiv.appendChild(childrenContainer);

                toggle.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent event from bubbling up to parent toggles
                    const parentNodeItem = e.target.closest('.tree-node-item');
                    parentNodeItem.classList.toggle('collapsed');
                    toggle.classList.toggle('expanded-icon');
                    toggle.classList.toggle('collapsed-icon');
                });

            } else {
                nodeDiv.classList.add('tree-node-leaf');
                // Add a placeholder for alignment with internal nodes if desired
                const placeholderSpan = document.createElement('span');
                placeholderSpan.className = 'toggle-icon'; // Same class for alignment
                placeholderSpan.style.visibility = 'hidden'; // Keep space but don't show icon
                nodeDiv.appendChild(placeholderSpan);

                const keySpan = document.createElement('span');
                keySpan.className = 'key';
                keySpan.textContent = `${key}: `;
                nodeDiv.appendChild(keySpan);

                // For primitive values, display key and value
                if (typeof value === 'string') {
                    // Image detection logic
                    const isImageUrl = (str) => (str.startsWith('http://') || str.startsWith('https://')) && /\.(svg|png|jpg|jpeg|gif|webp)$/i.test(str);
                    const isBase64Image = (str) => str.startsWith('data:image/');

                    if (isImageUrl(value) || isBase64Image(value)) {
                        const imgElement = document.createElement('img');
                        imgElement.src = value;
                        imgElement.className = 'tree-node-image';
                        // Optionally set alt text, perhaps from the key or a truncated string
                        imgElement.alt = `Image for key: ${key}`;
                        nodeDiv.appendChild(imgElement);
                    } else {
                        const valueSpan = document.createElement('span');
                        valueSpan.className = 'value';
                        valueSpan.textContent = value;
                        nodeDiv.appendChild(valueSpan);
                    }
                } else {
                    const valueSpan = document.createElement('span');
                    valueSpan.className = 'value';
                    valueSpan.textContent = String(value); // Convert boolean/null to string
                    nodeDiv.appendChild(valueSpan);
                }
            }
            parentElement.appendChild(nodeDiv);
        }
    }
}

// Expand All functionality
function expandAll() {
    const allInternalNodes = document.querySelectorAll('.tree-node-internal');
    allInternalNodes.forEach(node => {
        node.classList.remove('collapsed');
        const toggle = node.querySelector('.toggle-icon');
        if (toggle) {
            toggle.classList.remove('collapsed-icon');
            toggle.classList.add('expanded-icon');
        }
    });
}

// Collapse All functionality
function collapseAll() {
    const allInternalNodes = document.querySelectorAll('.tree-node-internal');
    allInternalNodes.forEach(node => {
        node.classList.add('collapsed');
        const toggle = node.querySelector('.toggle-icon');
        if (toggle) {
            toggle.classList.remove('expanded-icon');
            toggle.classList.add('collapsed-icon');
        }
    });
}

// Add event listeners for new buttons
expandAllButton.addEventListener('click', expandAll);
collapseAllButton.addEventListener('click', collapseAll);

// Function to save JSON to a file
function saveJsonFile() {
    const jsonString = jsonInput.value;

    // Optional: Check if there's content to save
    // if (!jsonString.trim()) {
    //     alert("Nothing to save. JSON input is empty.");
    //     return;
    // }

    const blob = new Blob([jsonString], { type: 'application/json' });
    const anchorElement = document.createElement('a');
    anchorElement.href = URL.createObjectURL(blob);
    anchorElement.download = 'data.json'; // Default filename

    document.body.appendChild(anchorElement); // Required for Firefox
    anchorElement.click();
    document.body.removeChild(anchorElement); // Clean up

    URL.revokeObjectURL(anchorElement.href);
}

// Add event listener for the save button
saveButton.addEventListener('click', saveJsonFile);

// Function to escape CSV cell content
function escapeCsvCell(cellData) {
    if (cellData == null) { // Handles undefined and null
        return '';
    }
    let cellString = String(cellData);
    if (typeof cellData === 'object') {
        cellString = JSON.stringify(cellData);
    }

    // If the string contains a comma, newline, or double quote, wrap it in double quotes.
    if (cellString.includes(',') || cellString.includes('\n') || cellString.includes('"')) {
        // Escape existing double quotes by doubling them
        cellString = cellString.replace(/"/g, '""');
        return `"${cellString}"`;
    }
    return cellString;
}


// Function to convert JSON to CSV
function convertToCsv() {
    const jsonString = jsonInput.value;
    if (!jsonString.trim()) {
        alert("JSON input is empty. Nothing to convert.");
        return;
    }

    let parsedJson;
    try {
        parsedJson = JSON.parse(jsonString);
    } catch (error) {
        alert(`Invalid JSON: ${error.message}`);
        console.error("Error parsing JSON for CSV conversion:", error);
        return;
    }

    let data = parsedJson;
    if (!Array.isArray(data)) {
        data = [data]; // Wrap single object in an array
    }

    if (data.length === 0 || !data.every(item => typeof item === 'object' && item !== null)) {
        alert("CSV conversion works best with an array of objects or a single object. Please ensure the top-level structure is an object or an array of objects.");
        return;
    }

    const headerSet = new Set();
    data.forEach(obj => {
        if (typeof obj === 'object' && obj !== null) {
            Object.keys(obj).forEach(key => headerSet.add(key));
        }
    });

    if (headerSet.size === 0) {
        alert("No data to convert. The JSON object(s) appear to be empty or not structured as key-value pairs.");
        return;
    }

    const headers = Array.from(headerSet);
    let csvContent = headers.map(header => escapeCsvCell(header)).join(',') + '\n';

    data.forEach(obj => {
        if (typeof obj === 'object' && obj !== null) {
            const row = headers.map(header => {
                const value = obj[header];
                return escapeCsvCell(value);
            });
            csvContent += row.join(',') + '\n';
        }
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const anchorElement = document.createElement('a');
    anchorElement.href = URL.createObjectURL(blob);
    anchorElement.download = 'data.csv';

    document.body.appendChild(anchorElement);
    anchorElement.click();
    document.body.removeChild(anchorElement);

    URL.revokeObjectURL(anchorElement.href);
}

// Add event listener for the convert button
convertButton.addEventListener('click', convertToCsv);

// --- Test Harness ---
const testResultsPre = document.getElementById('test-results');
const runTestsButton = document.getElementById('run-tests-button');

function assert(condition, message) {
    if (!condition) {
        throw new Error(message || "Assertion failed");
    }
}

// Test for JSON Parsing and Rendering
function testJsonParsingAndRendering() {
    // Sub-test 1: Valid JSON
    const validJsonString = '{"name": "Test", "value": 123, "nested": {"id": "n1"}}';
    jsonInput.value = validJsonString;
    parseAndRenderJson(jsonInput.value); // parseAndRenderJson clears treeDisplay internally
    assert(treeDisplay.querySelector('.error-message') === null, "Valid JSON should not show error message.");
    assert(treeDisplay.querySelectorAll('.tree-node-item').length === 3, "Valid JSON did not render correct number of root/nested nodes.");
    assert(treeDisplay.textContent.includes("Test") && treeDisplay.textContent.includes("123") && treeDisplay.textContent.includes("n1"), "Valid JSON content not found in tree.");
    treeDisplay.innerHTML = ''; // Clear for next test

    // Sub-test 2: Invalid JSON
    const invalidJsonString = '{"name": "Test", "value": 123,'; // Invalid
    jsonInput.value = invalidJsonString;
    parseAndRenderJson(jsonInput.value);
    const errorMessageElement = treeDisplay.querySelector('.error-message');
    assert(errorMessageElement !== null, "Invalid JSON should show an error message.");
    const errorMessageText = errorMessageElement ? errorMessageElement.textContent.toLowerCase() : "";
    assert(errorMessageText.includes('invalid json') || errorMessageText.includes('syntaxerror') || errorMessageText.includes('unexpected token'), "Error message for invalid JSON is not as expected.");
    treeDisplay.innerHTML = '';

    // Sub-test 3: Empty input (should clear tree, no error)
    jsonInput.value = '';
    parseAndRenderJson(jsonInput.value);
    assert(treeDisplay.querySelector('.error-message') === null, "Empty input should not show error message.");
    assert(treeDisplay.querySelectorAll('.tree-node-item').length === 0, "Empty input should result in an empty tree.");
    treeDisplay.innerHTML = '';

    jsonInput.value = ''; // Ensure textarea is cleared after tests
}


// Test for CSV Conversion (Array of Objects)
// For now, this test is an outline. It needs a way to get CSV string without download.
// We'll modify convertToCsv or use a helper in a real scenario.
function testCsvConversion_ArrayOfObjects() {
    const originalConvertToCsv = convertToCsv; // Save original
    let generatedCsvOutput = "";

    // Mocking part of convertToCsv to capture output instead of downloading
    // This is a simplified mock. A more robust solution might involve dependency injection.
    const mockConvertToCsv = () => {
        const jsonString = jsonInput.value;
        if (!jsonString.trim()) { return; } //Should be handled by actual function
        let parsedJson;
        try { parsedJson = JSON.parse(jsonString); } catch (e) { return; } //Should be handled
        let data = parsedJson;
        if (!Array.isArray(data)) { data = [data]; }
        if (data.length === 0 || !data.every(item => typeof item === 'object' && item !== null)) { return; } //Should be handled
        const headerSet = new Set();
        data.forEach(obj => { Object.keys(obj).forEach(key => headerSet.add(key)); });
        const headers = Array.from(headerSet);
        let csvContent = headers.map(h => escapeCsvCell(h)).join(',') + '\n';
        data.forEach(obj => {
            const row = headers.map(header => escapeCsvCell(obj[header]));
            csvContent += row.join(',') + '\n';
        });
        generatedCsvOutput = csvContent.trim(); // Trim trailing newline for comparison
    };

    // Test 1: Simple array of objects
    jsonInput.value = '[{"a":1,"b":2},{"a":3,"b":4,"c":5}]';
    // Temporarily replace global convertToCsv with mock for this test
    window.convertToCsv = mockConvertToCsv;
    window.convertToCsv(); // Call the mock
    window.convertToCsv = originalConvertToCsv; // Restore original

    // Headers might be in different order depending on Set to Array conversion. So we need to check content.
    const expectedHeaders1 = ["a", "b", "c"];
    const actualHeaders1 = generatedCsvOutput.split('\n')[0].split(',');
    assert(expectedHeaders1.every(h => actualHeaders1.includes(h)) && actualHeaders1.every(h => expectedHeaders1.includes(h)), "CSV headers mismatch for array of objects. Expected: a,b,c. Got: " + actualHeaders1.join(','));

    const expectedRows1 = ["1,2,", "3,4,5"]; // Note: expecting empty for missing 'c' in first object
    const actualRows1 = generatedCsvOutput.split('\n').slice(1);

    // A more robust check would parse the CSV rows and compare objects,
    // but for this basic test, string comparison after sorting headers could work if headers are fixed.
    // For now, let's check if the key parts are present.
    assert(generatedCsvOutput.includes("1,2,") || generatedCsvOutput.includes("1,,2"), "CSV content for first object incorrect. Expected something like '1,2,'"); // Order of b,c might vary
    assert(generatedCsvOutput.includes("3,4,5"), "CSV content for second object incorrect. Expected '3,4,5'");
    assert(actualRows1.length === 2, "CSV conversion for array of objects produced wrong number of data rows.");


    // Test 2: Object with nested data and special characters
    jsonInput.value = '[{"name": "John, Doe", "details": {"age": 30, "city": "New \"York\""}, "notes": "Likes \\"quotes\\" and commas,"}]';
    window.convertToCsv = mockConvertToCsv;
    window.convertToCsv();
    window.convertToCsv = originalConvertToCsv;

    assert(generatedCsvOutput.includes('"John, Doe"'), "CSV escaping for comma in name failed.");
    assert(generatedCsvOutput.includes('"{"age":30,"city":"New \\"York\\""}"'), "CSV stringification/escaping for nested object 'details' failed.");
    assert(generatedCsvOutput.includes('"Likes ""quotes"" and commas,"'), "CSV escaping for quotes and comma in notes failed.");

    jsonInput.value = ''; // Clear input
    generatedCsvOutput = ""; // Clear output
}


function runTests() {
    if (!testResultsPre) {
        console.error("Test results display element not found!");
        return;
    }
    testResultsPre.innerHTML = ''; // Clear previous results (use innerHTML to clear pass/fail spans)

    const testsToRun = [
        testJsonParsingAndRendering,
        testCsvConversion_ArrayOfObjects,
        // Add more test functions here
    ];

    let allTestsPassed = true;

    testsToRun.forEach(testFunction => {
        const testName = testFunction.name;
        const resultSpan = document.createElement('span');
        try {
            testFunction();
            resultSpan.textContent = `PASS: ${testName}\n`;
            resultSpan.className = 'pass';
        } catch (error) {
            resultSpan.textContent = `FAIL: ${testName} - ${error.message}\n`;
            resultSpan.className = 'fail';
            console.error(`Test failed: ${testName}`, error);
            allTestsPassed = false;
        }
        testResultsPre.appendChild(resultSpan);
    });

    const summarySpan = document.createElement('span');
    summarySpan.textContent = allTestsPassed ? "\nAll tests passed!" : "\nSome tests failed.";
    summarySpan.className = allTestsPassed ? 'pass' : 'fail';
    testResultsPre.appendChild(summarySpan);
}

if (runTestsButton) {
    runTestsButton.addEventListener('click', runTests);
}

// Optional: Initial run on script load
// runTests();


// Event listener for search input
searchInput.addEventListener('input', (event) => {
    const searchTerm = event.target.value.toLowerCase();
    filterTree(searchTerm);
});

// Function to filter the tree based on search term
function filterTree(searchTerm) {
    const allNodes = document.querySelectorAll('.tree-node-item');
    let hasMatches = false;

    // First pass: apply highlighting and initial hiding
    allNodes.forEach(node => {
        const nodeText = node.textContent.toLowerCase();
        const isMatch = searchTerm && nodeText.includes(searchTerm);

        if (isMatch) {
            node.classList.add('highlight');
            node.classList.remove('hidden');
            hasMatches = true;
        } else {
            node.classList.remove('highlight');
            if (searchTerm) { // Only hide if there's an active search term
                node.classList.add('hidden');
            } else {
                node.classList.remove('hidden'); // If search term is cleared, unhide all
            }
        }
    });

    // Second pass: ensure parents of highlighted nodes are visible
    if (searchTerm && hasMatches) {
        allNodes.forEach(node => {
            if (node.classList.contains('highlight')) {
                let parent = node.parentElement;
                while (parent && parent !== treeDisplay) {
                    if (parent.matches('.tree-node-item')) { // Check if parent is a tree node itself
                        parent.classList.remove('hidden');
                        // Optional: if parent was hidden, it might not be a direct match, so don't highlight it
                        // parent.classList.remove('highlight'); // Or add a specific class for "ancestor-of-match"
                    }
                    parent = parent.parentElement;
                }
            }
        });
    } else if (!searchTerm) { // If search term is empty, ensure all are visible
        allNodes.forEach(node => {
            node.classList.remove('hidden');
            node.classList.remove('highlight');
        });
    }
}
