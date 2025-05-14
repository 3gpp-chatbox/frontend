import React, { useState } from 'react';
import DescriptionModal from './modals/DescriptionModal';
import OriginalDataModal from './modals/OriginalDataModal';
import { fetchOriginalGraph } from "../API/api_calls";
import { MdInfo, MdHistory } from 'react-icons/md';

function ProcedureTitle({ selectedProcedure }) {
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [isOriginalGraphModalOpen, setIsOriginalGraphModalOpen] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
                className="action-button"
                onClick={handleDetailsClick}
                title="View Details"
              >
                <MdInfo className="action-icon" />
                Details
              </button>
              <button 
                className="action-button"
                onClick={handleOriginalGraphClick}
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
      <OriginalDataModal
        isOpen={isOriginalGraphModalOpen}
        onClose={() => {
          setIsOriginalGraphModalOpen(false);
          setOriginalData(null);
        }}
        originalData={originalData}
      />
    </>
  );
}

export default ProcedureTitle;
