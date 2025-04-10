import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

// Initialize mermaid with enhanced settings
mermaid.initialize({
  startOnLoad: true,
  theme: "default",
  logLevel: "error",
  securityLevel: "loose",
  flowchart: {
    curve: "basis",
    nodeSpacing: 50,
    rankSpacing: 50,
    padding: 10,
    useMaxWidth: true,
    htmlLabels: true,
  },
  themeVariables: {
    primaryColor: "#3b82f6",
    primaryTextColor: "#f4f4f5",
    primaryBorderColor: "#1d4ed8",
    lineColor: "#60a5fa",
    secondaryColor: "#1d4ed8",
    tertiaryColor: "#27272a",
  },
});

// Add zoom controls and constants
const MIN_SCALE = 0.1;
const MAX_SCALE = 5;
const ZOOM_SPEED = 0.1;

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

  const renderDiagram = async () => {
    if (!mermaidRef.current || !mermaidCode) {
      return;
    }

    try {
      console.log("Rendering diagram with code:", mermaidCode);
      mermaidRef.current.innerHTML = "";
      setError(null);

      const { svg } = await mermaid.render("mermaid-diagram", mermaidCode);
      mermaidRef.current.innerHTML = svg;
    } catch (err) {
      console.error("Error rendering diagram:", err);
      setError(err.message);
      mermaidRef.current.innerHTML = "Error rendering diagram";
    }
  };

  const styleDiagram = () => {
    if (!svgRef.current) return;

    // Style nodes
    const nodes = svgRef.current.querySelectorAll(".node");
    nodes.forEach((node) => {
      const rect = node.querySelector("rect");
      if (rect) {
        rect.setAttribute("rx", "8");
        rect.setAttribute("ry", "8");
      }
    });

    // Style edges
    const edges = svgRef.current.querySelectorAll(".edge path");
    edges.forEach((edge) => {
      edge.style.strokeWidth = "3px";
      edge.style.stroke = "#60a5fa";
    });

    // Style arrowheads
    const markers = svgRef.current.querySelectorAll("marker");
    markers.forEach((marker) => {
      marker.setAttribute("markerWidth", "15");
      marker.setAttribute("markerHeight", "15");
      marker.setAttribute("refX", "15");
      const markerPath = marker.querySelector("path");
      if (markerPath) {
        markerPath.setAttribute("fill", "#60a5fa");
        markerPath.setAttribute("stroke", "#60a5fa");
      }
    });
  };

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

  // Update zoom function to be more controlled
  const handleZoom = (delta, mousePosition = null) => {
    const oldScale = scale;
    const newScale = Math.min(
      Math.max(scale + delta * ZOOM_SPEED, MIN_SCALE),
      MAX_SCALE,
    );

    if (mousePosition && containerRef.current) {
      // Zoom towards mouse position
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
  };

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
  }, [scale, position]);

  // Add zoom control buttons
  const zoomIn = () => handleZoom(1);
  const zoomOut = () => handleZoom(-1);
  const resetZoom = () => {
    setScale(1);
    setZoomLevel(100);
    fitDiagramToContainer();
  };

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

  useEffect(() => {
    renderDiagram();
  }, [mermaidCode]);

  return (
    <div className="section-container">
      <div className="section-header">
        <span>Flow Diagram</span>
        <div className="diagram-controls">
          <button onClick={zoomOut} title="Zoom Out">
            -
          </button>
          <span className="zoom-level">{zoomLevel}%</span>
          <button onClick={zoomIn} title="Zoom In">
            +
          </button>
          <button onClick={resetZoom}>Reset View</button>
          <button onClick={renderDiagram}>Refresh</button>
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

export default FlowDiagram;
