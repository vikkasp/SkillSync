import React, { useState } from 'react';
import API from '../api/api';

export default function AddGoalForm({ onGoalCreated }) {
  const [goal, setGoal] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
  });

  const [message, setMessage] = useState('');
  const userId = localStorage.getItem('userId'); // get logged-in user

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGoal({ ...goal, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      setMessage('User not logged in');
      return;
    }

    try {
      const payload = {
        ...goal,
        isCompleted: false,
        user: { id: parseInt(userId) }
      };

      const response = await API.post('/goals', payload);
      setMessage('Goal added successfully!');
      setGoal({ title: '', description: '', startDate: '', endDate: '' });

      if (onGoalCreated) {
        onGoalCreated(response.data); // refresh goal list if parent passes callback
      }
    } catch (err) {
      console.error('Error creating goal:', err);
      setMessage('Failed to add goal');
    }
  };

  return (
    <div className="container my-4">
      <h4 className="mb-3">Set a New Goal</h4>
      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={goal.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            name="description"
            value={goal.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Start Date</label>
            <input
              type="date"
              className="form-control"
              name="startDate"
              value={goal.startDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">End Date</label>
            <input
              type="date"
              className="form-control"
              name="endDate"
              value={goal.endDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary mt-2">Save Goal</button>

        {message && <div className="mt-3 alert alert-info">{message}</div>}
      </form>
    </div>
  );
}
