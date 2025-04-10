import { useState, useEffect } from "react"
import { fetchGraphData } from "../API_calls/api"
import { getMermaidConverter } from "../functions/mermaidConverters"

function JsonViewer({ selectedProcedure, onMermaidCodeChange }) {
  const [data, setData] = useState(null)
  const [mermaidGraph, setMermaidGraph] = useState("")
  const [showMermaid, setShowMermaid] = useState(true)
  const [jsonContent, setJsonContent] = useState("")
  const [notification, setNotification] = useState({ show: false, message: "", type: "" })

  useEffect(() => {
    if (!selectedProcedure?.resultSet || !selectedProcedure?.procedureName) {
      console.log("JsonViewer: No valid procedure selected")
      setData(null)
      return
    }

    const loadGraphData = async () => {
      try {
        console.log(
          "JsonViewer: Fetching data for:",
          selectedProcedure.resultSet,
          selectedProcedure.procedureName
        )

        const graphData = await fetchGraphData(
          selectedProcedure.resultSet,
          selectedProcedure.procedureName
        )

        console.log("JsonViewer: Received data:", graphData)
        setData(graphData)
        setJsonContent(JSON.stringify(graphData, null, 2))
      } catch (error) {
        console.error("Error fetching graph data:", error)
        setData(null)
      }
    }

    loadGraphData()
  }, [selectedProcedure])

  useEffect(() => {
    if (!data || !selectedProcedure?.resultSet) return

    console.log(
      "JsonViewer: Converting data using method:",
      selectedProcedure.resultSet
    )
    const converter = getMermaidConverter(selectedProcedure.resultSet)
    const mermaidGraph = converter(data)
    setMermaidGraph(mermaidGraph)

    console.log("JsonViewer: Calling onMermaidCodeChange with:", mermaidGraph)
    onMermaidCodeChange(mermaidGraph)
  }, [data])

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
        // await saveGraphData(selectedProcedure.resultSet, selectedProcedure.procedureName, updatedData)
        await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulation for now
        
        try {
          // After saving, fetch the fresh data from database
          const freshData = await fetchGraphData(
            selectedProcedure.resultSet,
            selectedProcedure.procedureName
          )
          
          // Update local state with fresh data from database
          setData(freshData)
          setJsonContent(JSON.stringify(freshData, null, 2))
          
          // Show success notification
          setNotification({
            show: true,
            message: "Changes saved successfully",
            type: "success"
          })

          // Switch to Mermaid view after successful save and fetch
          setTimeout(() => {
            setShowMermaid(true)
          }, 500)
          
        } catch (error) {
          setNotification({
            show: true,
            message: "Changes saved but failed to refresh data",
            type: "warning"
          })
        }
        
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
        {data ? (
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
