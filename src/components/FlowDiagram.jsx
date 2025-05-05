import { useEffect, useRef, useState, useCallback, useMemo } from "react";
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
const MIN_SCALE = 0.2;
const MAX_SCALE = 10;
const ZOOM_SPEED = 0.1;

// Clean up mermaid code by removing extra whitespace and ensuring proper formatting
const cleanMermaidCode = (code) => {
  if (!code) return "";

  // Split into lines and filter out empty lines
  let lines = code
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  // Extract style definitions
  const styleLines = lines.filter((line) => line.startsWith("classDef"));

  // Remove flowchart declarations but keep style definitions
  lines = lines.filter((line) => {
    const isFlowchart =
      line.startsWith("flowchart") || line.startsWith("graph");
    return !isFlowchart;
  });

  // Add flowchart declaration and styles at the start
  lines.unshift("flowchart TD");
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

function FlowDiagram({ mermaidCode, onElementClick }) {
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

  const renderDiagram = useCallback(async () => {
    if (!mermaidRef.current || !mermaidCode) {
      setError(null);
      return;
    }

    try {
      const cleanedCode = cleanMermaidCode(mermaidCode);
      mermaidRef.current.innerHTML = "";
      setError(null);

      const { svg } = await mermaid.render("mermaid-diagram", cleanedCode);

      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = svg;
      const newSvg = tempDiv.querySelector("svg");

      // Set dimensions
      newSvg.style.width = "100%";
      newSvg.style.height = "100%";
      newSvg.style.minWidth = "800px";
      newSvg.style.minHeight = "600px";

      // Add click handlers for nodes
      newSvg.querySelectorAll(".node").forEach((node) => {
        node.style.cursor = "pointer";
        node.addEventListener("click", (e) => {
          e.stopPropagation();
          const nodeId = node.id;

          // Extract the actual node text from the label
          const labelEl = node.querySelector(".label");
          let nodeText = "";

          if (labelEl) {
            // Remove any HTML tags and get clean text
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = labelEl.innerHTML;
            nodeText = tempDiv.textContent.trim();

            // Remove quotes if present
            nodeText = nodeText.replace(/^["']|["']$/g, "");
          }

          // Add visual feedback for clicked node
          document
            .querySelectorAll(".node")
            .forEach((n) => n.classList.remove("selected"));
          node.classList.add("selected");

          onElementClick({
            type: "node",
            id: nodeId,
            text: nodeText,
            element: node,
          });
        });
      });

      // Add click handlers for edges
      newSvg.querySelectorAll(".edgePath").forEach((edge) => {
        // Function to handle edge click
        const handleEdgeClick = (e) => {
          e.stopPropagation();
          const edgeId = edge.id;

          // Extract source and target nodes from edge ID
          const parts = edgeId.split("-");
          const fromNode = parts[1];
          const toNode = parts[parts.length - 1];

          // Get the edge label if it exists
          const edgeLabelGroup = newSvg.querySelector(`#${edgeId}-label`);
          let edgeLabel = "";

          if (edgeLabelGroup) {
            const labelElement = edgeLabelGroup.querySelector(".edgeLabel");
            if (labelElement) {
              edgeLabel = labelElement.textContent.trim();
              edgeLabel = edgeLabel.replace(/^[|"'\s]+|[|"'\s]+$/g, "");
            }
          }

          // Add visual feedback for clicked edge
          newSvg.querySelectorAll(".edgePath").forEach((e) => {
            e.classList.remove("selected");
            const p = e.querySelector("path");
            if (p) p.style.strokeWidth = "";
          });

          edge.classList.add("selected");
          const pathEl = edge.querySelector("path");
          if (pathEl) {
            pathEl.style.strokeWidth = "4px";
          }

          onElementClick({
            type: "edge",
            id: edgeId,
            from: fromNode,
            to: toNode,
            label: edgeLabel,
            element: edge,
          });
        };

        // Make all parts of the edge clickable
        const makeClickable = (element) => {
          if (element) {
            element.style.cursor = "pointer";
            element.style.pointerEvents = "all";
            element.addEventListener("click", handleEdgeClick);
          }
        };

        // Make the edge path clickable
        makeClickable(edge);
        makeClickable(edge.querySelector("path"));
        makeClickable(edge.querySelector("marker-end"));

        // Make the edge label clickable
        const edgeLabelGroup = newSvg.querySelector(`#${edge.id}-label`);
        if (edgeLabelGroup) {
          makeClickable(edgeLabelGroup);

          // Make the label text clickable
          const labelElement = edgeLabelGroup.querySelector(".edgeLabel");
          if (labelElement) {
            makeClickable(labelElement);
          }

          // Make the foreignObject and its contents clickable
          const foreignObject = edgeLabelGroup.querySelector("foreignObject");
          if (foreignObject) {
            makeClickable(foreignObject);
            foreignObject.querySelectorAll("*").forEach(makeClickable);
          }
        }

        // Add hover effect for edges
        const handleEdgeHover = (isHover) => {
          if (!edge.classList.contains("selected")) {
            const pathEl = edge.querySelector("path");
            if (pathEl) {
              pathEl.style.strokeWidth = isHover ? "3px" : "";
            }
            edge.style.opacity = isHover ? "0.8" : "";
          }
        };

        edge.addEventListener("mouseenter", () => handleEdgeHover(true));
        edge.addEventListener("mouseleave", () => handleEdgeHover(false));
      });

      // Add click handler for diagram background to deselect
      newSvg.addEventListener("click", (e) => {
        if (e.target === newSvg || e.target.tagName === "rect") {
          newSvg.querySelectorAll(".node, .edgePath").forEach((el) => {
            el.classList.remove("selected");
            const pathEl = el.querySelector("path");
            if (pathEl) pathEl.style.strokeWidth = "";
          });
          onElementClick(null);
        }
      });

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
  }, [mermaidCode, onElementClick]);

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
      if (e.target.closest(".node") || e.target.closest(".edgePath")) {
        return; // Don't initiate drag if clicking on a node or edge
      }
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
      stroke: #f97316 !important;
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

  return (
    <div className="section-container">
      <div className="section-header">
        <span>Flow Diagram</span>
        <div className="diagram-controls">
          <span>Zoom: {zoomLevel}%</span>
          <button
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
  onElementClick: PropTypes.func.isRequired,
};

export default FlowDiagram;
