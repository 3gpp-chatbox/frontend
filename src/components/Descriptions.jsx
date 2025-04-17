import React, { useState } from "react";
import PropTypes from "prop-types";
import { fetchOriginalGraph } from "../API/api_calls";
import OriginalDataModal from "./OriginalDataModal";

function Description({ procedure }) {
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [originalData, setOriginalData] = useState(null);

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

  const handleViewOriginalData = async () => {
    if (!procedure?.id || procedure.status === "original") return;
    
    setIsLoading(true);
    try {
      const response = await fetchOriginalGraph(procedure.id);
      if (response && response.original_graph) {
        setOriginalData(response.original_graph);
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error fetching original data:", error);
    } finally {
      setIsLoading(false);
    }
  };

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

  // Get button text based on status
  const getButtonText = () => {
    if (isLoading) return "Loading...";
    if (procedure.status === "original") return "Currently Viewing Original";
    return "View Original Data";
  };

  return (
    <div className="description-panel">
      {procedure ? (
        <>
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
                <text className="detail-label">Status:</text>
                <text className="detail-value">{procedure.status || "N/A"}</text>
                <text className="detail-label">Model:</text>
                <text className="detail-value">{procedure.model || "N/A"}</text>
                <text className="detail-label">Method:</text>
                <text className="detail-value">{procedure.method || "N/A"}</text>
              </div>
              {/*Accuracy format should be a percentage*/}
              <div className="detail-item">
                <text className="detail-label">Accuracy:</text>
                <text className="detail-value">
                  {formatAccuracy(procedure.accuracy)}
                </text>
                <button 
                  className="view-original-btn" 
                  onClick={handleViewOriginalData}
                  disabled={isLoading || procedure.status === "original"}
                  title={procedure.status === "original" ? "Currently viewing original data" : "View original data"}
                >
                  {getButtonText()}
                </button>
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
          <OriginalDataModal 
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            originalData={originalData}
          />
        </>
      ) : (
        <div className="placeholder-text">
          Select a procedure to view details
        </div>
      )}
    </div>
  );
}

Description.propTypes = {
  procedure: PropTypes.object
};

export default Description;
