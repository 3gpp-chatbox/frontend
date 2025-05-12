import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/procedures";

//  Fetch all procedures
export const fetchProcedures = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/`);
    return response.data; // [{ id, name, entity }]
  } catch (error) {
    console.error("Error fetching procedure list:", error);
    return [];
  }
};

//  Fetch original reference context (Markdown)
export const fetchReferenceContext = async (procedureId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/reference/${procedureId}`);
    return response.data.context_markdown;
  } catch (error) {
    console.error("Error fetching reference context:", error);
    return "";
  }
};

//  Fetch full details for a specific graph (e.g. latest or selected version)
export const fetchGraphDetail = async (graphId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${graphId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching graph detail:", error);
    return null;
  }
};

//  Fetch version history for a procedure & entity
export const fetchGraphHistory = async (procedureId, entity) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/history/${procedureId}/${entity}`);
    return response.data; // Array of EntityVersionItem
  } catch (error) {
    console.error("Error fetching version history:", error);
    return [];
  }
};



// Insert procedure graph changes
export const insertProcedureGraphChanges = async (procedureId, changes, commitTitle, commitMessage) => {
  try {
    console.log("Inserting procedure graph changes:", changes);
    const response = await axios.post(`${API_BASE_URL}/${procedureId}`, {
      edited_graph: changes,
      commit_title: commitTitle,
      commit_message: commitMessage
    });
    return response.data || null;
  } catch (error) {
    console.error("Error inserting procedure graph changes:", error);
    throw error;
  }
};


