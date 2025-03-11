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
  if (!json || !json.edges || !Array.isArray(json.edges)) {
    console.log('JsonViewer: Invalid JSON structure');
    return "";
  }
  
  // Debug log for edges count
  console.log('JsonViewer: Number of edges in input:', json.edges.length);
  
  // Store initialization settings separately
  const initSettings = `%%{init: { 
    'theme': 'dark',
    'themeVariables': {
      'actorBorder': '#3b82f6',
      'actorBackground': '#1e3a8a',
      'actorTextColor': '#ffffff',
      'signalColor': '#3b82f6',
      'signalTextColor': '#ffffff',
      'labelTextColor': '#ffffff',
      'noteBkgColor': '#1e3a8a',
      'noteTextColor': '#ffffff',
      'activationBorderColor': '#3b82f6',
      'activationBkgColor': '#1e3a8a',
      'sequenceNumberColor': '#ffffff'
    },
    'sequence': { 
      'actorMargin': 150,
      'bottomMarginAdj': 20,
      'boxMargin': 20,
      'boxTextMargin': 10,
      'noteMargin': 15,
      'messageMargin': 60,
      'mirrorActors': false,
      'actorFontSize': 48,
      'actorFontWeight': 'bold',
      'messageFontSize': 40,
      'messageFontWeight': 'bold',
      'noteFontSize': 40,
      'noteAlign': 'left',
      'wrap': true,
      'useMaxWidth': false,
      'rightAngles': true,
      'showSequenceNumbers': true,
      'actorFontFamily': '"Segoe UI", "Roboto", sans-serif',
      'noteFontFamily': '"Segoe UI", "Roboto", sans-serif',
      'messageFontFamily': '"Segoe UI", "Roboto", sans-serif',
      'width': 150,
      'maxMessageWidth': 600,
      'diagramMarginX': 150,
      'diagramMarginY': 10,
      'layoutDirection': 'LR',
      'actorPosition': 'left',
      'displayMode': 'compact',
      'messageAlign': 'left'
    }
  }}%%\n%%{config: { "sequence": { "wrap": true, "width": 600, "rightAngles": true } } }%%\n`;
  
  // Start with just the sequence diagram content
  let mermaidStr = `sequenceDiagram
    participant UE as User Equipment
    participant AMF as Access and Mobility Management Function
    
    autonumber\n`;
  
  // Sort edges by sequence number if available and remove duplicates
  const uniqueEdges = [...new Map(json.edges.map(edge => 
    [edge.label, edge]
  )).values()];
  
  console.log('JsonViewer: Number of unique edges after deduplication:', uniqueEdges.length);
  
  const sortedEdges = uniqueEdges.sort((a, b) => {
    const seqA = a.step_number || 0;
    const seqB = b.step_number || 0;
    return seqA - seqB;
  });

  // Add edges as sequence diagram arrows
  sortedEdges.forEach(edge => {
    const message = edge.label || 'Message';
    mermaidStr += `    ${edge.source}->>${edge.target}: ${message}\n`;
  });

  console.log('JsonViewer: Final Mermaid string line count:', mermaidStr.split('\n').length - 4); // Subtract header lines
  return { initSettings, mermaidStr };
}

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
