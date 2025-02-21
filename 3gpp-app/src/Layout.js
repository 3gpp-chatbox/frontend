import React, { useCallback, useState } from 'react'
import DiagramView from './components/diagramView'
import { useProcedureData } from './APIHandler'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import DiagramEditor from './components/diagramEditor'

const Layout = () => {
  const [isProcedureListCollapsed, setIsProcedureListCollapsed] =
    useState(false)

  const {
    procedures,
    mermaidCode,
    loading,
    error,
    selectedProcedure,
    setSelectedProcedure,
    fetchProcedures,
    fetchMermaidDiagram,
    selectedNode,
    setSelectedNode,
    updateMermaidCode
  } = useProcedureData()

  React.useEffect(() => {
    fetchProcedures()
  }, [])

  const handleProcedureClick = useCallback(
    procedure => {
      setSelectedProcedure(procedure)
      setSelectedNode(null)
      fetchMermaidDiagram(procedure.id)
    },
    [setSelectedProcedure, fetchMermaidDiagram]
  )

  const handleCodeChange = newCode => {
    updateMermaidCode(newCode)
  }

  return (
    <div className='h-screen flex flex-col font-poppins text-white text-sm'>
      {/* Title Bar */}
      <div className='h-12 bg-zinc-900 border-b border-zinc-700 flex items-center px-4'>
        <h1 className='text-xl font-semibold text-white '>3GPP Assistant</h1>
      </div>

      {/* Main Content */}
      <div className='flex-1 flex'>
        {/* Procedure List - Collapsible Left Sidebar */}
        <div
          className={`flex ${
            isProcedureListCollapsed ? 'w-12' : 'w-64'
          } transition-all duration-300 ease-in-out`}
        >
          <div className='flex-1 background1-style  overflow-y-auto'>
            {!isProcedureListCollapsed && (
              <div className='p-4 h-full background1-style'>
                <h2 className='h1-style'>NR related NAS procedures</h2>
                <ul className='space-y-2'>
                  {procedures.map(procedure => (
                    <li
                      key={procedure.id}
                      onClick={() => handleProcedureClick(procedure)}
                      className={`hover-style
                        ${
                          selectedProcedure?.id === procedure.id
                            ? 'selected-style'
                            : ''
                        }`}
                    >
                      <span className='block truncate p-style'>
                        {procedure.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <button
            onClick={() =>
              setIsProcedureListCollapsed(!isProcedureListCollapsed)
            }
            className='bg-zinc-800 hover:bg-gray-300 transition-colors'
          >
            {isProcedureListCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </button>
        </div>

        {/* Main Content Area */}
        <div className='flex-1 flex'>
          {/* Left Column - Diagram and Summary */}
          <div className='flex-1 flex flex-col'>
            {/* Diagram View */}
            <div className='flex-1 background3-style border1-style overflow-auto'>
              <div className='transform scale-100 h-full origin-center transition-transform'>
                {loading ? (
                  <div className='text-gray-500'>Loading diagram...</div>
                ) : error ? (
                  <div className='text-red-500'>
                    Error loading diagram: {error.message}
                  </div>
                ) : mermaidCode ? (
                  <DiagramView diagramDefinition={mermaidCode} />
                ) : (
                  <div className='text-gray-500'>
                    Select a procedure to view its diagram
                  </div>
                )}
              </div>
            </div>

            {/* Procedure description */}
            <div className='h-1/4 background1-style border1-style  p-4 overflow-y-auto'>
              <h2 className='h1-style'>Description</h2>
              {selectedProcedure && (
                <div className='space-y-2'>
                  <h3 className='h2-style'>{selectedProcedure.name} :</h3>
                  <p className='p-style'>{selectedProcedure.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Editor and Other */}
          <div className='w-96 flex flex-col'>
            {/* Editor View */}
            <div className='flex-1 background1-style border1-style p-4 overflow-y-auto'>
              <h2 className='h1-style'>Editor</h2>
              <DiagramEditor
                mermaidCode={mermaidCode}
                onCodeChange={handleCodeChange}
              />
            </div>

            {/* Other Area */}
            {/* <div className='h-1/4 background1-style p-4 border-0 overflow-y-auto'> */}
            {/* <h2 className='h1-style'>Additional Info</h2> */}
            {/* Add additional information here */}
            {/* </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Layout
