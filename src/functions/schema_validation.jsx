/**
 * Frontend schema validation matching backend Pydantic models
 */

/**
 * Validates a Node object
 * @param {Object} node - The node to validate
 * @returns {Object} Validation result with any errors
 */
const validateNode = (node) => {
  const errors = [];
  
  // Check required fields
  if (!node.id) {
    errors.push("Missing required field: id");
  }
  
  if (!node.type) {
    errors.push("Missing required field: type");
  } else if (!["entity", "action"].includes(node.type)) {
    errors.push(`Invalid node type: ${node.type}. Must be either 'entity' or 'action'`);
  }
  
  if (!node.label || typeof node.label !== 'string') {
    errors.push("Missing or invalid label: must be a string");
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Validates an Edge object
 * @param {Object} edge - The edge to validate
 * @returns {Object} Validation result with any errors
 */
const validateEdge = (edge) => {
  const errors = [];
  
  // Check required fields
  if (!edge.source) {
    errors.push("Missing required field: source");
  }
  
  if (!edge.target) {
    errors.push("Missing required field: target");
  }
  
  if (!edge.label || typeof edge.label !== 'string') {
    errors.push("Missing or invalid label: must be a string");
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Validates the graph content structure
 * @param {Object} graphContent - The graph content to validate
 * @returns {Object} Validation result with any errors
 */
const validateGraphContent = (graphContent) => {
  const errors = [];
  
  if (!Array.isArray(graphContent.nodes)) {
    errors.push("Invalid graph content: nodes must be an array");
    return { valid: false, errors };
  }
  
  if (!Array.isArray(graphContent.edges)) {
    errors.push("Invalid graph content: edges must be an array");
    return { valid: false, errors };
  }

  // Validate each node
  const nodeIds = new Set();
  graphContent.nodes.forEach((node, index) => {
    const nodeValidation = validateNode(node);
    if (!nodeValidation.valid) {
      errors.push(`Invalid node at index ${index}: ${nodeValidation.errors.join(", ")}`);
    }
    nodeIds.add(node.id);
  });

  // Validate each edge and check references
  graphContent.edges.forEach((edge, index) => {
    const edgeValidation = validateEdge(edge);
    if (!edgeValidation.valid) {
      errors.push(`Invalid edge at index ${index}: ${edgeValidation.errors.join(", ")}`);
    }
    
    // Check if referenced nodes exist
    if (!nodeIds.has(edge.source)) {
      errors.push(`Invalid edge at index ${index}: 'source' node ${edge.source} does not exist`);
    }
    if (!nodeIds.has(edge.target)) {
      errors.push(`Invalid edge at index ${index}: 'target' node ${edge.target} does not exist`);
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Validates the complete graph structure
 * @param {Object} data - The graph data to validate
 * @returns {Object} Validation result with success status and any errors
 */
export const validateGraph = (data) => {
  try {
    // Check basic structure
    if (!data || typeof data !== 'object') {
      return { valid: false, error: "Invalid data: must be an object" };
    }

    // Validate graph content
    const contentValidation = validateGraphContent(data);
    if (!contentValidation.valid) {
      return {
        valid: false,
        error: contentValidation.errors.join("\n")
      };
    }

    return { valid: true };
  } catch (error) {
    console.error('Validation error:', error.message);
    return { valid: false, error: error.message };
  }
}; 