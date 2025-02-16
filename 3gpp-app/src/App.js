import React from 'react';
import './App.css';
// Keep the import but comment out for now
// import NASProcedureFlow from './flow_diagram';
import ProcedureView from './components/ProcedureView';

function App() {
  return (
    <div className="App">
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <h2>3GPP Procedure Visualization</h2>
        <ProcedureView />
        {/* Teammate's component - temporarily hidden
        <div>
          <h2>Original Flow Diagram</h2>
          <NASProcedureFlow />
        </div>
        */}
      </div>
    </div>
  );
}

export default App; 