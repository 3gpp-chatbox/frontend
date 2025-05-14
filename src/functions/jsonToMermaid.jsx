/**
 * Module for converting JSON graph data to Mermaid diagram syntax.
 * @module jsonToMermaid
 */

/**
 * Converts a JSON graph structure to Mermaid diagram syntax.
 * Handles nodes, edges, and their properties including styling and metadata.
 *
 * @param {Object} jsonData - The graph data in JSON format
 * @param {Array<Object>} jsonData.nodes - Array of node objects
 * @param {Array<Object>} jsonData.edges - Array of edge objects
 * @param {string} [jsonData.direction] - Graph direction
 * @param {Object} [options] - Configuration options
 * @param {string} [options.direction] - Graph direction ('LR' for left-right, 'TD' for top-down)
 * @param {Object} [options.styles] - Custom style definitions
 * @param {Object} [options.styles.state] - State node styles
 * @param {Object} [options.styles.event] - Event node styles
 * @returns {string} Mermaid diagram syntax
 * @throws {Error} If the JSON data structure is invalid
 */
export const JsonToMermaid = (jsonData, options = {}) => {
  if (!jsonData || !jsonData.nodes || !jsonData.edges) {
    console.error("Invalid graph data structure");
    return "";
  }

  const {
    direction = jsonData.direction || "LR",
    styles = {
      state: {
        fill: "#f9f",
        stroke: "#333",
        "stroke-width": "2px",
        color: "#000",
        "font-size": "50px",
      },
      event: {
        fill: "#bbf",
        stroke: "#333",
        "stroke-width": "2px",
        color: "#000",
        "font-size": "50px",
      },
    },
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
  jsonData.nodes.forEach((node) => {
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
      mermaidCode += `    %% Type: ${node.type}\n`;
      mermaidCode += `    %% Description: ${node.description}\n`;
    }
  });

  // Process edges using node labels
  jsonData.edges.forEach((edge) => {
    const fromLabel = nodeIdMap[edge.from_node] || nodeIdMap[edge.from];
    const toLabel = nodeIdMap[edge.to];

    if (!fromLabel || !toLabel) {
      console.warn(
        `Missing node mapping for edge: ${edge.from_node || edge.from} -> ${
          edge.to
        }`,
      );
      return;
    }

    // Add edge label (type) with HTML formatting for larger text
    const label = edge.description
      ? `"<span style='font-size:14px'>${edge.description}</span>"`
      : "";

    mermaidCode += `    ${fromLabel} -->|${label}| ${toLabel}\n`;

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
/**
 * Default configuration for Mermaid diagram generation.
 * Includes direction and style definitions for different node types.
 *
 * @constant
 * @type {Object}
 * @property {string} direction - Default graph direction ('LR')
 * @property {Object} styles - Default style definitions
 * @property {Object} styles.state - State node styles
 * @property {Object} styles.event - Event node styles
 */
export const defaultMermaidConfig = {
  direction: "LR",
  styles: {
    state: {
      fill: "#f9f",
      stroke: "#333",
      "stroke-width": "2px",
      color: "#000",
    },
    event: {
      fill: "#bbf",
      stroke: "#333",
      "stroke-width": "2px",
      color: "#000",
    },
  },
};
