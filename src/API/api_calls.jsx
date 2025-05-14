// api_calls.jsx
import axios from "axios";
import { dummyProcedures, dummyProcedureData } from "./dummyData";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const USE_DUMMY_DATA = true; // Set to false when using real API

// Fetch all procedures
export const fetchProcedures = async () => {
  if (USE_DUMMY_DATA) {
    console.log("Using dummy data for procedures");
    return dummyProcedures;
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/procedures`);
    return response.data;
  } catch (error) {
    console.error("Error fetching procedures:", error);
    throw error;
  }
};

// Fetch data for a specific procedure
export const fetchProcedure = async (procedureId, entity) => {
  if (USE_DUMMY_DATA) {
    console.log("Using dummy data for procedure:", procedureId, entity);
    // Get the base procedure data
    const procedureData = dummyProcedureData[procedureId];
    if (!procedureData) return null;

    // Return the procedure data with entity information
    return {
      ...procedureData,
    };
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/procedures/${procedureId}/${entity}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching procedure data:", error);
    throw error;
  }
};

// Insert procedure graph changes
export const insertProcedureGraphChanges = async (procedureId, changes) => {
  if (USE_DUMMY_DATA) {
    console.log("Using dummy data for procedure changes:", { procedureId, changes });
    // Update the dummy data
    if (dummyProcedureData[procedureId]) {
      dummyProcedureData[procedureId] = {
        ...dummyProcedureData[procedureId],
        ...changes
      };
    }
    return dummyProcedureData[procedureId] || null;
  }

  try {
    console.log("Inserting procedure graph changes:", changes);
    const response = await axios.put(`${API_BASE_URL}/procedures/${procedureId}`, {
      edited_graph: changes
    });
    return response.data || null;
  } catch (error) {
    console.error("Error inserting procedure graph changes:", error);
    throw error;
  }
};

// Fetch original graph data for a procedure
export const fetchOriginalGraph = async (procedureId) => {
  if (USE_DUMMY_DATA) {
    console.log("Using dummy data for original graph:", procedureId);
    return dummyProcedureData[procedureId] || null;
  }

  try {
    const response = await axios.get(
      `${API_BASE_URL}/procedures/${procedureId}`,
    );
    return response.data || null;
  } catch (error) {
    console.error("Error fetching procedure:", error);
    return null;
  }
};

export const updateProcedureGraph = async (procedureId, entity, graphData) => {
  if (USE_DUMMY_DATA) {
    console.log("Using dummy data for updating procedure:", procedureId, entity, graphData);
    return { success: true, message: "Dummy update successful" };
  }

  try {
    const response = await axios.put(
      `${API_BASE_URL}/procedures/${procedureId}/${entity}`,
      { graph: graphData }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating procedure graph:", error);
    throw error;
  }
};
