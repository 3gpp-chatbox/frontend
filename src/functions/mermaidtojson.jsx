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
 * Converts Mermaid flowchart code to JSON format
 * @param {string} mermaidCode - The Mermaid flowchart code
 * @returns {Object} The converted JSON object
 * @throws {Error} If the Mermaid code is invalid
 */
const convertMermaidToJson = (mermaidCode) => {
  if (!mermaidCode || typeof mermaidCode !== 'string') {
    throw new Error('Invalid Mermaid code: empty or not a string');
  }

  // Split lines and clean them up
  const lines = mermaidCode
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('%%'));

  if (lines.length === 0) {
    throw new Error('Invalid Mermaid code: no valid content found');
  }

  if (!lines[0].startsWith('flowchart')) {
    throw new Error('Invalid Mermaid code: must start with flowchart declaration');
  }

  const nodes = [];
  const edges = [];
  let nodeIdCounter = 1;
  const nodeMap = new Map();

  // Skip the flowchart TD/LR line
  const codeLines = lines.slice(1);

  // Helper function to generate unique node IDs
  const getNodeId = (label) => {
    if (!nodeMap.has(label)) {
      nodeMap.set(label, `node_${nodeIdCounter++}`);
    }
    return nodeMap.get(label);
  };

  // Helper function to parse node definition
  const parseNode = (line) => {
    const nodeMatch = line.match(/^(\w+)\[(["'])(.*?)\2\]$/);
    if (nodeMatch) {
      const [_, id, __, label] = nodeMatch;
      const nodeId = getNodeId(id);
      const { type, description } = parseNodeLabel(label);

      return {
        id: nodeId,
        type,
        description,
        properties: {
          originalId: id,
          label
        }
      };
    }
    return null;
  };

  // Helper function to parse edge definition
  const parseEdge = (line) => {
    const edgeMatch = line.match(/^(\w+)\s*--(?:\|(.*?)\|)?-->\s*(\w+)$/);
    if (edgeMatch) {
      const [_, fromId, label, toId] = edgeMatch;
      return {
        from: getNodeId(fromId),
        to: getNodeId(toId),
        type: 'trigger', // Default to trigger type
        description: label || 'Default transition',
        properties: {
          label: label || ''
        }
      };
    }
    return null;
  };

  // Process each line
  codeLines.forEach(line => {
    const node = parseNode(line);
    if (node) {
      nodes.push(node);
      return;
    }

    const edge = parseEdge(line);
    if (edge) {
      edges.push(edge);
    }
  });

  // Validate basic graph structure
  if (nodes.length === 0) {
    throw new Error('Invalid Mermaid code: no nodes found');
  }

  // Create the graph object
  const graph = {
    graph: {
      nodes,
      edges
    }
  };

  return graph;
};

/**
 * Saves the converted and validated JSON to a file
 * @param {string} mermaidCode - The Mermaid flowchart code to convert
 * @returns {Promise<Object>} Result of the operation
 */
export const saveMermaidAsJson = async (mermaidCode) => {
  try {
    // First validate Mermaid syntax
    if (!validateMermaidCode(mermaidCode)) {
      throw new Error('Invalid Mermaid syntax');
    }

    // Convert Mermaid to JSON
    const jsonData = convertMermaidToJson(mermaidCode);
    console.log('Converted JSON:', jsonData); // Debug log

    // Validate the converted JSON
    const validationResult = validateGraph(jsonData);
    if (!validationResult.valid) {
      console.error('Validation errors:', validationResult.error); // Debug log
      throw new Error(`Validation failed: ${validationResult.error}`);
    }

    // Save to file using fetch
    const response = await fetch('http://localhost:8000/api/save-edit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: jsonData,
        timestamp: new Date().toISOString(),
        version: '1.0'
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to save JSON data');
    }

    return {
      success: true,
      message: 'Successfully converted and saved Mermaid code',
      data: jsonData
    };

  } catch (error) {
    console.error('Error in saveMermaidAsJson:', error);
    return {
      success: false,
      message: error.message,
      error: error
    };
  }
};

/**
 * Validates Mermaid code structure before conversion
 * @param {string} mermaidCode - The Mermaid code to validate
 * @returns {boolean} Whether the code is valid
 */
export const validateMermaidCode = (mermaidCode) => {
  if (!mermaidCode || typeof mermaidCode !== 'string') {
    return false;
  }

  // Split and clean up lines
  const lines = mermaidCode
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('%%'));

  if (lines.length === 0) {
    return false;
  }

  // Check for required flowchart declaration
  if (!lines[0].startsWith('flowchart')) {
    return false;
  }

  // Check for at least one valid node or edge definition
  let hasValidContent = false;
  for (const line of lines.slice(1)) { // Skip flowchart line
    if (line.match(/^\w+\[["'].*["']\]$/) || 
        line.match(/^\w+\s*--(?:\|.*\|)?-->\s*\w+$/)) {
      hasValidContent = true;
      break;
    }
  }

  return hasValidContent;
}; 