/**
 * Converts a JSON graph structure to Mermaid diagram syntax
 * @param {Object} jsonData - The graph data in JSON format
 * @param {Object} options - Configuration options for the conversion
 * @param {string} options.direction - Graph direction ('TD' for top-down, 'LR' for left-right)
 * @param {Object} options.styles - Custom style definitions
 * @param {boolean} options.useEditedGraph - Whether to use edited_graph instead of original_graph
 * @returns {string} Mermaid diagram syntax
 */
export const JsonToMermaid = (jsonData, options = {}) => {
  if (!jsonData) {
    console.error("Invalid graph data: No data provided");
    return "";
  }

  // Handle both direct graph data and API response format
  let graphData;
  if (jsonData.original_graph || jsonData.edited_graph) {
    // API response format
    graphData = options.useEditedGraph ? jsonData.edited_graph : jsonData.original_graph;
  } else {
    // Direct graph data format
    graphData = jsonData;
  }

  if (!graphData || !graphData.nodes || !graphData.edges) {
    console.error("Invalid graph data structure:", graphData);
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

  // Style definitions
  Object.entries(styles).forEach(([className, style]) => {
    const styleStr = Object.entries(style)
      .map(([key, value]) => `${key}:${value}`)
      .join(",");
    mermaidCode += `    classDef ${className} ${styleStr}\n`;
  });
  mermaidCode += "\n";

  // Process nodes
  graphData.nodes.forEach(node => {
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
    
    if (node.description) {
      nodeContent += `${node.description}<br>`;
    }

    // Escape quotes and add node
    const escapedContent = nodeContent.replace(/"/g, '\\"');
    mermaidCode += `    ${nodeId}${shape}"${escapedContent}"${closeShape}:::${nodeType}\n`;
  });

  // Process edges
  graphData.edges.forEach(edge => {
    const sourceId = edge.from
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, "_")
      .trim();
    const targetId = edge.to
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, "_")
      .trim();

    // Add edge description if it exists
    const label = edge.description ? `|${edge.description}|` : "";

    mermaidCode += `    ${sourceId} -->${label} ${targetId}\n`;
  });

  return mermaidCode;
};

// Export a default configuration for common use cases
export const defaultMermaidConfig = {
  direction: "TD",
  useEditedGraph: true, // Default to using edited_graph
  styles: {
    state: { fill: "#f9f", stroke: "#333", "stroke-width": "2px", color: "#000" },
    event: { fill: "#bbf", stroke: "#333", "stroke-width": "2px", color: "#000" }
  }
};