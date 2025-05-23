import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

/**
 * Validates Mermaid code syntax and structure
 * @param {string} code - The Mermaid code to validate
 * @returns {Object} Validation result with errors array
 */
function validateMermaidSyntax(code) {
  const errors = [];
  const lines = code.split('\n');
  
  // Track nodes and edges for duplicate checking
  const nodes = new Set();
  const nodeContents = new Set();
  const edges = new Set();
  
  // Updated patterns to support both state and event node formats
  let nodePattern = /^([A-Za-z0-9_]+)(?:\["([^"]+)"\]|\(\("([^"]+)"\)\)):::(?:state|event)$/;
  let edgePattern = /^([A-Za-z0-9_]+)\s*-->\|"([^"]+)"\|\s*([A-Za-z0-9_]+)$/;
  let commentPattern = /^%%\s*(Type|Description|Section_Reference|Text_Reference):\s*.+$/;

  // Additional validation for node type matching bracket style
  const validateNodeFormat = (line) => {
    const statePattern = /^[A-Za-z0-9_]+\["[^"]+"\]:::state$/;
    const eventPattern = /^[A-Za-z0-9_]+\(\("[^"]+"\)\):::event$/;
    
    if (line.includes(':::state') && !statePattern.test(line)) {
      return 'State nodes must use square brackets []';
    }
    if (line.includes(':::event') && !eventPattern.test(line)) {
      return 'Event nodes must use double parentheses (())';
    }
    return null;
  };

  // Check for empty content
  if (!code.trim()) {
    errors.push("Graph must contain at least one node or edge definition");
    return { isValid: false, errors };
  }

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('flowchart')) {
      // Skip empty lines and flowchart declaration
      if (!trimmedLine.startsWith('%%')) {
        // Not a comment, should be node or edge
        if (!nodePattern.test(trimmedLine) && !edgePattern.test(trimmedLine)) {
          errors.push(`Line ${index + 1}: Invalid node or edge format - "${trimmedLine}"`);
        } else {
          // Check for duplicates
          if (nodePattern.test(trimmedLine)) {
            // Additional validation for node type matching bracket style
            const nodeFormatError = validateNodeFormat(trimmedLine);
            if (nodeFormatError) {
              errors.push(`Line ${index + 1}: ${nodeFormatError} - "${trimmedLine}"`);
            }
            
            // Check for duplicate nodes and node contents
            const nodeMatch = trimmedLine.match(nodePattern);
            if (nodeMatch) {
              const nodeId = nodeMatch[1];
              const nodeContent = nodeMatch[2] || nodeMatch[3]; // Handle both state and event formats
              
              if (nodes.has(nodeId)) {
                errors.push(`Line ${index + 1}: Duplicate node ID found - "${nodeId}"`);
              }
              if (nodeContents.has(nodeContent)) {
                errors.push(`Line ${index + 1}: Duplicate node content found - "${nodeContent}"`);
              }
              
              nodes.add(nodeId);
              nodeContents.add(nodeContent);
            }
          } else if (edgePattern.test(trimmedLine)) {
            // Check only for duplicate edges based on fromNode->toNode
            const edgeMatch = trimmedLine.match(edgePattern);
            if (edgeMatch) {
              const [, fromNode, , toNode] = edgeMatch;
              const edgeId = `${fromNode}->${toNode}`;
              
              if (edges.has(edgeId)) {
                errors.push(`Line ${index + 1}: Duplicate edge found - "${fromNode} to ${toNode}"`);
              }
              
              edges.add(edgeId);
            }
          }
        }
      } else if (!commentPattern.test(trimmedLine)) {
        // Invalid comment format
        errors.push(`Line ${index + 1}: Invalid comment format. Comments should be Type, Description, Section_Reference, or Text_Reference`);
      }
    }
  });

  // Check for required metadata for nodes and edges
  let currentElement = null;
  let hasRequiredMetadata = {
    Type: false,
    Description: false,
    Section_Reference: false,
    Text_Reference: false
  };

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    
    // Skip empty lines and flowchart declaration
    if (!trimmedLine || trimmedLine.startsWith('flowchart')) {
      return;
    }

    // Check if line is a node or edge definition
    if (nodePattern.test(trimmedLine) || edgePattern.test(trimmedLine)) {
      // Check if previous element had all required metadata
      if (currentElement) {
        if (!hasRequiredMetadata.Type) {
          errors.push(`Missing Type metadata for element "${currentElement}"`);
        }
        if (!hasRequiredMetadata.Description) {
          errors.push(`Missing Description metadata for element "${currentElement}"`);
        }
        if (!hasRequiredMetadata.Section_Reference) {
          errors.push(`Missing Section_Reference metadata for element "${currentElement}"`);
        }
        if (!hasRequiredMetadata.Text_Reference) {
          errors.push(`Missing Text_Reference metadata for element "${currentElement}"`);
        }
      }
      
      // Start tracking new element
      currentElement = trimmedLine;
      hasRequiredMetadata = {
        Type: false,
        Description: false,
        Section_Reference: false,
        Text_Reference: false
      };
    } else if (trimmedLine.startsWith('%%')) {
      // Check metadata comments
      const metadataMatch = trimmedLine.match(/^%%\s*(Type|Description|Section_Reference|Text_Reference):\s*(.+)$/);
      if (metadataMatch && currentElement) {
        const [, metadataType, value] = metadataMatch;
        if (value.trim()) { // Only mark as present if there's actual content
          hasRequiredMetadata[metadataType] = true;
        }
      }
    }
  });

  // Check last element's metadata
  if (currentElement) {
    if (!hasRequiredMetadata.Type) {
      errors.push(`Missing Type metadata for element "${currentElement}"`);
    }
    if (!hasRequiredMetadata.Description) {
      errors.push(`Missing Description metadata for element "${currentElement}"`);
    }
    if (!hasRequiredMetadata.Section_Reference) {
      errors.push(`Missing Section_Reference metadata for element "${currentElement}"`);
    }
    if (!hasRequiredMetadata.Text_Reference) {
      errors.push(`Missing Text_Reference metadata for element "${currentElement}"`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

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
    if (isEditing && activeView === "mermaid" && mermaidCode) {
      const { isValid, errors } = validateMermaidSyntax(mermaidCode);
      setValidationErrors(errors);
      onValidationChange(isValid);
    } else {
      setValidationErrors([]);
      onValidationChange(true);
    }
  }, [mermaidCode, isEditing, activeView, onValidationChange]);

  return (
    <div>
      {/* Standard notification */}
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* Validation errors panel */}
      {isEditing && activeView === "mermaid" && validationErrors.length > 0 && (
        <div className="validation-errors">
          <div className="validation-error-header">Format Requirements:</div>
          {validationErrors.map((error, index) => (
            <div key={index} className="validation-error-item">
              {error}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

NotificationManager.propTypes = {
  notification: PropTypes.shape({
    show: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  }).isRequired,
  isEditing: PropTypes.bool.isRequired,
  activeView: PropTypes.string.isRequired,
  mermaidCode: PropTypes.string,
  onValidationChange: PropTypes.func.isRequired,
};

export default NotificationManager;
