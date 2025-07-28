import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import '../styles/SignIn.css';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setSignedIn } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (email && password) {
      try {
        const res = await fetch('http://localhost:5000/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (data.success) {
          setSignedIn(true);
          navigate('/upload');
        } else {
          alert(data.message || 'Login failed');
        }
      } catch (err) {
        alert('Error connecting to server');
      }
    } else {
      alert('Please fill out all fields.');
    }
  };

  return (
    <div className="signin-container">
      <form className="signin-form" onSubmit={handleLogin}>
        <h2>Sign In</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
