import React, { useState } from 'react'
import DiagramView from './diagramView'

const DiagramEditor = ({ initialDiagram, onSave }) => {
  const [diagram, setDiagram] = useState(initialDiagram)
  const [error, setError] = useState(null)

  const handleDiagramChange = e => {
    const newDiagram = e.target.value
    setDiagram(newDiagram)
    // Error will be shown automatically by DiagramView if syntax is invalid
  }

  const handleSave = () => {
    if (onSave && !error) {
      onSave(diagram)
    }
  }

  return (
    <div className='flex flex-col gap-4 p-4'>
      <div className='flex gap-4'>
        {/* Editor Panel */}
        <div className='w-1/2'>
          <textarea
            className='w-full h-[400px] p-4 font-mono text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            value={diagram}
            onChange={handleDiagramChange}
            placeholder='Enter your Mermaid diagram code here...'
          />
          <button
            onClick={handleSave}
            className='mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400'
            disabled={!!error}
          >
            Save Changes
          </button>
        </div>

        {/* Preview Panel */}
        <div className='w-1/2 border rounded-lg p-4'>
          <h3 className='text-lg font-semibold mb-2'>Preview</h3>
          {error && <div className='text-red-500 mb-2'>{error}</div>}
          <DiagramView diagramDefinition={diagram} onError={setError} />
        </div>
      </div>
    </div>
  )
}

export default DiagramEditor
