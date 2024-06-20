import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../css/style.css';
import '../css/general.css';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    setTimeout(() => {
      navigate('/login');
    }, 1200);
  };

  const handleLogoClick = () => {
    const userIsLoggedIn = localStorage.getItem('userIsLoggedIn');
    const userData = JSON.parse(localStorage.getItem('userData'));

    if (userIsLoggedIn && userData) {
      if (userData.role === 'doctor') {
        navigate('/doctors/home');
      } else if (userData.role === 'sick') {
        navigate('/sicks/home');
      }
    } else {
      navigate('/');
    }
  };

  const renderButton = () => {
    const parts = location.pathname.split('/').filter(Boolean); // Filter out empty strings
    const profileLinkUrl = `/${parts.slice(0, 2).join('/')}/profile`;

    if (location.pathname.startsWith('/sicks/') || location.pathname.startsWith('/doctors/home')) {
      const userData = JSON.parse(localStorage.getItem('userData'));
      
      if (!userData) {
        navigate('/login');
        return null;
      }

      const photoProfileUrl = userData.photoProfileUrl;
      return (
        <nav>
          <ul>
            <div 
              className="profile-img" 
              style={{ backgroundImage: `url(${photoProfileUrl})` }}>
              <a href={profileLinkUrl}></a>
            </div>
            {userData.role === 'doctor' && (
              <a href="/doctors/home/articles" className="start-btn">Articles</a>
            )}
            <button onClick={handleLogout} className="start-btn">
              Logout
            </button>
          </ul>
        </nav>
      );
    }
    switch (location.pathname) {
      case '/login':
        return <Link to="/register" className="start-btn">Sign Up</Link>;
      case '/register':
        return <Link to="/login" className="start-btn">Login</Link>;
      case '/forgot':
        return <Link to="/login" className="start-btn">Login</Link>;  
      default:
        return <Link to="/login" className="start-btn">Start Now</Link>;
    }
  };

  return (
    <header>
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <h2>
              <span onClick={handleLogoClick} style={{ cursor: 'pointer' }}>Medics</span>
            </h2>
          </div>
          <div className="start">
            {renderButton()}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
