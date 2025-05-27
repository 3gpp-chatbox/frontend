import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { fetchGraphVersion, fetchVersionHistory } from '../API/api_calls';
import { JsonToMermaid, defaultMermaidConfig } from '../functions/jsonToMermaid';
import DiagramView from '../utils/DiagramView';
import { FaCheckCircle } from 'react-icons/fa';
import { highlightJson } from '../utils/jsonHighlighter';
import { highlightMermaid } from '../utils/MermaidHighlighter';
import { computeLineDiffs } from '../functions/diffHighlighter';

// Helper to render a diff panel (left or right)
const renderDiffPanel = (diffs, side, highlighter) => (
  <div className="panel-mermaid">
    {diffs.map((diff, idx) => {
      let line, type;
      if (side === 'left') {
        line = diff.left;
        type = diff.type === 'added' ? 'empty' : diff.type;
      } else {
        line = diff.right;
        type = diff.type === 'removed' ? 'empty' : diff.type;
      }
      if (type === 'empty') return <div className="code-line" key={idx}><span className="line-number">{idx+1}</span>&nbsp;</div>;
      let className = 'code-line';
      if (type === 'added') className += ' diff-added';
      if (type === 'removed') className += ' diff-removed';
      if (type === 'modified') className += (side === 'left' ? ' diff-removed' : ' diff-added');
      return (
        <div className={className} key={idx}>
          <span className="line-number">{idx+1}</span>
          <span dangerouslySetInnerHTML={{ __html: highlighter(line) }} />
        </div>
      );
    })}
  </div>
);

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
  const [isRightPanelReady, setIsRightPanelReady] = useState(false);

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
    // setIsRightPanelReady(false); // Reset when version changes
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
        setIsRightPanelReady(true); // Mark right panel as ready after data is loaded
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

  const renderPanelContent = (side) => {
    switch (selectedTab) {
      case 'Mermaid': {
        const leftFiltered = filterMermaidClassDef(leftMermaidContent);
        const rightFiltered = filterMermaidClassDef(rightMermaidContent);
        const diffs = computeLineDiffs(leftFiltered, rightFiltered);
        return renderDiffPanel(diffs, side, highlightMermaid);
      }
      case 'JSON': {
        const diffs = computeLineDiffs(leftJsonContent, rightJsonContent);
        return renderDiffPanel(diffs, side, highlightJson);
      }
      case 'Diagram':
        return (
          <div className="panel-graph" style={{ height: '100%', minHeight: '400px', position: 'relative' }}>
            {side === 'left' ? (
              leftMermaidContent ? (
                <DiagramView 
                  key={`mermaid-left-${selectedTab}-${leftMermaidContent.length}`}
                  mermaidCode={leftMermaidContent}
                  showControls={true}
                  showZoomLevel={true}
                  side={side}
                  highlightedElement={null}
                />
              ) : 'No graph content available'
            ) : (
              rightMermaidContent ? (
                <DiagramView 
                  key={`mermaid-right-${selectedTab}-${rightMermaidContent.length}`}
                  mermaidCode={rightMermaidContent}
                  showControls={true}
                  showZoomLevel={true}
                  side={side}
                  highlightedElement={null}
                />
              ) : 'No graph content available'
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
        {/* Left Panel */}
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
            {renderPanelContent('left')}
          </div>
        </div>

        {/* Right Panel */}
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
            {renderPanelContent('right')}
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
