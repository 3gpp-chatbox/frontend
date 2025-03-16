export const converter1 = jsonData => {
  if (!jsonData || !jsonData.nodes || !jsonData.edges) {
    console.error("Invalid graph data structure")
    return ""
  }

  let mermaidCode = "graph TD\n"

  // Style definitions
  mermaidCode += "    %% Method 1 styles\n"
  mermaidCode +=
    "    classDef state fill:#f9f,stroke:#333,stroke-width:2px,color:#000\n"
  mermaidCode +=
    "    classDef event fill:#bbf,stroke:#333,stroke-width:2px,color:#000\n\n"

  // Process nodes with detailed labels
  jsonData.nodes.forEach(node => {
    // Sanitize node ID by removing special characters and spaces
    const nodeId = node.id
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, "_")
      .trim()

    // Escape quotes in the label
    const nodeLabel = node.id.replace(/"/g, '\\"')
    const properties = node.properties
      ? `<br>${Object.entries(node.properties)
          .map(([k, v]) => `${k}: ${v}`)
          .join("<br>")}`
      : ""

    // Use circular shape for state nodes, regular shape for others
    const shape = node.type.toLowerCase() === "event" ? "((" : "["
    const closeShape = node.type.toLowerCase() === "event" ? "))" : "]"

    const body = `**${node.type.toUpperCase()}**<br>${node.entity}: ${
      node.properties.eventType
    }<br>${nodeLabel}`

    const body_2 = `**${node.type.toUpperCase()}**<br>${node.entity}: ${
      node.properties.state
    }<br>`

    node.type.toLowerCase() === "event"
      ? (mermaidCode += `    ${nodeId}${shape}"${body}"${closeShape}:::${node.type.toLowerCase()}\n`)
      : (mermaidCode += `    ${nodeId}${shape}"${body_2}"${closeShape}:::${node.type.toLowerCase()}\n`)

  })

  // Process edges with labels
  jsonData.edges.forEach(edge => {
    const sourceId = edge.from
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, "_")
      .trim()
    const targetId = edge.to
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, "_")
      .trim()
    const label = edge.properties.messageType
      ? `|${edge.properties.messageType}|`
      : ""

    mermaidCode += `    ${sourceId} -->${label} ${targetId}\n`
  })

  return mermaidCode
}

// Converter for Method 2: Property Graph Format
export const converter2 = jsonData => {
  // Handle array of procedures
  const procedure = Array.isArray(jsonData) ? jsonData[0] : jsonData;
  
  if (!procedure || !procedure.nodes || !procedure.edges) {
    console.error("Invalid graph data structure")
    return ""
  }

  let mermaidCode = "graph TD\n"

  // Style definitions with dark text colors
  mermaidCode += "    %% Node type styles\n"
  mermaidCode += "    classDef state fill:#e1f5fe,stroke:#01579b,stroke-width:2px,color:#000\n"
  mermaidCode += "    classDef event fill:#fff3e0,stroke:#ff6f00,stroke-width:2px,color:#000\n"
  mermaidCode += "    classDef message fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px,color:#000\n"

  // Process nodes - with actor and circle shape for states
  procedure.nodes.forEach(node => {
    const nodeId = node.id
    const nodeLabel = node.properties?.actor ? 
      `${node.label}<br>(${node.properties.actor})` : 
      node.label
    
    // Use circle shape (()) for states, regular shape ([]) for others
    const shape = node.type === 'state' ? '((' : '['
    const closeShape = node.type === 'state' ? '))' : ']'
    
    // Create node with label and actor
    mermaidCode += `    ${nodeId}${shape}"${nodeLabel}"${closeShape}\n`
    
    // Apply style based on node type
    mermaidCode += `    class ${nodeId} ${node.type}\n`
  })

  // Process edges
  procedure.edges.forEach(edge => {
    const sourceId = edge.source
    const targetId = edge.target
    const label = edge.label ? `|${edge.label}|` : ""

    mermaidCode += `    ${sourceId} -->${label} ${targetId}\n`
  })

  return mermaidCode
}

// Converter 3:
export const converter3 = jsonData => {}

// Mapper function to select converter
export const getMermaidConverter = resultSet => {
  const converterMap = {
    method_1: converter1,
    method_2: converter2,
    method_3: converter3,
  }

  console.log(`Using converter for result set: ${resultSet}`)
  return converterMap[resultSet] || converter1
}
