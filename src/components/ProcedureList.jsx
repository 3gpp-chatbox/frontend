import { useState } from 'react';

function ProcedureList({ selectedProcedure, onProcedureSelect }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const registrationProcedures = [
    { id: 'reg-1', name: "Initial Registration" },
    { id: 'reg-2', name: "Deregistration" },
    { id: 'reg-3', name: "Mobility Registration Update" },
    { id: 'reg-4', name: "Periodic Registration Update" },
  ];

  return (
    <div className="section-container">
      <div className="section-header">Procedures</div>
      <div className="content-area">
        <div 
          className={`procedure-item main-procedure ${isExpanded ? 'expanded' : ''}`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="procedure-header">
            <span>Registration Procedure</span>
            <span className="expand-icon">{isExpanded ? '−' : '+'}</span>
          </div>
        </div>
        
        {isExpanded && (
          <div className="sub-procedures">
            {registrationProcedures.map((procedure) => (
              <div
                key={procedure.id}
                className={`procedure-item sub-procedure ${
                  selectedProcedure?.id === procedure.id ? 'active' : ''
                }`}
                onClick={() => onProcedureSelect(procedure)}
              >
                {procedure.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProcedureList;