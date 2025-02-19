import React, { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'

// Configure mermaid
mermaid.initialize({
  startOnLoad: true,
  theme: 'default',
  securityLevel: 'loose',
  fontFamily: 'monospace',
  flowchart: {
    nodeWidth: 150,
    nodeHeight: 50,
    useMaxWidth: true,
    htmlLabels: true,
    curve: 'basis'
  }
})

const DiagramView = ({ diagramDefinition }) => {
  console.log('DiagramDefinition here:', diagramDefinition)
  const diagramRef = useRef(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    let intervalId

    const renderDiagram = async () => {
      if (!diagramDefinition) {
        console.warn('Diagram definition not available, retrying...')
        return
      }

      try {
        // Clear previous content
        if (diagramRef.current) {
          diagramRef.current.innerHTML = ''
        }

        // Set diagram content to the ref container
        if (diagramRef.current) {
          diagramRef.current.innerHTML = diagramDefinition
        }

        // Re-render diagram using mermaid
        await mermaid.contentLoaded() // Trigger rendering
        console.log('Diagram rendered successfully')

        // Clear the retry interval after successful rendering
        clearInterval(intervalId)
      } catch (error) {
        console.error('Failed to render diagram:', error)
      }
    }

    // Retry every 500ms until diagramDefinition is available (max retries: 10)
    intervalId = setInterval(() => {
      if (diagramDefinition || retryCount >= 10) {
        clearInterval(intervalId) // Stop retrying if definition is found or max retries reached
        renderDiagram()
      }
      setRetryCount(prev => prev + 1)
    }, 500)

    return () => clearInterval(intervalId) // Cleanup on unmount
  }, [diagramDefinition])

  return (
    <div className='w-full h-full min-h-[400px] p-4 bg-white border border-gray-200 rounded-lg'>
      <div ref={diagramRef} className='mermaid'>
        {/* This will be dynamically updated with the diagram */}
      </div>
    </div>
  )
}

export default DiagramView
