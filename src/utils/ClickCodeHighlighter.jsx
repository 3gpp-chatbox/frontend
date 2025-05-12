import { highlightMermaid } from './MermaidHighlighter';
import { highlightJson } from './jsonHighlighter';

/**
 * Extracts element information from a clicked line in the Mermaid code.
 * @param {string} line - The line of Mermaid code that was clicked
 * @returns {Object|null} - Object containing element type and ID, or null if no element found
 */
export const extractElementFromClick = (line) => {
    if (!line) return null;

    // Clean up the line
    line = line.trim();

    // Match node definitions (e.g., "A[Node Text]" or "A((Node Text))")
    const nodeMatch = line.match(/^([A-Z0-9]+)[\[\(]([^\]\)]+)[\]\)]/);
    if (nodeMatch) {
        return {
            type: 'node',
            id: `flowchart-${nodeMatch[1]}-`,
            text: nodeMatch[2].trim()
        };
    }

    // Match edge definitions (e.g., "A --> |text| B" or "A -->|text|B")
    const edgeMatch = line.match(/([A-Z0-9]+)\s*-->\s*\|([^|]+)\|\s*([A-Z0-9]+)/);
    if (edgeMatch) {
        return {
            type: 'edge',
            id: edgeMatch[2].trim(),
            from: edgeMatch[1],
            to: edgeMatch[3]
        };
    }

    return null;
};

export const highlightElement = (code, elementId, elementType) => {
    if (!code || !elementId) {
      console.log("No code or elementId provided");
      return code;
    }

    console.log("Received element:", { id: elementId, type: elementType });

    // Extract the node label for node highlighting
    const nodeMatch = elementId.match(/flowchart-([A-Z0-9]+)-/);
    if (!nodeMatch && elementType === 'node') {
        console.log("No node match found for elementId:", elementId);
        return code;
    }

    const nodeLabel = nodeMatch ? nodeMatch[1] : null;
    console.log("Looking for node/edge:", { nodeLabel, elementId });

    // Split the code into lines
    const lines = code.replace(/<[^>]*>/g, '').split('\n');
    let highlightedLines = [];
    let foundTarget = false;

    while (lineIndex < lines.length) {
        const line = lines[lineIndex];
        let shouldHighlight = false;

        if (elementType === 'node' && nodeLabel) {
            // Match node definitions with optional leading whitespace
            const nodePattern = new RegExp(`^\\s*${nodeLabel}(\\[|\\(\\()`);
            if (nodePattern.test(line)) {
                foundTarget = true;
                shouldHighlight = true;
            }
        }
        
        if (elementType === 'edge' && line.includes(elementId)) {
            foundTarget = true;
            shouldHighlight = true;
        }

        if (shouldHighlight) {
            highlightedLines.push(line);
        }

        lineIndex++;
    }
    
    

    return code;
};

export const renderCodeWithClickHandlers = (code, mapping) => {
    const codeContainer = document.getElementById('code-container');
    if (!codeContainer) {
        console.error("Code container not found");
        return;
    }

    // Clear existing content
    codeContainer.innerHTML = '';

    // Split the code into lines
    const lines = code.split('\n');

    lines.forEach((line, lineIndex) => {
        // Create a clickable element for each line
        const lineElement = document.createElement('div');
        lineElement.id = `line-${lineIndex}`;
        lineElement.textContent = line;
        lineElement.style.cursor = 'pointer';

        // Check if the line corresponds to a node or edge
        const elementId = mapping[lineIndex];
        if (elementId) {
            lineElement.addEventListener('click', () => {
                navigateToDiagramElement(elementId);
            });
        }

        // Append the line element to the container
        codeContainer.appendChild(lineElement);
    });
};

// Function to navigate to the diagram element
const navigateToDiagramElement = (elementId) => {
    console.log(`Navigating to element with ID: ${elementId}`);
    const diagramElement = document.querySelector(`[data-id="${elementId}"]`);
    if (diagramElement) {
        diagramElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        diagramElement.classList.add('highlight');
        setTimeout(() => diagramElement.classList.remove('highlight'), 2000);
    } else {
        console.error("Diagram element not found");
    }
};





