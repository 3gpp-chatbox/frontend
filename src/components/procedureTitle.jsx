import React, { useState } from 'react';
import PropTypes from 'prop-types';
import DescriptionModal from './modals/DescriptionModal';
import VersionHistory from './modals/VersionHistory';
import { fetchOriginalGraph, deleteProcedureGraph } from "../API/api_calls";
import { MdInfo, MdHistory, MdDelete } from 'react-icons/md';
import DeleteConfirmation from './modals/DeleteConfirmation';

function ProcedureTitle({ selectedProcedure, onOpenComparison }) {
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [versionHistoryKey, setVersionHistoryKey] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [response, setResponse] = useState(null);

  const handleDetailsClick = () => {
    setIsDescriptionModalOpen(true);
  };

  const handleVersionHistoryClick = () => {
    setVersionHistoryKey(prev => prev + 1);
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
            {selectedProcedure?.name || 'Select a procedure'}
          </span>
          {selectedProcedure?.id && (
            <div className="procedure-actions">
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
              <button 
                className="action-button delete-button"
                onClick={handleDeleteClick}
                title="Delete Procedure"
              >
                <MdDelete className="action-icon" />
                Delete
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
      <VersionHistory
        key={versionHistoryKey}
        isOpen={showVersionHistory}
        onClose={handleCloseVersionHistory}
        onOpenComparison={handleOpenComparison}
        procedure={selectedProcedure}
      />

      <DeleteConfirmation
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
        confirmText={deleteConfirmText}
        setConfirmText={setDeleteConfirmText}
        procedureName={selectedProcedure?.name.replace(`${selectedProcedure?.entity}-`, '')}
        entity={selectedProcedure?.entity}
      />
    </>
  );
}

ProcedureTitle.propTypes = {
  selectedProcedure: PropTypes.object,
  onOpenComparison: PropTypes.func,
};

export default ProcedureTitle;