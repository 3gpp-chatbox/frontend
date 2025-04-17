import React from "react";

function Description({ procedure }) {
  console.log("Description: procedure details here", procedure);
  if (!procedure) {
    return (
      <div className="section-container">
        <div className="section-header">
          <span>Description</span>
        </div>
        <div className="content-area">
          <div className="placeholder-text">
            Select a procedure to view its description
          </div>
        </div>
      </div>
    );
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Format accuracy as percentage
  const formatAccuracy = (accuracy) => {
    if (accuracy === undefined || accuracy === null) return "N/A";
    // If accuracy is already in percentage form (> 1), don't multiply by 100
    const value = accuracy > 1 ? accuracy : accuracy * 100;
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="description-panel">
      {procedure ? (
        <div className="detail-sections-container">
          <div className="detail-section">
            <h3>Document Information</h3>
            <div className="detail-item">
              <span className="detail-label">Document:</span>
              <span className="detail-value">
                {procedure.document_name || "N/A"}
              </span>
            </div>
          </div>

          <div className="detail-section">
            <h3>Graph Information</h3>
            <div className="detail-item">
              <span className="detail-label">Status:</span>
              <span className="detail-value">{procedure.status || "N/A"}</span>
            </div>
            {/*Accuracy format should be a percentage*/}
            <div className="detail-item">
              <span className="detail-label">Accuracy:</span>
              <span className="detail-value">
                {formatAccuracy(procedure.accuracy)}
              </span>
            </div>
          </div>

          <div className="detail-section">
            <h3>Timestamps</h3>
            <div className="detail-item">
              <span className="detail-label">Extracted:</span>
              <span className="detail-value">
                {formatDate(procedure.extracted_at)}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Last Edited:</span>
              <span className="detail-value">
                {formatDate(procedure.last_edit_at)}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="placeholder-text">
          Select a procedure to view details
        </div>
      )}
    </div>
  );
}

export default Description;
