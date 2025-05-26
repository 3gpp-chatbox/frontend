import React, { useState } from 'react';
import PropTypes from 'prop-types';
import DescriptionModal from './modals/DescriptionModal';
import OriginalDataModal from './modals/Archieve_OriginalDataModal';
import VersionHistory from './modals/VersionHistory';
import { fetchOriginalGraph, deleteProcedureGraph } from "../API/api_calls";
import { MdInfo, MdHistory, MdDelete } from 'react-icons/md';

function ProcedureTitle({ selectedProcedure, onOpenComparison }) {
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [isOriginalGraphModalOpen, setIsOriginalGraphModalOpen] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [response, setResponse] = useState(null);

  const handleDetailsClick = () => {
    setIsDescriptionModalOpen(true);
  };

  const handleOriginalGraphClick = async () => {
    if (!selectedProcedure?.id) return;
    
    setIsLoading(true);
    try {
      const response = await fetchOriginalGraph(selectedProcedure.id);
      if (response && response.original_graph) {
        setOriginalData(response.original_graph);
        setIsOriginalGraphModalOpen(true);
      }
    } catch (error) {
      console.error("Error fetching original data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVersionHistoryClick = () => {
    setShowVersionHistory(true);
  };

  const handleCloseVersionHistory = () => {
    setShowVersionHistory(false);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirmText !== "I confirm to delete" || !selectedProcedure?.id) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await deleteProcedureGraph(selectedProcedure.id, selectedProcedure.entity);
      // Show success notification
      setShowSuccessNotification(true);
      // Close the modal and reset state
      setShowDeleteModal(false);
      setDeleteConfirmText("");
      // Hide success notification after 3 seconds
      setTimeout(() => {
        setShowSuccessNotification(false);
        // Refresh the page
        window.location.reload();
      }, 3000);
      setResponse(response);
    } catch (error) {
      console.error("Error deleting procedure:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Handler to open comparison from VersionHistory
  const handleOpenComparison = () => {
    setShowVersionHistory(false);
    if (onOpenComparison) {
      onOpenComparison();
    }
  };

  return (
    <>
      <div className="procedure-title-bar">
        <div className="procedure-title-content">
          <span className="procedure-name">
            {selectedProcedure ? selectedProcedure.name : 'Select a procedure'}
          </span>
          {selectedProcedure && (
            <div className="procedure-actions">
              <button 
                className="action-button delete-button"
                onClick={handleDeleteClick}
                title="Delete Procedure"
              >
                <MdDelete className="action-icon" />
                Delete
              </button>
              <button 
                className="action-button"
                onClick={handleDetailsClick}
                title="View Details"
              >
                <MdInfo className="action-icon" />
                Details
              </button>
              <button 
                className="action-button"
                onClick={handleVersionHistoryClick}
                disabled={isLoading}
                title="View Version History"
              >
                <MdHistory className="action-icon" />
                {isLoading ? 'Loading...' : 'Version History'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Success Notification */}
      {showSuccessNotification && (
        <div className="notification success">
          {response?.procedure_deleted 
            ? `Successfully deleted procedure '${response.procedure_name}' and all its graphs`
            : `Successfully deleted procedure graphs for ${selectedProcedure?.entity} side of "${selectedProcedure?.name.replace(`${selectedProcedure?.entity}-`, '')}"`
          }
        </div>
      )}

      <DescriptionModal
        isOpen={isDescriptionModalOpen}
        onClose={() => setIsDescriptionModalOpen(false)}
        procedure={selectedProcedure}
      />
      <OriginalDataModal
        isOpen={isOriginalGraphModalOpen}
        onClose={() => {
          setIsOriginalGraphModalOpen(false);
          setOriginalData(null);
        }}
        originalData={originalData}
      />
      <VersionHistory
        isOpen={showVersionHistory}
        onClose={handleCloseVersionHistory}
        onOpenComparison={handleOpenComparison}
        procedure={selectedProcedure}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Delete Procedure</h3>
              <button 
                className="modal-close-btn"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmText("");
                }}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-section">
                <p className="warning-text">
                  This action cannot be undone. This will permanently delete all graphs for the {selectedProcedure?.entity} side of procedure "{selectedProcedure?.name.replace(`${selectedProcedure?.entity}-`, '')}".
                </p>
                <p className="warning-text">
                  Please type <strong>I confirm to delete</strong> to confirm.
                </p>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="Type 'I confirm to delete'"
                  className="delete-confirm-input"
                />
                <div className="dialog-buttons">
                  <button
                    className="action-button cancel-button"
                    onClick={() => {
                      setShowDeleteModal(false);
                      setDeleteConfirmText("");
                    }}
                    disabled={isDeleting}
                  >
                    Cancel
                  </button>
                  <button
                    className="action-button delete-confirm-button"
                    onClick={handleDeleteConfirm}
                    disabled={deleteConfirmText !== "I confirm to delete" || isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

ProcedureTitle.propTypes = {
  selectedProcedure: PropTypes.object,
  onOpenComparison: PropTypes.func,
};

export default ProcedureTitle;
