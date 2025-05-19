import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

/**
 * Helper function to validate Mermaid syntax with stricter checks
 * @param {string} code - The Mermaid code to validate
 * @returns {Object} Validation results
 */
const validateMermaidSyntax = (code) => {
  if (!code) return { isValid: false, error: "Empty code" };

  try {
    // Basic syntax validation
    if (!code.trim().startsWith("flowchart")) {
      return { isValid: false, error: "Must start with flowchart declaration" };
    }

    // Check for basic flowchart structure
    const lines = code.split("\n");
    let hasValidDirection = false;
    let hasNodes = false;
    let hasEdges = false;
    let currentNode = null;
    let currentEdge = null;
    let nodeMetadata = new Map();
    let edgeMetadata = new Map();
    let errors = [];

    for (let i = 0; i < lines.length; i++) {
      const trimmedLine = lines[i].trim();

      // Check flowchart direction
      if (trimmedLine.match(/^flowchart\s+(TD|TB|BT|LR|RL)/)) {
        hasValidDirection = true;
        continue;
      }

      // Check node definitions
      const nodeMatch = trimmedLine.match(/^([A-Z0-9]+)(\[|\(|\[\(|\(\()/);
      if (nodeMatch) {
        currentNode = nodeMatch[1];
        currentEdge = null; // Reset edge tracking when we find a node
        hasNodes = true;
        const openBracket = nodeMatch[2];

        // Define the corresponding closing bracket pattern
        const closingPattern = {
          "[": "]",
          "(": ")",
          "[(": ")]",
          "((": "))",
        }[openBracket];

        // Check if the line ends with the correct closing bracket, accounting for style definitions
        const hasStyle = trimmedLine.includes(":::");
        let hasValidClosure = false;

        if (hasStyle) {
          const beforeStyle = trimmedLine.split(":::")[0].trim();
          hasValidClosure = beforeStyle.endsWith(closingPattern);
        } else {
          hasValidClosure = trimmedLine.endsWith(closingPattern);
        }

        nodeMetadata.set(currentNode, {
          line: i + 1,
          metadata: new Set(),
          hasValidBrackets: hasValidClosure,
        });

        if (!hasValidClosure) {
          errors.push(
            `Invalid node format at line ${
              i + 1
            }: Missing closing ${closingPattern}`,
          );
        }
        continue;
      }

      // Check for edge definitions
      const edgeMatch = trimmedLine.match(/^([A-Z0-9]+)\s*-->\s*([A-Z0-9]+)/);
      if (edgeMatch) {
        hasEdges = true;
        const [_, sourceNode, targetNode] = edgeMatch;
        currentEdge = `${sourceNode}->${targetNode}`;
        currentNode = null; // Reset node tracking

        if (!nodeMetadata.has(sourceNode)) {
          errors.push(
            `Edge at line ${i + 1} references undefined node: ${sourceNode}`,
          );
        }
        if (!nodeMetadata.has(targetNode)) {
          errors.push(
            `Edge at line ${i + 1} references undefined node: ${targetNode}`,
          );
        }

        // Clear any existing metadata for this edge and set up new tracking
        if (!edgeMetadata.has(currentEdge)) {
          edgeMetadata.set(currentEdge, {
            line: i + 1,
            metadata: new Set(),
          });
        }
        continue;
      }

      // Handle metadata lines
      if (trimmedLine.startsWith("%%")) {
        const metadataMatch = trimmedLine.match(/%%\s*([^:]+):\s*(.+)/);
        if (metadataMatch) {
          const [_, key, value] = metadataMatch;
          const trimmedKey = key.trim();
          const trimmedValue = value.trim();

          // Check if this metadata belongs to the most recently defined edge or node
          const isNodeMetadata = currentNode && nodeMetadata.has(currentNode);
          const isEdgeMetadata = currentEdge && edgeMetadata.has(currentEdge);

          if (isNodeMetadata) {
            // Node metadata validation
            nodeMetadata.get(currentNode).metadata.add(trimmedKey);

            if (trimmedKey === "Type") {
              if (!["event", "state"].includes(trimmedValue)) {
                errors.push(
                  `Invalid Type value for node ${currentNode} at line ${
                    i + 1
                  }: must be event or state`,
                );
              }
            }
          } else if (isEdgeMetadata) {
            // Edge metadata validation
            edgeMetadata.get(currentEdge).metadata.add(trimmedKey);

            if (trimmedKey === "Type") {
              if (!["trigger", "condition"].includes(trimmedValue)) {
                errors.push(
                  `Invalid Type value for edge ${currentEdge} at line ${
                    i + 1
                  }: must be trigger or condition`,
                );
              }
            }
          }
        }
      }

      // Handle non-metadata, non-definition lines
      if (
        !trimmedLine.startsWith("%%") &&
        !trimmedLine.match(/^([A-Z0-9]+)[\[(]/) &&
        !trimmedLine.match(/^([A-Z0-9]+)\s*-->\s*([A-Z0-9]+)/)
      ) {
        currentNode = null;
        currentEdge = null;
      }
    }

    // Validate required metadata for nodes and edges
    const requiredNodeMetadata = [
      "Type",
      "Description",
      "Section_Reference",
      "Text_Reference",
    ];
    const requiredEdgeMetadata = [
      "Type",
      "Description",
      "Section_Reference",
      "Text_Reference",
    ];

    nodeMetadata.forEach((data, nodeId) => {
      requiredNodeMetadata.forEach((field) => {
        if (!data.metadata.has(field)) {
          errors.push(
            `Missing ${field} for node ${nodeId} defined at line ${data.line}`,
          );
        }
      });
    });

    edgeMetadata.forEach((data, edgeId) => {
      requiredEdgeMetadata.forEach((field) => {
        if (!data.metadata.has(field)) {
          errors.push(
            `Missing ${field} for edge ${edgeId} defined at line ${data.line}`,
          );
        }
      });
    });

    // Check overall structure
    if (!hasValidDirection) {
      errors.push("Missing or invalid flowchart direction");
    }
    if (!hasNodes) {
      errors.push("No nodes defined in the flowchart");
    }

    return {
      isValid: errors.length === 0,
      errors: errors,
    };
  } catch (error) {
    return {
      isValid: false,
      errors: [`Syntax error: ${error.message}`],
    };
  }
};

/**
 * Component for managing notifications and validation errors.
 *
 * @component
 * @param {Object} props - Component properties
 * @param {Object} props.notification - Current notification state
 * @param {boolean} props.isEditing - Whether the editor is in edit mode
 * @param {string} props.activeView - Current active view
 * @param {string} props.mermaidCode - Current Mermaid code
 * @param {function} props.onValidationChange - Callback function to notify parent of validation state
 */
function NotificationManager({
  notification,
  isEditing = false,
  activeView = "mermaid",
  mermaidCode = "",
  onValidationChange = () => {},
}) {
  const [validationErrors, setValidationErrors] = useState([]);

  // Run validation when mermaidCode changes
  useEffect(() => {
    if (!mermaidCode || !isEditing || activeView !== "mermaid") {
      setValidationErrors([]);
      onValidationChange(true);
      return;
    }

    const validation = validateMermaidSyntax(mermaidCode);
    const errors = validation.errors || [];
    setValidationErrors(errors);
    onValidationChange(errors.length === 0);
  }, [mermaidCode, isEditing, activeView, onValidationChange]);

  return (
    <>
      {/* Standard notification */}
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* Editing warning */}
      {isEditing && activeView !== "mermaid" && (
        <div className="editing-warning">
          You have unsaved changes in the Mermaid editor. Your changes will be
          preserved while you navigate.
        </div>
      )}

      {/* Validation errors panel */}
      {isEditing && activeView === "mermaid" && validationErrors.length > 0 && (
        <div className="validation-errors">
          <div className="validation-error-header">
            Validation Errors ({validationErrors.length})
          </div>
          {validationErrors.map((error, index) => (
            <div key={index} className="validation-error-item">
              {error}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

NotificationManager.propTypes = {
  notification: PropTypes.shape({
    show: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  }).isRequired,
  isEditing: PropTypes.bool,
  activeView: PropTypes.string,
  mermaidCode: PropTypes.string,
  onValidationChange: PropTypes.func,
};

export { validateMermaidSyntax };
export default NotificationManager;
