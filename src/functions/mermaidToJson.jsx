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
    nodes: [],
    edges: []
  };

  const labelToIdMap = {};
  let lastElementType = null; // "node" or "edge"
  let lastElementRef = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip empty lines and flowchart declaration
    if (!line || line === 'flowchart TD') continue;

    // Match node definitions
    const nodeMatch = line.match(/^(\d+)([\[\(])"([^"]+)"([\]\)])(?:::(\w+))?/);
    if (nodeMatch) {
      const [_, id, openBracket, content, closeBracket, nodeType] = nodeMatch;
      
      // Determine node type from brackets or explicit type
      let type = 'entity'; // default type
      if (nodeType) {
        type = nodeType === 'event' ? 'action' : 'entity';
      } else if (openBracket === '(' && closeBracket === ')') {
        type = 'action';
      }

      // Parse content for label
      const parts = content.split('<br>');
      const label = parts[parts.length - 1] || parts[0];
      
      const node = {
        id: id,
        type: type,
        label: label.replace(/\*\*/g, '') // Remove markdown formatting
      };
      
      jsonOutput.nodes.push(node);
      labelToIdMap[id] = node;
      lastElementType = 'node';
      lastElementRef = node;
      continue;
    }

    // Match edge definitions: 1 --> 2
    const edgeMatch = line.match(/^(\d+)\s*-->\s*(\d+)$/);
    if (edgeMatch) {
      const [_, sourceId, targetId] = edgeMatch;
      
      const edge = {
        source: sourceId,
        target: targetId,
        label: '' // Default empty label
      };
      
      jsonOutput.edges.push(edge);
      lastElementType = 'edge';
      lastElementRef = edge;
      continue;
    }

    // Match edge with label: 1 -->|label| 2
    const labeledEdgeMatch = line.match(/^(\d+)\s*-->\|([^|]+)\|\s*(\d+)$/);
    if (labeledEdgeMatch) {
      const [_, sourceId, label, targetId] = labeledEdgeMatch;
      
      const edge = {
        source: sourceId,
        target: targetId,
        label: label.trim()
      };
      
      jsonOutput.edges.push(edge);
      lastElementType = 'edge';
      lastElementRef = edge;
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