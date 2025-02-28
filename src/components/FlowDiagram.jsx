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

function FlowDiagram({ mermaidCode, procedure }) {
  const mermaidRef = useRef(null);
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const renderDiagram = async (code) => {
    if (!mermaidRef.current || !code) return;
    
    try {
      const { svg } = await mermaid.render('mermaid-diagram', code);
      mermaidRef.current.innerHTML = svg;
      svgRef.current = mermaidRef.current.querySelector('svg');
      
      if (svgRef.current) {
        // Make SVG responsive and fit container
        svgRef.current.setAttribute('width', '100%');
        svgRef.current.setAttribute('height', '100%');
        svgRef.current.style.maxWidth = '100%';
        svgRef.current.style.maxHeight = '100%';
        
        // Enhance edges and arrows
        const edges = svgRef.current.querySelectorAll('.edge path');
        edges.forEach(edge => {
          edge.style.strokeWidth = '3px';
          edge.style.stroke = '#60a5fa';
        });

        // Make arrowheads larger and more visible
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

        // Style nodes
        const nodes = svgRef.current.querySelectorAll('.node');
        nodes.forEach(node => {
          const rect = node.querySelector('rect');
          if (rect) {
            rect.setAttribute('rx', '8');
            rect.setAttribute('ry', '8');
          }
        });

        // Center and scale the diagram to fit
        fitDiagramToContainer();
      }
    } catch (error) {
      console.error('Error rendering diagram:', error);
    }
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
    renderDiagram(mermaidCode);
  }, [mermaidCode]);

  // Auto-render from JSON if mermaid code is not available
  useEffect(() => {
    if (!mermaidCode && procedure) {
      const convertJsonToMermaid = (json) => {
        if (!json || !json.nodes || !json.edges) return "";
        let mermaidStr = "graph TD\n";
        json.nodes.forEach(node => {
          mermaidStr += `  ${node.id}["${node.label || node.id}"]\n`;
        });
        json.edges.forEach(edge => {
          mermaidStr += `  ${edge.source} -->|${edge.label}| ${edge.target}\n`;
        });
        return mermaidStr;
      };
      
      const autoMermaidCode = convertJsonToMermaid(procedure);
      renderDiagram(autoMermaidCode);
    }
  }, [procedure, mermaidCode]);

  const handleWheel = (e) => {
    if (!containerRef.current.contains(e.target)) return;
    
    // Prevent default scroll behavior
    e.preventDefault();
    e.stopPropagation();
    
    const delta = e.deltaY * -0.01;
    const newScale = Math.min(Math.max(scale + delta, 0.5), 3);
    setScale(newScale);
  };

  const resetView = () => {
    if (!containerRef.current || !svgRef.current) return;
    fitDiagramToContainer();
  };

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
          <button onClick={resetView}>Reset View</button>
        </div>
      </div>
      <div 
        ref={containerRef}
        className="content-area diagram-container"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div 
          className="flow-diagram" 
          ref={mermaidRef}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: 'center center',
            cursor: isDragging ? 'grabbing' : 'grab'
          }}
        />
      </div>
    </div>
  );
}

export default FlowDiagram;