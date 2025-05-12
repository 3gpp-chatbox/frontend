import React, { useState } from 'react';
import DescriptionModal from './DescriptionModal';
import OriginalDataModal from './OriginalDataModal';
import { fetchOriginalGraph } from "../API/api_calls";

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
          <div className="menu-item">
            <span className="menu-item-text">
              {selectedProcedure ? selectedProcedure.name : 'Select a procedure'}
            </span>
            {selectedProcedure && (
              <div className="dropdown-content">
                <div className="dropdown-item" onClick={handleDetailsClick}>Details</div>
                <div className="dropdown-item" onClick={handleOriginalGraphClick}>
                  {isLoading ? 'Loading...' : 'Version History'}
                </div>
              </div>
            )}
          </div>
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
          setOriginalData(null); // Clear the data when closing
        }}
        originalData={originalData}
      />
    </>
  );
}

export default ProcedureTitle;
