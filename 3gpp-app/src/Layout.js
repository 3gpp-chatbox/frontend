import React, { useCallback } from 'react'
import { Box, Grid, Paper, List, ListItem, ListItemText } from '@mui/material'
import styled from '@emotion/styled'
import DiagramView from './components/diagramView'
import { useProcedureData } from './APIHandler'

const StyledPaper = styled(Paper)`
  padding: 20px;
  height: calc(100vh - 40px);
  overflow: auto;
`

// Style for the flow diagram container
const FlowContainer = styled(StyledPaper)`
  display: flex;
  flex-direction: column;

  .flow-wrapper {
    flex: 1;
    min-height: 0;
    position: relative;
    overflow: hidden;
  }
`

const Layout = () => {
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
    setError
  } = useProcedureData()

  React.useEffect(() => {
    fetchProcedures()
  }, [])

  // Monitor mermaidCode changes
  React.useEffect(() => {
    const updateMermaidCode = async () => {
      if (mermaidCode) {
        console.log('MermaidCode updated:', mermaidCode)
        // Simulate an async operation (e.g., storing or modifying mermaidCode)
        await new Promise(resolve => setTimeout(resolve, 1000))
        console.log('Async operation completed')
      }
    }
    updateMermaidCode()
  }, [mermaidCode])

  const handleProcedureClick = useCallback(
    procedure => {
      setSelectedProcedure(procedure)
      setSelectedNode(null)
      fetchMermaidDiagram(procedure.id)
    },
    [setSelectedProcedure, fetchMermaidDiagram]
  )

  const handleNodeClick = nodeInfo => {
    setSelectedNode(nodeInfo)
  }

  return (
    <div className='m-0 font-sans antialiased'>
      <Box sx={{ flexGrow: 1, p: 2 }}>
        <Grid container spacing={2}>
          {/* Procedures List */}
          <Grid item xs={3}>
            <StyledPaper elevation={3}>
              <h2>3GPP Procedures</h2>
              <List>
                {procedures.map(procedure => (
                  <ListItem
                    button
                    key={procedure.id}
                    onClick={() => handleProcedureClick(procedure)}
                    selected={selectedProcedure?.id === procedure.id}
                  >
                    <ListItemText primary={procedure.name} />
                  </ListItem>
                ))}
              </List>
            </StyledPaper>
          </Grid>

          {/* Graph Visualization */}
          <Grid item xs={6}>
            <FlowContainer elevation={3}>
              <h2>Flow Diagram</h2>
              <div className='flow-wrapper'>
                {loading ? (
                  <div>Loading diagram...</div>
                ) : error ? (
                  <div>Error loading diagram: {error.message}</div>
                ) : mermaidCode ? (
                  <DiagramView diagramDefinition={mermaidCode} />
                ) : (
                  <div>Select a procedure to view its diagram</div>
                )}
              </div>
            </FlowContainer>
          </Grid>

          {/* Summary Section */}
          <Grid item xs={3}>
            <StyledPaper elevation={3}>
              <h2>Details</h2>
              {selectedNode ? (
                <div>
                  <h3>{selectedNode.text}</h3>
                  <p>Type: {selectedNode.type}</p>
                  {/* Add more node details here */}
                </div>
              ) : selectedProcedure ? (
                <div>
                  <h3>{selectedProcedure.name}</h3>
                  <p>{selectedProcedure.description}</p>
                </div>
              ) : (
                <p>Select a procedure or node to see details</p>
              )}
            </StyledPaper>
          </Grid>
        </Grid>
      </Box>
    </div>
  )
}

export default Layout
