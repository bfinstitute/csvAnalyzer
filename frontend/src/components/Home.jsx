import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to CSV Magic</h1>
      <button
        className="home-button"
        onClick={() => navigate('/upload')}
      >
        Try out CSV
      </button>
    </div>
  );
}
