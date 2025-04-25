import { useEffect, useRef, useState, useCallback } from "react";
import PropTypes from "prop-types";
import mermaid from "mermaid";

// Constants for zoom control
const MIN_SCALE = 0.2;
const MAX_SCALE = 6;
const ZOOM_SPEED = 0.1;

function ModalDiagram({ mermaidCode }) {
  const mermaidRef = useRef(null);
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [error, setError] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(100);

  // Initialize mermaid with a unique ID for this instance
  useEffect(() => {
    const init = async () => {
      try {
        await mermaid.initialize({
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
        console.log("Mermaid initialized for modal");
      } catch (err) {
        console.error("Error initializing Mermaid:", err);
        setError("Failed to initialize diagram renderer");
      }
    };
    init();
  }, []);

  const renderDiagram = useCallback(async () => {
    if (!mermaidRef.current || !mermaidCode) {
      console.log("No ref or code available");
      return;
    }

    try {
      console.log("Attempting to render diagram with code:", mermaidCode);
      mermaidRef.current.innerHTML = "";
      setError(null);

      const uniqueId = `modal-mermaid-${Date.now()}`;
      const { svg } = await mermaid.render(uniqueId, mermaidCode);
      console.log("Diagram rendered successfully");

      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = svg;
      const newSvg = tempDiv.querySelector("svg");

      // Set dimensions and styling
      newSvg.style.width = "100%";
      newSvg.style.height = "100%";
      newSvg.style.minWidth = "800px";
      newSvg.style.minHeight = "600px";
      newSvg.style.display = "block";

      mermaidRef.current.appendChild(newSvg);
    } catch (err) {
      console.error("Error rendering diagram:", err);
      setError(err.message || "Error rendering diagram");
      if (mermaidRef.current) {
        mermaidRef.current.innerHTML = "";
      }
    }
  }, [mermaidCode]);

  // Render diagram when code changes
  useEffect(() => {
    console.log("Mermaid code changed, rendering diagram");
    renderDiagram();
  }, [renderDiagram]);

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
    <div
      className="modal-diagram-container"
      style={{
        width: "90%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        backgroundColor: "#1a1a1a",
      }}
    >
      <div
        className="diagram-controls"
        style={{
          padding: "8px",
          borderBottom: "1px solid #333",
          display: "flex",
          gap: "8px",
          alignItems: "center",
        }}
      >
        <span style={{ color: "#f4f4f5" }}>Zoom: {zoomLevel}%</span>
        <button
          onClick={() => {
            setScale(1);
            setZoomLevel(100);
            setPosition({ x: 0, y: 0 });
          }}
          style={{
            padding: "4px 8px",
            backgroundColor: "#3b82f6",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Reset View
        </button>
      </div>
      <div
        ref={containerRef}
        className="diagram-view-area"
        style={{
          position: "relative",
          overflow: "hidden",
          flex: 1,
          cursor: isDragging ? "grabbing" : "grab",
          backgroundColor: "#1a1a1a",
        }}
      >
        {error ? (
          <div
            className="error-overlay"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0,0,0,0.7)",
            }}
          >
            <div
              className="error-content"
              style={{
                padding: "20px",
                backgroundColor: "#27272a",
                borderRadius: "8px",
                color: "#ef4444",
              }}
            >
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
              backgroundColor: "#1a1a1a",
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
