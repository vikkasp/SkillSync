import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserResourceList = () => {
  const [resources, setResources] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [viewed, setViewed] = useState({}); // Track what user has clicked/viewed

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      setError("User not logged in");
      setLoading(false);
      return;
    }
    fetchResources(storedUserId);
  }, []);

  const fetchResources = (uId) => {
    axios.get(`http://localhost:8080/api/resources/user/${uId}/resources`)
      .then(res => {
        setResources(res.data);
      })
      .catch(err => {
        console.error("Error fetching user resources:", err);
        setError("Error fetching resources");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // group resources by folder
  const groupByFolder = (resources) =>
    resources.reduce((acc, resource) => {
      const folder = resource.folderName || 'Others';
      if (!acc[folder]) {
        acc[folder] = [];
      }
      acc[folder].push(resource);
      return acc;
    }, {});

  const handleComplete = async (resourceId) => {
    try {
      await axios.put(`http://localhost:8080/api/resources/${resourceId}/complete`);
      const storedUserId = localStorage.getItem("userId");
      fetchResources(storedUserId);
    } catch (err) {
      console.error("Failed to complete resource:", err);
      alert("Something went wrong");
    }
  };

  // when user clicks/view link
  const handleView = (r) => {
    setViewed(prev => ({ ...prev, [r.id]: true }));
    window.open(r.url, "_blank");
  };

  const grouped = groupByFolder(resources);

  return (
    <div className="container mt-4">
      <h3>User Resources</h3>

      {loading ? (
        <p>Loading resources...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : Object.keys(grouped).length === 0 ? (
        <p>No resources available.</p>
      ) : (
        Object.keys(grouped).map((folder) => (
          <div key={folder} className="mb-4">
            <h5 className="text-primary">{folder}</h5>
            <p><b>Progress:</b>{" "}
              {
                (() => {
                  const all = grouped[folder].length;
                  const done = grouped[folder].filter(x => x.isCompleted).length;
                  const percent = all ? Math.ceil(done * 100 / all) : 0;
                  return `${percent}%`;
                })()
              }
            </p>

            <ul className="list-group">
              {grouped[folder].map((res) => (
                <li key={res.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{res.title}</strong> ({res.type})<br />
                    {res.type?.startsWith("image") ? (
                      <img src={res.url} alt={res.title} style={{ maxWidth: '200px', marginTop: '10px' }} />
                    ) : (
                      <a style={{ cursor: "pointer", color: "blue" }}
                        onClick={() => handleView(res)}>
                        Download / View
                      </a>
                    )}
                  </div>

                  <div>
                    <input
                      type="checkbox"
                      checked={res.isCompleted}
                      disabled={res.isCompleted || !viewed[res.id]} // disable until viewed
                      onChange={() => handleComplete(res.id)}
                    />{" "}
                    {res.isCompleted
                      ? "Completed"
                      : (!viewed[res.id] ? "View to enable" : "Mark Complete")}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default UserResourceList;
