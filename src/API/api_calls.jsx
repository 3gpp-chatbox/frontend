/**
 * Module for handling API calls to the backend server.
 * @module api_calls
 */

import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

// Configure axios defaults
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Fetches a list of all available procedures.
 *
 * @async
 * @returns {Promise<Array>} Array of procedure objects
 * @throws {Error} If the API call fails
 */
export const fetchProcedures = async () => {
  try {
    const response = await api.get("/procedures");
    return response.data; // API returns array of {id, name} objects directly
  } catch (error) {
    console.error("Error fetching procedure list:", error);
    throw error;
  }
};

/**
 * Fetches detailed data for a specific procedure.
 *
 * @async
 * @param {string} id - The procedure ID
 * @returns {Promise<Object>} Procedure data including graphs and metadata
 * @throws {Error} If the API call fails
 */
export const fetchProcedure = async (id) => {
  try {
    const response = await api.get(`/procedures/${id}`);
    return response.data || null;
  } catch (error) {
    console.error(`Error fetching procedure ${id}:`, error);
    throw error;
  }
};

/**
 * Updates a procedure with new data.
 *
 * @async
 * @param {string} id - The procedure ID
 * @param {Object} data - Updated procedure data
 * @param {Object} data.edited_graph - The edited graph data
 * @returns {Promise<Object>} Updated procedure data
 * @throws {Error} If the API call fails
 */
export const updateProcedure = async (id, data) => {
  try {
    const response = await api.put(`/procedures/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating procedure ${id}:`, error);
    throw error;
  }
};

// Insert procedure graph changes
export const insertProcedureGraphChanges = async (procedureId, changes) => {
  try {
    console.log("Inserting procedure graph changes:", changes);
    const response = await api.put(`/procedures/${procedureId}`, {
      edited_graph: changes,
    });
    return response.data || null;
  } catch (error) {
    console.error("Error inserting procedure graph changes:", error);
    throw error; // Propagate the error so we can handle it in the UI
  }
};

// Fetch original graph data for a procedure
export const fetchOriginalGraph = async (procedureId) => {
  try {
    const response = await api.get(`/procedures/${procedureId}`);
    return response.data || null;
  } catch (error) {
    console.error("Error fetching procedure:", error);
    return null;
  }
};
