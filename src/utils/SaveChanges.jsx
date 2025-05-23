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

/**
 * Validates and saves graph changes to the database
 * @param {Object} params - Parameters for saving changes
 * @param {string} params.mermaidGraph - The Mermaid graph code
 * @param {Object} params.selectedProcedure - The selected procedure
 * @param {Function} params.setNotification - Function to set notification state
 * @param {Function} params.setShowConfirmation - Function to set confirmation dialog state
 * @param {Function} params.setIsEditing - Function to set editing state
 * @param {Object} params.isUserEditing - Ref to track user editing state
 * @param {Function} params.setData - Function to set data state
 * @param {Function} params.setOriginalData - Function to set original data state
 * @param {Function} params.setJsonContent - Function to set JSON content
 * @param {Function} params.onProcedureUpdate - Callback for procedure updates
 * @param {string} params.title - Commit title
 * @param {string} params.message - Commit message
 * @returns {Promise<void>}
 */
export const saveGraphChanges = async ({
  mermaidGraph,
  selectedProcedure,
  setNotification,
  setShowConfirmation,
  setIsEditing,
  isUserEditing,
  setData,
  setOriginalData,
  setJsonContent,
  onProcedureUpdate,
  title,
  message,
}) => {
  try {
    // 1. Validate Mermaid code
    if (!validateMermaidCode(mermaidGraph)) {
      throw new Error("Invalid Mermaid syntax");
    }

    // 2. Convert to JSON and validate structure
    const graphData = convertMermaidToJson(mermaidGraph);
    const validationResult = validateGraph(graphData);
    
    if (!validationResult.valid) {
      setNotification({
        show: true,
        message: `Validation failed: ${validationResult.error}`,
        type: "error",
      });
      return;
    }

    // 3. Show saving notification
    setNotification({
      show: true,
      message: "Saving changes...",
      type: "info",
    });

    // 4. Call API to save changes
    const result = await insertProcedureGraphChanges(
      selectedProcedure.id,
      selectedProcedure.entity,
      {
        edited_graph: graphData,
        commit_title: title,
        commit_message: message,
      }
    );

    if (!result) {
      throw new Error("Failed to save changes");
    }

    // 5. Update UI state
    setNotification({
      show: true,
      message: "Changes saved successfully!",
      type: "success",
    });
    setShowConfirmation(false);
    setIsEditing(false);
    isUserEditing.current = false;

    // 6. Update data states
    setData(result);
    setOriginalData(result);
    setJsonContent(JSON.stringify(result.graph || result.edited_graph, null, 2));
    onProcedureUpdate(result);

  } catch (error) {
    setNotification({
      show: true,
      message: `Failed to save changes: ${error.message}`,
      type: "error",
    });
  }
};

/**
 * Reverts changes to the original state
 * @param {Object} params - Parameters for reverting changes
 * @param {string} params.originalMermaidGraph - The original Mermaid graph code
 * @param {Object} params.originalData - The original data
 * @param {Function} params.setMermaidGraph - Function to set Mermaid graph state
 * @param {Function} params.setData - Function to set data state
 * @param {Function} params.setJsonContent - Function to set JSON content
 * @param {Object} params.isUserEditing - Ref to track user editing state
 * @param {Function} params.setIsEditing - Function to set editing state
 * @param {Function} params.setShowConfirmation - Function to set confirmation dialog state
 * @param {Function} params.onMermaidCodeChange - Callback for Mermaid code changes
 * @param {Function} params.setNotification - Function to set notification state
 */
export const revertChanges = ({
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
  try {
    // 1. Reset all editing states first
    isUserEditing.current = false;
    setIsEditing(false);
    setShowConfirmation(false);

    // 2. Clear and reset Mermaid code
    setMermaidGraph(originalMermaidGraph || "");
    onMermaidCodeChange(originalMermaidGraph || "");

    // 3. Reset data states
    if (originalData) {
      setData(originalData);
      const graphData = originalData.edited_graph || originalData.original_graph || originalData.graph;
      setJsonContent(JSON.stringify(graphData, null, 2));
    } else {
      setData(null);
      setJsonContent("");
    }

    // 4. Show success notification
    setNotification({
      show: true,
      message: "Changes reverted to original",
      type: "info",
    });
  } catch (error) {
    // Reset states even if there's an error
    isUserEditing.current = false;
    setIsEditing(false);
    setShowConfirmation(false);
    
    setNotification({
      show: true,
      message: `Failed to revert changes: ${error.message}`,
      type: "error",
    });
  }
};

/**
 * Continues editing without saving
 * @param {Function} setShowConfirmation - Function to set confirmation dialog state
 */
export const continueEditing = (setShowConfirmation) => {
  setShowConfirmation(false);
};