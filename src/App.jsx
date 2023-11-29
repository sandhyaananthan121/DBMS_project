// App.jsx
import React, { useState } from 'react';
import './App.css';
import Header from './Header';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Sidebar from './Sidebar';
import Home from './Home';
import Login from './Login';
import Q2 from './Q2';
import Q3 from './Q3';
import Q4 from './Q4';
import Q5 from './Q5';
import { UserProvider } from './UserContext';


function App() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };
  
  return (
    <Router>
      <UserProvider>
        <Switch>
          <Route path="/login" component={() => (
            <>
            <div className="login-main-container">
              <Header OpenSidebar={OpenSidebar} />
              <Login />
              </div>
            </>
          )} />
            
          <Route path="/q2" component={() => (
              <>
              <div className='grid-container'>
                <Header OpenSidebar={OpenSidebar} />
                <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
                <Q2 />
              </div>
              </>
            )} />
            <Route path="/q3" component={() => (
              <>
              <div className='grid-container'>
                <Header OpenSidebar={OpenSidebar} />
                <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
                <Q3 />
              </div>
              </>
            )} />
            <Route path="/q4" component={() => (
              <>
              <div className='grid-container'>
                <Header OpenSidebar={OpenSidebar} />
                <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
                <Q4 />
              </div>
              </>
            )} />
            <Route path="/q5" component={() => (
              <>
              <div className='grid-container'>
                <Header OpenSidebar={OpenSidebar} />
                <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
                <Q5/>
              </div>
              </>
            )} />
            <Route path="/"  render={() => (
              <>
              <div className='grid-container'>
                <Header OpenSidebar={OpenSidebar} />
                <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
                <Home />
              </div>
              </>
            )} />
        </Switch>
      </UserProvider>
    </Router>
  );
}

export default App;
