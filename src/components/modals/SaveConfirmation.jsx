import React, { useState } from "react";
import PropTypes from "prop-types";

function ConfirmationDialog({
  show = false,
  onConfirm,
  onContinueEditing,
  onRevert,
}) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const TITLE_MAX_LENGTH = 72;
  const MESSAGE_MAX_LENGTH = 1000;

  const clearContent = () => {
    setTitle("");
    setMessage("");
  };

  const handleConfirm = () => {
    onConfirm({ title, message });
    clearContent();
  };

  const handleRevert = () => {
    onRevert();
    clearContent();
  };

  const handleClose = () => {
    onContinueEditing();
    clearContent();
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Commit Changes</h3>
          <button className="modal-close-btn" onClick={handleClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="modal-section">
              <span>Add your commit message here</span>
              {/* Add a text area for the commit title */}
              <label className="commit-label" htmlFor="commit-title">Title</label>
              <div className="textarea-container">
                <textarea 
                  id="commit-title"
                  className="commit-title-textarea" 
                  placeholder="Enter a brief title for your changes"
                  maxLength={TITLE_MAX_LENGTH}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <span className="char-count">{title.length}/{TITLE_MAX_LENGTH}</span>
              </div>
              {/* Add a text area for the commit message */}
              <label className="commit-label" htmlFor="commit-message">Description</label>
              <div className="textarea-container">
                <textarea 
                  id="commit-message"
                  className="commit-message-textarea" 
                  placeholder="Provide a detailed description of your changes"
                  maxLength={MESSAGE_MAX_LENGTH}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <span className="char-count">{message.length}/{MESSAGE_MAX_LENGTH}</span>
              </div>
          </div>
          <div className="modal-section">
              <div className="dialog-buttons">
                <button 
                  className="action-button" 
                  onClick={handleConfirm}
                  disabled={!title.trim() || !message.trim()}
                >
                  Confirm Changes
                </button>
                <button className="action-button" onClick={onContinueEditing}>
                  Continue Editing
                </button>
                <button className="action-button" onClick={handleRevert}>
                  Revert to Original
                </button>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}

ConfirmationDialog.propTypes = {
  show: PropTypes.bool,
  onConfirm: PropTypes.func.isRequired,
  onContinueEditing: PropTypes.func,
  onRevert: PropTypes.func,
};

export default ConfirmationDialog;
