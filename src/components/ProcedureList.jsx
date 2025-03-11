import { useState, useEffect } from 'react';

// Define the procedure data structure
const procedures = [
  {
    id: 'registration',
    label: 'Registration Flow',
    type: 'registration',
    subProcedures: [
      {
        id: 'Initial_Registration',
        label: 'Initial Registration',
        type: 'initial-registration',
        description: 'Initial UE registration procedure',
        triggers: [
          {
            id: 'Power_On',
            label: 'Power On / UE Startup',
            description: 'The UE is powered on and needs to register with the network for the first time'
          },
          {
            id: 'Enter_5G_Coverage',
            label: 'Enter 5G Coverage',
            description: 'The UE moves from a non-5G area into a 5G coverage area'
          },
          {
            id: 'Change_of_PLMN',
            label: 'Change of PLMN',
            description: 'The UE detects a new PLMN and must register to establish a connection'
          },
          {
            id: 'Change_in_Subscription',
            label: 'Change in Subscription',
            description: 'UE\'s subscription information has changed (e.g., USIM updates)'
          },
          {
            id: 'Registration_Area_Change',
            label: 'Registration Area Change',
            description: 'Tracking area update failure requiring new registration'
          },
          {
            id: 'Loss_of_Connection',
            label: 'Loss of Connection',
            description: 'UE was deregistered by AMF due to inactivity or timer expiry'
          },
          {
            id: 'Explicit_Deregistration',
            label: 'Explicit Deregistration',
            description: 'UE previously performed 5GMM De-registration'
          },
          {
            id: 'Security_Context_Change',
            label: 'Security Context Change',
            description: 'Security context is lost or reset, requiring fresh registration'
          },
          {
            id: 'Emergency_Registration',
            label: 'Emergency Registration',
            description: 'UE needs to register for emergency services'
          }
        ]
      },
      {
        id: 'Periodic_Registration',
        label: 'Periodic Registration',
        type: 'periodic-registration',
        description: 'Periodic UE registration update procedure',
        triggers: [
          {
            id: 'T3512_Timer_Expiry',
            label: 'T3512 Timer Expiry',
            description: 'UE-initiated periodic registration'
          },
          {
            id: 'Change_in_RAT',
            label: 'Change in RAT',
            description: 'Radio Access Technology change'
          },
          {
            id: 'Change_in_NSSAI',
            label: 'Change in NSSAI',
            description: 'Network Slice Selection Assistance Information change'
          },
          {
            id: 'Change_in_Service_Area',
            label: 'Change in Service Area',
            description: 'Service Area change'
          }
        ]
      }
    ]
  }
  // Add more main procedures here as needed
];

