import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { fetchGraphVersion, fetchVersionHistory } from '../API/api_calls';
import { JsonToMermaid, defaultMermaidConfig } from '../functions/jsonToMermaid';
import DiagramView from '../utils/DiagramView';
import { FaCheckCircle } from 'react-icons/fa';

function Comparison({ left, right, onClose, selectedProcedure }) {
  const [selectedTab, setSelectedTab] = useState('Mermaid');
  const [versions, setVersions] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [rightGraphData, setRightGraphData] = useState(null);
  const [rightMermaidContent, setRightMermaidContent] = useState('');
  const [leftMermaidContent, setLeftMermaidContent] = useState('');
  const [rightJsonContent, setRightJsonContent] = useState('');
  const [leftJsonContent, setLeftJsonContent] = useState('');

  // Initialize left panel content when component mounts
  useEffect(() => {
    if (left?.mermaidContent) {
      setLeftMermaidContent(left.mermaidContent);
      setLeftJsonContent(left.jsonContent || ''); 
    }
  }, [left]);

  // Fetch versions when component mounts
  useEffect(() => {
    if (selectedProcedure?.id) {
      fetchVersions();
    }
  }, [selectedProcedure]);

  // Fetch selected version data when version changes
  useEffect(() => {
    if (selectedVersion && selectedProcedure?.id) {
      fetchVersionData();
    }
  }, [selectedVersion, selectedProcedure]);

  const fetchVersions = async () => {
    try {
      const data = await fetchVersionHistory(
        selectedProcedure.id,
        selectedProcedure.entity
      );
      setVersions(data || []);
    } catch (error) {
      console.error('Error fetching versions:', error);
    }
  };

  const fetchVersionData = async () => {
    try {
      const data = await fetchGraphVersion(
        selectedProcedure.id,
        selectedProcedure.entity,
        selectedVersion
      );
      
      if (data) {
        setRightGraphData(data);
        const mermaidCode = JsonToMermaid(data.graph || data, defaultMermaidConfig);
        setRightMermaidContent(mermaidCode);
        setRightJsonContent(JSON.stringify(data.graph || data, null, 2));
      }
    } catch (error) {
      console.error('Error fetching version data:', error);
    }
  };

  const handleVersionChange = (event) => {
    setSelectedVersion(event.target.value);
  };

  const renderPanelContent = (content, mermaidContent, jsonContent) => {
    switch (selectedTab) {
      case 'Mermaid':
        return <div className="panel-mermaid">{content || 'No Mermaid content available'}</div>;
      case 'JSON':
        return <div className="panel-json">{jsonContent || 'No JSON content available'}</div>;
      case 'Diagram':
        return (
          <div className="panel-graph" style={{ height: '100%', minHeight: '400px', position: 'relative' }}>
            {mermaidContent ? (
              <DiagramView 
                key={`mermaid-${Date.now()}`}
                mermaidCode={mermaidContent}
                showControls={true}
                showZoomLevel={true}
              />
            ) : (
              'No graph content available'
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="comparison-view">
      <div className="comparison-header">
        <div className="comparison-header-left">
          <span>Baseline Version Comparison</span>
          <div className="comparison-tabs">
            <button 
              className={selectedTab === 'Mermaid' ? 'active' : ''} 
              onClick={() => setSelectedTab('Mermaid')}
            >
              Mermaid
            </button>
            <button 
              className={selectedTab === 'JSON' ? 'active' : ''} 
              onClick={() => setSelectedTab('JSON')}
            >
              JSON
            </button>
            <button 
              className={selectedTab === 'Diagram' ? 'active' : ''} 
              onClick={() => setSelectedTab('Diagram')}
            >
              Diagram
            </button>
          </div>
        </div>
        <button className="close-btn" onClick={onClose}>×<span className="close-btn-text">Close</span></button>
      </div>
      <div className="comparison-panels">
        {/* Left Panel - verified version */}
        <div className="comparison-panel">
          <div className="panel-header">
            <div className="panel-title">
              <span>{left?.title || 'unknown Version'}<FaCheckCircle 
                style={{ 
                  color: '#3b82f6',
                  marginLeft: '8px',
                  fontSize: '16px',
                  filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2))'
                }} 
              />
              </span>
            </div>
          </div>
          <div className="panel-content">
            {renderPanelContent(leftMermaidContent, leftMermaidContent, leftJsonContent)}
          </div>
        </div>

        {/* Right Panel - version selection */}
        <div className="comparison-panel">
          <div className="panel-header">
            <div className="version-selector">
              <select 
                value={selectedVersion || ''} 
                onChange={handleVersionChange}
                className="version-dropdown"
              >
                <option value="">Select a version</option>
                {versions.map((version) => (
                  <option key={version.graph_id} value={version.graph_id}>
                    {`${selectedProcedure?.name || 'Unknown'} - Version ${version.version}`}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="panel-content">
            {renderPanelContent(rightMermaidContent, rightMermaidContent, rightJsonContent)}
          </div>
        </div>
      </div>
    </div>
  );
}

Comparison.propTypes = {
  left: PropTypes.shape({
    title: PropTypes.string,
    mermaidContent: PropTypes.string,
    jsonContent: PropTypes.string,
  }),
  right: PropTypes.shape({
    title: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
  selectedProcedure: PropTypes.shape({
    id: PropTypes.string.isRequired,
    entity: PropTypes.string.isRequired,
  }).isRequired,
};

export default Comparison;
