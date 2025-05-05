import React, { useEffect, useState } from 'react';
import './FeedbackList.css';

const FeedbackList = ({ graphId }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resolvingFeedback, setResolvingFeedback] = useState(null);
  const [resolutionReason, setResolutionReason] = useState('');

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await fetch(`http://localhost:8000/feedback/graph/${graphId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch feedbacks');
        }
        const data = await response.json();
        setFeedbacks(data);
      } catch (err) {
        console.error('Error fetching feedbacks:', err);
        setError('Failed to load feedbacks');
      } finally {
        setLoading(false);
      }
    };

    if (graphId) {
      fetchFeedbacks();
    }
  }, [graphId]);

  const handleResolve = async (feedbackId) => {
    try {
      const response = await fetch('http://localhost:8000/feedback/resolve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          feedback_id: feedbackId,
          resolution_reason: resolutionReason,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to resolve feedback');
      }

      // Update the feedbacks list with the resolved feedback
      const updatedFeedback = await response.json();
      setFeedbacks(feedbacks.map(f => 
        f.id === feedbackId ? updatedFeedback : f
      ));
      
      // Reset the resolution form
      setResolvingFeedback(null);
      setResolutionReason('');
    } catch (error) {
      console.error('Error resolving feedback:', error);
      setError('Failed to resolve feedback');
    }
  };

  if (loading) {
    return <div className="feedback-list loading">Loading feedbacks...</div>;
  }

  if (error) {
    return <div className="feedback-list error">{error}</div>;
  }

  if (feedbacks.length === 0) {
    return <div className="feedback-list empty">No feedback yet. Be the first to comment!</div>;
  }

  return (
    <div className="feedback-list">
      <h3>Previous Feedback</h3>
      {feedbacks.map((feedback) => (
        <div key={feedback.id} className={`feedback-item ${feedback.status === 'resolved' ? 'resolved' : ''}`}>
          <div className="feedback-header">
            <span className="feedback-date">{feedback.created_at}</span>
            {feedback.user_email && (
              <span className="feedback-email">{feedback.user_email}</span>
            )}
            {feedback.status === 'resolved' && (
              <span className="feedback-status resolved">✓ Resolved</span>
            )}
          </div>
          <div className="feedback-content">{feedback.comment}</div>
          {feedback.status === 'resolved' && feedback.resolution_reason && (
            <div className="resolution-reason">
              <strong>Resolution:</strong> {feedback.resolution_reason}
            </div>
          )}
          {feedback.status === 'pending' && (
            <div className="feedback-actions">
              {resolvingFeedback === feedback.id ? (
                <div className="resolution-form">
                  <textarea
                    value={resolutionReason}
                    onChange={(e) => setResolutionReason(e.target.value)}
                    placeholder="Enter reason for resolution..."
                    rows={2}
                  />
                  <div className="resolution-buttons">
                    <button 
                      onClick={() => handleResolve(feedback.id)}
                      disabled={!resolutionReason.trim()}
                    >
                      Confirm
                    </button>
                    <button 
                      onClick={() => {
                        setResolvingFeedback(null);
                        setResolutionReason('');
                      }}
                      className="cancel"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setResolvingFeedback(feedback.id)}
                  className="resolve-button"
                >
                  Resolve
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FeedbackList; 