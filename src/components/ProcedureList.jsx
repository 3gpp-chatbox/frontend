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
        label: 'Initial Registration Flow',
        type: 'initial-registration',
        description: 'Initial UE registration procedure'
      },
      {
        id: 'Periodic_Registration',
        label: 'Periodic Registration Flow',
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
  const [expandedTriggers, setExpandedTriggers] = useState(false);
  const [triggerData, setTriggerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch trigger data
  const fetchTriggerData = async (triggerName) => {
    try {
      setLoading(true);
      setError(null);
      setTriggerData(null); // Reset trigger data before new fetch
      
      console.log("Fetching data for trigger:", triggerName);
      
      // Use specific endpoint for Change in RAT
      let endpoint;
      if (triggerName === 'Change_in_RAT') {
        endpoint = 'http://localhost:3000/periodic-registration/change-in-rat-path';
      } else {
        endpoint = `http://localhost:3000/periodic-registration/${encodeURIComponent(triggerName)}`;
      }
      
      console.log("Making request to:", endpoint);
      const response = await fetch(endpoint, {
        headers: {
          'Accept': 'application/json'
        }
      });
      
      console.log("Response status:", response.status);
      console.log("Response headers:", Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log("Error response text:", errorText);
        
        let errorMessage;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.error || `HTTP error! status: ${response.status}`;
        } catch (e) {
          errorMessage = `Server error: ${errorText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("Received data:", JSON.stringify(data, null, 2));
      
      if (data.status === 'success' && data.data) {
        console.log("Setting trigger data...");
        setTriggerData(data.data);
        
        // Pass the data to parent component if needed
        if (onProcedureSelect) {
          console.log("Calling onProcedureSelect with data");
          onProcedureSelect({
            ...data.data,
            id: triggerName,
            type: 'periodic-registration-trigger',
            label: triggerName,
            data: data.data // Include the full data for JsonViewer
          });
        }
      } else {
        console.log("Invalid data structure received:", data);
        throw new Error(data.error || 'Invalid data received');
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

  const handleTriggerClick = (trigger) => {
    console.log("Trigger clicked:", trigger);
    fetchTriggerData(trigger.id);
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
                      if (subProc.id === 'Periodic_Registration') {
                        setExpandedTriggers(!expandedTriggers);
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
                          setExpandedTriggers(!expandedTriggers);
                        }}
                      >
                        {expandedTriggers ? '−' : '+'}
                      </span>
                    )}
                  </div>
                </div>
                {subProc.id === 'Periodic_Registration' && expandedTriggers && (
                  <div className="sub-procedures">
                    {subProc.triggers.map(trigger => (
                      <div
                        key={trigger.id}
                        className={`procedure-item sub-procedure ${selectedProcedure?.id === trigger.id ? 'active' : ''}`}
                        onClick={() => handleTriggerClick(trigger)}
                        title={trigger.description}
                      >
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

export default ProcedureList;