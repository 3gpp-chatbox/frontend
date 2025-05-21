import PropTypes from "prop-types";
import { FaSave, FaUndo } from "react-icons/fa";
import { BiVerticalTop, BiHorizontalLeft } from "react-icons/bi";

/**
 * Controls component for the editor panel with direction switching and save functionality
 */
function ViewerControls({
  activeView,
  direction,
  isEditing,
  hasChanges,
  onDirectionChange,
  onSave,
  onRevert,
  setNotification,
  isValidCode = true,
}) {
  const handleDirectionChange = (newDirection) => {
    if (isEditing) {
      setNotification({
        show: true,
        message: "Please save or revert your changes first",
        type: "warning",
      });
      return;
    }
    onDirectionChange(newDirection);
  };

  if (activeView !== "mermaid") return null;

  return (
    <div className="viewer-controls">
      <div className="viewer-controls-left">
        <span className="direction-label">Flow chart direction</span>
        <div className="direction-tabs">
          <button
            className={`direction-button ${direction === "TD" ? "active" : ""}`}
            onClick={() => handleDirectionChange("TD")}
            disabled={isEditing}
            title="Top to Bottom"
          >
            <BiVerticalTop size={20} />
          </button>
          <button
            className={`direction-button ${direction === "LR" ? "active" : ""}`}
            onClick={() => handleDirectionChange("LR")}
            disabled={isEditing}
            title="Left to Right"
          >
            <BiHorizontalLeft size={20} />
          </button>
        </div>
      </div>
      <div className="viewer-controls-right">
        {isEditing && (
          <div className="button-group">
            <button
              className="undo-all-button"
              onClick={onRevert}
              title="Undo All Changes"
            >
              <FaUndo size={16} />
              Undo all
            </button>
            {hasChanges && (
              <button
                className="save-button"
                onClick={onSave}
                disabled={!isValidCode}
                title="Save Changes"
              >
                <FaSave size={16} />
                Save
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

ViewerControls.propTypes = {
  activeView: PropTypes.oneOf(["mermaid", "json", "reference"]).isRequired,
  direction: PropTypes.oneOf(["TD", "LR"]).isRequired,
  isEditing: PropTypes.bool.isRequired,
  hasChanges: PropTypes.bool.isRequired,
  onDirectionChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onRevert: PropTypes.func.isRequired,
  setNotification: PropTypes.func.isRequired,
  isValidCode: PropTypes.bool,
};

export default ViewerControls;
