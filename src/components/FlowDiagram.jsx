import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

// Initialize mermaid with enhanced settings
mermaid.initialize({
  startOnLoad: true,
  theme: 'dark',
  securityLevel: 'loose',
  logLevel: 1,
  sequence: {
    diagramMarginX: 150,
    diagramMarginY: 10,
    actorMargin: 200,
    width: 200,
    height: 100,
    boxMargin: 20,
    boxTextMargin: 10,
    noteMargin: 15,
    messageMargin: 60,
    mirrorActors: false,
    bottomMarginAdj: 20,
    useMaxWidth: false,
    rightAngles: true,
    showSequenceNumbers: true,
    actorFontSize: 32,
    actorFontFamily: '"Segoe UI", "Roboto", sans-serif',
    actorFontWeight: 'bold',
    noteFontSize: 28,
    noteFontFamily: '"Segoe UI", "Roboto", sans-serif',
    messageFontSize: 28,
    messageFontFamily: '"Segoe UI", "Roboto", sans-serif',
    messageFontWeight: 'bold',
    wrap: true,
    maxMessageWidth: 400,
    noteAlign: 'left',
    layoutDirection: 'LR',
    actorPosition: 'left',
    displayMode: 'compact',
    messageAlign: 'left'
  },
  themeVariables: {
    primaryColor: '#3b82f6',
    primaryTextColor: '#ffffff',
    primaryBorderColor: '#3b82f6',
    lineColor: '#3b82f6',
    secondaryColor: '#1e3a8a',
    tertiaryColor: '#ffffff',
    actorBorder: '#3b82f6',
    actorBackground: '#1e3a8a',
    actorTextColor: '#ffffff',
    actorLineColor: '#3b82f6',
    signalColor: '#3b82f6',
    signalTextColor: '#ffffff',
    labelBoxBkgColor: '#1e3a8a',
    labelBoxBorderColor: '#3b82f6',
    labelTextColor: '#ffffff',
    loopTextColor: '#ffffff',
    noteBorderColor: '#3b82f6',
    noteBkgColor: '#1e3a8a',
    noteTextColor: '#ffffff',
    activationBorderColor: '#3b82f6',
    activationBkgColor: '#1e3a8a',
    sequenceNumberColor: '#ffffff'
  }
});


function FlowDiagram({ mermaidCode }) {
  const mermaidRef = useRef(null);
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [error, setError] = useState(null);

  const renderDiagram = async () => {
    if (!mermaidRef.current || !mermaidCode) return;
    
    try {
      mermaidRef.current.innerHTML = '';
      setError(null);

      const id = `mermaid-${Date.now()}`;
      const { svg } = await mermaid.render(id, mermaidCode);
      
      mermaidRef.current.innerHTML = svg;
      svgRef.current = mermaidRef.current.querySelector('svg');
      
      if (svgRef.current) {
        svgRef.current.setAttribute('width', '100%');
        svgRef.current.setAttribute('height', '100%');
        styleDiagram();
        fitDiagramToContainer();
      }
    } catch (error) {
      console.error('FlowDiagram: Error rendering diagram:', error);
      setError(error.message);
    }
  };

  const styleDiagram = () => {
    if (!svgRef.current) return;

    // Style nodes
    const nodes = svgRef.current.querySelectorAll('.node');
    nodes.forEach(node => {
      const rect = node.querySelector('rect');
      if (rect) {
        rect.setAttribute('rx', '8');
        rect.setAttribute('ry', '8');
      }
    });

    // Style edges
    const edges = svgRef.current.querySelectorAll('.edge path');
    edges.forEach(edge => {
      edge.style.strokeWidth = '3px';
      edge.style.stroke = '#60a5fa';
    });

    // Style arrowheads
    const markers = svgRef.current.querySelectorAll('marker');
    markers.forEach(marker => {
      marker.setAttribute('markerWidth', '15');
      marker.setAttribute('markerHeight', '15');
      marker.setAttribute('refX', '15');
      const markerPath = marker.querySelector('path');
      if (markerPath) {
        markerPath.setAttribute('fill', '#60a5fa');
        markerPath.setAttribute('stroke', '#60a5fa');
      }
    });
  };

  const fitDiagramToContainer = () => {
    if (!containerRef.current || !svgRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const svgRect = svgRef.current.getBoundingClientRect();

    const scaleX = (containerRect.width * 0.9) / svgRect.width;
    const scaleY = (containerRect.height * 0.9) / svgRect.height;
    const newScale = Math.min(Math.max(Math.min(scaleX, scaleY), 0.5), 2);

    const centerX = (containerRect.width - (svgRect.width * newScale)) / 2;
    const centerY = (containerRect.height - (svgRect.height * newScale)) / 2;

    setScale(newScale);
    setPosition({ x: centerX, y: centerY });
  };

  // Handle zoom
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      e.preventDefault();
      const delta = e.deltaY * -0.01;
      const newScale = Math.min(Math.max(scale + delta, 0.5), 10);
      setScale(newScale);
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [scale]);

  // Handle drag
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    renderDiagram();
  }, [mermaidCode]);

  return (
    <div className="section-container">
      <div className="section-header">
        <span>Flow Diagram</span>
        <div className="diagram-controls">
          <button onClick={() => renderDiagram()}>Refresh</button>
          <button onClick={() => fitDiagramToContainer()}>Reset View</button>
        </div>
      </div>
      <div 
        ref={containerRef}
        className="content-area diagram-container"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div 
          ref={mermaidRef}
          style={{
            position: 'absolute',
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: 'center center',
            width: '100%',
            height: '100%',
            cursor: isDragging ? 'grabbing' : 'grab'
          }}
        />
        {error && (
          <div className="error-overlay">
            <div className="error-content">
              {error}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FlowDiagram;