import axios from 'axios'

const API_BASE_URL = 'http://127.0.0.1:8000'

// Fetch all available result-sets (results:method_1, method_2, method_3)
export const fetchResultSets = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/graphs/result-sets`)
    return response.data.data
  } catch (error) {
    console.error('Error fetching result sets:', error)
    return []
  }
}

// Fetch all available graphs for a specific result set (results for method_2: periodic_registration, initial_registration)
export const fetchGraphs = async resultSet => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/graphs/result-sets/${resultSet}`
    )
    return response.data.data
  } catch (error) {
    console.error(`Error fetching graphs for ${resultSet}:`, error)
    return []
  }
}

// Fetch graph data for a specific procedure (results: nodes and edges)
export const fetchGraphData = async (resultSet, procedureName) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/graphs/result-sets/${resultSet}/${procedureName}`
    )
    return response.data.data
  } catch (error) {
    console.error(
      `Error fetching graph data for ${procedureName} in ${resultSet}:`,
      error
    )
    return null
  }
}
