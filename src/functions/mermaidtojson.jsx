import { validateGraph } from './schema_validation';

/**
 * Parses a Mermaid node label to extract type and description
 * @param {string} label - The node label from Mermaid
 * @returns {Object} Object containing type and description
 */
const parseNodeLabel = (label) => {
  const parts = label.split('<br/>');
  let type = 'state'; // default type
  let description = label;

  // If we have multiple parts, try to extract type and description
  if (parts.length > 1) {
    // Look for type in square brackets [type]
    const typeMatch = parts[1]?.match(/\[(.*?)\]/);
    if (typeMatch) {
      const extractedType = typeMatch[1].toLowerCase();
      // Only accept valid types
      if (['state', 'event'].includes(extractedType)) {
        type = extractedType;
      }
    }
    // Use the last part as description if available
    description = parts[parts.length - 1] || parts[0];
  }

  return { type, description };
};

/**
 * Validates Mermaid code structure
 * @param {string} mermaidCode - The Mermaid code to validate
 * @returns {boolean} True if valid, false otherwise
 */
export function validateMermaidCode(mermaidCode) {
  if (!mermaidCode || typeof mermaidCode !== 'string') return false;
  
  const lines = mermaidCode.split('\n').map(line => line.trim());
  
  // Check for flowchart declaration
  if (!lines.some(line => line === 'flowchart TD')) return false;
  
  let hasValidContent = false;
  let hasNodes = false;
  
  for (const line of lines) {
    // Skip empty lines and comments
    if (!line || line.startsWith('%%')) continue;
    
    // Check for valid node definitions: A(Node text)
    if (line.match(/^[A-Z]+\([^()]+\);?$/)) {
      hasNodes = true;
      hasValidContent = true;
      continue;
    }
    
    // Check for valid edge definitions: A --> B
    if (line.match(/^[A-Z]+\s*-->\s*[A-Z]+;?$/)) {
      if (hasNodes) { // Only count edges as valid if we've seen nodes
        hasValidContent = true;
      }
      continue;
    }
  }
  
  return hasValidContent;
}

/**
 * Converts Mermaid diagram code to JSON format
 * @param {string} mermaidCode - The Mermaid code to convert
 * @returns {Object} The JSON representation of the diagram
 */
export function convertMermaidToJson(mermaidCode) {
  const lines = mermaidCode.split('\n');

  const jsonOutput = {
    procedure_name: '',
    graph: {
      nodes: [],
      edges: []
    }
  };

  const labelToIdMap = {};
  let lastElementType = null; // "node" or "edge"
  let lastElementRef = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip empty lines and flowchart declaration
    if (!line || line === 'flowchart TD') continue;

    // Match Procedure
    if (line.includes('%% Procedure:')) {
      jsonOutput.procedure_name = line.split('%% Procedure:')[1].trim();
      continue;
    }

    // Match node: A(UE_Deregistered)
    const nodeMatch = line.match(/^([A-Z]+)\(([^()]+)\);?/);
    if (nodeMatch) {
      const [_, label, id] = nodeMatch;
      // Unescape node text
      const unescapedId = id
        .replace(/\\\\?\(/g, '(')
        .replace(/\\\\?\)/g, ')')
        .replace(/&quot;/g, '"');
      
      labelToIdMap[label] = unescapedId;
      const node = { id: unescapedId, type: '', description: '' };
      jsonOutput.graph.nodes.push(node);
      lastElementType = 'node';
      lastElementRef = node;
      continue;
    }

    // Match edge: A --> B
    const edgeMatch = line.match(/^([A-Z]+)\s*-->\s*([A-Z]+);?/);
    if (edgeMatch) {
      const [_, fromLabel, toLabel] = edgeMatch;
      const from = labelToIdMap[fromLabel] || fromLabel;
      const to = labelToIdMap[toLabel] || toLabel;
      const edge = { from, to, type: '', description: '' };
      jsonOutput.graph.edges.push(edge);
      lastElementType = 'edge';
      lastElementRef = edge;
      continue;
    }

    // Match Type
    const typeMatch = line.match(/^%% Type:\s*(.+)$/);
    if (typeMatch && lastElementRef) {
      lastElementRef.type = typeMatch[1].trim();
      continue;
    }

    // Match Description
    const descMatch = line.match(/^%% Description:\s*(.+)$/);
    if (descMatch && lastElementRef) {
      lastElementRef.description = descMatch[1].trim();
      continue;
    }
  }

  return jsonOutput;
}

/**
 * Saves Mermaid code as JSON
 * @param {string} mermaidCode - The Mermaid code to convert and save
 * @returns {Object} Result object with success status and message
 */
export async function saveMermaidAsJson(mermaidCode) {
  try {
    if (!validateMermaidCode(mermaidCode)) {
      return {
        success: false,
        message: 'Invalid Mermaid code structure'
      };
    }

    const jsonData = convertMermaidToJson(mermaidCode);
    
    return {
      success: true,
      message: 'Successfully converted to JSON',
      data: jsonData
    };
  } catch (error) {
    console.error('Error in saveMermaidAsJson:', error);
    return {
      success: false,
      message: error.message
    };
  }
} 