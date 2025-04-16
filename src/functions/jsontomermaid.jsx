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

  let lines = [];
  lines.push(`flowchart ${direction}`);

  // Style definitions
  Object.entries(styles).forEach(([className, style]) => {
    const styleStr = Object.entries(style)
      .map(([key, value]) => `${key}:${value}`)
      .join(",");
    lines.push(`classDef ${className} ${styleStr}`);
  });
  lines.push("");

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
    lines.push(`${nodeId}${shape}"${escapedContent}"${closeShape}:::${nodeType}`);
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

    lines.push(`${sourceId} -->${label} ${targetId}`);
  });

  // Join all lines with newlines and ensure no extra whitespace
  return lines.join('\n').trim();
};

// Export a default configuration for common use cases
export const defaultMermaidConfig = {
  direction: "TD",
  styles: {
    state: { fill: "#f9f", stroke: "#333", "stroke-width": "2px", color: "#000" },
    event: { fill: "#bbf", stroke: "#333", "stroke-width": "2px", color: "#000" }
  }
};

