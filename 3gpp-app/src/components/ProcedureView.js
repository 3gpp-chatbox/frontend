import React, { useState, useEffect, useRef } from 'react';
import { 
    Box, 
    Paper, 
    Typography, 
    FormControl, 
    InputLabel, 
    Select, 
    MenuItem,
    Grid,
    Chip,
    CircularProgress
} from '@mui/material';
import mermaid from 'mermaid';
import { fetchProcedureTypes, fetchProcedureFlow } from '../services/api';

export default function ProcedureView() {
    const mermaidRef = useRef(null);
    const [procedureData, setProcedureData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedProcedure, setSelectedProcedure] = useState('');
    const [selectedSubProcedure, setSelectedSubProcedure] = useState('');
    const [availableProcedures, setAvailableProcedures] = useState([]);
    const [subProcedures, setSubProcedures] = useState([]);

    // Load available procedure types
    useEffect(() => {
        const loadProcedureTypes = async () => {
            try {
                const types = await fetchProcedureTypes();
                console.log('Raw types from API:', types);
                
                if (types && types.length > 0) {
                    setAvailableProcedures(types);
                    setSelectedProcedure(types[0]);
                }
            } catch (err) {
                console.error('Error loading procedure types:', err);
                setError('Failed to load procedure types');
            }
        };
        loadProcedureTypes();
    }, []);

    // Update sub-procedures based on selected procedure
    useEffect(() => {
        if (selectedProcedure) {
            const getSubProcedures = async () => {
                try {
                    const data = await fetchProcedureFlow(selectedProcedure);
                    if (data && data.nodes && data.nodes.procedures) {
                        const subProcs = data.nodes.procedures.filter(proc => 
                            proc.toLowerCase().includes(selectedProcedure.toLowerCase()) &&
                            proc !== selectedProcedure
                        );
                        setSubProcedures(subProcs);
                        if (subProcs.length > 0) {
                            setSelectedSubProcedure(subProcs[0]);
                        }
                    }
                } catch (err) {
                    console.error('Error loading sub-procedures:', err);
                }
            };
            getSubProcedures();
        }
    }, [selectedProcedure]);

    // Load procedure flow when type is selected
    useEffect(() => {
        const loadProcedureFlow = async () => {
            if (!selectedProcedure) return;
            
            setLoading(true);
            try {
                const data = await fetchProcedureFlow(selectedProcedure, selectedSubProcedure);
                console.log('Loaded procedure flow:', data);
                setProcedureData(data);
                setError(null);
            } catch (err) {
                console.error('Error loading procedure flow:', err);
                setError(err.message || 'Failed to load procedure flow');
            } finally {
                setLoading(false);
            }
        };
        loadProcedureFlow();
    }, [selectedProcedure, selectedSubProcedure]);

    // Render mermaid diagram
    useEffect(() => {
        if (procedureData) {
            const renderMermaid = async () => {
                console.log('Rendering data:', procedureData);
                try {
                    // Initialize mermaid
                    mermaid.initialize({
                        startOnLoad: true,
                        theme: 'default',
                        securityLevel: 'loose',
                        flowchart: {
                            curve: 'linear',
                            nodeSpacing: 80,
                            rankSpacing: 100,
                            padding: 40,
                            defaultRenderer: 'dagre',
                            htmlLabels: true,
                            useMaxWidth: true
                        }
                    });

                    // Generate diagram
                    const diagram = generateMermaidDiagram(procedureData, selectedProcedure, selectedSubProcedure);
                    
                    // Render diagram
                    if (mermaidRef.current) {
                        mermaidRef.current.innerHTML = '';
                        const { svg } = await mermaid.render('procedure-diagram', diagram);
                        mermaidRef.current.innerHTML = svg;
                    }
                } catch (err) {
                    console.error('Error rendering diagram:', err);
                    setError('Failed to render diagram');
                }
            };
            renderMermaid();
        }
    }, [procedureData, selectedProcedure, selectedSubProcedure]);

    return (
        <Box>
            {/* Procedure Selection Controls */}
            <Paper sx={{ p: 2, mb: 3 }} elevation={2}>
                <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>Procedure Type</InputLabel>
                            <Select
                                value={selectedProcedure}
                                onChange={(e) => setSelectedProcedure(e.target.value)}
                                label="Procedure Type"
                            >
                                {availableProcedures.map(type => (
                                    <MenuItem key={type} value={type}>{type}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    {subProcedures.length > 0 && (
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel>Sub-Procedure</InputLabel>
                                <Select
                                    value={selectedSubProcedure}
                                    onChange={(e) => setSelectedSubProcedure(e.target.value)}
                                    label="Sub-Procedure"
                                >
                                    {subProcedures.map(proc => (
                                        <MenuItem key={proc} value={proc}>{proc}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    )}
                </Grid>
            </Paper>

            {/* Main Content */}
            {loading ? (
                <Box display="flex" justifyContent="center" p={4}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Paper sx={{ p: 2, bgcolor: '#ffebee' }}>
                    <Typography color="error">{error}</Typography>
                </Paper>
            ) : procedureData ? (
                <Grid container spacing={3}>
                    {/* Flow Diagram */}
                    <Grid item xs={12}>
                        <Paper sx={{ p: 2 }} elevation={2}>
                            <Typography variant="h6" gutterBottom>Flow Diagram</Typography>
                            <Box 
                                ref={mermaidRef} 
                                sx={{ 
                                    minHeight: '600px',
                                    '& svg': {
                                        maxWidth: '100%',
                                        height: 'auto',
                                        display: 'block',
                                        margin: '0 auto'
                                    }
                                }} 
                            />
                        </Paper>
                    </Grid>

                    {/* Procedure Information */}
                    <Grid item xs={12}>
                        <Paper sx={{ p: 2 }} elevation={2}>
                            <Typography variant="h6" gutterBottom>Procedure Information</Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={4}>
                                    <Typography variant="subtitle1" gutterBottom>States</Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {procedureData.nodes.states.map(state => (
                                            <Chip 
                                                key={state} 
                                                label={state} 
                                                color="primary" 
                                                variant="outlined"
                                            />
                                        ))}
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Typography variant="subtitle1" gutterBottom>Entities</Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {procedureData.nodes.entities.map(entity => (
                                            <Chip 
                                                key={entity} 
                                                label={entity} 
                                                color="secondary" 
                                                variant="outlined"
                                            />
                                        ))}
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Typography variant="subtitle1" gutterBottom>Procedures</Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {procedureData.nodes.procedures.map(proc => (
                                            <Chip 
                                                key={proc} 
                                                label={proc} 
                                                color="info" 
                                                variant="outlined"
                                            />
                                        ))}
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            ) : null}
        </Box>
    );
}

// Helper function to generate Mermaid diagram
function generateMermaidDiagram(data, selectedProcedure, selectedSubProcedure) {
    const nodes = data.nodes || { states: [], messages: [], procedures: [], entities: [] };
    const edges = data.edges || [];

    // Create style definitions
    const styles = `
    %% Style definitions
    classDef stateNode fill:#f4f4f4,stroke:#666,stroke-width:2px;
    classDef messageNode fill:none,stroke:none,color:#ff0000;
    classDef entityNode fill:#e1f5fe,stroke:#0288d1,stroke-width:2px;
    `;

    // Process nodes and edges
    const processedNodes = new Set();
    const nodeDefinitions = [];
    const edgeDefinitions = [];

    // Add edges and ensure all connected nodes are included
    edges.forEach(edge => {
        const sourceId = edge.source.replace(/[^a-zA-Z0-9]/g, '_');
        const targetId = edge.target.replace(/[^a-zA-Z0-9]/g, '_');
        
        // Add source node if not already added
        if (!processedNodes.has(sourceId)) {
            const isState = edge.source.includes('_');
            const style = isState ? ':::stateNode' : ':::messageNode';
            nodeDefinitions.push(`    ${sourceId}["${edge.source}"]${style}`);
            processedNodes.add(sourceId);
        }
        
        // Add target node if not already added
        if (!processedNodes.has(targetId)) {
            const isState = edge.target.includes('_');
            const style = isState ? ':::stateNode' : ':::messageNode';
            nodeDefinitions.push(`    ${targetId}["${edge.target}"]${style}`);
            processedNodes.add(targetId);
        }
        
        // Add edge with relationship as label
        edgeDefinitions.push(`    ${sourceId} -->|${edge.relationship}| ${targetId}`);
    });

    // Generate complete diagram
    return `graph TB
${styles}
    %% Node definitions
${nodeDefinitions.join('\n')}

    %% Edge definitions
${edgeDefinitions.join('\n')}`;
} 