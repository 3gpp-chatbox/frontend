const BASE_URL = "http://localhost:8000"; // FastAPI backend URL

/**
 * Fetches the list of available procedures
 * @returns {Promise<Array>} List of procedures
 */
export const fetchProcedures = async () => {
  try {
    // Return mock data with main procedures
    return [
      {
        id: "registration",
        label: "Registration",
        type: "group",
        subProcedures: [
          {
            id: "initial_registration",
            label: "Initial Registration",
            type: "procedure",
          },
        ],
      },
    ];
  } catch (error) {
    console.error("Error fetching procedures:", error);
    throw error;
  }
};

/**
 * Fetches mock graph data for Initial Registration
 * @param {Object} procedure - The selected procedure object
 * @returns {Promise<Object>} The graph data
 */
export const fetchMockData = async (procedure) => {
  try {
    console.log(`Fetching mock data for: ${procedure.label}`);
    const response = await fetch(`${BASE_URL}/api/mock-data`);
    if (!response.ok) {
      throw new Error("Failed to fetch mock data");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching mock data:", error);
    throw error;
  }
};

/**
 * Saves edited graph data
 * @param {Object} data - The graph data to save
 * @returns {Promise<{message: string}>} The response message
 */
export const saveEditedData = async (data) => {
  try {
    const response = await fetch(`${BASE_URL}/api/save-edit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to save edited data");
    }
    return await response.json();
  } catch (error) {
    console.error("Error saving edited data:", error);
    throw error;
  }
};