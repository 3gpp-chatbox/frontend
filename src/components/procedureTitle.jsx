import React, { useState } from 'react';
import PropTypes from 'prop-types';
import DescriptionModal from './modals/DescriptionModal';
import VersionHistory from './modals/VersionHistory';
import { MdInfo, MdHistory } from 'react-icons/md';

function ProcedureTitle({ selectedProcedure, onOpenComparison }) {
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [versionHistoryKey, setVersionHistoryKey] = useState(0);

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
            </div>
          )}
        </div>
      </div>

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
    </>
  );
}

ProcedureTitle.propTypes = {
  selectedProcedure: PropTypes.object,
  onOpenComparison: PropTypes.func,
};

export default ProcedureTitle;