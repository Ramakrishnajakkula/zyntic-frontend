import React, { useState } from 'react';
import axios from 'axios';

function ProductRating({ productId, existingRating, onRatingSubmit }) {
  const [rating, setRating] = useState(existingRating?.value || 0);
  const [comment, setComment] = useState(existingRating?.comment || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('You must be logged in to rate products');
        return;
      }
      
      const response = await axios.post(
        `https://zyntic-backend.vercel.app/api/products/${productId}/rate`,
        { rating, comment },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setSuccess('Thank you for your rating!');
      
      // Notify parent component of the new rating
      if (onRatingSubmit) {
        onRatingSubmit(response.data);
      }
    } catch (err) {
      console.error('Error submitting rating:', err);
      setError(err.response?.data?.message || 'Failed to submit rating');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="card border-0 shadow-sm mt-3">
      <div className="card-body p-3 p-md-4">
        <h5 className="card-title fs-5 mb-3">Rate This Product</h5>
        
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        
        {success && (
          <div className="alert alert-success" role="alert">
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Your Rating</label>
            <select 
              className="form-select" 
              value={rating} 
              onChange={(e) => setRating(Number(e.target.value))}
              required
            >
              <option value="">Select a rating</option>
              <option value="1">1 - Poor</option>
              <option value="2">2 - Fair</option>
              <option value="3">3 - Good</option>
              <option value="4">4 - Very Good</option>
              <option value="5">5 - Excellent</option>
            </select>
          </div>
          
          <div className="mb-3">
            <label className="form-label">Your Review (Optional)</label>
            <textarea 
              className="form-control" 
              rows="3"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your review here..."
            ></textarea>
          </div>
          
          <button 
            type="submit" 
            className="btn"
            style={{ 
              backgroundColor: "rgb(255, 112, 67)",
              color: "white"
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Submitting...
              </>
            ) : (
              'Submit Rating'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProductRating;