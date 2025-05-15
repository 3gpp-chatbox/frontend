import {
  validateMermaidCode,
  convertMermaidToJson,
} from "../functions/mermaidToJson";
import { validateGraph } from "../functions/schema_validation";
import { insertProcedureGraphChanges } from "../API/api_calls";

/**
 * @module SaveChanges
 * Utility module for managing save and revert functionality in editors.
 */

// Base save functions
export const handleSaveChanges = (
  mermaidGraph,
  setNotification,
  setShowConfirmation,
) => {
  try {
    // Get current direction or default to LR
    const directionMatch = mermaidGraph.match(/flowchart\s+(TD|TB|BT|LR|RL)/);
    if (!directionMatch) {
      // If no direction specified, prepend LR direction
      const lines = mermaidGraph.split("\n");
      const firstLine = lines[0].trim();
      if (!firstLine.startsWith("flowchart")) {
        throw new Error(
          "Invalid Mermaid syntax: Must include valid flowchart direction (TD, TB, BT, LR, or RL)",
        );
      }
    }

    setNotification({
      show: true,
      message: "Validating structure...",
      type: "info",
    });

    // Convert to JSON and validate structure
    const jsonData = convertMermaidToJson(mermaidGraph);
    const validationResult = validateGraph(jsonData);

    if (validationResult.valid) {
      setNotification({
        show: true,
        message: "Structure validation successful",
        type: "success",
      });
      setTimeout(() => {
        setShowConfirmation(true);
      }, 1000);
    } else {
      throw new Error(
        `Structural validation failed: ${validationResult.error}`,
      );
    }
  } catch (error) {
    setNotification({
      show: true,
      message: error.message,
      type: "error",
    });
  }
};

export const handleConfirmSave = async ({
  mermaidGraph,
  selectedProcedure,
  setShowConfirmation,
  setNotification,
  setOriginalMermaidGraph,
  setData,
  setOriginalData,
  setJsonContent,
  isUserEditing,
  setIsEditing,
  onProcedureUpdate,
  onMermaidCodeChange,
}) => {
  setShowConfirmation(false);
  setNotification({
    show: true,
    message: "Saving changes...",
    type: "info",
  });

  try {
    // First validate the Mermaid code
    if (!validateMermaidCode(mermaidGraph)) {
      throw new Error("Invalid Mermaid syntax");
    }

    // Convert to JSON and save
    const graphData = convertMermaidToJson(mermaidGraph);
    
    // Add required fields to nodes and edges
    const enrichedGraphData = {
      nodes: graphData.nodes.map(node => ({
        id: node.id,
        type: node.type === "event" ? "event" : "state",  // Must be exactly "state" or "event"
        description: node.description || "Manually added node",
        section_reference: "Manual Edit",
        text_reference: "Manually edited through UI"
      })),
      edges: graphData.edges.map(edge => ({
        from: edge.from,  // Using 'from' as it's aliased to 'from_node' in backend
        to: edge.to,
        type: edge.type === "condition" ? "condition" : "trigger",  // Must be exactly "trigger" or "condition"
        description: edge.description || "Manually added edge",
        section_reference: "Manual Edit",
        text_reference: "Manually edited through UI"
      }))
    };

    const result = await insertProcedureGraphChanges(
      selectedProcedure.id || selectedProcedure.procedure_id,
      selectedProcedure.entity,
      {
        edited_graph: enrichedGraphData,
        commit_title: "Manual edit",
        commit_message: "Graph manually edited through UI"
      }
    );

    if (!result) {
      throw new Error("Failed to save changes");
    }

    // Update both Mermaid and JSON views
    setOriginalMermaidGraph(mermaidGraph);
    setData(result);
    setOriginalData(result);

    // Only show the graph data in JSON view
    const updatedGraphData = result.edited_graph || result.original_graph;
    setJsonContent(JSON.stringify(updatedGraphData, null, 2));

    isUserEditing.current = false;
    setIsEditing(false);

    // Update parent component with new data
    onProcedureUpdate(result);
    onMermaidCodeChange(mermaidGraph);

    setNotification({
      show: true,
      message: "Changes saved successfully",
      type: "success",
    });
  } catch (error) {
    setNotification({
      show: true,
      message: `Failed to save changes: ${error.message}`,
      type: "error",
    });
  }
};

export const handleRevertChanges = ({
  originalMermaidGraph,
  originalData,
  setMermaidGraph,
  setData,
  setJsonContent,
  isUserEditing,
  setIsEditing,
  setShowConfirmation,
  onMermaidCodeChange,
  setNotification,
}) => {
  setMermaidGraph(originalMermaidGraph);
  setData(originalData);

  // Only show the graph data in JSON view
  const graphData = originalData.edited_graph || originalData.original_graph;
  setJsonContent(JSON.stringify(graphData, null, 2));

  isUserEditing.current = false;
  setIsEditing(false);
  setShowConfirmation(false);
  onMermaidCodeChange(originalMermaidGraph);
  setNotification({
    show: true,
    message: "Changes reverted to original",
    type: "info",
  });
};

export const handleContinueEditing = (setShowConfirmation) => {
  setShowConfirmation(false);
};

/**
 * Creates save and revert handlers for managing editor state.
 *
 * @param {Object} options - Configuration options
 * @param {Function} options.setIsEditing - Function to update editing state
 * @param {Function} options.setData - Function to update data state
 * @param {Function} options.setMermaidCode - Function to update Mermaid code
 * @param {Function} options.onProcedureUpdate - Callback for procedure updates
 * @param {Object} options.selectedProcedure - Currently selected procedure
 * @param {Function} options.setNotification - Function to show notifications
 * @returns {Object} Object containing save and revert handler functions
 */
export const createSaveHandlers = ({
  mermaidGraph,
  selectedProcedure,
  setShowConfirmation,
  setNotification,
  setOriginalMermaidGraph,
  setData,
  setOriginalData,
  setJsonContent,
  isUserEditing,
  setIsEditing,
  onProcedureUpdate,
  onMermaidCodeChange,
  originalMermaidGraph,
  originalData,
  setMermaidGraph,
}) => {
  const handleSaveClick = () => {
    handleSaveChanges(mermaidGraph, setNotification, setShowConfirmation);
  };

  const handleConfirmSaveClick = async () => {
    await handleConfirmSave({
      mermaidGraph,
      selectedProcedure,
      setShowConfirmation,
      setNotification,
      setOriginalMermaidGraph,
      setData,
      setOriginalData,
      setJsonContent,
      isUserEditing,
      setIsEditing,
      onProcedureUpdate,
      onMermaidCodeChange,
    });
  };

  const handleRevertChangesClick = () => {
    handleRevertChanges({
      originalMermaidGraph,
      originalData,
      setMermaidGraph,
      setData,
      setJsonContent,
      isUserEditing,
      setIsEditing,
      setShowConfirmation,
      onMermaidCodeChange,
      setNotification,
    });
  };

  const handleContinueEditingClick = () => {
    handleContinueEditing(setShowConfirmation);
  };

  return {
    handleSaveClick,
    handleConfirmSaveClick,
    handleRevertChangesClick,
    handleContinueEditingClick,
  };
};