import { highlightMermaid } from './MermaidHighlighter';

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
