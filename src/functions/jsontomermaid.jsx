/**
 * Escapes special characters in node text for Mermaid compatibility
 * @param {string} text - The text to escape
 * @returns {string} Escaped text
 */
function escapeNodeText(text) {
  return text.replace(/\(/g, "\\(").replace(/\)/g, "\\)").replace(/"/g, "&quot;");
}

/**
 * Escapes special characters in edge text for Mermaid compatibility
 * @param {string} text - The text to escape
 * @returns {string} Escaped text
 */
function escapeEdgeText(text) {
  return text.replace(/\(/g, "&#40;").replace(/\)/g, "&#41;").replace(/"/g, "&quot;");
}

/**
 * Converts a JSON graph structure to Mermaid diagram code
 * @param {Object} graphData - The graph data in JSON format
 * @returns {string} Mermaid diagram code
 */
export function convertJsonToMermaid(graphData) {
  let mermaidCode = "flowchart TD\n";

  if (graphData.procedure_name) {
    mermaidCode += `  %% Procedure: ${graphData.procedure_name}\n`;
  }

  const nodeIdMap = {};
  const labelLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let labelIndex = 0;

  // Extend label system to AA, AB, etc., if we run out of single letters
  function getNextLabel() {
    let label = "";
    let index = labelIndex;
    do {
      label = labelLetters[index % 26] + label;
      index = Math.floor(index / 26) - 1;
    } while (index >= 0);
    labelIndex++;
    return label;
  }

  // Assign labels and print node definitions
  graphData.graph.nodes.forEach(node => {
    const label = getNextLabel();
    nodeIdMap[node.id] = label;
    const labelText = escapeNodeText(node.id);
    mermaidCode += `  ${label}(${labelText})\n`;
    mermaidCode += `  %% Type: ${node.type}\n`;
    if (node.description) {
      mermaidCode += `  %% Description: ${node.description}\n`;
    }
  });

  // Add edges using mapped labels
  graphData.graph.edges.forEach(edge => {
    const from = nodeIdMap[edge.from] || edge.from;
    const to = nodeIdMap[edge.to] || edge.to;
    mermaidCode += `  ${from} --> ${to}\n`;
    mermaidCode += `  %% Type: ${edge.type}\n`;
    if (edge.description) {
      mermaidCode += `  %% Description: ${edge.description}\n`;
    }
  });

  return mermaidCode;
}

// Sample test data
const sampleGraphData = {
  procedure_name: "Initial Registration",
  graph: {
    nodes: [
      {
        id: "UE",
        type: "endpoint",
        description: "User Equipment"
      },
      {
        id: "gNB",
        type: "network_element",
        description: "Next Generation Node B"
      },
      {
        id: "AMF",
        type: "network_function",
        description: "Access and Mobility Management Function"
      }
    ],
    edges: [
      {
        from: "UE",
        to: "gNB",
        type: "message",
        description: "Registration Request"
      },
      {
        from: "gNB",
        to: "AMF",
        type: "message",
        description: "N2 Registration Request"
      }
    ]
  }
};

// Export the sample data for testing
export const getMermaidConverter = () => {
  return (data) => convertJsonToMermaid(data || sampleGraphData);
};
