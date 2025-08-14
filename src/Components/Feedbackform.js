import { useState, useEffect } from 'react';
import axios from 'axios';

function FeedbackForm() {
  const [skills, setSkills] = useState([]);
  const [goals, setGoals] = useState([]);
  const [formData, setFormData] = useState({
    skillId: '',
    goalId: '',
    rating: '',
    comment: ''
  });
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (userId) {
      // Fetch skills
      axios.get(`http://localhost:8080/api/user-skills/user/${userId}`)
        .then(res => {
          const userSkills = res.data.map(us => ({
            id: us.skill.id,
            name: us.skill.name
          }));
          setSkills(userSkills);
        })
        .catch(err => console.error('Error fetching skills:', err));

      // Fetch goals
      axios.get(`http://localhost:8080/api/goals/user/${userId}`)
        .then(res => {
          const userGoals = res.data.map(g => ({
            id: g.id,
            title: g.title
          }));
          setGoals(userGoals);
        })
        .catch(err => console.error('Error fetching goals:', err));
    }
  }, [userId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.skillId) return 'Please select a skill';
    if (!formData.goalId) return 'Please select a goal';
    if (!formData.rating) return 'Please select a rating';
    if (!formData.comment.trim()) return 'Please enter a comment';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setMessage(validationError);
      return;
    }

    if (!userId) {
      setMessage('User not logged in.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await axios.post('http://localhost:8080/api/feedback', {
        userId: parseInt(userId),
        skillId: parseInt(formData.skillId),
        goalId: parseInt(formData.goalId),
        message: formData.comment,
        rating: parseInt(formData.rating)
      });

      setMessage('Feedback submitted successfully!');
      setFormData({ skillId: '', goalId: '', rating: '', comment: '' });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                         error.response?.data?.error || 
                         error.message || 
                         'Failed to submit feedback';
      setMessage(errorMessage);
      
      if (error.response) {
        console.error('Server responded with:', error.response.status, error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Request setup error:', error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mt-4">
      <h4 className="mb-3">Submit Feedback</h4>
      {message && (
        <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Skill Selection */}
        <div className="mb-3">
          <label htmlFor="skillId" className="form-label">Select Skill</label>
          <select
            className="form-select"
            name="skillId"
            value={formData.skillId}
            onChange={handleChange}
            required
          >
            <option value="">-- Choose Skill --</option>
            {skills.map(skill => (
              <option key={skill.id} value={skill.id}>{skill.name}</option>
            ))}
          </select>
        </div>

        {/* Goal Selection */}
        <div className="mb-3">
          <label htmlFor="goalId" className="form-label">Select Goal</label>
          <select
            className="form-select"
            name="goalId"
            value={formData.goalId}
            onChange={handleChange}
            required
          >
            <option value="">-- Choose Goal --</option>
            {goals.map(goal => (
              <option key={goal.id} value={goal.id}>{goal.title}</option>
            ))}
          </select>
        </div>

        {/* Rating */}
        <div className="mb-3">
          <label htmlFor="rating" className="form-label">Rating (1-5)</label>
          <select
            className="form-select"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            required
          >
            <option value="">-- Choose Rating --</option>
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num}>{num} - {num === 1 ? 'Poor' : num === 5 ? 'Excellent' : 'Good'}</option>
            ))}
          </select>
        </div>

        {/* Comment */}
        <div className="mb-3">
          <label htmlFor="comment" className="form-label">Comment</label>
          <textarea
            className="form-control"
            name="comment"
            rows="3"
            value={formData.comment}
            onChange={handleChange}
            placeholder="Write your feedback..."
            required
            minLength="10"
          />
          <small className="text-muted">Minimum 10 characters</small>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Submitting...
            </>
          ) : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
}

export default FeedbackForm;
