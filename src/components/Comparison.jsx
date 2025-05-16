import React, { useState } from 'react';
import PropTypes from 'prop-types';

function Comparison({ left, right, onClose }) {
  const [leftTab, setLeftTab] = useState('Mermaid');
  const [rightTab, setRightTab] = useState('Mermaid');

  return (
    <div className="comparison-view">
      <div className="comparison-header">
        <span>Baseline Version Comparison</span>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>
      <div className="comparison-panels">
        {/* Left Panel */}
        <div className="comparison-panel">
          <div className="panel-header">
            <span className="panel-title">{left?.title || 'Left Version'}</span>
            <div className="panel-tabs">
              <button className={leftTab === 'Mermaid' ? 'active' : ''} onClick={() => setLeftTab('Mermaid')}>Mermaid</button>
              <button className={leftTab === 'JSON' ? 'active' : ''} onClick={() => setLeftTab('JSON')}>JSON</button>
            </div>
          </div>
          <div className="panel-content">
            {leftTab === 'Mermaid' ? (
              <div className="panel-mermaid">Mermaid content here</div>
            ) : (
              <div className="panel-json">JSON content here</div>
            )}
          </div>
        </div>
        {/* Right Panel */}
        <div className="comparison-panel">
          <div className="panel-header">
            <span className="panel-title">{right?.title || 'Right Version'}</span>
            <div className="panel-tabs">
              <button className={rightTab === 'Mermaid' ? 'active' : ''} onClick={() => setRightTab('Mermaid')}>Mermaid</button>
              <button className={rightTab === 'JSON' ? 'active' : ''} onClick={() => setRightTab('JSON')}>JSON</button>
            </div>
          </div>
          <div className="panel-content">
            {rightTab === 'Mermaid' ? (
              <div className="panel-mermaid">Mermaid content here</div>
            ) : (
              <div className="panel-json">JSON content here</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

Comparison.propTypes = {
  left: PropTypes.object,
  right: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};

export default Comparison;
