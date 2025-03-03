import { useState } from 'react';

// Define the procedure data structure
const procedures = [
  {
    id: 'registration',
    label: 'Registration Flow',
    type: 'registration',
    subProcedures: [
      {
        id: 'initial-registration',
        label: 'Initial Registration Flow',
        type: 'initial-registration',
        description: 'Initial UE registration procedure'
      },
      {
        id: 'periodic-registration',
        label: 'Periodic Registration Flow',
        type: 'periodic-registration',
        description: 'Periodic UE registration update procedure'
      }
    ]
  }
  // Add more main procedures here as needed
];

function ProcedureList({ selectedProcedure, onProcedureSelect }) {
  const [expandedProcedures, setExpandedProcedures] = useState(new Set());

  const toggleProcedure = (procedureId) => {
    const newExpanded = new Set(expandedProcedures);
    if (newExpanded.has(procedureId)) {
      newExpanded.delete(procedureId);
    } else {
      newExpanded.add(procedureId);
    }
    setExpandedProcedures(newExpanded);
  };

  const renderProcedure = (procedure) => {
    const isExpanded = expandedProcedures.has(procedure.id);
    const isSelected = selectedProcedure?.id === procedure.id;
    const hasSubProcedures = procedure.subProcedures?.length > 0;

    return (
      <div key={procedure.id}>
        <div 
          className={`procedure-item main-procedure ${isExpanded ? 'expanded' : ''} ${isSelected ? 'active' : ''}`}
          onClick={() => {
            if (hasSubProcedures) {
              toggleProcedure(procedure.id);
            } else {
              onProcedureSelect(procedure);
            }
          }}
        >
          <div className="procedure-header">
            <span>{procedure.label}</span>
            {hasSubProcedures && (
              <span className="expand-icon">
                {isExpanded ? '−' : '+'}
              </span>
            )}
          </div>
        </div>
        
        {isExpanded && hasSubProcedures && (
          <div className="sub-procedures">
            {procedure.subProcedures.map(subProc => (
              <div
                key={subProc.id}
                className={`procedure-item sub-procedure ${selectedProcedure?.id === subProc.id ? 'active' : ''}`}
                onClick={() => {
                  console.log('Selected sub-procedure:', subProc);
                  onProcedureSelect(subProc);
                }}
              >
                {subProc.label}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="section-container">
      <div className="section-header">
        <span>Procedures</span>
      </div>
      <div className="content-area">
        {procedures.map(renderProcedure)}
      </div>
    </div>
  );
}

export default ProcedureList;