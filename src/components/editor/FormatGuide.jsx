import PropTypes from "prop-types";
import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

/**
 * Component for displaying Mermaid code format requirements
 */
function FormatGuide({ isEditing, activeView }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isEditing || activeView !== "mermaid") return null;

  return (
    <div className="format-guide">
      <button 
        className="format-guide-toggle" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span>Editing Guidelines</span>
        {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
      </button>
      
      {isExpanded && (
        <div className="format-guide-content">
          <div className="format-guide-section">
            <h4>Node Format:</h4>
            <pre className="format-example">
{`A["Node Name"]:::Node type(state or event)
%% Type: state or event
%% Description: Node description
%% Section_Reference: Section reference (e.g. 5.5.1.2.2 Initial registration initiation)
%% Text_Reference: Text reference (e.g. The UE in state 5GMM-DEREGISTERED shall initiate the registration procedure for initial registration by sending a REGISTRATION REQUEST message to the AMF)`}</pre>
          </div>
          <div className="format-guide-section">
            <h4>Edge Format:</h4>
            <pre className="format-example">
{`A -->|"Edge description as edge label"| B
%% Type: trigger or condition
%% Description: Edge description (e.g. UE sends REGISTRATION REQUEST to AMF; No condition)
%% Section_Reference: Section reference (e.g. 5.5.1.2.2 Initial registration initiation)
%% Text_Reference: Text reference (e.g. The UE in state 5GMM-DEREGISTERED shall initiate the registration procedure for initial registration by sending a REGISTRATION REQUEST message to the AMF)`}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

FormatGuide.propTypes = {
  isEditing: PropTypes.bool.isRequired,
  activeView: PropTypes.string.isRequired,
};

export default FormatGuide; 