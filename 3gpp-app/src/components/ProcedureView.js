import React, { useState, useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { fetchProcedureById } from '../services/api';

export default function ProcedureView() {
    const mermaidRef = useRef(null);
    const [procedureData, setProcedureData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadProcedure = async () => {
            try {
                const data = await fetchProcedureById(5410);
                setProcedureData(data);
            } catch (err) {
                setError(err.message);
                console.error('Error loading procedure:', err);
            }
        };

        loadProcedure();
    }, []);

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

    if (error) {
        return (
            <div style={{ color: 'red', padding: '20px' }}>
                Error: {error}
            </div>
        );
    }

    if (!procedureData) {
        return (
            <div style={{ padding: '20px' }}>
                Loading procedure data...
            </div>
        );
    }

    return (
        <div style={{ 
            padding: '20px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '30px',
            alignItems: 'start'
        }}>
            {/* Left Column: Description and Extracted Information */}
            <div>
                <div style={{ marginBottom: '20px' }}>
                    <h3>Procedure ID: {procedureData.id}</h3>
                    <div style={{ 
                        padding: '15px',
                        backgroundColor: '#f5f5f5',
                        borderRadius: '5px',
                        marginBottom: '20px'
                    }}>
                        <h4>Description:</h4>
                        <p>{procedureData.chunk_text}</p>
                    </div>
                    <div style={{ 
                        padding: '15px',
                        backgroundColor: '#f5f5f5',
                        borderRadius: '5px'
                    }}>
                        <h4>Extracted Information:</h4>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li style={{ marginBottom: '10px' }}>
                                <strong>States: </strong>
                                <div style={{ marginTop: '5px' }}>
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
                            <li style={{ marginBottom: '10px' }}>
                                <strong>Entities: </strong>
                                <div style={{ marginTop: '5px' }}>
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
                            <li style={{ marginBottom: '10px' }}>
                                <strong>Procedures: </strong>
                                <div style={{ marginTop: '5px' }}>
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
                </div>
            </div>

            {/* Right Column: Flow Diagram */}
            <div style={{ 
                border: '1px solid #ddd',
                borderRadius: '5px',
                padding: '20px',
                backgroundColor: 'white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                height: 'fit-content',
                position: 'sticky',
                top: '20px'
            }}>
                <h4 style={{ marginBottom: '15px' }}>Flow Diagram:</h4>
                <div ref={mermaidRef}></div>
            </div>
        </div>
    );
} 