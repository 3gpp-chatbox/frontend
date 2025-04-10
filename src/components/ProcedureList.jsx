import { useState, useEffect } from "react";
import { fetchResultSets, fetchGraphs } from "../API_calls/api"; 

function ProcedureList({ selectedProcedure, onProcedureSelect }) {
  const [resultSets, setResultSets] = useState([]); 
  const [expandedResults, setExpandedResults] = useState(new Set()); 
  const [procedures, setProcedures] = useState({}); 

  // Fetch available result sets on mount
  useEffect(() => {
    fetchResultSets().then(setResultSets);
  }, []);

  // Toggle a result set and fetch its procedures
  const toggleResultSet = async (resultSet) => {
    const newExpanded = new Set(expandedResults);
    if (newExpanded.has(resultSet)) {
      newExpanded.delete(resultSet);
    } else {
      newExpanded.add(resultSet);
      if (!procedures[resultSet]) {
        const graphs = await fetchGraphs(resultSet);
        setProcedures((prev) => ({ ...prev, [resultSet]: graphs }));
      }
    }
    setExpandedResults(newExpanded);
  };

  const handleProcedureClick = (resultSet, procedure) => {
    // Map the result set name to match the converter naming
    const methodMap = {
      'Result Set 1': 'method_1',
      'Result Set 2': 'method_2',
      'Result Set 3': 'method_3',
    };

    onProcedureSelect({
      resultSet: methodMap[resultSet] || resultSet, // Use mapped name or original if no mapping
      procedureName: procedure,
      id: procedure
    });
  };

  return (
    <div className="section-container">
      <div className="section-header">
        <span>Procedures</span>
      </div>
      <div className="content-area">
        {resultSets.map((resultSet) => {
          const isExpanded = expandedResults.has(resultSet);
          return (
            <div key={resultSet}>
              {/* Main Result Set */}
              <div
                className={`procedure-item main-procedure ${isExpanded ? "expanded" : ""}`}
                onClick={() => toggleResultSet(resultSet)}
              >
                <div className="procedure-header">
                  <span>{resultSet}</span>
                  <span className="expand-icon">{isExpanded ? "−" : "+"}</span>
                </div>
              </div>

              {/* Sub Procedures (Graphs) */}
              {isExpanded && procedures[resultSet] && (
                <div className="sub-procedures">
                  {procedures[resultSet].map((procedure) => (
                    <div
                      key={procedure}
                      className={`procedure-item sub-procedure ${
                        selectedProcedure?.id === procedure ? "active" : ""
                      }`}
                      onClick={() => handleProcedureClick(resultSet, procedure)}
                    >
                      {procedure}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProcedureList;
