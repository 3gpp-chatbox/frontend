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
 * @returns {Object} Validation result with success status and error messages
 */
export function validateMermaidCode(mermaidCode) {
  const errors = [];
  
  if (!mermaidCode || typeof mermaidCode !== 'string') {
    return {
      isValid: false,
      errors: ['No Mermaid code provided or invalid type']
    };
  }
  
  const lines = mermaidCode.split('\n').map(line => line.trim()).filter(line => line);
  
  if (lines.length === 0) {
    return {
      isValid: false,
      errors: ['Mermaid code is empty']
    };
  }
  
  // Check for flowchart declaration
  if (!lines[0].match(/^flowchart\s+(TD|LR)$/)) {
    errors.push('First line must be "flowchart TD" or "flowchart LR"');
  }
  
  let hasNodes = false;
  let nodeCount = 0;
  let edgeCount = 0;
  const definedNodes = new Set();
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    
    // Skip valid comments and style definitions
    if (line.startsWith('%%') || line.startsWith('classDef')) {
      continue;
    }
    
    // Check for valid node definitions
    // Allow more flexible node syntax
    const nodeMatch = line.match(/^([A-Z]+)\s*(?:\[|\(|\(\()["']([^"']+)["'](?:\]|\)|\)\))(?:\s*:::[\w-]+)?$/);
    if (nodeMatch) {
      const [_, nodeId] = nodeMatch;
      
      if (definedNodes.has(nodeId)) {
        errors.push(`Line ${i + 1}: Duplicate node ID "${nodeId}"`);
      } else {
        definedNodes.add(nodeId);
        hasNodes = true;
        nodeCount++;
      }
      continue;
    }
    
    // Check for valid edge definitions with more flexible syntax
    const edgeMatch = line.match(/^([A-Z]+)\s*-->\s*(?:\|[^|]+\|\s*)?([A-Z]+)$/);
    if (edgeMatch) {
      const [_, fromNode, toNode] = edgeMatch;
      if (!definedNodes.has(fromNode)) {
        errors.push(`Line ${i + 1}: Edge references undefined node "${fromNode}"`);
      }
      if (!definedNodes.has(toNode)) {
        errors.push(`Line ${i + 1}: Edge references undefined node "${toNode}"`);
      }
      edgeCount++;
      continue;
    }

    // If line doesn't match any pattern and isn't a comment/style
    if (!line.startsWith('%%') && !line.startsWith('classDef')) {
      errors.push(`Line ${i + 1}: Invalid syntax: "${line}"`);
    }
  }
  
  // Final validation checks
  if (nodeCount === 0) {
    errors.push('No valid nodes found in the diagram');
  }
  
  if (edgeCount === 0 && nodeCount > 1) {
    errors.push('Multiple nodes found but no edges connecting them');
  }

  return {
    isValid: errors.length === 0,
    errors: errors
  };
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
    edges: [],
    procedure_name: ""
  };

  const labelToIdMap = {};
  let lastElementType = null; // "node" or "edge"
  let lastElementRef = null;

  // Extract procedure name if it exists
  const procedureLine = lines.find(line => line.includes("%% Procedure:"));
  if (procedureLine) {
    jsonOutput.procedure_name = procedureLine.split("%% Procedure:")[1].trim();
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip empty lines and flowchart declaration
    if (!line || line === 'flowchart TD' || line.startsWith('classDef')) continue;

    // Match node definitions with label: A["content"] or A(("content"))
    const nodeMatch = line.match(/^([A-Z]+)(?:\[|\(\()["']([^"']+)["'](?:\]|\)\))(?:::(\w+))?/);
    if (nodeMatch) {
      const [_, label, content, nodeType] = nodeMatch;
      
      // Extract the actual node ID from the content
      // Remove formatting and get the last part if there are line breaks
      const parts = content.split('<br>');
      const cleanContent = parts[parts.length - 1]?.replace(/\*\*/g, '') || content;
      
      labelToIdMap[label] = cleanContent;
      
      // Determine node type based on shape or explicit type
      // Default to 'state' if not specified
      let type = 'state';
      if (nodeType) {
        type = nodeType; // Use explicit type if provided via :::type
      } else if (line.includes('((') && line.includes('))')) {
        type = 'event'; // Double parentheses indicate event
      }

      // Validate node type
      if (!['state', 'event'].includes(type)) {
        type = 'state'; // Default to state if invalid type
      }
      
      const node = {
        id: cleanContent,
        type: type,
        description: ""
      };
      
      jsonOutput.nodes.push(node);
      lastElementType = "node";
      lastElementRef = node;
      continue;
    }

    // Match edge definitions: A --> B or A -->|message| B
    const edgeMatch = line.match(/^([A-Z]+)\s*-->\s*(?:\|([^|]+)\|)?\s*([A-Z]+)/);
    if (edgeMatch) {
      const [_, fromLabel, messageType, toLabel] = edgeMatch;
      const from = labelToIdMap[fromLabel] || fromLabel;
      const to = labelToIdMap[toLabel] || toLabel;
      
      const edge = {
        from,
        to,
        type: "trigger", // Default to trigger, can be overridden by Type comment
        description: messageType || "" // Use message type as description if available
      };
      
      jsonOutput.edges.push(edge);
      lastElementType = "edge";
      lastElementRef = edge;
      continue;
    }

    // Match Type comment
    const typeMatch = line.match(/^%% Type:\s*(.+)$/);
    if (typeMatch && lastElementRef) {
      const type = typeMatch[1].trim();
      if (lastElementType === "edge") {
        // Validate edge type
        lastElementRef.type = ['trigger', 'condition'].includes(type) ? type : 'trigger';
      } else {
        // Validate node type
        lastElementRef.type = ['state', 'event'].includes(type) ? type : 'state';
      }
      continue;
    }

    // Match Description comment
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
    console.log('Starting Mermaid validation...');
    // First validate Mermaid syntax
    const mermaidValidation = validateMermaidCode(mermaidCode);
    console.log('Mermaid validation result:', mermaidValidation);
    
    if (!mermaidValidation.isValid) {
      return {
        success: false,
        message: 'Invalid Mermaid syntax',
        errors: mermaidValidation.errors,
        errorType: 'MERMAID_SYNTAX_ERROR'
      };
    }

    // Convert to JSON
    console.log('Converting to JSON...');
    let jsonData;
    try {
      jsonData = convertMermaidToJson(mermaidCode);
      console.log('Converted JSON:', jsonData);
    } catch (conversionError) {
      console.error('Conversion error:', conversionError);
      return {
        success: false,
        message: 'Failed to convert Mermaid to JSON',
        errors: [conversionError.message],
        errorType: 'CONVERSION_ERROR'
      };
    }

    // Validate the JSON structure
    console.log('Validating JSON structure...');
    const jsonValidation = validateGraph(jsonData);
    console.log('JSON validation result:', jsonValidation);
    
    if (!jsonValidation.valid) {
      return {
        success: false,
        message: 'Invalid graph structure',
        errors: [jsonValidation.error],
        errorType: 'GRAPH_STRUCTURE_ERROR'
      };
    }

    // If we get here, everything is valid
    return {
      success: true,
      message: 'Successfully converted and validated',
      data: jsonData
    };

  } catch (error) {
    console.error('Unexpected error in saveMermaidAsJson:', error);
    return {
      success: false,
      message: 'Unexpected error occurred',
      errors: [error.message],
      errorType: 'UNEXPECTED_ERROR'
    };
  }
} 

