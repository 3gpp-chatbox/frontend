import { useState, useEffect } from 'react';
import { convertJsonToMermaid } from '../mermaidConverter';

function JsonViewer({ data, onMermaidCodeChange }) {
  const [showMermaid, setShowMermaid] = useState(false);
  const [mermaidGraph, setMermaidGraph] = useState({ initSettings: '', mermaidStr: '' });
  
  useEffect(() => {
    console.log('JsonViewer: Data received:', data);
    if (data) {
      // Log the structure of incoming data
      console.log('JsonViewer: Number of edges in data:', data.edges?.length);
      console.log('JsonViewer: Edge labels:', data.edges?.map(e => e.label));
      
      const graph = convertJsonToMermaid(data);
      setMermaidGraph(graph);
      
      if (onMermaidCodeChange) {
        onMermaidCodeChange(graph.initSettings + graph.mermaidStr);
      }
    }
  }, [data, onMermaidCodeChange]);

  return (
    <div className="section-container">
      <div className="section-header">
        <span>Code View</span>
        <button className="toggle-button" onClick={() => setShowMermaid(!showMermaid)}>
          {showMermaid ? 'Show JSON' : 'Show Mermaid'}
        </button>
      </div>
      <div className="content-area">
        {data ? (
          <pre className="json-content">
            {showMermaid ? (
              <code>{mermaidGraph.mermaidStr || 'No diagram data available'}</code>
            ) : (
              <code>{JSON.stringify(data, null, 2)}</code>
            )}
          </pre>
        ) : (
          <div className="placeholder-text">
            Select a procedure to view its data
          </div>
        )}
      </div>
    </div>
  );
}

export default JsonViewer;
