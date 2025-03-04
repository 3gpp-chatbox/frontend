import { useState, useEffect } from 'react';

// Function to escape special characters for Mermaid
function escapeLabel(text) {
  if (!text) return '';
  return text
    .replace(/[#]/g, '')
    .replace(/[()]/g, '')
    .replace(/[,]/g, '')
    .replace(/["]/g, "'")  // Replace double quotes with single quotes
    .replace(/\s+/g, ' ')
    .trim();
}

// Function to create a node label with properties
function createNodeLabel(node) {
  const label = escapeLabel(node.label || node.id);
  const type = node.type || 'NetworkElement';
  return `${label}<br/>[${type}]`;
}

// Function to create an edge label (simplified)
function createEdgeLabel(edge) {
  // Show the message property or label as the edge label
  return edge.properties?.message || edge.label || edge.type || 'UNKNOWN';
}

// Function to convert JSON to Mermaid format
function convertJsonToMermaid(json) {
  console.log('JsonViewer: Starting JSON to Mermaid conversion with:', json);
  if (!json || !json.nodes || !json.edges) {
    console.log('JsonViewer: Invalid JSON structure');
    return "";
  }
  
  let mermaidStr = "graph TD;\n";
  
  // Add nodes with styling
  json.nodes.forEach(node => {
    const nodeId = node.id;
    const nodeLabel = createNodeLabel(node);
    const nodeStyle = node.type === 'State' ? 
      `["${nodeLabel}"]:::stateNode` : 
      `["${nodeLabel}"]:::elementNode`;
    
    mermaidStr += `  ${nodeId}${nodeStyle}\n`;
  });

  // Add edges with styling (simplified labels)
  json.edges.forEach((edge, index) => {
    const edgeLabel = createEdgeLabel(edge);
    
    // Use different styles for different relationship types
    let edgeStyle;
    if (edge.type === 'TRANSITIONS_TO') {
      edgeStyle = '-->';
    } else if (edge.type === 'SENDS_MESSAGE') {
      edgeStyle = '==>';
    } else {
      edgeStyle = '-.->'; // default style for other relationships
    }

    // Add edge with click event
    mermaidStr += `  ${edge.source} ${edgeStyle}|"${edgeLabel}"| ${edge.target}\n`;
    
    // Store edge properties for click handling
    const edgeData = {
      type: edge.type,
      label: edge.label,
      properties: edge.properties || {},
      source: edge.source,
      target: edge.target
    };
    const edgeProps = JSON.stringify(edgeData).replace(/"/g, "'");
    mermaidStr += `  click ${edge.source}${edge.target} callback "${edgeProps}"\n`;
  });

  // Add class definitions
  mermaidStr += `
  classDef stateNode fill:#2d2d2d,stroke:#1d4ed8,stroke-width:2px;
  classDef elementNode fill:#1a1a1a,stroke:#3b82f6,stroke-width:2px;
  linkStyle default stroke:#3b82f6,stroke-width:2px;
  `;

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
