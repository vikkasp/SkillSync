import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8080/api/users/login', {
        email,
        password,
      });

       const userData = response.data;
      localStorage.setItem('user', JSON.stringify(response.data));
      localStorage.setItem('userId', userData.id);
         const role = userData.role?.toLowerCase();

if (role === 'admin') {
  navigate('/admin/dashboard');
} else if (role === 'user') {
  navigate('/user/dashboard');
} else {
  alert('Unknown role');
}

    } catch (error) {
      console.error('Login failed:', error);
      alert('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow-sm border-0 p-4" style={{ width: '100%', maxWidth: '450px' }}>
        <div className="text-center mb-4">
          <h2 className="text-primary fw-bold">SkillSync</h2>
          <p className="text-muted">Login to your account</p>
        </div>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-medium">Email Address</label>
            <input
              id="email"
              type="email"
              className="form-control rounded-pill"
              placeholder="e.g. abc12@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label fw-medium">Password</label>
            <input
              id="password"
              type="password"
              className="form-control rounded-pill"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 rounded-pill fw-semibold"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div className="text-center mt-3">
            <small>
              Don’t have an account?{' '}
              <a href="/register" className="text-decoration-none text-primary fw-medium">Register</a>
            </small>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;