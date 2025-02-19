import { useState } from 'react'
import { MOCK_PROCEDURES, MOCK_DIAGRAMS } from './mockData'

// use mock data for testing
// Set this to false to use real API endpoints
const USE_MOCK_DATA = true

export const useProcedureData = () => {
  const [procedures, setProcedures] = useState([])
  const [mermaidCode, setMermaidCode] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedProcedure, setSelectedProcedure] = useState(null)
  const [selectedNode, setSelectedNode] = useState(null)

  const fetchProcedures = async () => {
    try {
      if (USE_MOCK_DATA) {
        setProcedures(MOCK_PROCEDURES)
        setLoading(false)
        return
      }

      const response = await fetch('/api/procedures')
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`)
      const data = await response.json()
      setProcedures(data.procedures)
    } catch (err) {
      setError(err)
      console.error('Error fetching procedures:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchMermaidDiagram = async procedureId => {
    try {
      setLoading(true)

      if (USE_MOCK_DATA) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500))
        const mockDiagram = MOCK_DIAGRAMS[procedureId]
        if (!mockDiagram) {
          throw new Error('Diagram not found')
        }
        setMermaidCode(mockDiagram)
        setError(null)
        return
      }

      const response = await fetch(`/api/procedures/${procedureId}/diagram`)
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`)
      const data = await response.json()
      setMermaidCode(data.mermaid)
    } catch (err) {
      setError(err)
      console.error('Error fetching diagram:', err)
    } finally {
      setLoading(false)
    }
  }

  return {
    procedures,
    mermaidCode,
    loading,
    error,
    selectedProcedure,
    setSelectedProcedure,
    selectedNode,
    setSelectedNode,
    fetchProcedures,
    fetchMermaidDiagram
  }
}
