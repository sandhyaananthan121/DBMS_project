import React, { useState } from 'react';
import { Redirect } from 'react-router-dom'; // Import Redirect from react-router-dom

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = (event) => {
    event.preventDefault(); // Prevents the form from submitting

    // Simulating a basic authentication - replace this with actual authentication logic
    if (username === 'group32' && password === 'password') {
      setLoggedIn(true);
      alert('Login successful!');
      // You may redirect the user to another page upon successful login
    } else {
      alert('Invalid credentials. Please try again.');
    }
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  if (loggedIn) {
    // Redirect the user to the '/' route upon successful login
    return <Redirect to="/q1" />;
  }
  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          {/* Login form fields go here */}
          <input type="text" placeholder="Username" value={username} onChange={handleUsernameChange}/>
          <input type="password" placeholder="Password" value={password} onChange={handlePasswordChange}/>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
