import { useState, useEffect } from "react";
import { fetchMockData, saveEditedData } from "../API_calls/mockapi";
import { getMermaidConverter } from "../functions/mermaidConverters";

function JsonViewer({ onMermaidCodeChange, selectedProcedure }) {
  const [data, setData] = useState(null);
  const [mermaidGraph, setMermaidGraph] = useState("");
  const [showMermaid, setShowMermaid] = useState(true);
  const [jsonContent, setJsonContent] = useState("");
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  useEffect(() => {
    const loadMockData = async () => {
      if (!selectedProcedure) return;

      try {
        console.log(
          "JsonViewer: Fetching mock data for procedure:",
          selectedProcedure,
        );
        const mockData = await fetchMockData(selectedProcedure);
        console.log("JsonViewer: Received data:", mockData);
        setData(mockData);
        setJsonContent(JSON.stringify(mockData, null, 2));
      } catch (error) {
        console.error("Error fetching mock data:", error);
        setNotification({
          show: true,
          message: "Failed to load mock data",
          type: "error",
        });
        setData(null);
      }
    };

    loadMockData();
  }, [selectedProcedure]);

  useEffect(() => {
    if (!data) return;

    console.log("JsonViewer: Converting data to Mermaid");
    const converter = getMermaidConverter("method_1");
    const mermaidGraph = converter(data);
    setMermaidGraph(mermaidGraph);

    console.log("JsonViewer: Calling onMermaidCodeChange with:", mermaidGraph);
    onMermaidCodeChange(mermaidGraph);
  }, [data]);

  // Auto-hide notification after 3 seconds
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  const handleJsonChange = (event) => {
    setJsonContent(event.target.value);
  };

  const handleSaveChanges = async () => {
    if (!selectedProcedure) {
      setNotification({
        show: true,
        message: "Please select a procedure first",
        type: "error",
      });
      return;
    }

    setNotification({
      show: true,
      message: "Saving changes...",
      type: "info",
    });

    try {
      // First validate JSON
      const updatedData = JSON.parse(jsonContent);

      try {
        // Save to backend
        await saveEditedData(updatedData);

        // Update local state
        setData(updatedData);

        setNotification({
          show: true,
          message: "Changes saved successfully",
          type: "success",
        });

        // Switch to Mermaid view after successful save
        setTimeout(() => {
          setShowMermaid(true);
        }, 500);
      } catch (error) {
        setNotification({
          show: true,
          message: "Failed to save changes",
          type: "error",
        });
      }
    } catch (error) {
      setNotification({
        show: true,
        message: "Invalid JSON format",
        type: "error",
      });
    }
  };

  return (
    <div className="section-container">
      <style>
        {`
          .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 24px;
            border-radius: 4px;
            color: white;
            font-size: 14px;
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          }

          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }

          .notification.info {
            background-color: #2196F3;
          }

          .notification.success {
            background-color: #4CAF50;
          }

          .notification.error {
            background-color: #f44336;
          }
        `}
      </style>
      <div className="section-header">
        <span>
          Code View {selectedProcedure ? `- ${selectedProcedure}` : ""}
        </span>
        <button
          className="toggle-button"
          onClick={() => setShowMermaid(!showMermaid)}
          title={showMermaid ? "View and Edit JSON code here" : ""}
        >
          {showMermaid ? "Show JSON" : "Show Mermaid"}
        </button>
        {!showMermaid && (
          <button className="save-button" onClick={handleSaveChanges}>
            Save Changes
          </button>
        )}
      </div>
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
      <div className="content-area">
        {selectedProcedure ? (
          data ? (
            <pre className="json-content">
              {showMermaid ? (
                <code>{mermaidGraph}</code>
              ) : (
                <textarea
                  value={jsonContent}
                  onChange={handleJsonChange}
                  style={{
                    width: "100%",
                    height: "100%",
                    fontFamily: "monospace",
                    resize: "none",
                  }}
                />
              )}
            </pre>
          ) : (
            <div className="placeholder-text">Loading mock data...</div>
          )
        ) : (
          <div className="placeholder-text">
            Please select a procedure from the list above
          </div>
        )}
      </div>
    </div>
  );
}

export default JsonViewer;
