import { useState, useEffect } from "react"
import { JsonToMermaid, defaultMermaidConfig } from "../functions/jsonToMermaid"

function JsonViewer({ selectedProcedure, onMermaidCodeChange }) {
  const [showMermaid, setShowMermaid] = useState(true)
  const [jsonContent, setJsonContent] = useState("")
  const [notification, setNotification] = useState({ show: false, message: "", type: "" })

  useEffect(() => {
    if (!selectedProcedure) {
      console.log("JsonViewer: No procedure selected")
      return
    }

    // Update JSON content when a new procedure is selected
    if (selectedProcedure.jsonData) {
      setJsonContent(JSON.stringify(selectedProcedure.jsonData, null, 2))
    }

    // Update Mermaid diagram when a new procedure is selected
    if (selectedProcedure.mermaidDiagram) {
      onMermaidCodeChange(selectedProcedure.mermaidDiagram)
    }
  }, [selectedProcedure, onMermaidCodeChange])

  // Auto-hide notification after 3 seconds
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ show: false, message: "", type: "" })
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [notification.show])

  const handleJsonChange = (event) => {
    setJsonContent(event.target.value)
  }

  const handleSaveChanges = async () => {
    // Show saving notification
    setNotification({
      show: true,
      message: "Saving changes...",
      type: "info"
    })

    try {
      // First validate JSON
      const updatedData = JSON.parse(jsonContent)
      
      try {
        // TODO: Replace this with your actual API call to save to database
        // Example structure:
        // await saveGraphData(selectedProcedure.id, updatedData)
        await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulation for now
        
        // After saving, update the Mermaid diagram
        const mermaidDiagram = JsonToMermaid(updatedData, defaultMermaidConfig)
        onMermaidCodeChange(mermaidDiagram)
        
        // Show success notification
        setNotification({
          show: true,
          message: "Changes saved successfully",
          type: "success"
        })

        // Switch to Mermaid view after successful save
        setTimeout(() => {
          setShowMermaid(true)
        }, 500)
        
      } catch (error) {
        // Handle database connection error
        setNotification({
          show: true,
          message: "Changes not saved: No database connection",
          type: "error"
        })
      }
    } catch (error) {
      // Handle JSON parsing error
      setNotification({
        show: true,
        message: "Changes not saved: Invalid JSON format",
        type: "error"
      })
    }
  }

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
        <span>Code View</span>
        <button
          className="toggle-button"
          onClick={() => setShowMermaid(!showMermaid)}
          title={showMermaid ? "View and Edit JSON code here" : ""}
        >
          {showMermaid ? "Show JSON" : "Show Mermaid"}
        </button>
        {!showMermaid && (
          <button
            className="save-button"
            onClick={handleSaveChanges}
          >
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
          <pre className="json-content">
            {showMermaid ? (
              <code>{selectedProcedure.mermaidDiagram}</code>
            ) : (
              <textarea
                value={jsonContent}
                onChange={handleJsonChange}
                style={{
                  width: "100%",
                  height: "100%",
                  fontFamily: "monospace",
                  resize: "none"
                }}
              />
            )}
          </pre>
        ) : (
          <div className="placeholder-text">
            Select a procedure to view its data
          </div>
        )}
      </div>
    </div>
  )
}

export default JsonViewer
