// api_calls.jsx
import axios from "axios";
import { dummyProcedures, dummyProcedureData } from "./dummyData";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const USE_DUMMY_DATA = false; // Set to false when using real API

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

// Fetch data for a specific procedure and entity
export const fetchProcedure = async (procedureId, entity) => {
  if (USE_DUMMY_DATA) {
    console.log("Using dummy data for procedure:", procedureId, entity);
    const procedureData = dummyProcedureData[procedureId];
    if (!procedureData) return null;
    return { ...procedureData };
  }

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
  if (USE_DUMMY_DATA) {
    console.log("Using dummy data for procedure changes:", { procedureId, entity, changes });
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
    const response = await axios.post(
      `${API_BASE_URL}/procedures/${procedureId}/${entity}`,
      {
        edited_graph: changes.graph,
        commit_title: changes.commit_title,
        commit_message: changes.commit_message,
      }
    );
    return response.data || null;
  } catch (error) {
    console.error("Error inserting procedure graph changes:", error);
    throw error;
  }
};

// Fetch the original graph data (latest version) for a procedure and entity
export const fetchOriginalGraph = async (procedureId, entity) => {
  if (USE_DUMMY_DATA) {
    console.log("Using dummy data for original graph:", procedureId);
    return dummyProcedureData[procedureId] || null;
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/procedures/${procedureId}/${entity}`);
    return response.data || null;
  } catch (error) {
    console.error("Error fetching original graph:", error);
    return null;
  }
};