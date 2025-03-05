import { useState, useEffect } from 'react';

// Function to escape special characters for Mermaid
function escapeLabel(text) {
  if (!text) return '';
  return text
    .replace(/[[\](){}|]/g, '') // Remove brackets, parentheses, and pipes
    .replace(/["]/g, '')       // Remove quotes
    .replace(/[,]/g, '')       // Remove commas
    .replace(/\s+/g, ' ')      // Normalize whitespace
    .trim();
}

// Function to create a node label with properties
function createNodeLabel(node) {
  const label = escapeLabel(node.label || node.id);
  const type = node.type || 'NetworkElement';
  const description = node.description 
    ? `\n${escapeLabel(node.description)}` 
    : '';
  return `${label}\n(${type})${description}`;
}

// Function to create an edge label with details
function createEdgeLabel(edge) {
  const seqNum = edge.properties?.sequence_number?.low || '';
  const message = escapeLabel(edge.properties?.message || edge.label || edge.type || 'UNKNOWN');
  const description = edge.properties?.description ? `\n${escapeLabel(edge.properties.description)}` : '';
  const trigger = edge.properties?.trigger ? `\nTrigger: ${edge.properties.trigger}` : '';
  const timing = edge.properties?.timing ? `\nTiming: ${edge.properties.timing}` : '';
  const conditions = edge.properties?.conditions ? `\nConditions: ${edge.properties.conditions}` : '';
  
  return `[${seqNum}] ${message}${description}${trigger}${timing}${conditions}`;
}

// Function to convert JSON to Mermaid format
function convertJsonToMermaid(json) {
  console.log('JsonViewer: Starting JSON to Mermaid conversion with:', json);
  if (!json || !json.nodes || !json.edges) {
    console.log('JsonViewer: Invalid JSON structure');
    return "";
  }
  
  // Start with style definitions and direction
  let mermaidStr = `graph TB
%% Style definitions
classDef default fill:#1a1a1a,stroke:#3b82f6,stroke-width:2px
linkStyle default stroke:#3b82f6,stroke-width:2px\n\n`;
  
  // Sort edges by sequence number
  const sortedEdges = [...json.edges].sort((a, b) => {
    const seqA = a.properties?.sequence_number?.low || 0;
    const seqB = b.properties?.sequence_number?.low || 0;
    return seqA - seqB;
  });

  // Remove duplicate nodes
  const uniqueNodes = Array.from(new Map(json.nodes.map(node => [node.id, node])).values());
  
  // Add nodes
  uniqueNodes.forEach(node => {
    const nodeId = node.id;
    const nodeLabel = createNodeLabel(node);
    mermaidStr += `  ${nodeId}["${nodeLabel}"]\n`;
  });

  // Add a blank line between nodes and edges
  mermaidStr += '\n';

  // Add edges with sequence numbers and labels
  sortedEdges.forEach(edge => {
    const edgeLabel = createEdgeLabel(edge);
    mermaidStr += `  ${edge.source} -- "${edgeLabel}" --> ${edge.target}\n`;
  });

  console.log('JsonViewer: Generated Mermaid string:', mermaidStr);
  return mermaidStr;
}

function JsonViewer({ data, onMermaidCodeChange }) {
  const [showMermaid, setShowMermaid] = useState(false);
  const [mermaidGraph, setMermaidGraph] = useState('');
  
  useEffect(() => {
    console.log('JsonViewer: Data changed:', data);
    const mermaidGraph = convertJsonToMermaid(data);
    setMermaidGraph(mermaidGraph);
    console.log('JsonViewer: Calling onMermaidCodeChange with:', mermaidGraph);
    onMermaidCodeChange(mermaidGraph);
  }, [data, onMermaidCodeChange]);

  return (
    <div className="section-container">
      <div className="section-header">
        <span>JSON View</span>
        <button className="toggle-button" onClick={() => setShowMermaid(!showMermaid)}>
          {showMermaid ? 'Show JSON' : 'Show Mermaid'}
        </button>
      </div>
      <div className="content-area">
        {data ? (
          <pre className="json-content">
            {showMermaid ? (
              <code>{mermaidGraph}</code>
            ) : (
              JSON.stringify(data, null, 2)
            )}
          </pre>
        ) : (
          <div className="placeholder-text">Select a procedure to view its data</div>
        )}
      </div>
    </div>
  );
}

export default JsonViewer;
