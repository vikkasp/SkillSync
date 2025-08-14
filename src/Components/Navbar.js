import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role?.toUpperCase(); // ADMIN or USER

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login'); // this should work if inside Router
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand" to="/">SkillSync</Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav me-auto">
          {role === 'USER' && (
            <>
              <li className="nav-item"><Link className="nav-link" to="/user/UserSkillList">Skills</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/user/MySkills">My Skills</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/goals">Goals</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/userresourceslist">Resources</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/feedback">Feedback</Link></li>
            </>
          )}

          {role === 'ADMIN' && (
            <>
              <li className="nav-item"><Link className="nav-link" to="/admin/dashboard">Admin Dashboard</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/admin/adminskilllist">SkillList</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/admin/adminresourcelist">ResourceList</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/admin/feedbacklist">FeedbackList</Link></li>
            </>
          )}
        </ul>

        <ul className="navbar-nav ms-auto">
          {user ? (
            <>
              <li className="nav-item">
                <span className="navbar-text me-3">Hello, {user.name}</span>
              </li>
              <li className="nav-item">
                <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/register">Register</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
