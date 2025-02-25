import { useState } from 'react';

function JsonViewer({ procedure }) {
  const [showMermaid, setShowMermaid] = useState(false);

  return (
    <div className="section-container">
      <div className="section-header">
        <span>JSON View</span>
        <button
          className="toggle-button"
          onClick={() => setShowMermaid(!showMermaid)}
        >
          {showMermaid ? 'Show JSON' : 'Show Mermaid'}
        </button>
      </div>
      <div className="content-area">
        {procedure ? (
          <pre className="json-content">
            {showMermaid ? 
              "graph TD\nA-->B" :
              JSON.stringify(procedure, null, 2)
            }
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