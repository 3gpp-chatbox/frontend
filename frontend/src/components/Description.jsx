function Description({ procedure }) {
    return (
      <div className="section-container">
        <div className="section-header">Description</div>
        <div className="content-area">
          {procedure ? (
            <>
              <h3 className="description-title">{procedure.name}</h3>
              <p className="description-text">
                This procedure describes the interaction between network elements
                during the {procedure.name.toLowerCase()}. The flow demonstrates
                the message sequence and timing of events that occur during this
                process.
              </p>
            </>
          ) : (
            <div className="placeholder-text">
              Select a procedure to view its description
            </div>
          )}
        </div>
      </div>
    );
  }
  
  export default Description;