function FlowDiagram({ procedure }) {
    return (
      <div className="section-container">
        <div className="section-header">Flow Diagram</div>
        <div className="content-area">
          {procedure ? (
            <div className="flow-diagram">
              Flow diagram for {procedure.name}
            </div>
          ) : (
            <div className="placeholder-text">
              Select a procedure to view its flow diagram
            </div>
          )}
        </div>
      </div>
    );
  }
  
  export default FlowDiagram;