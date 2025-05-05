import React, { useEffect, useState } from 'react';
import './FeedbackList.css';

const FeedbackList = ({ graphId }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        <div key={feedback.id} className="feedback-item">
          <div className="feedback-header">
            <span className="feedback-date">{feedback.created_at}</span>
            {feedback.user_email && (
              <span className="feedback-email">{feedback.user_email}</span>
            )}
          </div>
          <div className="feedback-content">{feedback.comment}</div>
        </div>
      ))}
    </div>
  );
};

export default FeedbackList; 