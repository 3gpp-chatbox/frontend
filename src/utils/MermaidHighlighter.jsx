export const highlightMermaidElement = (mermaidCode, highlightedElement) => {
  if (!mermaidCode || !highlightedElement) return mermaidCode;

  const lines = mermaidCode.split('\n');
  const result = [];
  let inHighlightBlock = false;
  let metadataCount = 0;

  // Helper function to wrap line in highlight
  const wrapInHighlight = (line) => {
    return `<div class="highlighted-line" style="background-color: rgba(249, 115, 22, 0.2); border-left: 3px solid #f97316;">${line}</div>`;
  };

  // First pass: identify and highlight relevant lines
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    let shouldHighlight = false;

    if (highlightedElement) {
      if (highlightedElement.type === 'node') {
        // For nodes, we need to match the node ID without the flowchart- prefix
        const nodeId = (highlightedElement.text || highlightedElement.id).replace('flowchart-', '');
        
        // Check if this is a node definition line
        if (trimmedLine.includes(nodeId)) {
          shouldHighlight = true;
          inHighlightBlock = true;
          metadataCount = 0;
        }
        // Check for metadata lines that follow
        else if (inHighlightBlock && trimmedLine.startsWith('%%')) {
          shouldHighlight = true;
          metadataCount++;
        }
        // If we hit a non-metadata line after our node, stop highlighting
        else if (inHighlightBlock && !trimmedLine.startsWith('%%')) {
          inHighlightBlock = false;
        }
      } else if (highlightedElement.type === 'edge') {
        // For edges, check both the edge line and its metadata
        if (trimmedLine.includes(highlightedElement.id)) {
          shouldHighlight = true;
          inHighlightBlock = true;
          metadataCount = 0;
        }
        // Check for metadata lines that follow
        else if (inHighlightBlock && trimmedLine.startsWith('%%')) {
          shouldHighlight = true;
          metadataCount++;
        }
        // If we hit a non-metadata line after our edge, stop highlighting
        else if (inHighlightBlock && !trimmedLine.startsWith('%%')) {
          inHighlightBlock = false;
        }
      }
    }

    // Add the line with appropriate highlighting
    if (shouldHighlight) {
      result.push(wrapInHighlight(line));
    } else {
      result.push(`<div class="mermaid-line">${line}</div>`);
    }

    // If we've processed all metadata lines (Type and Description), stop the highlight block
    if (metadataCount >= 2) {
      inHighlightBlock = false;
      metadataCount = 0;
    }
  }

  return result.join('\n');
};

export const highlightMermaid = (code) => {
  if (!code) return "";

  return code
    .split("\n")
    .map((line) => {
      const trimmedLine = line.trim();
      let highlightedLine = line;

      // Highlight flowchart declaration
      if (trimmedLine.startsWith("flowchart")) {
        highlightedLine = line.replace(
          /(flowchart\s+(TD|TB|BT|LR|RL))/,
          '<span class="flowchart">$1</span>',
        );
      }
      // Highlight comments and metadata
      else if (trimmedLine.startsWith("%%")) {
        if (trimmedLine.includes("Type:")) {
          highlightedLine = line.replace(
            /(%%.+?Type:)(.+)/,
            '<span class="comment">$1</span><span class="type">$2</span>',
          );
        } else if (trimmedLine.includes("Description:")) {
          highlightedLine = line.replace(
            /(%%.+?Description:)(.+)/,
            '<span class="comment">$1</span><span class="description">$2</span>',
          );
        } else {
          highlightedLine = `<span class="comment">${line}</span>`;
        }
      }
      // Highlight node definitions: A(text)
      else if (/^[A-Z]+\([^)]+\)/.test(trimmedLine)) {
        highlightedLine = line.replace(
          /([A-Z]+)(\()([^)]+)(\))/,
          '<span class="node-id">$1</span>$2<span class="node-text">$3</span>$4',
        );
      }
      // Highlight edges: A --> B
      else if (/^[A-Z]+\s*-->/.test(trimmedLine)) {
        highlightedLine = line.replace(
          /([A-Z]+)(\s*-->?\s*)([A-Z]+)/,
          '<span class="node-id">$1</span><span class="arrow">$2</span><span class="node-id">$3</span>',
        );
      }

      return highlightedLine;
    })
    .join("\n");
};

export const highlightMermaidLine = (code, elementId, elementType) => {
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
  let lineIndex = 0;
  
  while (lineIndex < lines.length) {
    const line = lines[lineIndex];
    let shouldHighlight = false;
    
    if (elementType === 'node' && nodeLabel) {
      // Match node definitions with optional leading whitespace
      const nodePattern = new RegExp(`^\\s*${nodeLabel}(\\[|\\(\\()`);
      if (nodePattern.test(line)) {
        foundTarget = true;
        shouldHighlight = true;
        
        // Add the node definition line with orange highlight
        highlightedLines.push(`<span class="orange-highlight">${highlightMermaid(line)}</span>`);
        lineIndex++;
        
        // Look ahead for comments
        while (lineIndex < lines.length && lines[lineIndex].trim().startsWith('%%')) {
          highlightedLines.push(`<span class="orange-highlight">${highlightMermaid(lines[lineIndex])}</span>`);
          lineIndex++;
        }
        continue;
      }
    } else if (elementType === 'edge') {
      const escapedElementId = elementId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const edgePattern = new RegExp(`^\\s*.*-->\\|"?${escapedElementId}"?\\|.*`);
      
      if (edgePattern.test(line)) {
        foundTarget = true;
        shouldHighlight = true;
        
        // Add the edge definition line with orange highlight
        highlightedLines.push(`<span class="orange-highlight">${highlightMermaid(line)}</span>`);
        lineIndex++;
        
        // Look ahead for comments
        while (lineIndex < lines.length && lines[lineIndex].trim().startsWith('%%')) {
          highlightedLines.push(`<span class="orange-highlight">${highlightMermaid(lines[lineIndex])}</span>`);
          lineIndex++;
        }
        continue;
      }
    }
    
    if (!shouldHighlight) {
      highlightedLines.push(highlightMermaid(line));
    }
    lineIndex++;
  }
  
  if (!foundTarget) {
    console.log("No matching node/edge found in code");
  }
  
  return highlightedLines.join('\n');
};