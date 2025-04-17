// api_calls.jsx
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000"; 

// Fetch all procedures
export const fetchProcedures = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/procedures/list`);
      return response.data; // API returns array of {id, name} objects directly
    } catch (error) {
      console.error("Error fetching procedure list:", error);
      return [];
    }
};
  
// Fetch data for a specific procedure 
export const fetchProcedure = async (procedureId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/procedures/${procedureId}`);
    return response.data || null;
  } catch (error) {
    console.error("Error fetching procedure:", error);
    return null;
  }
};

// Insert procedure graph changes
export const insertProcedureGraphChanges = async (procedureId, changes) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/procedures/${procedureId}/edit`, {
      edited_graph: changes
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
    const response = await axios.get(`${API_BASE_URL}/procedures/${procedureId}`);
    return response.data || null;
  } catch (error) {
    console.error("Error fetching procedure:", error);
    return null;
  }
};