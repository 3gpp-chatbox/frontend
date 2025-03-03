import { useState, useEffect } from 'react';

// Function to convert JSON to Mermaid format
function convertJsonToMermaid(json) {
  if (!json || !json.nodes || !json.edges) return "";
  
  let mermaidStr = "graph TD\n"; // Initialize Mermaid flowchart

  // Add all nodes first
  json.nodes.forEach(node => {
    mermaidStr += `  ${node.id}["${node.label || node.id}"]\n`;
  });

  // Add all edges
  json.edges.forEach(edge => {
    mermaidStr += `  ${edge.source} -->|${edge.label}| ${edge.target}\n`;
  });

  // Debugging: log the generated mermaidStr
  console.log("Generated Mermaid String:\n", mermaidStr);

  return mermaidStr;
}

function JsonViewer({ data, onMermaidCodeChange }) {
  const [showMermaid, setShowMermaid] = useState(false);
  const mermaidGraph = convertJsonToMermaid(data);

  // Always pass the mermaid code to parent when component mounts or data changes
  useEffect(() => {
    onMermaidCodeChange(mermaidGraph);
  }, [mermaidGraph, onMermaidCodeChange]);

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
              // Show the Mermaid graph code as text when "Show Mermaid" is clicked
              <code>{mermaidGraph}</code>
            ) : (
              // Show the raw JSON
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
