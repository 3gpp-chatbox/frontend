import React, { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'
import mermaidConfig from '../config/mermaidConfig'

// Configure mermaid
mermaid.initialize(mermaidConfig)

const DiagramView = ({ diagramDefinition }) => {
  console.log('DiagramDefinition here:', diagramDefinition)
  const diagramRef = useRef(null)
  const [retryCount, setRetryCount] = useState(0)
  const [scale, setScale] = useState(1)

   // Add zoom control functions
   const zoomIn = () => {
    setScale(prevScale => Math.min(prevScale + 0.2, 3)) // Max zoom: 3x
  }

  const zoomOut = () => {
    setScale(prevScale => Math.max(prevScale - 0.2, 0.5)) // Min zoom: 0.5x
  }

  const resetZoom = () => {
    setScale(1)
  }

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
    <div className='relative w-full h-full min-h-[400px] p-2'>
      {/* Zoom controls */}
      <div className='absolute top-2 right-2 flex gap-2 z-10'>
        <button
          onClick={zoomIn}
          className='bg-gray-200 hover:bg-gray-300 p-2 rounded'
          aria-label="Zoom in"
        >
          <span className="text-xl">+</span>
        </button>
        <button
          onClick={zoomOut}
          className='bg-gray-200 hover:bg-gray-300 p-2 rounded'
          aria-label="Zoom out"
        >
          <span className="text-xl">−</span>
        </button>
        <button
          onClick={resetZoom}
          className='bg-gray-200 hover:bg-gray-300 p-2 rounded text-sm'
          aria-label="Reset zoom"
        >
          Reset
        </button>
      </div>

      {/* Diagram container with zoom transform */}
      <div className='w-full h-full flex items-center justify-center overflow-auto'>
        <div 
          style={{ 
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
            transition: 'transform 0.2s ease-out'
          }}
        >
          <div ref={diagramRef} className='mermaid'>
            {/* This will be dynamically updated with the diagram */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DiagramView
