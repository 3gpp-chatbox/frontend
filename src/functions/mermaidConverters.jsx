// Simple converter that matches the desired format
export const converter1 = (jsonData) => {
  if (!jsonData?.graph?.nodes || !jsonData?.graph?.edges) {
    console.error("Invalid graph data structure", jsonData);
    return "";
  }

  // Helper function to escape special characters in text
  const escapeText = (text) => {
    if (!text) return "";
    return text
      .replace(/[()[\]{}]/g, "\\$&") // Escape brackets and parentheses
      .replace(/[,;]/g, "\\$&") // Escape commas and semicolons
      .replace(/\n/g, "<br/>") // Convert newlines to HTML breaks
      .replace(/['"]/g, "") // Remove quotes
      .trim();
  };

  let mermaidCode = "flowchart TD\n";

  // Process nodes
  jsonData.graph.nodes.forEach((node) => {
    const nodeId = node.id.toString();
    const description = escapeText(node.description || node.id);
    const type = node.type || "unknown";

    // Create a formatted label with ID, type, and description
    const label = `${nodeId}<br/>[${type}]<br/>${description}`;

    // Determine node shape based on type
    let shape = "["; // Default shape is square
    let closeShape = "]";

    if (node.type === "state") {
      shape = "(("; // Round shape for state
      closeShape = "))";
    } else if (node.type === "event") {
      shape = "["; // Square shape for event
      closeShape = "]";
    }

    // Add node with label
    mermaidCode += `    ${nodeId}${shape}"${label}"${closeShape}\n`;
  });

  // Process edges
  jsonData.graph.edges.forEach((edge) => {
    const sourceId = edge.from.toString();
    const targetId = edge.to.toString();

    // Add edge label if it exists
    const message = edge.properties?.message
      ? escapeText(edge.properties.message)
      : "";
    const label = message ? `|${message}|` : "";

    mermaidCode += `    ${sourceId} -->${label} ${targetId}\n`;
  });

  return mermaidCode;
};

// Converter for Method 2: Property Graph Format
export const converter2 = (jsonData) => {
  // Handle array of procedures
  const procedure = Array.isArray(jsonData) ? jsonData[0] : jsonData;

  if (!procedure || !procedure.nodes || !procedure.edges) {
    console.error("Invalid graph data structure");
    return "";
  }

  let mermaidCode = "graph TD\n";

  // Process nodes - with actor and circle shape for states
  procedure.nodes.forEach((node) => {
    const nodeId = node.id;
    const nodeLabel = node.properties?.actor
      ? `${node.label}<br>(${node.properties.actor})`
      : node.label;

    // Use circle shape (()) for states, regular shape ([]) for others
    const shape = node.type === "state" ? "((" : "[";
    const closeShape = node.type === "state" ? "))" : "]";

    // Create node with label and actor
    mermaidCode += `    ${nodeId}${shape}"${nodeLabel}"${closeShape}\n`;

    // Apply style based on node type
    mermaidCode += `    class ${nodeId} ${node.type}\n`;
  });

  // Process edges
  procedure.edges.forEach((edge) => {
    const sourceId = edge.source;
    const targetId = edge.target;
    const label = edge.label ? `|${edge.label}|` : "";

    mermaidCode += `    ${sourceId} -->${label} ${targetId}\n`;
  });

  return mermaidCode;
};

// Converter 3: Placeholder for future implementation
export const converter3 = () => {
  // Implementation pending
  return "";
};

// Mapper function to select converter
export const getMermaidConverter = () => converter1;
