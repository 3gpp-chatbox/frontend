// Function to escape special characters for Mermaid
export function escapeLabel(text) {
  if (!text) return '';
  // Remove all special characters and normalize text
  return text
    .replace(/[^a-zA-Z0-9\s]/g, ' ') // Only keep alphanumeric and spaces
    .replace(/\s+/g, ' ')            // Normalize spaces
    .trim();
}

// Function to create a safe state ID
export function createSafeId(text) {
  if (!text) return '';
  // Create a simple state ID
  return text
    .replace(/[^a-zA-Z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .toLowerCase();
}

// Function to create a node label with properties
export function createNodeLabel(node) {
  const label = escapeLabel(node.label || node.id);
  const type = node.type || 'NetworkElement';
  const description = node.description 
    ? `\n${escapeLabel(node.description)}` 
    : '';
  return `${label}\n(${type})${description}`;
}

// Function to create an edge label with details
export function createEdgeLabel(edge) {
  const seqNum = edge.properties?.sequence_number?.low || '';
  const message = escapeLabel(edge.properties?.message || edge.label || edge.type || 'UNKNOWN');
  const description = edge.properties?.description ? `\n${escapeLabel(edge.properties.description)}` : '';
  const trigger = edge.properties?.trigger ? `\nTrigger: ${edge.properties.trigger}` : '';
  const timing = edge.properties?.timing ? `\nTiming: ${edge.properties.timing}` : '';
  const conditions = edge.properties?.conditions ? `\nConditions: ${edge.properties.conditions}` : '';
  
  return `[${seqNum}] ${message}${description}${trigger}${timing}${conditions}`;
}

// Function to convert JSON to Mermaid format
export function convertJsonToMermaid(json) {
  if (!json || !json.edges || !Array.isArray(json.edges)) {
    return { initSettings: '', mermaidStr: '' };
  }
  
  // Simplified initialization settings
  const initSettings = `%%{init: {'theme': 'dark'}}%%\n`;

  // Start state diagram
  let mermaidStr = `stateDiagram-v2\n`;
  
  // Sort edges by sequence number
  const sortedEdges = [...json.edges].sort((a, b) => {
    const seqA = a.sequence_number || 0;
    const seqB = b.sequence_number || 0;
    return seqA - seqB;
  });

  // Add initial state
  if (sortedEdges.length > 0) {
    const firstState = createSafeId(sortedEdges[0].source);
    mermaidStr += `    [*] --> ${firstState}\n`;
  }

  // Create simple state transitions
  sortedEdges.forEach((edge, index) => {
    if (edge.source && edge.target) {
      const sourceId = createSafeId(edge.source);
      const targetId = createSafeId(edge.target);
      const stepNum = index + 1;
      
      // Create a simple transition label
      let label = edge.message || edge.label || '';
      label = escapeLabel(label);
      
      // Add the transition
      mermaidStr += `    ${sourceId} --> ${targetId}: ${stepNum} ${label}\n`;
    }
  });

  return { initSettings, mermaidStr };
} 