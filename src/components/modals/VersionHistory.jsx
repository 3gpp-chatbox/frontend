import React, { useState } from 'react';
import PropTypes from 'prop-types';

// Dummy version history data for demonstration
const versionHistory = [
  {
    id: 1,
    type: 'extracted',
    title: 'Procedure extracted',
    message: 'Title here',
    commit: 'This is a temporary commit message for testing purposes. Actual functionality will be implemented in future commits. This is a temporary commit message for testing purposes. Actual functionality will be implemented in future commits.',
    timestamp: '5/6/2025, 10:30:00 AM',
    link: '#',
  },
  {
    id: 2,
    type: 'version',
    title: 'Created V01',
    message: 'Title here',
    commit: 'This is a temporary commit message for testing purposes. Actual functionality will be implemented in future commits. This is a temporary commit message for testing purposes. Actual functionality will be implemented in future commits.',
    timestamp: '5/6/2025, 10:30:00 AM',
    link: '#',
  },
  {
    id: 3,
    type: 'version',
    title: 'Created V02',
    message: 'Title here',
    commit: 'This is a temporary commit message for testing purposes. Actual functionality will be implemented in future commits. This is a temporary commit message for testing purposes. Actual functionality will be implemented in future commits.',
    timestamp: '5/6/2025, 10:30:00 AM',
    link: '#',
  },
];

function VersionHistory({ isOpen, onClose }) {
  const [expandedCommit, setExpandedCommit] = useState(null);

  const handleToggleExpand = (id) => {
    setExpandedCommit(expandedCommit === id ? null : id);
  };

  if (!isOpen) return null; 

  return (
    <div className="modal-overlay">
      <div className="modal-content description-modal-content version-history-modal-content">
        <div className="modal-header">
          <h3>Version History</h3>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body version-history-modal-body">
          <div className="timeline-container">
            <div className="timeline-vertical-line" />
            <div className="timeline-events">
              {versionHistory.map((event) => (
                <div className="timeline-event" key={event.id}>
                  <div className="timeline-dot" />
                  <div className="timeline-content">
                    <div className="timeline-header-row">
                      <span className="timeline-title">
                        {event.title}
                        {event.link && (
                          <a href={event.link} target="_blank" rel="noopener noreferrer" className="timeline-link" title="Open details">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                          </a>
                        )}
                      </span>
                      <span className="commit-timestamp">{event.timestamp}</span>
                    </div>
                    {event.message && <div className="commit-title">{event.message}</div>}
                    {event.commit && (
                      <div className={`commit-message${expandedCommit === event.id ? ' expanded' : ''}`}>
                        {expandedCommit === event.id ? (
                          <>
                            {event.commit}
                            {event.commit.length > 180 && (
                              <span
                                className="show-more-less"
                                onClick={() => handleToggleExpand(event.id)}
                              >
                                Show less
                              </span>
                            )}
                          </>
                        ) : (
                          <>
                            <span className="commit-preview">
                              {event.commit.slice(0, 180)}
                              {event.commit.length > 180 ? '...' : ''}
                            </span>
                            {event.commit.length > 180 && (
                              <span
                                className="show-more-less"
                                onClick={() => handleToggleExpand(event.id)}
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
        </div>
      </div>
    </div>
  );
}

VersionHistory.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default VersionHistory;
