// this is the diagram view for the comparison view
import { useEffect, useRef, useState, useCallback } from "react";
import PropTypes from "prop-types";
import mermaid from "mermaid";
import { FaRedo } from "react-icons/fa";

// Constants for zoom control
const MIN_SCALE = 0.2;
const MAX_SCALE = 6;
const ZOOM_SPEED = 0.1;

// Initialize mermaid once at module level
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

function DiagramView({ mermaidCode }) {
  const mermaidRef = useRef(null);
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [error, setError] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [renderedId, setRenderedId] = useState(null);

  const renderDiagram = useCallback(async () => {
    if (!mermaidRef.current || !mermaidCode) {
      console.log("No ref or code available");
      return;
    }

    try {
      // Clear previous content
      mermaidRef.current.innerHTML = "";
      setError(null);

      // Generate a unique ID for this render
      const uniqueId = `modal-mermaid-${Date.now()}`;
      setRenderedId(uniqueId);

      // Render the diagram
      const { svg } = await mermaid.render(uniqueId, mermaidCode);
      console.log("Diagram rendered successfully");

      // Create a temporary container
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = svg;
      const newSvg = tempDiv.querySelector("svg");

      if (!newSvg) {
        throw new Error("Failed to create SVG element");
      }

      // Set dimensions and styling
      newSvg.style.width = "100%";
      newSvg.style.height = "100%";
      newSvg.style.minWidth = "800px";
      newSvg.style.minHeight = "600px";
      newSvg.style.display = "block";

      // Clear any existing content and append the new SVG
      mermaidRef.current.innerHTML = "";
      mermaidRef.current.appendChild(newSvg);
    } catch (err) {
      console.error("Error rendering diagram:", err);
      setError(err.message || "Error rendering diagram");
      if (mermaidRef.current) {
        mermaidRef.current.innerHTML = "";
      }
    }
  }, [mermaidCode]);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (mermaidRef.current) {
      mermaidRef.current.innerHTML = "";
    }
    if (renderedId) {
      try {
        mermaid.contentLoaded();
      } catch (err) {
        console.error("Error cleaning up mermaid:", err);
      }
    }
  }, [renderedId]);

  // Render diagram when code changes
  useEffect(() => {
    cleanup();
    renderDiagram();
    return cleanup;
  }, [renderDiagram, cleanup]);

  // Handle zooming
  const handleWheel = useCallback(
    (e) => {
      e.preventDefault();
      const delta = e.deltaY;
      const newScale = Math.min(
        Math.max(scale + (delta > 0 ? -ZOOM_SPEED : ZOOM_SPEED), MIN_SCALE),
        MAX_SCALE,
      );
      setScale(newScale);
      setZoomLevel(Math.round(newScale * 100));
    },
    [scale],
  );

  // Handle dragging
  const handleMouseDown = useCallback(
    (e) => {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    },
    [position],
  );

  const handleMouseMove = useCallback(
    (e) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        });
      }
    },
    [isDragging, dragStart],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add event listeners for dragging and zooming
  useEffect(() => {
    const currentRef = containerRef.current;
    if (currentRef) {
      currentRef.addEventListener("wheel", handleWheel, { passive: false });
      currentRef.addEventListener("mousedown", handleMouseDown);
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);

      return () => {
        currentRef.removeEventListener("wheel", handleWheel);
        currentRef.removeEventListener("mousedown", handleMouseDown);
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [handleWheel, handleMouseDown, handleMouseMove, handleMouseUp]);

  return (
    <div className="comparison-diagram-container">
      <div className="comparison-diagram-controls">
        <span>Zoom: {zoomLevel}%</span>
        <button
          onClick={() => {
            setScale(1);
            setZoomLevel(100);
            setPosition({ x: 0, y: 0 });
          }}
        >
          <FaRedo className="reset-icon" />
          Reset View
        </button>
      </div>
      <div
        ref={containerRef}
        className={`comparison-diagram-view-area ${isDragging ? 'dragging' : ''}`}
      >
        {error ? (
          <div className="comparison-diagram-error-overlay">
            <div className="comparison-diagram-error-content">
              <h3>Error Rendering Diagram</h3>
              <p className="comparison-diagram-error-message">{error}</p>
            </div>
          </div>
        ) : (
          <div
            ref={mermaidRef}
            className="comparison-diagram-mermaid-container"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            }}
          />
        )}
      </div>
    </div>
  );
}

ModalDiagram.propTypes = {
  mermaidCode: PropTypes.string.isRequired,
};

export default ModalDiagram;
