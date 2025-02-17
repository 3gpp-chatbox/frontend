const API_BASE_URL = 'http://localhost:8000';

// Get all available procedure types with hierarchical structure
export const fetchProcedureTypes = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/procedures/types`);
        if (!response.ok) {
            throw new Error('Failed to fetch procedure types');
        }
        const data = await response.json();
        // The backend returns { types: [...] }, so we need to check both data and data.types
        if (!data || !data.types || data.types.length === 0) {
            throw new Error('No procedures found in the database');
        }
        return data.types;
    } catch (error) {
        console.error('Error fetching procedure types:', error);
        throw error;
    }
};

// Get sub-procedures for a specific procedure type
export const fetchSubProcedures = async (procedureType) => {
    try {
        const response = await fetch(`${API_BASE_URL}/procedures/${encodeURIComponent(procedureType)}/sub-procedures`);
        if (!response.ok) {
            throw new Error('Failed to fetch sub-procedures');
        }
        const data = await response.json();
        return data.sub_procedures;
    } catch (error) {
        console.error('Error fetching sub-procedures:', error);
        throw error;
    }
};

// Get complete flow for a procedure type with sub-procedure filtering
export const fetchProcedureFlow = async (procedureType, subProcedure = '') => {
    try {
        const url = new URL(`${API_BASE_URL}/procedures/flow/${encodeURIComponent(procedureType)}`);
        if (subProcedure) {
            url.searchParams.append('sub_procedure', subProcedure);
        }
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch procedure flow');
        }
        const data = await response.json();
        
        // Process the data to include relevant chunks
        return {
            ...data,
            nodes: typeof data.nodes === 'string' ? JSON.parse(data.nodes) : data.nodes,
            edges: typeof data.edges === 'string' ? JSON.parse(data.edges) : data.edges,
            relevantChunks: data.relevant_chunks || []
        };
    } catch (error) {
        console.error('Error fetching procedure flow:', error);
        throw error;
    }
};

// Get procedures by type with additional context
export const fetchProceduresByType = async (procedureType) => {
    try {
        const response = await fetch(`${API_BASE_URL}/procedures/by-type/${encodeURIComponent(procedureType)}`);
        if (!response.ok) {
            throw new Error('Failed to fetch procedures');
        }
        const data = await response.json();
        return {
            ...data,
            procedures: data.procedures.map(proc => ({
                ...proc,
                nodes: typeof proc.nodes === 'string' ? JSON.parse(proc.nodes) : proc.nodes,
                edges: typeof proc.edges === 'string' ? JSON.parse(proc.edges) : proc.edges
            }))
        };
    } catch (error) {
        console.error('Error fetching procedures by type:', error);
        throw error;
    }
};

// Get specific procedure by ID with enhanced error handling
export const fetchProcedureById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/procedure/${id}`);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`Procedure with ID ${id} not found`);
            }
            throw new Error('Failed to fetch procedure');
        }
        const data = await response.json();
        return {
            ...data,
            nodes: typeof data.nodes === 'string' ? JSON.parse(data.nodes) : data.nodes,
            edges: typeof data.edges === 'string' ? JSON.parse(data.edges) : data.edges
        };
    } catch (error) {
        console.error('Error fetching procedure:', error);
        throw error;
    }
};

// Get all procedures with pagination support
export const fetchAllProcedures = async (page = 1, limit = 10) => {
    try {
        const response = await fetch(`${API_BASE_URL}/view-database?page=${page}&limit=${limit}`);
        if (!response.ok) {
            throw new Error('Failed to fetch procedures');
        }
        const data = await response.json();
        return {
            total: data.total_chunks,
            procedures: data.chunks.map(chunk => ({
                ...chunk,
                nodes: typeof chunk.nodes === 'string' ? JSON.parse(chunk.nodes) : chunk.nodes,
                edges: typeof chunk.edges === 'string' ? JSON.parse(chunk.edges) : chunk.edges
            }))
        };
    } catch (error) {
        console.error('Error fetching all procedures:', error);
        throw error;
    }
}; 