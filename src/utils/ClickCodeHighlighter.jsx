import { highlightMermaid } from './MermaidHighlighter';
import { highlightJson } from './jsonHighlighter';

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

export const highlightJsonLine = (code, elementId, elementType) => {
    if (!code || !elementId) {
      console.log("No JSON code or elementId provided");
      return(code);
    }
    
    console.log("Highlighting JSON for:", { elementId, elementType });
    
    try {
      // Parse the JSON to work with the structure
      const jsonData = JSON.parse(code);
      const lines = code.split('\n');
      let highlightedLines = [];
      let inTargetBlock = false;
      let bracketCount = 0;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmedLine = line.trim();
        
        // Track object/array nesting level
        if (trimmedLine.includes('{') || trimmedLine.includes('[')) bracketCount++;
        if (trimmedLine.includes('}') || trimmedLine.includes(']')) bracketCount--;
        
        // Check if this line contains our target
        if (elementType === 'node') {
          if (line.includes(`"id": "${elementId}"`) || 
              (line.includes('"nodes"') && jsonData.nodes?.some(node => node.id === elementId))) {
            inTargetBlock = true;
          }
        } else if (elementType === 'edge') {
          if (line.includes(`"description": "${elementId}"`) || 
              (line.includes('"edges"') && jsonData.edges?.some(edge => edge.description === elementId))) {
            inTargetBlock = true;
          }
        }
        
        // Highlight the line if we're in the target block
        if (inTargetBlock) {
          highlightedLines.push(`<span class="orange-highlight">${highlightJson(line)}</span>`);
        } else {
          highlightedLines.push(highlightJson(line));
        }
        
        // Check if we've reached the end of our target block
        if (inTargetBlock && bracketCount === 0) {
          inTargetBlock = false;
        }
      }
      
      return highlightedLines.join('\n');
    } catch (error) {
      console.error("Error highlighting JSON:", error);
      return highlightJson(code);
    }
};


