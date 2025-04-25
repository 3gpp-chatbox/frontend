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
  
  // Extract style definitions
  const styleLines = lines.filter(line => line.startsWith('classDef'));
  
  // Remove flowchart declarations but keep style definitions
  lines = lines.filter(line => {
    const isFlowchart = line.startsWith('flowchart') || line.startsWith('graph');
    return !isFlowchart;
  });
  
  // Add flowchart declaration and styles at the start
  lines.unshift('flowchart TD');
  if (styleLines.length > 0) {
    lines.splice(1, 0, ...styleLines);
  }
  
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
  const lastViewStateRef = useRef({ scale: 1, position: { x: 0, y: 0 }, zoomLevel: 100 });

  const renderDiagram = useCallback(async () => {
    if (!mermaidRef.current || !mermaidCode) {
      setError(null);
      return;
    }

    try {
      // Clean up the mermaid code before rendering
      const cleanedCode = cleanMermaidCode(mermaidCode);
      
      // Clear the container and error state before rendering
      mermaidRef.current.innerHTML = '';
      setError(null);
      
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
      
      // Restore the previous view state
      setScale(lastViewStateRef.current.scale);
      setZoomLevel(lastViewStateRef.current.zoomLevel);
      setPosition(lastViewStateRef.current.position);
      
    } catch (err) {
      console.error("Error rendering diagram:", err);
      setError(err.message || "Error rendering diagram");
      // Clear the container when there's an error
      if (mermaidRef.current) {
        mermaidRef.current.innerHTML = '';
      }
    }
  }, [mermaidCode]);

  // Save view state when it changes
  useEffect(() => {
    lastViewStateRef.current = {
      scale,
      position,
      zoomLevel
    };
  }, [scale, position, zoomLevel]);

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

  // Handle zooming
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY;
    const newScale = Math.min(
      Math.max(scale + (delta > 0 ? -ZOOM_SPEED : ZOOM_SPEED), MIN_SCALE),
      MAX_SCALE
    );
    setScale(newScale);
    setZoomLevel(Math.round(newScale * 100));
  }, [scale]);

  // Handle dragging
  const handleMouseDown = useCallback((e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  }, [position]);

  const handleMouseMove = useCallback((e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add event listeners for dragging
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.addEventListener('wheel', handleWheel, { passive: false });
      containerRef.current.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);

      return () => {
        containerRef.current?.removeEventListener('wheel', handleWheel);
        containerRef.current?.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [handleWheel, handleMouseDown, handleMouseMove, handleMouseUp]);

  return (
    <div className="section-container">
      <div className="section-header">
        <span>Flow Diagram</span>
        <div className="diagram-controls">
          <span>Zoom: {zoomLevel}%</span>
          <button onClick={() => {
            const newScale = 1;
            const newPosition = { x: 0, y: 0 };
            setScale(newScale);
            setZoomLevel(100);
            setPosition(newPosition);
            lastViewStateRef.current = { scale: newScale, position: newPosition, zoomLevel: 100 };
          }}>Reset View</button>
        </div>
      </div>
      <div
        ref={containerRef}
        className="content-area diagram-container"
        style={{ overflow: "hidden" }}
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