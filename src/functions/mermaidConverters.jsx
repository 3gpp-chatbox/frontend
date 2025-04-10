export const converter1 = (jsonData) => {
  if (
    !jsonData ||
    !jsonData.graph ||
    !jsonData.graph.nodes ||
    !jsonData.graph.edges
  ) {
    console.error("Invalid graph data structure", jsonData);
    return "";
  }

  let mermaidCode = "graph TD\n";

  // Style definitions
  mermaidCode += "    %% Node styles\n";
  mermaidCode += "    classDef start fill:#9f9,stroke:#333,stroke-width:2px\n";
  mermaidCode += "    classDef end fill:#f99,stroke:#333,stroke-width:2px\n";
  mermaidCode +=
    "    classDef process fill:#fff,stroke:#333,stroke-width:2px\n";
  mermaidCode +=
    "    classDef decision fill:#ffd,stroke:#333,stroke-width:2px,shape:diamond\n";
  mermaidCode +=
    "    classDef timer fill:#bbf,stroke:#333,stroke-width:2px\n\n";

  // Process nodes
  jsonData.graph.nodes.forEach((node) => {
    // Sanitize node ID
    const nodeId = node.id.toString().replace(/[^\w\s]/g, "_");

    // Create label with description and relevant properties
    let label = node.description;
    if (node.properties) {
      if (node.properties.messages) {
        label += `<br>Messages: ${node.properties.messages.join(", ")}`;
      }
      if (node.properties.state_change) {
        label += `<br>State: ${node.properties.state_change}`;
      }
    }

    // Escape quotes and newlines in the label
    const escapedLabel = label.replace(/"/g, '\\"').replace(/\n/g, "<br>");

    // Add node with appropriate shape based on type
    mermaidCode += `    ${nodeId}["${escapedLabel}"]\n`;
    mermaidCode += `    class ${nodeId} ${node.type}\n`;
  });

  // Process edges
  jsonData.graph.edges.forEach((edge) => {
    const sourceId = edge.from.toString().replace(/[^\w\s]/g, "_");
    const targetId = edge.to.toString().replace(/[^\w\s]/g, "_");

    // Create edge label
    let label = "";
    if (edge.properties) {
      if (edge.type === "conditional" && edge.properties.condition) {
        label = `|${edge.properties.condition}|`;
      } else if (edge.properties.trigger) {
        label = `|${edge.properties.trigger}|`;
      }
    }

    // Add edge with label
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

  // Style definitions with dark text colors
  mermaidCode += "    %% Node type styles\n";
  mermaidCode +=
    "    classDef state fill:#e1f5fe,stroke:#01579b,stroke-width:2px,color:#000\n";
  mermaidCode +=
    "    classDef event fill:#fff3e0,stroke:#ff6f00,stroke-width:2px,color:#000\n";
  mermaidCode +=
    "    classDef message fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px,color:#000\n";

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

// Converter 3:
export const converter3 = (jsonData) => {};

// Mapper function to select converter
export const getMermaidConverter = (resultSet) => {
  const converterMap = {
    method_1: converter1,
    method_2: converter2,
    method_3: converter3,
  };

  console.log(`Using converter for result set: ${resultSet}`);
  return converterMap[resultSet] || converter1;
};
