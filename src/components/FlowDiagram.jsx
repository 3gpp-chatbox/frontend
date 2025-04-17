import { useEffect, useRef, useState, useCallback } from "react";
import PropTypes from "prop-types";
import mermaid from "mermaid";

// Initialize mermaid with optimized settings
mermaid.initialize({
  startOnLoad: true,
  theme: "dark",
  logLevel: "error",
  securityLevel: "loose",
  flowchart: {
    curve: "basis",
    nodeSpacing: 100,
    rankSpacing: 100,
    padding: 20,
    useMaxWidth: false,
    htmlLabels: true,
  },
  themeVariables: {
    primaryColor: "#3b82f6",
    primaryTextColor: "#f4f4f5",
    primaryBorderColor: "#1d4ed8",
    lineColor: "#60a5fa",
    secondaryColor: "#1d4ed8",
    tertiaryColor: "#27272a",
    mainBkg: "#1a1a1a",
    nodeBorder: "#3b82f6",
    clusterBkg: "#1a1a1a",
    titleColor: "#f4f4f5",
    edgeLabelBackground: "#1a1a1a",
    textColor: "#f4f4f5",
  },
});

// Add zoom controls and constants
const MIN_SCALE = 0.1;
const MAX_SCALE = 5;
const ZOOM_SPEED = 0.1;

// Clean up mermaid code by removing extra whitespace and ensuring proper formatting
const cleanMermaidCode = (code) => {
  if (!code) return "";
  
  // Split into lines and filter out empty lines
  let lines = code.split('\n')
    .map(line => line.trim())
    .filter(Boolean);
  
  // Remove any existing flowchart/graph declarations
  lines = lines.filter(line => {
    const isFlowchart = line.startsWith('flowchart') || line.startsWith('graph');
    return !isFlowchart;
  });
  
  // Add single flowchart declaration at the start
  lines.unshift('flowchart TD');
  
  // Clean up class definitions and other special lines
  lines = lines.map(line => {
    // Handle class definitions
    if (line.startsWith('classDef')) {
      return line.replace(/\s+/g, ' ');
    }
    
    // Handle node definitions and connections
    if (line.includes('-->') || line.includes('---')) {
      return line.replace(/\s+/g, ' ').trim();
    }
    
    return line;
  });
  
  // Join lines with proper spacing
  return lines.join('\n');
};

function FlowDiagram({ mermaidCode }) {
  const mermaidRef = useRef(null);
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [error, setError] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(100);

  const renderDiagram = useCallback(async () => {
    if (!mermaidRef.current || !mermaidCode) return;

    try {
      // Clean up the mermaid code before rendering
      const cleanedCode = cleanMermaidCode(mermaidCode);
      
      // Clear the container before rendering
      mermaidRef.current.innerHTML = '';
      
      // Render new diagram
      const { svg } = await mermaid.render("mermaid-diagram", cleanedCode);
      
      // Create temporary div to hold SVG
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = svg;
      const newSvg = tempDiv.querySelector("svg");
      
      // Set fixed dimensions for SVG
      newSvg.style.width = "100%";
      newSvg.style.height = "100%";
      newSvg.style.minWidth = "800px"; // Set minimum width
      newSvg.style.minHeight = "600px"; // Set minimum height
      
      // Ensure viewBox is set correctly
      if (!newSvg.getAttribute("viewBox")) {
        const bbox = newSvg.getBBox();
        newSvg.setAttribute("viewBox", `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`);
      }
      
      // Add the SVG to the container
      mermaidRef.current.appendChild(newSvg);
      
      // Reset zoom and position
      setScale(1);
      setZoomLevel(100);
      setPosition({ x: 0, y: 0 });
      
      setError(null);
    } catch (err) {
      console.error("Error rendering diagram:", err);
      setError(err.message || "Error rendering diagram");
    }
  }, [mermaidCode]);

  // Add useEffect to handle initial render and window resize
  useEffect(() => {
    const handleResize = () => {
      renderDiagram();
    };

    window.addEventListener('resize', handleResize);
    renderDiagram();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [renderDiagram]);

  const fitDiagramToContainer = () => {
    if (!containerRef.current || !svgRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const svgRect = svgRef.current.getBoundingClientRect();

    const scaleX = (containerRect.width * 0.9) / svgRect.width;
    const scaleY = (containerRect.height * 0.9) / svgRect.height;
    const newScale = Math.min(scaleX, scaleY, 1);

    const centerX = (containerRect.width - svgRect.width * newScale) / 2;
    const centerY = (containerRect.height - svgRect.height * newScale) / 2;

    setScale(newScale);
    setPosition({ x: centerX, y: centerY });
  };

  // Handle zoom
  const handleZoom = useCallback(
    (delta, mousePosition = null) => {
      const oldScale = scale;
      const newScale = Math.min(
        Math.max(scale + delta * ZOOM_SPEED, MIN_SCALE),
        MAX_SCALE,
      );

      if (mousePosition && containerRef.current) {
        const container = containerRef.current.getBoundingClientRect();
        const mouseX = mousePosition.x - container.left;
        const mouseY = mousePosition.y - container.top;

        const newPosition = {
          x:
            position.x -
            ((mouseX - position.x) * (newScale - oldScale)) / oldScale,
          y:
            position.y -
            ((mouseY - position.y) * (newScale - oldScale)) / oldScale,
        };

        setPosition(newPosition);
      }

      setScale(newScale);
      setZoomLevel(Math.round(newScale * 100));
    },
    [scale, position],
  );

  // Handle wheel zoom
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      e.preventDefault();
      const delta = -Math.sign(e.deltaY);
      handleZoom(delta, { x: e.clientX, y: e.clientY });
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [handleZoom]);

  // Add zoom control buttons
  const zoomIn = () => handleZoom(1);
  const zoomOut = () => handleZoom(-1);

  // Handle drag
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
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
          <button onClick={zoomOut} title="Zoom Out">-</button>
          <span className="zoom-level">{zoomLevel}%</span>
          <button onClick={zoomIn} title="Zoom In">+</button>
          <button onClick={() => {
            setScale(1);
            setZoomLevel(100);
            setPosition({ x: 0, y: 0 });
          }}>Reset View</button>
        </div>
      </div>
      <div
        ref={containerRef}
        className="content-area diagram-container"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
          height: '100%',
          minHeight: '600px'
        }}
      >
        {error ? (
          <div className="error-overlay">
            <div className="error-content">
              <h3>Error Rendering Diagram</h3>
              <p className="error-message">{error}</p>
            </div>
          </div>
        ) : (
          <div
            ref={mermaidRef}
            style={{
              position: "absolute",
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              transformOrigin: "center center",
              width: "100%",
              height: "100%",
              cursor: isDragging ? "grabbing" : "grab",
            }}
          />
        )}
      </div>
    </div>
  );
}

FlowDiagram.propTypes = {
  mermaidCode: PropTypes.string,
};

export default FlowDiagram;