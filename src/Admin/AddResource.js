import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AddResource() {
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    url: '',
    folder: '',
    skillId: ''
  });

  const [file, setFile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [skillsLoading, setSkillsLoading] = useState(true);

  // Fetch all skills on component mount
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/skills');
        if (Array.isArray(response.data)) {
          const safeSkills = response.data.map(skill => ({
            id: skill.id,
            name: skill.name,
            level: skill.level || 'N/A'
          }));
          setSkills(safeSkills);
        } else {
          throw new Error("Unexpected response format from server");
        }
      } catch (err) {
        console.error("Error fetching skills:", err);
        setError("Failed to load skills.");
      } finally {
        setSkillsLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // If user changes type, clear file and url
    if (name === 'type') {
      setFile(null);
      setFormData(prev => ({
        ...prev,
        url: '',
      }));
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.title || !formData.type || !formData.skillId) {
      setMessage('Please fill all required fields.');
      return;
    }

    // For type “article”, file is required and URL is ignored
    if (formData.type === 'article' && !file) {
      setMessage('Please select a file to upload for type Article.');
      return;
    }

    // For other types, URL is required
    if (formData.type !== 'article' && !formData.url) {
      setMessage('Please enter a URL.');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      if (formData.type === 'article') {
        // Use multipart/form-data upload for article with file
        const multipartFormData = new FormData();
        multipartFormData.append('file', file);
        multipartFormData.append('title', formData.title);
        multipartFormData.append('type', formData.type);
        multipartFormData.append('skillId', formData.skillId);
        if (formData.folder) {
          multipartFormData.append('folderName', formData.folder);
        }

        await axios.post('http://localhost:8080/api/resources/upload', multipartFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        // Normal JSON payload for other types with URL
        await axios.post('http://localhost:8080/api/resources', {
          title: formData.title,
          type: formData.type,
          url: formData.url,
          folderName: formData.folder || null,
          skillId: formData.skillId
        });
      }

      setMessage('✅ Resource created successfully!');
      setFormData({
        title: '',
        type: '',
        url: '',
        folder: '',
        skillId: ''
      });
      setFile(null);
    } catch (error) {
      console.error("Error creating resource:", error);
      setMessage(error.response?.data?.message || '❌ Failed to create resource');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add New Resource</h2>

      {message && (
        <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-danger'}`}>
          {message}
        </div>
      )}

      {skillsLoading ? (
        <div className="text-center my-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading skills...</p>
        </div>
      ) : skills.length === 0 ? (
        <div className="alert alert-warning">
          No skills available. Please create skills first.
        </div>
      ) : (
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-3">
            <label className="form-label">Title*</label>
            <input
              type="text"
              className="form-control"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Type*</label>
            <select
              className="form-control"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="">Select type</option>
              <option value="video">Video</option>
              <option value="article">Article</option>
              <option value="document">Document</option>
            </select>
          </div>

          {formData.type === 'article' ? (
            <div className="mb-3">
              <label className="form-label">Upload File*</label>
              <input
                type="file"
                className="form-control"
                accept=".pdf,.doc,.docx,.txt,.md" // adjust allowed file types as you see fit
                onChange={handleFileChange}
                required
              />
            </div>
          ) : (
            <div className="mb-3">
              <label className="form-label">URL*</label>
              <input
                type="url"
                className="form-control"
                name="url"
                value={formData.url}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="mb-3">
            <label className="form-label">Skill*</label>
            <select
              className="form-control"
              name="skillId"
              value={formData.skillId}
              onChange={handleChange}
              required
            >
              <option value="">Select skill</option>
              {skills.map(skill => (
                <option key={skill.id} value={skill.id}>
                  {skill.name} ({skill.level})
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Folder (optional)</label>
            <input
              type="text"
              className="form-control"
              name="folder"
              value={formData.folder}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Resource'}
          </button>
        </form>
      )}
    </div>
  );
}

export default AddResource;
