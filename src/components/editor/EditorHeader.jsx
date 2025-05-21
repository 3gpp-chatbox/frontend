import PropTypes from "prop-types";

/**
 * Header component for the editor panel with view switching tabs
 */
function EditorHeader({
  activeView,
  setActiveView,
  isEditing,
  setNotification,
}) {
  const handleViewChange = (view) => {
    setActiveView(view);
  };

  return (
    <div className="section-header">
      <span>
        {activeView === "mermaid"
          ? "Mermaid"
          : activeView === "json"
            ? "JSON"
            : "Reference"}{" "}
        Viewer
        {isEditing && <span className="editing-indicator"> (Editing)</span>}
      </span>
      <div className="header-controls">
        <div className="view-tabs">
          <button
            className={`tab-button ${activeView === "mermaid" ? "active" : ""}`}
            onClick={() => handleViewChange("mermaid")}
          >
            Mermaid
          </button>
          <button
            className={`tab-button ${activeView === "json" ? "active" : ""}`}
            onClick={() => handleViewChange("json")}
          >
            JSON
          </button>
          <button
            className={`tab-button ${
              activeView === "reference" ? "active" : ""
            }`}
            onClick={() => handleViewChange("reference")}
          >
            Reference
          </button>
        </div>
      </div>
    </div>
  );
}

EditorHeader.propTypes = {
  activeView: PropTypes.oneOf(["mermaid", "json", "reference"]).isRequired,
  setActiveView: PropTypes.func.isRequired,
  isEditing: PropTypes.bool.isRequired,
  setNotification: PropTypes.func.isRequired,
};

export default EditorHeader;
