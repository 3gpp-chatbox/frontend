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
  
  // Include key properties in the label
  const properties = node.properties || {};
  const propsStr = Object.entries(properties)
    .filter(([key]) => !['name', 'id'].includes(key))
    .map(([key, value]) => `${key}: ${value}`)
    .join('<br/>');
    
  return propsStr ? 
    `${label}<br/>[${type}]<br/>${propsStr}` : 
    `${label}<br/>[${type}]`;
}

// Function to create an edge label with properties
function createEdgeLabel(edge) {
  const label = escapeLabel(edge.label);
  const type = edge.type || '';
  
  // Include key properties in the label
  const properties = edge.properties || {};
  const propsStr = Object.entries(properties)
    .filter(([key]) => !['message'].includes(key))
    .map(([key, value]) => `${key}: ${value}`)
    .join('<br/>');
    
  return propsStr ? 
    `${label}<br/>${type}<br/>${propsStr}` : 
    `${label}<br/>${type}`;
}

// Function to convert JSON to Mermaid format
function convertJsonToMermaid(json) {
  console.log('JsonViewer: Starting JSON to Mermaid conversion with:', json);
  if (!json || !json.nodes || !json.edges) {
    console.log('JsonViewer: Invalid JSON structure');
    return "";
  }
  
  let mermaidStr = "graph TD;\n";
  
  // Add nodes with styling and all properties in the label
  json.nodes.forEach(node => {
    const nodeId = node.id;
    const nodeLabel = createNodeLabel(node);
    const nodeStyle = node.type === 'State' ? 
      `["${nodeLabel}"]:::stateNode` : 
      `["${nodeLabel}"]:::elementNode`;
    
    mermaidStr += `  ${nodeId}${nodeStyle}\n`;
  });

  // Add edges with styling and all properties in the label
  json.edges.forEach(edge => {
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

    mermaidStr += `  ${edge.source} ${edgeStyle}|"${edgeLabel}"| ${edge.target}\n`;
  });

  // Add class definitions with hover effects
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
