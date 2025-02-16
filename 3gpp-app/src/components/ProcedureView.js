import React, { useState, useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { fetchProcedureById } from '../services/api';

export default function ProcedureView() {
    const mermaidRef = useRef(null);
    const [procedureData, setProcedureData] = useState(null);
    const [error, setError] = useState(null);
    const [inputId, setInputId] = useState('5410');
    const [loading, setLoading] = useState(false);

    const loadProcedure = async (id) => {
        setLoading(true);
        try {
            const data = await fetchProcedureById(Number(id));
            setProcedureData(data);
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error('Error loading procedure:', err);
        } finally {
            setLoading(false);
        }
    };

    // Load initial procedure
    useEffect(() => {
        loadProcedure(inputId);
    }, []);

    // Mermaid rendering effect remains the same
    useEffect(() => {
        if (procedureData) {
            const renderMermaid = async () => {
                // Create unique IDs for nodes to avoid spaces and special characters
                const createNodeId = (type, name) => `${type}_${name.replace(/[\s-]/g, '_')}`;
                
                // Create node definitions with unique IDs
                const stateNodes = procedureData.nodes.states.map(state => 
                    `    ${createNodeId('state', state)}["${state}"]`
                );
                const entityNodes = procedureData.nodes.entities.map(entity => 
                    `    ${createNodeId('entity', entity)}["${entity}"]`
                );
                const procedureNodes = procedureData.nodes.procedures.map(proc => 
                    `    ${createNodeId('proc', proc)}["${proc}"]`
                );

                // Create edges with the unique IDs
                const edges = procedureData.edges.map(edge => {
                    const sourceId = createNodeId('entity', edge.source);
                    const targetId = createNodeId('proc', edge.target);
                    return `    ${sourceId} -->|${edge.relationship}| ${targetId}`;
                });

                // Combine into mermaid syntax
                const diagram = `flowchart TD
    subgraph States
${stateNodes.join('\n')}
    end
    subgraph Entities
${entityNodes.join('\n')}
    end
    subgraph Procedures
${procedureNodes.join('\n')}
    end
${edges.join('\n')}`;

                console.log('Generated diagram:', diagram); // For debugging

                try {
                    mermaid.initialize({ 
                        startOnLoad: true,
                        theme: 'default',
                        securityLevel: 'loose'
                    });
                    const { svg } = await mermaid.render('procedure-diagram', diagram);
                    if (mermaidRef.current) {
                        mermaidRef.current.innerHTML = svg;
                    }
                } catch (err) {
                    console.error('Error rendering diagram:', err);
                    setError('Error rendering diagram: ' + err.message);
                }
            };
            renderMermaid();
        }
    }, [procedureData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        loadProcedure(inputId);
    };

    if (error) {
        return (
            <div style={{ color: 'red', padding: '20px' }}>
                Error: {error}
                <div style={{ marginTop: '10px' }}>
                    <button 
                        onClick={() => loadProcedure(inputId)}
                        style={{ padding: '5px 10px' }}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            {/* ID Selector */}
            <div style={{ 
                marginBottom: '30px',
                padding: '15px',
                backgroundColor: '#f5f5f5',
                borderRadius: '5px',
                width: '100%'
            }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <label>Enter Procedure ID:</label>
                    <input
                        type="number"
                        value={inputId}
                        onChange={(e) => setInputId(e.target.value)}
                        style={{
                            padding: '5px',
                            borderRadius: '4px',
                            border: '1px solid #ddd',
                            width: '100px'
                        }}
                        min="1"
                    />
                    <button 
                        type="submit"
                        disabled={loading}
                        style={{
                            padding: '5px 15px',
                            borderRadius: '4px',
                            border: '1px solid #ddd',
                            backgroundColor: loading ? '#f0f0f0' : 'white',
                            cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {loading ? 'Loading...' : 'Load'}
                    </button>
                </form>
            </div>

            {procedureData ? (
                <>
                    {/* Description Section */}
                    <div style={{ marginBottom: '30px' }}>
                        <h3>Procedure ID: {procedureData.id}</h3>
                        <div style={{ 
                            padding: '20px',
                            backgroundColor: '#f5f5f5',
                            borderRadius: '5px',
                            marginTop: '15px'
                        }}>
                            <h4>Description:</h4>
                            <p style={{ marginTop: '10px' }}>{procedureData.chunk_text}</p>
                        </div>
                    </div>

                    {/* Flow Diagram Section */}
                    <div style={{ 
                        marginBottom: '30px',
                        padding: '20px',
                        backgroundColor: 'white',
                        borderRadius: '5px',
                        border: '1px solid #ddd',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        <h4>Flow Diagram:</h4>
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '20px' }}>Loading diagram...</div>
                        ) : (
                            <div ref={mermaidRef} style={{ marginTop: '15px' }}></div>
                        )}
                    </div>

                    {/* Extracted Information Section */}
                    <div style={{ 
                        padding: '20px',
                        backgroundColor: '#f5f5f5',
                        borderRadius: '5px'
                    }}>
                        <h4>Extracted Information:</h4>
                        <ul style={{ 
                            listStyle: 'none', 
                            padding: 0,
                            marginTop: '15px'
                        }}>
                            <li style={{ marginBottom: '20px' }}>
                                <strong>States: </strong>
                                <div style={{ marginTop: '10px' }}>
                                    {procedureData.nodes.states.map(state => (
                                        <span key={state} style={{
                                            display: 'inline-block',
                                            background: '#e3f2fd',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            margin: '2px',
                                            fontSize: '0.9em'
                                        }}>
                                            {state}
                                        </span>
                                    ))}
                                </div>
                            </li>
                            <li style={{ marginBottom: '20px' }}>
                                <strong>Entities: </strong>
                                <div style={{ marginTop: '10px' }}>
                                    {procedureData.nodes.entities.map(entity => (
                                        <span key={entity} style={{
                                            display: 'inline-block',
                                            background: '#e8f5e9',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            margin: '2px',
                                            fontSize: '0.9em'
                                        }}>
                                            {entity}
                                        </span>
                                    ))}
                                </div>
                            </li>
                            <li style={{ marginBottom: '20px' }}>
                                <strong>Procedures: </strong>
                                <div style={{ marginTop: '10px' }}>
                                    {procedureData.nodes.procedures.map(proc => (
                                        <span key={proc} style={{
                                            display: 'inline-block',
                                            background: '#fce4ec',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            margin: '2px',
                                            fontSize: '0.9em'
                                        }}>
                                            {proc}
                                        </span>
                                    ))}
                                </div>
                            </li>
                        </ul>
                    </div>
                </>
            ) : (
                <div style={{ 
                    padding: '30px', 
                    textAlign: 'center',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '5px'
                }}>
                    {loading ? 'Loading procedure...' : 'Enter a procedure ID to view details'}
                </div>
            )}
        </div>
    );
} 