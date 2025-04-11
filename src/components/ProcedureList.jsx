import { useState } from "react";

// Define the procedure data structure
const procedures = [
  {
    id: "registration",
    label: "Registration Procedure",
    type: "registration",
    subProcedures: [
      {
        id: "Initial_Registration",
        label: "Initial Registration",
        type: "initial-registration",
        description: "Initial UE registration procedure",
      },
      {
        id: "Periodic_Registration",
        label: "Periodic Registration",
        type: "periodic-registration",
        description: "Periodic UE registration update procedure",
      },
    ],
  },
  // Add more main procedures here as needed
];

function ProcedureList({ selectedProcedure, onProcedureSelect }) {
  const [expandedProcedures, setExpandedProcedures] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [floatingPanelPosition, setFloatingPanelPosition] = useState({
    x: 0,
    y: 0,
  });

  const toggleProcedure = (procedureId, event) => {
    const newExpanded = new Set(expandedProcedures);
    if (newExpanded.has(procedureId)) {
      newExpanded.delete(procedureId);
    } else {
      // Calculate position for floating panel
      const button = event.currentTarget;
      const rect = button.getBoundingClientRect();
      setFloatingPanelPosition({
        x: rect.right + 10, // 10px offset from the button
        y: rect.top,
      });
      newExpanded.add(procedureId);
    }
    setExpandedProcedures(newExpanded);
  };

  const renderProcedure = (procedure) => {
    const isExpanded = expandedProcedures.has(procedure.id);
    const isSelected = selectedProcedure?.id === procedure.id;
    const hasSubProcedures = procedure.subProcedures?.length > 0;

    return (
      <div key={procedure.id} className="procedure-container">
        <div
          className={`procedure-item main-procedure ${
            isExpanded ? "expanded" : ""
          } ${isSelected ? "active" : ""}`}
          onClick={(e) => {
            if (hasSubProcedures) {
              toggleProcedure(procedure.id, e);
            } else {
              onProcedureSelect(procedure);
            }
          }}
        >
          <div className="procedure-header">
            <span>{procedure.label}</span>
            {hasSubProcedures && <span className="expand-icon">+</span>}
          </div>
        </div>

        {isExpanded && hasSubProcedures && (
          <div
            className="floating-sub-procedures"
            style={{
              position: "fixed",
              left: `${floatingPanelPosition.x}px`,
              top: `${floatingPanelPosition.y}px`,
            }}
          >
            <div className="floating-panel-header">
              <span>Sub-procedures</span>
              <span
                className="close-button"
                onClick={() => toggleProcedure(procedure.id)}
              >
                ×
              </span>
            </div>
            {procedure.subProcedures.map((subProc) => (
              <div
                key={subProc.id}
                className={`procedure-item sub-procedure ${
                  selectedProcedure?.id === subProc.id ? "active" : ""
                }`}
                onClick={() => {
                  onProcedureSelect(subProc);
                  toggleProcedure(procedure.id);
                }}
              >
                <span>{subProc.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Add loading and error states to the UI
  return (
    <div className="section-container">
      <div className="section-header">
        <span>Procedures</span>
      </div>
      <div className="content-area">
        {loading && <div className="loading-state">Loading data...</div>}
        {error && <div className="error-state">Error: {error}</div>}
        {procedures.map(renderProcedure)}
      </div>
    </div>
  );
}

// Updated styles
const styles = `
  .procedure-container {
    position: relative;
  }

  .main-procedure {
    display: inline-flex;
    align-items: center;
    background-color: var(--black-600);
    border: 1px solid var(--blue-700);
    border-radius: 4px;
    padding: 8px 12px;
    margin: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .main-procedure:hover {
    background-color: var(--black-500);
    border-color: var(--blue-500);
  }

  .main-procedure .procedure-header {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .floating-sub-procedures {
    position: fixed;
    background-color: var(--black-800);
    border: 1px solid var(--blue-500);
    border-radius: 4px;
    min-width: 200px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
    z-index: 1000;
  }

  .floating-panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    background-color: var(--blue-700);
    border-bottom: 1px solid var(--blue-500);
    color: var(--silver-100);
  }

  .close-button {
    cursor: pointer;
    font-size: 20px;
    color: var(--silver-100);
    transition: color 0.2s;
  }

  .close-button:hover {
    color: var(--silver-200);
  }

  .sub-procedure {
    padding: 12px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--black-500);
    background-color: var(--black-700);
    color: var(--silver-100);
    transition: all 0.2s ease;
  }

  .sub-procedure:hover {
    background-color: var(--blue-700);
    color: white;
  }

  .sub-procedure:last-child {
    border-bottom: none;
  }

  .sub-procedure.active {
    background-color: var(--blue-600);
    color: white;
  }

  .expand-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    margin-left: 8px;
    color: var(--blue-300);
    font-weight: bold;
  }
`;

// Add the styles to the document
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default ProcedureList;
