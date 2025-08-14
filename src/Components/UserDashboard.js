import React from 'react';

export default function UserDashboard() {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="container mt-5">
      <h2 className="text-primary">Welcome {user?.name} </h2>
      <p><strong>Email:</strong> {user?.email}</p>
      <p><strong>Role:</strong> {user?.role}</p>

      <div className="mt-4">
        <button className="btn btn-danger rounded-pill" onClick={() => {
          localStorage.removeItem('user');
          window.location.href = '/login';
        }}>Logout</button>
      </div>
    </div>
  );
}
