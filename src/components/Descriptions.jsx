import React from 'react';

function Description({ procedure }) {
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

  const title = procedure.label || procedure.type || 'Unknown Procedure';
  const description = procedure.description || 'No description available.';

  return (
    <div className="section-container">
      <div className="section-header">
        <span>Description</span>
      </div>
      <div className="content-area">
        <h2 className="description-title">{title}</h2>
        <p className="description-text">{description}</p>
      </div>
    </div>
  );
}

export default Description;