function ProcedureList({ selectedProcedure, onProcedureSelect }) {
  const [expandedProcedures, setExpandedProcedures] = useState(new Set());
  const [expandedTriggerSections, setExpandedTriggerSections] = useState(new Set());
  const [triggerData, setTriggerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch trigger data
  const fetchTriggerData = async (trigger) => {
    try {
      setLoading(true);
      setError(null);
      setTriggerData(null);
      
      const triggerId = trigger.id.replace(/ /g, '_');
      console.log("Fetching data for trigger:", triggerId);
      
      const endpoint = `http://localhost:8000/periodic-registration/${triggerId}`;
      console.log("Making request to:", endpoint);
      
      const response = await fetch(endpoint);
      const data = await response.json();
      
      console.log("Raw API response:", data);  // Debug log
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (data.status === 'success' && data.data) {
        console.log("Setting trigger data:", data.data);  // Debug log
        setTriggerData(data.data);
        
        if (onProcedureSelect) {
          const processedData = {
            ...data.data,
            id: trigger.id,
            type: 'periodic-registration-trigger',
            label: trigger.label,
          };
          console.log("Passing to parent:", processedData);  // Debug log
          onProcedureSelect(processedData);
        }
      } else {
        throw new Error('Invalid data received');
      }
      
    } catch (err) {
      console.error('Error fetching trigger data:', err);
      setError(err.message);
      setTriggerData(null);
    } finally {
      setLoading(false);
    }
  };

  const toggleProcedure = (procedureId) => {
    const newExpanded = new Set(expandedProcedures);
    if (newExpanded.has(procedureId)) {
      newExpanded.delete(procedureId);
    } else {
      newExpanded.add(procedureId);
    }
    setExpandedProcedures(newExpanded);
  };

  const toggleTriggerSection = (procedureId) => {
    const newExpanded = new Set(expandedTriggerSections);
    if (newExpanded.has(procedureId)) {
      newExpanded.delete(procedureId);
    } else {
      newExpanded.add(procedureId);
    }
    setExpandedTriggerSections(newExpanded);
  };

  const handleTriggerClick = async (trigger) => {
    console.log("Trigger clicked:", trigger);
    try {
      setLoading(true);
      setError(null);
      setTriggerData(null);

      // Format trigger ID for the API call
      const triggerId = trigger.id.replace(/ /g, '_');
      console.log("Formatted trigger ID:", triggerId);

      // Call onProcedureSelect with the trigger data
      if (onProcedureSelect) {
        const processedData = {
          ...trigger,
          type: 'periodic-registration-trigger'
        };
        console.log("Passing to parent:", processedData);
        onProcedureSelect(processedData);
      }
    } catch (err) {
      console.error('Error handling trigger click:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
              <div key={subProc.id}>
                <div
                  className={`procedure-item sub-procedure ${selectedProcedure?.id === subProc.id ? 'active' : ''}`}
                >
                  <div 
                    className="procedure-header" 
                    onClick={() => {
                      if (subProc.triggers) {
                        toggleTriggerSection(subProc.id);
                      }
                      onProcedureSelect(subProc);
                    }}
                  >
                    <span>{subProc.label}</span>
                    {subProc.triggers && (
                      <span 
                        className="expand-icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTriggerSection(subProc.id);
                        }}
                      >
                        {expandedTriggerSections.has(subProc.id) ? '−' : '+'}
                      </span>
                    )}
                  </div>
                </div>
                {subProc.triggers && expandedTriggerSections.has(subProc.id) && (
                  <div className="sub-procedures">
                    <div className="trigger-section-header">
                      <span className="trigger-icon">⚡</span>
                      <span>Triggers for {subProc.label}</span>
                    </div>
                    {subProc.triggers.map(trigger => (
                      <div
                        key={trigger.id}
                        className={`procedure-item trigger-item ${selectedProcedure?.id === trigger.id ? 'active' : ''}`}
                        onClick={() => handleTriggerClick(trigger)}
                        title={trigger.description}
                      >
                        <span className="trigger-bullet">•</span>
                        {trigger.label}
                      </div>
                    ))}
                  </div>
                )}
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
        {loading && <div className="loading-state">Loading trigger data...</div>}
        {error && <div className="error-state">Error: {error}</div>}
        {procedures.map(renderProcedure)}
      </div>
    </div>
  );
}

// Add these styles at the end of the file or in your CSS
const styles = `
  .trigger-section-header {
    padding: 8px 16px;
    font-size: 0.9em;
    color: #94a3b8;
    display: flex;
    align-items: center;
    gap: 8px;
    border-bottom: 1px solid #334155;
    margin-bottom: 8px;
  }

  .trigger-icon {
    font-size: 1.1em;
  }

  .trigger-item {
    padding-left: 32px !important;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.9em;
    color: #e2e8f0;
  }

  .trigger-bullet {
    color: #60a5fa;
    font-size: 1.2em;
  }

  .trigger-item:hover {
    background-color: #1e293b;
  }

  .trigger-item.active {
    background-color: #2563eb;
    color: white;
  }
`;

// Add the styles to the document
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default ProcedureList;