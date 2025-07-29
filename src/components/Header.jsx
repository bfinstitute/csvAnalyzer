import '../styles/Header.css';
import mainLogo from '../assets/images/LogoBFI.jpg'

export default function Header() {
  return (
    <header className="site-header">
      <div className="container">
        <div className="branding">
          <a href="/">
            <img src={mainLogo} alt="Better Futures Institute" className="logo"/>
          </a>
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