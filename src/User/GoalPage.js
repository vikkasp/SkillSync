import React, { useEffect, useState } from 'react';
import API from '../api/api';

export default function GoalPage() {
  const [goals, setGoals] = useState([]);
  const [skills, setSkills] = useState([]);
  const [goalForm, setGoalForm] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: ''
  });
  const [skillTimelines, setSkillTimelines] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) {
      setMessage("User not logged in");
      setLoading(false);
      return;
    }

    fetchGoals();
    fetchSkills();
  }, [userId]);

  const fetchGoals = async () => {
    try {
      const response = await API.get(`/goals/user/${userId}`);
      setGoals(response.data);
    } catch (err) {
      console.error("Failed to load goals", err);
      setMessage("Error loading goals.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSkills = async () => {
    try {
      const response = await API.get('/skills');
      setSkills(response.data);
    } catch (err) {
      console.error("Failed to load skills");
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setGoalForm({ ...goalForm, [name]: value });
  };

  const handleAddSkillTimeline = () => {
    setSkillTimelines([
      ...skillTimelines,
      { skillId: '', startDate: '', endDate: '' }
    ]);
  };

  const updateSkillTimeline = (index, field, value) => {
    const updated = [...skillTimelines];
    updated[index][field] = value;
    setSkillTimelines(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...goalForm,
      isCompleted: false,
      user: { id: parseInt(userId) },
      goalSkills: skillTimelines.map(s => ({
        skill: { id: parseInt(s.skillId) },
        startDate: s.startDate,
        endDate: s.endDate
      }))
    };

    try {
      const res = await API.post('/goals', payload);
      setGoals([...goals, res.data]);
      setGoalForm({ title: '', description: '', startDate: '', endDate: '' });
      setSkillTimelines([]);
      setMessage('Goal added successfully!');
    } catch (err) {
      console.error('Error creating goal:', err);
      setMessage('Failed to create goal');
    }
  };

  const getSkillNameById = (id) => {
    const skill = skills.find(s => s.id === id);
    return skill ? skill.name : 'Unknown Skill';
  };

  const calculateRemainingDays = (endDateStr) => {
    const today = new Date();
    const end = new Date(endDateStr);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">🎯 My Goals</h2>

      {/* Goal Form */}
      <form onSubmit={handleSubmit} className="card p-4 shadow-sm mb-5">
        <h5 className="mb-3">Add New Goal</h5>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            name="title"
            placeholder="Title"
            value={goalForm.title}
            onChange={handleFormChange}
            required
          />
        </div>

        <div className="mb-3">
          <textarea
            className="form-control"
            name="description"
            placeholder="Description"
            value={goalForm.description}
            onChange={handleFormChange}
            required
          />
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label>Start Date</label>
            <input
              type="date"
              className="form-control"
              name="startDate"
              value={goalForm.startDate}
              onChange={handleFormChange}
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label>End Date</label>
            <input
              type="date"
              className="form-control"
              name="endDate"
              value={goalForm.endDate}
              onChange={handleFormChange}
              required
            />
          </div>
        </div>

        <hr />

        <h6>Add Skills to Goal</h6>
        {skillTimelines.map((s, idx) => (
          <div className="row align-items-end mb-3" key={idx}>
            <div className="col-md-4">
              <select
                className="form-select"
                value={s.skillId}
                onChange={(e) => updateSkillTimeline(idx, 'skillId', e.target.value)}
              >
                <option value="">Select Skill</option>
                {skills.map(skill => (
                  <option key={skill.id} value={skill.id}>{skill.name}</option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <input
                type="date"
                className="form-control"
                placeholder="Skill Start"
                value={s.startDate}
                onChange={(e) => updateSkillTimeline(idx, 'startDate', e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <input
                type="date"
                className="form-control"
                placeholder="Skill End"
                value={s.endDate}
                onChange={(e) => updateSkillTimeline(idx, 'endDate', e.target.value)}
              />
            </div>
          </div>
        ))}
        <button type="button" className="btn btn-outline-primary mb-3" onClick={handleAddSkillTimeline}>
          + Add Skill Timeline
        </button>

        <button type="submit" className="btn btn-success w-100">Save Goal</button>
        {message && <div className="alert alert-info mt-3">{message}</div>}
      </form>

      {/* Goal List */}
      {loading ? (
        <div className="text-center text-muted">Loading goals...</div>
      ) : goals.length === 0 ? (
        <div className="alert alert-info text-center">No goals found.</div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 g-4">
          {goals.map((goal) => (
            <div className="col" key={goal.id}>
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{goal.title}</h5>
                  <p className="card-text">{goal.description}</p>
                  <p><strong>Status:</strong> {goal.isCompleted ? '✅ Completed' : '⏳ In Progress'}</p>
                  <p><strong>Start:</strong> {goal.startDate}</p>
                  <p><strong>End:</strong> {goal.endDate}</p>
                  <p>
                    <strong>Remaining:</strong>{' '}
                    {goal.isCompleted
                      ? '✅ Completed'
                      : calculateRemainingDays(goal.endDate) < 0
                        ? '⛔ Past deadline'
                        : `${calculateRemainingDays(goal.endDate)} days left`}
                  </p>

                  {/* Timeline display per skill */}
                  {goal.goalSkills && goal.goalSkills.length > 0 && (
                    <div className="mt-3">
                      <h6 className="fw-bold">Skill Timeline</h6>
                      <ul className="list-group list-group-flush">
                        {goal.goalSkills.map(gs => (
                          <li key={gs.id} className="list-group-item">
                            🛠 <strong>{getSkillNameById(gs.skill.id)}</strong><br />
                            📅 {gs.startDate} → {gs.endDate}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
