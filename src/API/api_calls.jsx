// api_calls.jsx
import axios from "axios";

// Validate API base URL
const validateApiBaseUrl = () => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  
  if (!apiBaseUrl) {
    throw new Error(
      "VITE_API_BASE_URL is not defined. Please create a .env file with VITE_API_BASE_URL set to your backend API URL."
    );
  }

  try {
    new URL(apiBaseUrl);
  } catch (error) {
    throw new Error(
      `Invalid VITE_API_BASE_URL: ${apiBaseUrl}. Please provide a valid URL`
    );
  }

  return apiBaseUrl;
};

const API_BASE_URL = validateApiBaseUrl();

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add response interceptor for common error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout - the server is taking too long to respond');
      throw new Error('Request timeout - please try again later');
    }
    
    if (!error.response) {
      console.error('Network error - unable to reach the server');
      throw new Error('Network error - please check your connection and server status');
    }

    // Handle specific HTTP status codes
    switch (error.response.status) {
      case 404:
        throw new Error('Resource not found');
      case 500:
        throw new Error('Server error - please try again later');
      default:
        throw error;
    }
  }
);

// Fetch all procedures
export const fetchProcedures = async () => {
  try {
    const response = await api.get('procedures');
    return response.data;
  } catch (error) {
    console.error("Error fetching procedures:", error.message);
    throw error;
  }
};

// Fetch data for a specific procedure and entity
export const fetchProcedure = async (procedureId, entity) => {
  try {
    const response = await api.get(`/procedures/${procedureId}/${entity}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching procedure data:", error.message);
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
    const response = await api.post(
      `/procedures/${procedureId}/${entity}`,
      {
        edited_graph: changes.edited_graph,
        commit_title: changes.commit_title,
        commit_message: changes.commit_message,
      }
    );
    return response.data || null;
  } catch (error) {
    console.error("Error inserting procedure graph changes:", error.message);
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
    const response = await api.get(`/procedures/${procedureId}/${entity}`);
    return response.data || null;
  } catch (error) {
    console.error("Error fetching original graph:", error.message);
    return null;
  }
};

// Fetch the version history for a procedure
export const fetchVersionHistory = async (procedureId, entity) => {
  try {
    const response = await api.get(`/procedures/${procedureId}/${entity}/history`);
    return response.data || null;
  } catch (error) {
    console.error("Error fetching version history:", error.message);
    throw error;
  }
};

// Fetch one graphversion for a specific procedure and entity type
export const fetchGraphVersion = async (procedureId, entity, graphId) => {
  try {
    const response = await api.get(`/procedures/${procedureId}/${entity}/history/${graphId}`);
    return response.data || null;
  } catch (error) {
    console.error("Error fetching graph version:", error.message);
    throw error;
  }
};

// Delete a procedure graph
export const deleteProcedureGraph = async (procedureId, entity) => {
  try {
    const response = await api.delete(`/procedures/${procedureId}/${entity}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting procedure graph:", error.message);
    throw error;
  }
};
