// Header.jsx
import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { UserContext } from './UserContext';
import { BsPersonCircle, BsJustify, BsHouseExclamation } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

function Header() {
  const { username, setUsername } = useContext(UserContext);
  const location = useLocation();
  const history = useHistory();

  // Function to parse query parameters from the URL
  const getQueryParam = (param) => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get(param);
  };
  
  const handleLogout = () => {
    setUsername(''); // Clear the username in the context
    history.push('/login'); // Redirect to the login page after logout
  };

  // Get the username from the query parameters
  const queryParamsUsername = getQueryParam('username');

  // If username exists in query parameters, update the context
  if (queryParamsUsername && queryParamsUsername !== username) {
    setUsername(queryParamsUsername);
  }
  return (
    <header className="header">
      <div className="menu-icon">
        <BsJustify className="icon" />
      </div>
      <div className="header-left">
        <Link to="/" className="home-link">
          <BsHouseExclamation className="icon" /> Home
        </Link>
      </div>
      <div className="header-right">
        
        {username ? (
          // If username exists in context
          <Link to='' className="login-link" onClick={handleLogout}>
            {username} (Click to logout) <BsPersonCircle className="icon" />
          </Link>
        ) : (
          // If username doesn't exist in context
          <Link to="/login" className="login-link">
            Login <BsPersonCircle className="icon" />
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;
