import React from "react";

function ConfirmationDialog({
  onConfirm,
  onContinueEditing,
  onRevert,
  onClose,
}) {
  return (
    <div className="confirmation-overlay">
      <style>
        {`
          .confirmation-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
          }

          .confirmation-dialog {
            background-color: var(--black-800);
            border: 2px solid var(--blue-700);
            border-radius: 8px;
            padding: 24px;
            max-width: 500px;
            width: 90%;
          }

          .dialog-title {
            color: var(--silver-100);
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 16px;
          }

          .dialog-message {
            color: var(--silver-300);
            margin-bottom: 24px;
            line-height: 1.5;
          }

          .dialog-buttons {
            display: flex;
            gap: 12px;
            justify-content: flex-end;
          }

          .dialog-button {
            padding: 8px 16px;
            border-radius: 4px;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s ease;
            border: none;
          }

          .confirm-button {
            background-color: var(--blue-600);
            color: white;
          }

          .confirm-button:hover {
            background-color: var(--blue-700);
          }

          .continue-button {
            background-color: var(--black-600);
            color: var(--silver-100);
          }

          .continue-button:hover {
            background-color: var(--black-500);
          }

          .revert-button {
            background-color: var(--orange-600);
            color: white;
          }

          .revert-button:hover {
            background-color: var(--orange-700);
          }
        `}
      </style>
      <div className="confirmation-dialog">
        <div className="dialog-title">Save Changes?</div>
        <div className="dialog-message">
          Are you sure you want to save the changes you made to the JSON code?
        </div>
        <div className="dialog-buttons">
          <button className="dialog-button confirm-button" onClick={onConfirm}>
            Confirm Changes
          </button>
          <button
            className="dialog-button continue-button"
            onClick={onContinueEditing}
          >
            Continue Editing
          </button>
          <button className="dialog-button revert-button" onClick={onRevert}>
            Revert to Original
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationDialog;
