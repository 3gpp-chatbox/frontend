import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import mermaid from "mermaid";
import { MdRefresh } from "react-icons/md";

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
    fontSize: "18px",
  },
});

// Add zoom controls and constants
const MIN_SCALE = 0.1;
const MAX_SCALE = 10;
const ZOOM_SPEED = 0.1;

/**
 * Component for rendering and interacting with Mermaid flow diagrams.
 * Provides zoom, pan, and click interactions with diagram elements.
 *
 * @component
 * @param {Object} props - Component properties
 * @param {string} props.mermaidCode - The Mermaid diagram code to render
 * @param {string} [props.direction='TD'] - Diagram direction ('TD', 'TB', 'BT', 'LR', 'RL')
 * @param {Function} props.onElementClick - Callback for element click events
 * @returns {JSX.Element} The rendered flow diagram
 */
function FlowDiagram({ mermaidCode, direction = "TD", onElementClick }) {
  const mermaidRef = useRef(null);
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [error, setError] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const lastViewStateRef = useRef({
    scale: 1,
    position: { x: 0, y: 0 },
    zoomLevel: 100,
  });

  /**
   * Cleans and formats Mermaid code for rendering.
   * Removes extra whitespace and ensures proper formatting.
   *
   * @param {string} code - Raw Mermaid code
   * @param {string} [direction='TD'] - Diagram direction
   * @returns {string} Cleaned Mermaid code
   */
  const cleanMermaidCode = (code, direction = "TD") => {
  if (!code) return "";
  
  // Split into lines and filter out empty lines
    let lines = code
      .split("\n")
      .map((line) => line.trim())
    .filter(Boolean);
  
  // Extract style definitions
    const styleLines = lines.filter((line) => line.startsWith("classDef"));
  
  // Extract existing direction if present
  let flowDirection = direction;
    lines.forEach((line) => {
    const match = line.match(/flowchart\s+(TD|TB|BT|LR|RL)/);
    if (match) {
      flowDirection = match[1];
    }
  });
  
  // Remove flowchart declarations but keep style definitions
    lines = lines.filter((line) => {
      const isFlowchart =
        line.startsWith("flowchart") || line.startsWith("graph");
    return !isFlowchart;
  });
  
  // Add flowchart declaration with preserved direction and styles at the start
  lines.unshift(`flowchart ${flowDirection}`);
  if (styleLines.length > 0) {
    lines.splice(1, 0, ...styleLines);
  }
  
  // Clean up class definitions and other special lines
    lines = lines.map((line) => {
    // Handle class definitions
      if (line.startsWith("classDef")) {
        return line.replace(/\s+/g, " ");
    }
    
    // Handle node definitions and connections
      if (line.includes("-->") || line.includes("---")) {
        return line.replace(/\s+/g, " ").trim();
    }
    
    return line;
  });
  
  // Join lines with proper spacing
    return lines.join("\n");
  };

  /**
   * Renders the Mermaid diagram and sets up interaction handlers.
   * Handles node and edge click events, visual feedback, and error states.
   *
   * @async
   * @function
   */
  const renderDiagram = useCallback(async () => {
    if (!mermaidRef.current || !mermaidCode) {
      setError(null);
      return;
    }

    try {
      // Clear existing content before rendering
      mermaidRef.current.innerHTML = "";
      setError(null);

      const cleanedCode = cleanMermaidCode(mermaidCode, direction);
      
      // Generate unique ID for this render
      const diagramId = `mermaid-diagram-${Date.now()}`;
      const { svg } = await mermaid.render(diagramId, cleanedCode);
      
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = svg;
      const newSvg = tempDiv.querySelector("svg");
      
      if (!newSvg) {
        throw new Error("Failed to generate SVG");
      }

      // Remove any existing SVG before adding the new one
      const existingSvg = mermaidRef.current.querySelector("svg");
      if (existingSvg) {
        existingSvg.remove();
      }

      // Set up click handlers
      setupClickHandlers(newSvg, cleanedCode);
      
      // Set fixed dimensions for SVG
      newSvg.style.width = "100%";
      newSvg.style.height = "100%";
      newSvg.style.minWidth = "800px";
      newSvg.style.minHeight = "600px";

      mermaidRef.current.appendChild(newSvg);
      
      // Restore view state
      setScale(lastViewStateRef.current.scale);
      setZoomLevel(lastViewStateRef.current.zoomLevel);
      setPosition(lastViewStateRef.current.position);
    } catch (err) {
      console.error("Error rendering diagram:", err);
      setError(err.message || "Error rendering diagram");
      if (mermaidRef.current) {
        mermaidRef.current.innerHTML = "";
      }
    }
  }, [mermaidCode, direction, onElementClick]);

  // Extract click handler setup to a separate function
  const setupClickHandlers = useCallback((svg, cleanedCode) => {
    // Set up node click handlers
    svg.querySelectorAll(".node").forEach((element) => {
      element.style.cursor = "pointer";
      element.addEventListener("click", (e) => {
        e.stopPropagation();
        const nodeId = element.id.replace(/^flowchart-/, '');
        const nodeText = element.querySelector(".label")?.textContent;
        
        // Extract references from comments
        let sectionRef = "";
        let textRef = "";
        const lines = cleanedCode.split("\n");
        let foundNode = false;
        
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line.match(new RegExp(`^[A-Z]\\["${nodeText}"\\]`)) || 
              line.match(new RegExp(`^[A-Z]\\["${nodeId}"\\]`)) ||
              line.match(new RegExp(`^[A-Z]\\(\\("${nodeText}"\\)\\)`)) ||
              line.match(new RegExp(`^[A-Z]\\(\\("${nodeId}"\\)\\)`))) {
            foundNode = true;
            continue;
          }
          if (foundNode) {
            if (line.startsWith('%% Section_Reference:')) {
              sectionRef = line.replace('%% Section_Reference:', '').trim();
            } else if (line.startsWith('%% Text_Reference:')) {
              textRef = line
                .replace(/^%%\s*Text_Reference:\s*/i, '')
                .replace(/^Looking for text:\s*/i, '')
                .trim();
            }
            if (line.match(/^[A-Z][\[\(]/)) break;
          }
        }

        onElementClick?.({
          type: "node",
          id: nodeId,
          text: nodeText,
          section_ref: sectionRef,
          text_ref: textRef
        });
      });
    });

    // Handle edge labels
    svg.querySelectorAll(".edgeLabel").forEach((edgeLabel) => {
      edgeLabel.style.cursor = "pointer";
      
      edgeLabel.addEventListener("click", (e) => {
        e.stopPropagation();
        const edgeLabelText = edgeLabel.textContent.trim();
        
        let sectionRef = "";
        let textRef = "";
        const lines = cleanedCode.split("\n");
        let foundEdge = false;
        
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line.includes("-->") && line.includes(edgeLabelText)) {
            foundEdge = true;
            for (let j = i + 1; j < lines.length; j++) {
              const commentLine = lines[j].trim();
              if (commentLine.startsWith('%% Section_Reference:')) {
                sectionRef = commentLine.replace('%% Section_Reference:', '').trim();
              } else if (commentLine.startsWith('%% Text_Reference:')) {
                textRef = commentLine
                  .replace(/^%%\s*Text_Reference:\s*/i, '')
                  .replace(/^Looking for text:\s*/i, '')
                  .trim();
              }
              if (commentLine.match(/^[A-Z][\[\(]/) || !commentLine.startsWith('%%')) {
                break;
              }
            }
            break;
          }
        }

        onElementClick?.({
          type: "edge",
          id: edgeLabelText,
          text: edgeLabelText,
          section_ref: sectionRef,
          text_ref: textRef
        });
      });
    });

    // Add click handler for diagram background to deselect
    svg.addEventListener("click", (e) => {
      if (e.target === svg || e.target.tagName === "rect") {
        svg.querySelectorAll(".node, .edgePath").forEach((el) => {
          el.classList.remove("selected");
          const pathEl = el.querySelector("path");
          if (pathEl) pathEl.style.strokeWidth = "";
        });
        onElementClick(null);
      }
    });
  }, [onElementClick]);

  // Save view state when it changes
  useEffect(() => {
    lastViewStateRef.current = {
      scale,
      position,
      zoomLevel,
    };
  }, [scale, position, zoomLevel]);

  // Add useEffect to handle initial render and window resize
  useEffect(() => {
    const handleResize = () => {
      renderDiagram();
    };

    window.addEventListener("resize", handleResize);
    renderDiagram();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [renderDiagram]);

  /**
   * Handles mouse wheel events for zooming.
   *
   * @param {WheelEvent} e - Wheel event
   */
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

  /**
   * Handles mouse down events for dragging.
   *
   * @param {MouseEvent} e - Mouse event
   */
  const handleMouseDown = useCallback(
    (e) => {
      if (e.target.closest(".node") || e.target.closest(".edgePath")) {
        return; // Don't initiate drag if clicking on a node or edge
      }
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    },
    [position],
  );

  /**
   * Handles mouse move events during dragging.
   *
   * @param {MouseEvent} e - Mouse event
   */
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

  /**
   * Handles mouse up events to end dragging.
   */
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add event listeners for dragging
  useEffect(() => {
    const currentRef = containerRef.current;
    if (currentRef) {
      currentRef.addEventListener("wheel", handleWheel, {
        passive: false,
      });
      currentRef.addEventListener("mousedown", handleMouseDown);
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);

      return () => {
        currentRef?.removeEventListener("wheel", handleWheel);
        currentRef?.removeEventListener("mousedown", handleMouseDown);
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [handleWheel, handleMouseDown, handleMouseMove, handleMouseUp]);

  // Add these styles at the end of the component:
  const styles = useMemo(
    () => `
    .node.selected rect {
      stroke:rgb(252, 106, 2) !important;
      stroke-width: 3px !important;
    }

    .edgePath.selected path {
      stroke: #f97316 !important;
      stroke-width: 4px !important;
    }

    .node:hover rect {
      filter: brightness(1.1);
    }



    .edgePath:hover path {
      stroke-width: 4px !important;
      stroke: rgb(252, 106, 2) !important;
    }
  `,
    [],
  );

  // Add the styles to the component
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
    return () => styleSheet.remove();
  }, [styles]);

  // Update the styles
  const additionalStyles = useMemo(
    () => `
    .edgePath {
      pointer-events: all !important;
    }
    .edgePath path {
      pointer-events: all !important;
    }
    .edgeLabel, .edgeLabel * {
      pointer-events: all !important;
    }
  `,
    [],
  );

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = additionalStyles;
    const newSvg = mermaidRef.current?.querySelector("svg");
    if (newSvg) {
      newSvg.appendChild(styleSheet);
    }
    return () => styleSheet.remove();
  }, [additionalStyles]);

  // Add cleanup effect
  useEffect(() => {
    return () => {
      if (mermaidRef.current) {
        mermaidRef.current.innerHTML = "";
      }
    };
  }, []);

  return (
    <div className="section-container">
      <div className="section-header">
        <span>Flow Diagram</span>
        <div className="diagram-controls">
          <span>Zoom: {zoomLevel}%</span>
          <button
            className="reset-button"
            onClick={() => {
            const newScale = 1;
            const newPosition = { x: 0, y: 0 };
            setScale(newScale);
            setZoomLevel(100);
            setPosition(newPosition);
              lastViewStateRef.current = {
                scale: newScale,
                position: newPosition,
                zoomLevel: 100,
              };
            }}
          >
            <MdRefresh className="reset-icon" />
            Reset View
          </button>
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
  direction: PropTypes.oneOf(["TD", "TB", "BT", "LR", "RL"]),
  onElementClick: PropTypes.func,
};

export default FlowDiagram;
