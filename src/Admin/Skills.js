import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState({
    name: '',
    category: '',
    description: '',
    level: '',
    estimatedTime: '',
  });

  const user = JSON.parse(localStorage.getItem('user'));
  const creatorId = user?.id;

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/skills/add');
      setSkills(response.data);
    } catch (error) {
      console.error('Error fetching skills:', error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!creatorId) {
      alert('Login required');
      return;
    }

    const skillData = {
      name: form.name,
      category: form.category,
      description: form.description,
      level: form.level,
      estimatedTime: form.estimatedTime,
      creator: { id: parseInt(creatorId) },
    };

    try {
      const res = await axios.post('http://localhost:8080/api/skills/add', skillData);
      console.log('Skill added:', res.data);
      alert("Skill added successfully");
      fetchSkills(); // refresh list
    } catch (error) {
      console.error('Failed to add skill:', error);
      alert("Failed to add skill");
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center mb-5">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">Add New Skill</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Skill Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Enter skill name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Category</label>
                  <input
                    type="text"
                    name="category"
                    className="form-control"
                    placeholder="Enter category"
                    value={form.category}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    name="description"
                    className="form-control"
                    placeholder="Enter description"
                    rows="3"
                    value={form.description}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Level</label>
                    <input
                      type="text"
                      name="level"
                      className="form-control"
                      placeholder="Beginner, Intermediate, etc."
                      value={form.level}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Estimated Time</label>
                    <input
                      type="text"
                      name="estimatedTime"
                      className="form-control"
                      placeholder="e.g. 2 weeks"
                      value={form.estimatedTime}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary w-100">Add Skill</button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <h4 className="mb-3">Skills List</h4>
      <div className="row">
        {skills.map((skill) => (
          <div className="col-md-4 mb-4" key={skill.id}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{skill.name}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{skill.category}</h6>
                <p className="card-text">{skill.description}</p>
              </div>
              <div className="card-footer text-muted small">
                Level: {skill.level} | Time: {skill.estimatedTime}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
