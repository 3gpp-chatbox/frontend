import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { fetchGraphVersion, fetchVersionHistory } from '../API/api_calls';
import { JsonToMermaid, defaultMermaidConfig } from '../functions/jsonToMermaid';
import DiagramView from '../utils/DiagramView';
import { FaCheckCircle } from 'react-icons/fa';
import { highlightJsonDiff } from '../functions/diffhighlighting/jsonDiffHighlighter';
import { highlightMermaidDiff } from '../functions/diffhighlighting/mermaidDiffHighlighter';
import { findDifferences, applyDiffHighlighting } from '../functions/diffhighlighting/diffHighlighter';

function Comparison({ left, right, onClose, selectedProcedure }) {
  const [selectedTab, setSelectedTab] = useState('Mermaid');
  const [versions, setVersions] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [rightGraphData, setRightGraphData] = useState(null);
  const [rightMermaidContent, setRightMermaidContent] = useState('');
  const [leftMermaidContent, setLeftMermaidContent] = useState('');
  const [rightJsonContent, setRightJsonContent] = useState('');
  const [leftJsonContent, setLeftJsonContent] = useState('');
  const [leftVersion, setLeftVersion] = useState(null);
  // Initialize left panel content when component mounts
  useEffect(() => {
    if (left?.jsonContent) {
      try {
        // Parse JSON content
        const jsonData = JSON.parse(left.jsonContent);
        
        // Convert JSON to Mermaid using JsonToMermaid
        const mermaidCode = JsonToMermaid(jsonData, defaultMermaidConfig);
        
        setLeftMermaidContent(mermaidCode);
        setLeftJsonContent(left.jsonContent);
        setLeftVersion(left.version);
      } catch (error) {
        console.error('Error converting JSON to Mermaid:', error);
      }
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

  const renderPanelContent = (content, mermaidContent, jsonContent, isLeftPanel = false) => {
    switch (selectedTab) {
      case 'Mermaid':
        const mermaidDiffs = !isLeftPanel ? findDifferences(leftMermaidContent, content) : [];
        return (
          <div 
            className="panel-mermaid"
            dangerouslySetInnerHTML={{
              __html: !isLeftPanel ? 
                applyDiffHighlighting(content, mermaidDiffs, 'mermaid') : 
                highlightMermaidDiff(content)
            }}
          />
        );
      case 'JSON':
        const jsonDiffs = !isLeftPanel ? findDifferences(leftJsonContent, jsonContent) : [];
        return (
          <div 
            className="panel-json"
            dangerouslySetInnerHTML={{
              __html: !isLeftPanel
                ? applyDiffHighlighting(jsonContent, jsonDiffs, 'json')
                : jsonContent
                    .split('\n')
                    .map(line => `<div class="code-line">${highlightJsonDiff(line)}</div>`)
                    .join('\n')
            }}
          />
        );
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
            <span>{`${left?.title} - ${leftVersion}`}<FaCheckCircle 
                style={{ 
                  color: '#3b82f6',
                  marginLeft: '8px',
                  fontSize: '16px'
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
