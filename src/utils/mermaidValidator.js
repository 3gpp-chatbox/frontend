import mermaid from "mermaid";

/**
 * Validates Mermaid diagram syntax
 * @param {string} code - Mermaid diagram code to validate
 * @returns {Promise<{isValid: boolean, error: string|null}>}
 */
export const validateMermaidSyntax = async (code) => {
  try {
    await mermaid.parse(code);
    return { isValid: true, error: null };
  } catch (error) {
    return { isValid: false, error: error.message };
  }
};

/**
 * Verifies the graph structure for valid nodes and edges
 * @param {string} code - Mermaid diagram code to verify
 * @returns {{isValid: boolean, error: string|null}}
 */
export const verifyGraphStructure = (code) => {
  try {
    const lines = code.split('\n');
    const nodes = new Set();
    const edges = [];
    let hasFlowchart = false;

    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Check flowchart declaration
      if (trimmedLine.startsWith('flowchart') || trimmedLine.startsWith('graph')) {
        hasFlowchart = true;
        continue;
      }

      // Skip comments and empty lines
      if (trimmedLine.startsWith('%%') || !trimmedLine) continue;

      // Check for node definitions
      const nodeMatch = trimmedLine.match(/^([A-Za-z0-9_-]+)[\[\(\{]/);
      if (nodeMatch) {
        const nodeId = nodeMatch[1];
        if (nodes.has(nodeId)) {
          return { isValid: false, error: `Duplicate node ID: ${nodeId}` };
        }
        nodes.add(nodeId);
        continue;
      }

      // Check for edge definitions
      const edgeMatch = trimmedLine.match(/([A-Za-z0-9_-]+)\s*--?>?\s*([A-Za-z0-9_-]+)/);
      if (edgeMatch) {
        const [_, fromNode, toNode] = edgeMatch;
        edges.push({ from: fromNode, to: toNode });
      }
    }

    // Verify flowchart declaration exists
    if (!hasFlowchart) {
      return { isValid: false, error: "Missing flowchart declaration" };
    }

    // Verify edge connections
    for (const edge of edges) {
      if (!nodes.has(edge.from)) {
        return { isValid: false, error: `Edge references undefined node: ${edge.from}` };
      }
      if (!nodes.has(edge.to)) {
        return { isValid: false, error: `Edge references undefined node: ${edge.to}` };
      }
    }

    return { isValid: true, error: null };
  } catch (error) {
    return { isValid: false, error: "Invalid graph structure" };
  }
};

/**
 * Formats Mermaid code with proper indentation and spacing
 * @param {string} code - Mermaid diagram code to format
 * @returns {string} Formatted code
 */
export const formatMermaidCode = (code) => {
  try {
    const lines = code.split('\n');
    const formattedLines = [];
    let indentLevel = 0;

    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Skip empty lines
      if (!trimmedLine) continue;

      // Handle flowchart declaration
      if (trimmedLine.startsWith('flowchart') || trimmedLine.startsWith('graph')) {
        formattedLines.push(trimmedLine);
        indentLevel = 1;
        continue;
      }

      // Handle comments
      if (trimmedLine.startsWith('%%')) {
        formattedLines.push('    '.repeat(indentLevel) + trimmedLine);
        continue;
      }

      // Handle node definitions and edges
      if (trimmedLine.match(/^[A-Za-z0-9_-]+[\[\(\{]/) || 
          trimmedLine.match(/[A-Za-z0-9_-]+\s*--?>?\s*[A-Za-z0-9_-]+/)) {
        formattedLines.push('    '.repeat(indentLevel) + trimmedLine);
        continue;
      }

      // Handle other lines
      formattedLines.push('    '.repeat(indentLevel) + trimmedLine);
    }

    return formattedLines.join('\n');
  } catch (error) {
    return code; // Return original code if formatting fails
  }
};

/**
 * Generates a unique node ID
 * @returns {string} Unique node ID
 */
export const generateNodeId = () => {
  return `N${Math.random().toString(36).substr(2, 6)}`;
}; 