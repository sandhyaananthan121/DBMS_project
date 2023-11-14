// Header.jsx
import React from 'react';
import { BsPersonCircle, BsJustify, BsHouseExclamation } from 'react-icons/bs';
import { Link } from 'react-router-dom';

function Header() {
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
        <Link to="/login" className="login-link">
          Login <BsPersonCircle className="icon" />
        </Link>
      </div>
    </header>
  );
}

export default Header;
