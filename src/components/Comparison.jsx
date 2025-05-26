import React, { useState, useEffect, useRef } from 'react';
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
  const leftPanelRef = useRef(null);
  const rightPanelRef = useRef(null);
  const isSyncingScroll = useRef(false);

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
        console.error('Error parsing JSON:', error);
      }
    }
  }, [left]);

  // Fetch versions when component mounts or when procedure changes
  useEffect(() => {
    if (selectedProcedure?.id) {
      fetchVersions();
    }
  }, [selectedProcedure?.id, selectedProcedure?.version]);

  // Fetch selected version data when version changes
  useEffect(() => {
    if (selectedVersion && selectedProcedure?.id) {
      fetchVersionData();
    }
  }, [selectedVersion, selectedProcedure?.id]);

  const fetchVersions = async () => {
    try {
      setVersions([]); 
      const data = await fetchVersionHistory(
        selectedProcedure.id,
        selectedProcedure.entity
      );
      setVersions(data || []);
      // Reset selected version when versions change
      setSelectedVersion(null);
      setRightGraphData(null);
      setRightMermaidContent('');
      setRightJsonContent('');
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

  const handleSyncScroll = (source) => (e) => {
    if (isSyncingScroll.current) return;
    isSyncingScroll.current = true;
    const otherPanel = source === 'left' ? rightPanelRef.current : leftPanelRef.current;
    if (otherPanel) {
      otherPanel.scrollTop = e.target.scrollTop;
    }
    setTimeout(() => { isSyncingScroll.current = false; }, 0);
  };

  const filterMermaidClassDef = (content) =>
    content
      .split('\n')
      .filter(line => !line.trim().startsWith('classDef'))
      .join('\n');

  const renderPanelContent = (content, mermaidContent, jsonContent, isLeftPanel = false) => {
    switch (selectedTab) {
      case 'Mermaid':
        // Filter out classDef lines
        const mermaidDiffs = !isLeftPanel ? findDifferences(leftMermaidContent, content) : [];
        const filteredContent = filterMermaidClassDef(content);
        if (!isLeftPanel) {
          // For diff view, add line numbers to each code-line div in the diff output
          const diffHtml = applyDiffHighlighting(filteredContent, mermaidDiffs, 'mermaid');
          // Add line numbers to each code-line
          return (
            <div
              className="panel-mermaid"
              dangerouslySetInnerHTML={{
                __html: diffHtml.replace(/<div class=\"code-line\">/g, (m, offset, str) => {
                  const lineNum = (str.slice(0, offset).match(/<div class=\"code-line\">/g) || []).length + 1;
                  return `<div class=\"code-line\"><span class=\"line-number\">${lineNum}</span>`;
                })
              }}
            />
          );
        } else {
          // For left panel, split and add line numbers
          return (
            <div
              className="panel-mermaid"
              dangerouslySetInnerHTML={{
                __html: content
                  .split('\n')
                  .map((line, idx) => `<div class=\"code-line\"><span class=\"line-number\">${idx + 1}</span>${highlightMermaidDiff(line)}</div>`)
                  .join('\n')
              }}
            />
          );
        }
      case 'JSON':
        const jsonDiffs = !isLeftPanel ? findDifferences(leftJsonContent, jsonContent) : [];
        if (!isLeftPanel) {
          // For diff view, add line numbers to each code-line div in the diff output
          const diffHtml = applyDiffHighlighting(jsonContent, jsonDiffs, 'json');
          return (
            <div
              className="panel-json"
              dangerouslySetInnerHTML={{
                __html: diffHtml.replace(/<div class=\"code-line\">/g, (m, offset, str) => {
                  const lineNum = (str.slice(0, offset).match(/<div class=\"code-line\">/g) || []).length + 1;
                  return `<div class=\"code-line\"><span class=\"line-number\">${lineNum}</span>`;
                })
              }}
            />
          );
        } else {
          // For left panel, split and add line numbers
          return (
            <div
              className="panel-json"
              dangerouslySetInnerHTML={{
                __html: jsonContent
                  .split('\n')
                  .map((line, idx) => `<div class=\"code-line\"><span class=\"line-number\">${idx + 1}</span>${highlightJsonDiff(line)}</div>`)
                  .join('\n')
              }}
            />
          );
        }
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
          <div className="panel-content" ref={leftPanelRef} onScroll={handleSyncScroll('left')}>
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
          <div className="panel-content" ref={rightPanelRef} onScroll={handleSyncScroll('right')}>
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
