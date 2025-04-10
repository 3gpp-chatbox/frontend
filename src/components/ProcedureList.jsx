import React from "react";

function ProcedureList({ selectedProcedure, onProcedureSelect }) {
  const handleClick = () => {
    onProcedureSelect({
      resultSet: "method_1",
      procedureName: "Initial Registration",
      id: "Initial Registration",
    });
  };

  return (
    <div className="section-container">
      <div className="section-header">
        <span>Procedures</span>
      </div>
      <div className="content-area">
        <button
          className={`procedure-button ${
            selectedProcedure?.id === "Initial Registration" ? "active" : ""
          }`}
          onClick={handleClick}
        >
          Initial Registration
        </button>
      </div>
    </div>
  );
}

export default ProcedureList;
