import '../styles/Dashboard.css';

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard Preview</h1>
      <div className="dashboard-widgets">
        <div className="widget">📊 Summary Stats</div>
        <div className="widget">📈 Charts</div>
        <div className="widget">🧠 AI Insights</div>
        <div className="widget">📁 Export Options</div>
      </div>
    </div>
  );
}
