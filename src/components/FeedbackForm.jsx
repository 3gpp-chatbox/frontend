import React, { useState } from 'react';
import './FeedbackForm.css';

const FeedbackForm = ({ graphId, onFeedbackSubmitted }) => {
  const [comment, setComment] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [feedbackType, setFeedbackType] = useState('correction');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const response = await fetch('http://localhost:8000/feedback/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          graph_id: graphId,
          comment: comment,
          user_email: email || null,
          feedback_type: feedbackType,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      setStatus('success');
      setComment('');
      setEmail('');
      setFeedbackType('correction');
      
      // Notify parent component to refresh feedback list
      if (onFeedbackSubmitted) {
        onFeedbackSubmitted();
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setStatus('error');
    }
  };

  return (
    <div className="feedback-form">
      <h3>Provide Feedback</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email (optional):</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
          />
        </div>
        <div className="form-group">
          <label>Feedback Type:</label>
          <div className="feedback-type-options">
            {['correction', 'suggestion', 'question', 'clarification'].map((type) => (
              <label key={type} className="feedback-type-option">
                <input
                  type="radio"
                  name="feedbackType"
                  value={type}
                  checked={feedbackType === type}
                  onChange={(e) => setFeedbackType(e.target.value)}
                />
                <span className="feedback-type-label">{type.charAt(0).toUpperCase() + type.slice(1)}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="comment">Feedback:</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Enter your feedback here..."
            required
            rows={4}
          />
        </div>
        <button 
          type="submit" 
          disabled={status === 'sending' || !comment.trim()}
        >
          {status === 'sending' ? 'Submitting...' : 'Submit Feedback'}
        </button>
        {status === 'success' && (
          <p className="success-message">Thank you for your feedback!</p>
        )}
        {status === 'error' && (
          <p className="error-message">Failed to submit feedback. Please try again.</p>
        )}
      </form>
    </div>
  );
};

export default FeedbackForm; 