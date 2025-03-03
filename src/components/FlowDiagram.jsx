import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

// Initialize mermaid with enhanced settings
mermaid.initialize({
  startOnLoad: true,
  theme: 'dark',
  securityLevel: 'loose',
  flowchart: {
    curve: 'basis',
    nodeSpacing: 50,
    rankSpacing: 70,
    edgeLengthFactor: 1,
    useMaxWidth: true,
    htmlLabels: true,
    defaultRenderer: 'dagre',
  },
  themeVariables: {
    primaryColor: '#3b82f6',
    primaryTextColor: '#f4f4f5',
    primaryBorderColor: '#1d4ed8',
    lineColor: '#60a5fa',
    secondaryColor: '#1d4ed8',
    tertiaryColor: '#27272a',
    fontSize: '16px'
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
    if (!mermaidRef.current || !mermaidCode) {
      console.log('FlowDiagram: Missing ref or code:', { 
        hasRef: !!mermaidRef.current, 
        code: mermaidCode 
      });
      return;
    }
    
    try {
      console.log('FlowDiagram: Attempting to render diagram with code:', mermaidCode);
      
      // Clear previous content and error
      mermaidRef.current.innerHTML = '';
      setError(null);

      // Create a unique ID for this render
      const id = `mermaid-${Date.now()}`;
      
      // Render the diagram
      const { svg } = await mermaid.render(id, mermaidCode);
      console.log('FlowDiagram: Successfully generated SVG');
      
      // Update the DOM
      mermaidRef.current.innerHTML = svg;
      svgRef.current = mermaidRef.current.querySelector('svg');
      
      if (svgRef.current) {
        // Make SVG responsive and fit container
        svgRef.current.setAttribute('width', '100%');
        svgRef.current.setAttribute('height', '100%');
        svgRef.current.style.maxWidth = '100%';
        svgRef.current.style.maxHeight = '100%';
        
        // Style the diagram
        styleDiagram();
        
        // Center and scale the diagram
        fitDiagramToContainer();
      }
    } catch (error) {
      console.error('FlowDiagram: Error rendering diagram:', error);
      setError(error.message);
      if (mermaidRef.current) {
        mermaidRef.current.innerHTML = `
          <div class="error-message">
            Failed to render diagram: ${error.message}
            <br/>
            <pre>${error.str || ''}</pre>
          </div>
        `;
      }
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

    // Calculate scale to fit
    const scaleX = (containerRect.width * 0.9) / svgRect.width;
    const scaleY = (containerRect.height * 0.9) / svgRect.height;
    const newScale = Math.min(scaleX, scaleY, 1); // Don't scale up beyond 1

    // Calculate position to center
    const centerX = (containerRect.width - (svgRect.width * newScale)) / 2;
    const centerY = (containerRect.height - (svgRect.height * newScale)) / 2;

    setScale(newScale);
    setPosition({ x: centerX, y: centerY });
  };

  useEffect(() => {
    console.log('FlowDiagram: mermaidCode changed:', mermaidCode);
    renderDiagram();
  }, [mermaidCode]);

  // Set up wheel event listener with passive: false
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      e.preventDefault();
      const delta = e.deltaY * -0.01;
      const newScale = Math.min(Math.max(scale + delta, 0.5), 3);
      setScale(newScale);
    };

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [scale]);

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