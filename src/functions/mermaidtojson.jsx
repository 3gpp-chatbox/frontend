import { validateGraph, validateNode, validateEdge } from './schema_validation';

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
 * @throws {Error} If validation fails
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
  let currentNode = null;
  let currentEdge = null;

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
      // If we were processing a previous node or edge, validate it before moving on
      if (currentNode) {
        const validation = validateNode(currentNode);
        if (!validation.valid) {
          throw new Error(`Invalid node: ${validation.errors.join(", ")}`);
        }
      }
      
      const [_, label, id] = nodeMatch;
      // Unescape node text
      const unescapedId = id
        .replace(/\\\\?\(/g, '(')
        .replace(/\\\\?\)/g, ')')
        .replace(/&quot;/g, '"');
      
      labelToIdMap[label] = unescapedId;
      currentNode = { 
        id: unescapedId, 
        type: 'state', // Default type, will be updated by Type comment if present
        description: '' // Will be updated by Description comment if present
      };
      jsonOutput.graph.nodes.push(currentNode);
      lastElementType = 'node';
      lastElementRef = currentNode;
      continue;
    }

    // Match edge: A --> B
    const edgeMatch = line.match(/^([A-Z]+)\s*-->\s*([A-Z]+);?/);
    if (edgeMatch) {
      // If we were processing a previous node or edge, validate it
      if (currentNode) {
        const validation = validateNode(currentNode);
        if (!validation.valid) {
          throw new Error(`Invalid node: ${validation.errors.join(", ")}`);
        }
        currentNode = null;
      }
      if (currentEdge) {
        const validation = validateEdge(currentEdge);
        if (!validation.valid) {
          throw new Error(`Invalid edge: ${validation.errors.join(", ")}`);
        }
      }

      const [_, fromLabel, toLabel] = edgeMatch;
      const from = labelToIdMap[fromLabel] || fromLabel;
      const to = labelToIdMap[toLabel] || toLabel;
      currentEdge = { 
        from, 
        to, 
        type: 'trigger', // Default type, will be updated by Type comment if present
        description: '' // Will be updated by Description comment if present
      };
      jsonOutput.graph.edges.push(currentEdge);
      lastElementType = 'edge';
      lastElementRef = currentEdge;
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

  // Validate the last node or edge if any
  if (currentNode) {
    const validation = validateNode(currentNode);
    if (!validation.valid) {
      throw new Error(`Invalid node: ${validation.errors.join(", ")}`);
    }
  }
  if (currentEdge) {
    const validation = validateEdge(currentEdge);
    if (!validation.valid) {
      throw new Error(`Invalid edge: ${validation.errors.join(", ")}`);
    }
  }

  // Final validation of the entire graph
  const finalValidation = validateGraph(jsonOutput);
  if (!finalValidation.valid) {
    throw new Error(`Graph validation failed: ${finalValidation.error}`);
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