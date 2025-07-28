import '../styles/Header.css';

export default function Header() {
  return (
    <header className="site-header">
      <div className="container">
        <div className="branding">
          {/* <img src="/logo.png" alt="Houston Data" className="logo" /> */}
          <h1>Better Futures Institute</h1>
        </div>
        <nav className="nav-links">
          <a href="/">Home</a>
          <a href="#dashboard">Dashboard</a>
          <a href="#upload">Upload CSV</a>
          <a href="#about">About</a>
        </nav>
      </div>
    </header>
  );
}