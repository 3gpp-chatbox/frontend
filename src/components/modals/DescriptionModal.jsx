import React from 'react';
import PropTypes from 'prop-types';

function DescriptionModal({ isOpen, onClose, procedure }) {

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";  // Handle undefined or empty date
    
    const date = new Date(dateString);  // Parse ISO 8601 format
    
    if (isNaN(date.getTime())) return "Invalid Date";  // Handle invalid date
    
    return date.toLocaleString();  // Format to a readable string
  };
  

  // Format accuracy as percentage
  const formatAccuracy = (accuracy) => {
    if (accuracy === undefined || accuracy === null) return "N/A";
    const value = accuracy > 1 ? accuracy : accuracy * 100;
    return `${value.toFixed(1)}%`;
  };


  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content description-modal-content">
        <div className="modal-header">
          <h3>Procedure Graph Details</h3>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
        <div className="description-section">
            <h4>Baseline Graph Information</h4>
              <div className="detail-line">
                <span className="detail-label">Entity:</span>
                <span className="detail-value">
                {procedure.entity}
                </span>
              </div>
              <div className="detail-line">
                <text className="detail-label">Version:</text>
                <text className="detail-value">{procedure.version}</text>
              </div>
              <div className="detail-line">
                <text className="detail-label">Status:</text>
                <text className="detail-value">{procedure.status}</text>
              </div>
          </div>
          <div className="description-section">
            <h4>Reference Document Information</h4>
              <div className="detail-line">
                <span className="detail-label">Document:</span>
                <span className="detail-value">
                  {procedure.document_name || "N/A"}
                </span>
              </div>
          </div>
          <div className="description-section">
            <h4>Original Graph Extraction Information</h4>
              <div className="detail-line">
                <text className="detail-label">LLM Model:</text>
                <text className="detail-value">{procedure.model_name || "N/A"}</text>
              </div>
              <div className="detail-line">
                <text className="detail-label">Accuracy Method:</text>
                <text className="detail-value">{procedure.extraction_method || "N/A"}</text>
              </div>
              <div className="detail-line">
                <text className="detail-label">Accuracy:</text>
                <text className="detail-value">
                  {formatAccuracy(procedure.accuracy)}
                </text>
              </div>
          </div>
          <div className="description-section">
            <h4>Timestamps</h4>
              <div className="detail-line">
                <span className="detail-label">Extracted:</span>
                <span className="detail-value">
                  {formatDate(procedure.extracted_at)}
                </span>
              </div>
              <div className="detail-line">
                <span className="detail-label">Last Edited:</span>
                <span className="detail-value">
                  {formatDate(procedure.created_at)}
                </span>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}

DescriptionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  procedure: PropTypes.object
};

export default DescriptionModal; 