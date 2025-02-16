const API_BASE_URL = 'http://localhost:8000';

export const fetchProcedureById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/procedure/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch procedure');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching procedure:', error);
        throw error;
    }
};

export const fetchAllProcedures = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/view-database`);
        if (!response.ok) {
            throw new Error('Failed to fetch procedures');
        }
        const data = await response.json();
        return data.chunks;
    } catch (error) {
        console.error('Error fetching all procedures:', error);
        throw error;
    }
}; 