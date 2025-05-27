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
  
  // Track metadata for duplicate checking
  const elementMetadata = new Map(); // Map to store metadata for each element
  
  // Updated patterns to support both state and event node formats
  let nodePattern = /^([A-Za-z0-9_]+)(?:\["([^"]+)"\]|\(\("([^"]+)"\)\)):::(?:state|event)$/;
  let edgePattern = /^([A-Za-z0-9_]+)\s*-->\|"([^"]+)"\|\s*([A-Za-z0-9_]+)$/;
  let commentPattern = /^%%\s*(Type|Description|Section_Reference|Text_Reference):\s*(.+)$/;

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

  // Process lines to group elements with their metadata
  let currentElement = null;
  let currentMetadata = new Map();
  const elementGroups = new Map(); // Store each element with its metadata

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    
    if (!trimmedLine) {
      return;
    }

    // Check for flowchart declaration
    if (trimmedLine.startsWith('flowchart')) {
      if (!/^flowchart\s+(TD|LR)$/.test(trimmedLine)) {
        errors.push(`Line ${index + 1}: Invalid flowchart declaration. Use 'flowchart TD' or 'flowchart LR'`);
      }
      return;
    }

    // Check for invalid/gibberish content that's not a comment
    if (!trimmedLine.startsWith('%%')) {
      // Check if it looks like a node definition attempt
      if (trimmedLine.includes('[') || trimmedLine.includes('(')) {
        if (!nodePattern.test(trimmedLine)) {
          errors.push(`Line ${index + 1}: Invalid node definition. Expected format: 'ID["Text"]:::state' or 'ID(("Text")):::event'`);
        } else {
          // Check for duplicate nodes immediately
          const nodeMatch = trimmedLine.match(nodePattern);
          if (nodeMatch) {
            const nodeId = nodeMatch[1];
            const nodeContent = nodeMatch[2] || nodeMatch[3];
            
            if (nodes.has(nodeId)) {
              errors.push(`Line ${index + 1}: Duplicate node ID found - "${nodeId}"`);
            }
            if (nodeContents.has(nodeContent)) {
              errors.push(`Line ${index + 1}: Duplicate node content found - "${nodeContent}"`);
            }
            
            nodes.add(nodeId);
            nodeContents.add(nodeContent);
          }
        }
      }
      // Check if it looks like an edge definition attempt
      else if (trimmedLine.includes('-->')) {
        if (!edgePattern.test(trimmedLine)) {
          errors.push(`Line ${index + 1}: Invalid edge definition. Expected format: 'FromNode-->|"Description"|ToNode'`);
        } else {
          // Check for duplicate edges immediately
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
      // If it's not empty and not a valid node/edge/comment, it's probably gibberish
      else if (trimmedLine.length > 0 && !nodePattern.test(trimmedLine) && !edgePattern.test(trimmedLine)) {
        errors.push(`Line ${index + 1}: Invalid syntax. Line must be a node definition, edge definition, or comment`);
      }
    }

    // Check if line is a node or edge definition
    if (nodePattern.test(trimmedLine) || edgePattern.test(trimmedLine)) {
      // If we had a previous element, save its metadata
      if (currentElement) {
        elementGroups.set(currentElement, new Map(currentMetadata));
      }
      
      // Start tracking new element
      currentElement = trimmedLine;
      currentMetadata = new Map();
    } 
    // Check if line is metadata for current element
    else if (trimmedLine.startsWith('%%') && currentElement) {
      const metadataMatch = trimmedLine.match(commentPattern);
      if (metadataMatch) {
        const [, metadataType, value] = metadataMatch;
        if (currentMetadata.has(metadataType)) {
          errors.push(`Line ${index + 1}: Duplicate ${metadataType} metadata for element "${currentElement}"`);
        } else {
          currentMetadata.set(metadataType, value.trim());
        }
      } else if (!commentPattern.test(trimmedLine)) {
        errors.push(`Line ${index + 1}: Invalid comment format. Comments should be Type, Description, Section_Reference, or Text_Reference`);
      }
    }
  });

  // Don't forget to save metadata for the last element
  if (currentElement) {
    elementGroups.set(currentElement, new Map(currentMetadata));
  }

  // Validate metadata requirements
  elementGroups.forEach((metadata, element) => {
    // Check for required metadata
    if (!metadata.has('Type')) {
      errors.push(`Missing Type metadata for element "${element}"`);
    }
    if (!metadata.has('Description')) {
      errors.push(`Missing Description metadata for element "${element}"`);
    }
    if (!metadata.has('Section_Reference')) {
      errors.push(`Missing Section_Reference metadata for element "${element}"`);
    }
    if (!metadata.has('Text_Reference')) {
      errors.push(`Missing Text_Reference metadata for element "${element}"`);
    }
  });

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
