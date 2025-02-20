import React, { useState, useEffect, useRef } from 'react';
import mermaid from 'mermaid';

export default function NASProcedureFlow() {
  const mermaidRef = useRef(null);
  
  const [graphData, setGraphData] = useState([
    { id: 'DEREG', label: 'EMM-DEREGISTERED' },
    { id: 'REG', label: 'EMM-REGISTERED' },
    { id: 'CONN', label: 'EMM-CONNECTED' },
    { id: 'PDN_DISC', label: 'PDN DISCONNECTED' },
    { id: 'PDN_CONN', label: 'PDN CONNECTED' }
  ]);
  
  const [transitions, setTransitions] = useState([
    { from: 'DEREG', to: 'REG', label: 'Attach Request' },
    { from: 'REG', to: 'DEREG', label: 'Detach' },
    { from: 'REG', to: 'CONN', label: 'Service Request' },
    { from: 'CONN', to: 'REG', label: 'Connection Release' },
    { from: 'PDN_DISC', to: 'PDN_CONN', label: 'PDN Connectivity Request' },
    { from: 'PDN_CONN', to: 'PDN_DISC', label: 'PDN Disconnect Request' }
  ]);

  const [newState, setNewState] = useState({ id: '', label: '' });
  const [newTransition, setNewTransition] = useState({ from: '', to: '', label: '' });

  const generateMermaidDiagram = () => {
    const nodes = graphData.map(node => `${node.id}[${node.label}]`).join('\n');
    const edges = transitions.map(t => `${t.from} -->|${t.label}| ${t.to}`).join('\n');
    return `flowchart TB\n${nodes}\n${edges}`;
  };

  const renderDiagram = () => {
    const diagram = generateMermaidDiagram();
    mermaid.initialize({ startOnLoad: true, theme: 'default' });
    if (mermaidRef.current) {
      mermaid.render('mermaid-diagram', diagram)
        .then(({ svg }) => {
          mermaidRef.current.innerHTML = svg;
        })
        .catch(console.error);
    }
  };

  const handleAddState = () => {
    if (newState.id && newState.label) {
      setGraphData(prev => [...prev, newState]);
      setNewState({ id: '', label: '' });
    }
  };

  const handleAddTransition = () => {
    if (newTransition.from && newTransition.to && newTransition.label) {
      setTransitions(prev => [...prev, newTransition]);
      setNewTransition({ from: '', to: '', label: '' });
    }
  };

  useEffect(() => {
    renderDiagram();
  }, [graphData, transitions]);

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'auto' }}>
      <h3>Interactive Flow Diagram from Property Graph Data</h3>
      <p>This diagram is dynamically generated from state and transition data.</p>

      <div>
        <h4>Add New State</h4>
        <input
          type="text"
          placeholder="State ID"
          value={newState.id}
          onChange={(e) => setNewState({ ...newState, id: e.target.value })}
        />
        <input
          type="text"
          placeholder="State Label"
          value={newState.label}
          onChange={(e) => setNewState({ ...newState, label: e.target.value })}
        />
        <button onClick={handleAddState}>Add State</button>
      </div>

      <div>
        <h4>Add New Transition</h4>
        <input
          type="text"
          placeholder="From State"
          value={newTransition.from}
          onChange={(e) => setNewTransition({ ...newTransition, from: e.target.value })}
        />
        <input
          type="text"
          placeholder="To State"
          value={newTransition.to}
          onChange={(e) => setNewTransition({ ...newTransition, to: e.target.value })}
        />
        <input
          type="text"
          placeholder="Transition Label"
          value={newTransition.label}
          onChange={(e) => setNewTransition({ ...newTransition, label: e.target.value })}
        />
        <button onClick={handleAddTransition}>Add Transition</button>
      </div>

      <button onClick={renderDiagram} style={{ marginBottom: '16px' }}>Generate from Graph</button>

      <div ref={mermaidRef} style={{ padding: '20px', border: '1px solid #ccc' }}></div>
    </div>
  );
}
