import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { fetchVersionHistory } from '../../API/api_calls';

function VersionHistory({ isOpen, onClose, onOpenComparison, procedure }) {
  const [expandedCommit, setExpandedCommit] = useState(null);
  const [versionHistory, setVersionHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (isOpen && procedure?.id && procedure?.entity) {
      setLoading(true);
      setError(null);
      fetchVersionHistory(procedure.id, procedure.entity)
        .then((data) => setVersionHistory(data || []))
        .catch((err) => setError("Failed to load version history"))
        .finally(() => setLoading(false));
    }
  }, [isOpen, procedure?.id, procedure?.entity]);

  const handleToggleExpand = (id) => {
    setExpandedCommit(expandedCommit === id ? null : id);
  };

  if (!isOpen) return null; 

  return (
    <div className="modal-overlay">
      <div className="modal-content description-modal-content version-history-modal-content">
        <div className="modal-header">
          <h3>Version History Summary</h3>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body version-history-modal-body" style={{ position: 'relative', minHeight: '400px' }}>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : (
            <div className="timeline-container">
              <div className="timeline-vertical-line" />
              <div className="timeline-events">
                {versionHistory.map((event) => (
                  <div className="timeline-event" key={event.graph_id}>
                    <div className="timeline-dot" />
                    <div className="timeline-content">
                      <div className="timeline-header-row">
                        <span className="timeline-title">
                          {`V${event.version}: ${event.commit_title}`}
                        </span>
                        <span className="commit-timestamp">
                          {new Date(event.created_at).toLocaleString()}
                        </span>
                      </div>
                      {event.commit_message && (
                        <div className={`commit-message${expandedCommit === event.graph_id ? ' expanded' : ''}`}>
                        {expandedCommit === event.graph_id ? (
                          <>
                            {event.commit_message}
                            <span
                              className="show-more-less"
                              onClick={() => handleToggleExpand(event.graph_id)}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => { if (e.key === 'Enter') handleToggleExpand(event.graph_id); }}
                            >
                              Show less
                            </span>
                          </>
                        ) : (
                          <>
                            <div className="commit-preview">
                              {event.commit_message}
                            </div>
                            {event.commit_message.length > 80 && (
                              <span
                                className="show-more-less"
                                onClick={() => handleToggleExpand(event.graph_id)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => { if (e.key === 'Enter') handleToggleExpand(event.graph_id); }}
                              >
                                Show more
                              </span>
                            )}
                          </>
                        )}
                      </div>
                      
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
        <div className="version-history-button-container">
            <button
                className="version-history-button"
                onClick={onOpenComparison}
            >
            Open Comparison
            </button>
          </div>
      </div> 
    </div>
  );
}

VersionHistory.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onOpenComparison: PropTypes.func.isRequired,
  procedure: PropTypes.object.isRequired,
};

export default VersionHistory;