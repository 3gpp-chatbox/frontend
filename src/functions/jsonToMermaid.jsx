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

  let mermaidCode = `graph ${direction}\n`;

  // Style definitions
  Object.entries(styles).forEach(([className, style]) => {
    const styleStr = Object.entries(style)
      .map(([key, value]) => `${key}:${value}`)
      .join(",");
    mermaidCode += `    classDef ${className} ${styleStr}\n`;
  });
  mermaidCode += "\n";

  // Process nodes
  jsonData.nodes.forEach(node => {
    // Sanitize node ID
    const nodeId = node.id
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, "_")
      .trim();

    // Create node label based on type
    const nodeType = node.type.toLowerCase();
    const shape = nodeType === "event" ? "((" : "[";
    const closeShape = nodeType === "event" ? "))" : "]";

    // Build node content
    let nodeContent = `**${node.type.toUpperCase()}**<br>`;
    
    if (node.properties) {
      if (nodeType === "event" && node.properties.eventType) {
        nodeContent += `${node.entity}: ${node.properties.eventType}<br>`;
      } else if (nodeType === "state" && node.properties.state) {
        nodeContent += `${node.entity}: ${node.properties.state}<br>`;
      }
      
      // Add any additional properties
      Object.entries(node.properties)
        .filter(([key]) => !["eventType", "state"].includes(key))
        .forEach(([key, value]) => {
          nodeContent += `${key}: ${value}<br>`;
        });
    }

    // Escape quotes and add node
    const escapedContent = nodeContent.replace(/"/g, '\\"');
    mermaidCode += `    ${nodeId}${shape}"${escapedContent}"${closeShape}:::${nodeType}\n`;
  });

  // Process edges
  jsonData.edges.forEach(edge => {
    const sourceId = edge.from
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, "_")
      .trim();
    const targetId = edge.to
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, "_")
      .trim();

    // Add edge label if properties exist
    const label = edge.properties?.messageType
      ? `|${edge.properties.messageType}|`
      : "";

    mermaidCode += `    ${sourceId} -->${label} ${targetId}\n`;
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

