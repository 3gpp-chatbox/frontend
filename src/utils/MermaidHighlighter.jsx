export const highlightMermaidElement = (mermaidCode, highlightedElement) => {
  if (!mermaidCode || !highlightedElement) {
    console.log("No code or highlighted element provided");
    return mermaidCode;
  }

  console.log("Highlighting element:", highlightedElement);

  // Strip existing HTML tags before processing
  const lines = mermaidCode.replace(/<[^>]*>/g, '').split('\n');
  const result = [];
  let inHighlightBlock = false;
  let metadataCount = 0;

  // Helper function to wrap line in highlight
  const wrapInHighlight = (line) => {
    return `<div class="highlighted-line" style="background-color: rgba(249, 115, 22, 0.2); border-left: 3px solid #f97316;">${highlightMermaid(line)}</div>`;
  };

  // Process each line
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    let shouldHighlight = false;

    if (highlightedElement.type === 'node') {
      // Extract node ID, handling both text and id properties
      const nodeId = (highlightedElement.text || highlightedElement.id || '').replace('flowchart-', '');
      
      // Check if this line contains the node definition
      if (trimmedLine.includes(nodeId) && /^[A-Z0-9]+[\[(]/.test(trimmedLine)) {
        shouldHighlight = true;
        inHighlightBlock = true;
        metadataCount = 0;
      }
    } else if (highlightedElement.type === 'edge') {
      // Extract the actual edge ID from the full ID (which includes source and target)
      const edgeIdMatch = (highlightedElement.id || '').match(/edge-([^-]+)/);
      const edgeId = edgeIdMatch ? edgeIdMatch[1] : highlightedElement.id;
      
      // Check if this line contains the edge definition
      if (trimmedLine.includes(edgeId)) {
        shouldHighlight = true;
        inHighlightBlock = true;
        metadataCount = 0;
      }
    }

    // Handle metadata lines that follow the highlighted element
    if (inHighlightBlock && trimmedLine.startsWith('%%')) {
      shouldHighlight = true;
      if (trimmedLine.includes('Type:') || trimmedLine.includes('Description:')) {
        metadataCount++;
      }
    } else if (inHighlightBlock && !trimmedLine.startsWith('%%')) {
      // Only end the highlight block if we've found both Type and Description
      // or if we've hit a non-metadata line
      if (metadataCount >= 2) {
        inHighlightBlock = false;
        metadataCount = 0;
      }
    }

    // Apply highlighting while preserving syntax highlighting
    if (shouldHighlight) {
      result.push(wrapInHighlight(line));
    } else {
      result.push(`<div class="mermaid-line">${highlightMermaid(line)}</div>`);
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
      // Highlight node definitions with improved pattern matching
      else if (/^[A-Z0-9]+[\[(]/.test(trimmedLine)) {
        highlightedLine = line.replace(
          /([A-Z0-9]+)([\[(][^)\]]+[)\]])/,
          '<span class="node-id">$1</span><span class="node-text">$2</span>',
        );
      }
      // Highlight edges with improved pattern matching
      else if (/^[A-Z0-9]+\s*-->/.test(trimmedLine)) {
        highlightedLine = line.replace(
          /([A-Z0-9]+)(\s*-->?\s*)([A-Z0-9]+)(\|[^|]*\|)?/,
          '<span class="node-id">$1</span><span class="arrow">$2</span><span class="node-id">$3</span>$4',
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
  
  // Strip existing HTML tags before processing
  const lines = code.replace(/<[^>]*>/g, '').split('\n');
  let highlightedLines = [];
  let foundTarget = false;
  let lineIndex = 0;
  
  while (lineIndex < lines.length) {
    const line = lines[lineIndex];
    let shouldHighlight = false;
    
    if (elementType === 'node' && nodeLabel) {
      // Match node definitions with optional leading whitespace
      const nodePattern = new RegExp(`^\\s*${nodeLabel}(\\[|\\(|\\(\\()`);
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