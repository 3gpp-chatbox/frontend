// api_calls.jsx
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Fetch all procedures
export const fetchProcedures = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/procedures`);
    return response.data;
  } catch (error) {
    console.error("Error fetching procedures:", error);
    throw error;
  }
};

// Fetch data for a specific procedure and entity
export const fetchProcedure = async (procedureId, entity) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/procedures/${procedureId}/${entity}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching procedure data:", error);
    throw error;
  }
};

// Insert a new version of a graph with edited data
export const insertProcedureGraphChanges = async (procedureId, entity, changes) => {
  try {
    console.log("Inserting procedure graph changes:", {
      procedureId,
      entity,
      requestBody: {
        edited_graph: changes.edited_graph,
        commit_title: changes.commit_title,
        commit_message: changes.commit_message,
      }
    });
    const response = await axios.post(
      `${API_BASE_URL}/procedures/${procedureId}/${entity}`,
      {
        edited_graph: changes.edited_graph,
        commit_title: changes.commit_title,
        commit_message: changes.commit_message,
      }
    );
    return response.data || null;
  } catch (error) {
    console.error("Error inserting procedure graph changes:", error);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    }
    throw error;
  }
};

// Fetch the original graph data (latest version) for a procedure and entity
export const fetchOriginalGraph = async (procedureId, entity) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/procedures/${procedureId}/${entity}`);
    return response.data || null;
  } catch (error) {
    console.error("Error fetching original graph:", error);
    return null;
  }
};

// Fetch the version history for a procedure
export const fetchVersionHistory = async (procedureId, entity) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/procedures/${procedureId}/${entity}/history`);
    return response.data || null;
  } catch (error) {
    console.error("Error fetching version history:", error);
    throw error;
  }
};

// Fetch one graphversion for a specific procedure and entity type
export const fetchGraphVersion = async (procedureId, entity, graphId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/procedures/${procedureId}/${entity}/history/${graphId}`);
    return response.data || null;
  } catch (error) {
    console.error("Error fetching graph version:", error);
    throw error;
  }
};

// Delete a procedure graph
export const deleteProcedureGraph = async (procedureId, entity) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/procedures/${procedureId}/${entity}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting procedure graph:", error);
    throw error;
  }
};
