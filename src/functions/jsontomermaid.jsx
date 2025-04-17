/**
 * Converts a JSON graph structure to Mermaid diagram syntax
 * @param {Object} jsonData - The graph data in JSON format
 * @param {Object} options - Configuration options for the conversion
 * @param {string} options.direction - Graph direction ('TD' for top-down, 'LR' for left-right)
 * @param {Object} options.styles - Custom style definitions
 * @returns {string} Mermaid diagram syntax
 */
export const JsonToMermaid = (jsonData, options = {}) => {
  if (!jsonData || !jsonData.nodes || !jsonData.edges) {
    console.error("Invalid graph data structure");
    return "";
  }

  const {
    direction = "TD",
    styles = {
      state: { fill: "#f9f", stroke: "#333", "stroke-width": "2px", color: "#000" },
      event: { fill: "#bbf", stroke: "#333", "stroke-width": "2px", color: "#000" }
    }
  } = options;

  let mermaidCode = `flowchart ${direction}\n`;

  // Add procedure name if exists
  if (jsonData.procedure_name) {
    mermaidCode += `    %% Procedure: ${jsonData.procedure_name}\n`;
  }

  // Style definitions
  Object.entries(styles).forEach(([className, style]) => {
    const styleStr = Object.entries(style)
      .map(([key, value]) => `${key}:${value}`)
      .join(",");
    mermaidCode += `    classDef ${className} ${styleStr}\n`;
  });
  mermaidCode += "\n";

  // Create node label mapping
  const nodeIdMap = {};
  const labelLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let labelIndex = 0;

  // Function to generate node labels (A, B, C, ... AA, AB, etc.)
  const getNextLabel = () => {
    let label = "";
    let index = labelIndex;
    do {
      label = labelLetters[index % 26] + label;
      index = Math.floor(index / 26) - 1;
    } while (index >= 0);
    labelIndex++;
    return label;
  };

  // Process nodes
  jsonData.nodes.forEach(node => {
    // Generate and store label for this node
    const label = getNextLabel();
    
    // Store both the display ID and the actual ID in the map
    const nodeId = node.id.trim();
    nodeIdMap[nodeId] = label;

    // Create node label based on type
    const nodeType = node.type.toLowerCase();
    const shape = nodeType === "event" ? "((" : "[";
    const closeShape = nodeType === "event" ? "))" : "]";

    // Build node content
    let nodeContent = `${nodeId}`;
    
    if (node.properties) {
      if (nodeType === "event" && node.properties.eventType) {
        nodeContent += `${node.entity}: ${node.properties.eventType}`;
      } else if (nodeType === "state" && node.properties.state) {
        nodeContent += `${node.entity}: ${node.properties.state}`;
      }
      
      // Add any additional properties
      Object.entries(node.properties)
        .filter(([key]) => !["eventType", "state"].includes(key))
        .forEach(([key, value]) => {
          nodeContent += `${key}: ${value}<br>`;
        });
    }

    // Escape quotes and add node with label
    const escapedContent = nodeContent.replace(/"/g, '\\"');
    mermaidCode += `    ${label}${shape}"${escapedContent}"${closeShape}:::${nodeType}\n`;

    // Add comments for type and description if available

    if (node.description) {
      mermaidCode += `    %% Description: ${node.description}\n`;
    }
  });

  // Process edges using node labels
  jsonData.edges.forEach(edge => {
    const fromLabel = nodeIdMap[edge.from_node] || nodeIdMap[edge.from];
    const toLabel = nodeIdMap[edge.to];

    if (!fromLabel || !toLabel) {
      console.warn(`Missing node mapping for edge: ${edge.from_node || edge.from} -> ${edge.to}`);
      return;
    }

    // Add edge label (type)
    const label = edge.type
      ? `|${edge.type}|`
      : "";

    mermaidCode += `    ${fromLabel} -->${label} ${toLabel}\n`;

    // Add comments for edge type and description if available
    if (edge.type) {
      mermaidCode += `    %% Type: ${edge.type}\n`;
    }
    if (edge.description) {
      mermaidCode += `    %% Description: ${edge.description}\n`;
    }
  });

  return mermaidCode;
};

// Export a default configuration for common use cases
export const defaultMermaidConfig = {
  direction: "TD",
  styles: {
    state: { fill: "#f9f", stroke: "#333", "stroke-width": "2px", color: "#000" },
    event: { fill: "#bbf", stroke: "#333", "stroke-width": "2px", color: "#000" }
  }
};

