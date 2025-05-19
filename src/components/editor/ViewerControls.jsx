import PropTypes from "prop-types";
import { FaSave } from "react-icons/fa";
import { BiVerticalTop, BiHorizontalLeft } from "react-icons/bi";

/**
 * Controls component for the editor panel with direction switching and save functionality
 */
function ViewerControls({
  activeView,
  direction,
  isEditing,
  onDirectionChange,
  onSave,
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
    </div>
  );
}

ViewerControls.propTypes = {
  activeView: PropTypes.oneOf(["mermaid", "json", "reference"]).isRequired,
  direction: PropTypes.oneOf(["TD", "LR"]).isRequired,
  isEditing: PropTypes.bool.isRequired,
  onDirectionChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  setNotification: PropTypes.func.isRequired,
  isValidCode: PropTypes.bool,
};

export default ViewerControls;
