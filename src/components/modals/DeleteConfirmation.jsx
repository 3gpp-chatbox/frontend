import React from "react";
import PropTypes from "prop-types";

function DeleteConfirmation({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
  confirmText,
  setConfirmText,
  procedureName,
  entity
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content delete-modal-content">
        <div className="modal-header delete-modal-header">
          <h3>Delete Procedure</h3>
          <button
            className="modal-close-btn"
            onClick={() => {
              onClose();
              setConfirmText("");
            }}
          >
            ×
          </button>
        </div>
        <div className="modal-body delete-modal-body">
          <div className="modal-section">
            <p className="warning-text">
              This action cannot be undone. This will permanently delete all graphs for the {entity} side of procedure "{procedureName}".
            </p>
            <p className="warning-text">
              Please type <strong>I confirm to delete</strong> to confirm.
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type 'I confirm to delete'"
              className="delete-confirm-input"
            />
            <div className="dialog-buttons">
              <button
                className="action-button cancel-button"
                onClick={() => {
                  onClose();
                  setConfirmText("");
                }}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className="action-button delete-confirm-button"
                onClick={onConfirm}
                disabled={confirmText !== "I confirm to delete" || isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

DeleteConfirmation.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  isDeleting: PropTypes.bool,
  confirmText: PropTypes.string.isRequired,
  setConfirmText: PropTypes.func.isRequired,
  procedureName: PropTypes.string,
  entity: PropTypes.string
};

export default DeleteConfirmation;
