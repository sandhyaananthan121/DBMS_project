// App.jsx
import React, { useState } from 'react';
import './App.css';
import Header from './Header';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Sidebar from './Sidebar';
import Home from './Home';
import Login from './Login';
import Q2 from './q2';

function App() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };
  
  return (
    <Router>
      <Switch>
        <Route path="/login" component={() => (
          <>
          <div className="login-main-container">
            <Header OpenSidebar={OpenSidebar} />
            <Login />
            </div>
          </>
        )} />
        <Route path="/" render={() => (
            <>
            <div className='grid-container'>
              <Header OpenSidebar={OpenSidebar} />
              <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
              <Home />
            </div>
            </>
          )} />
        <Route path="/q2" component={() => (
            <>
            <div className='grid-container1'>
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
          <Route path="/q6" component={() => (
            <>
            <div className='grid-container'>
              <Header OpenSidebar={OpenSidebar} />
              <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
              <Q6 />
            </div>
            </>
          )} />
      </Switch>
    </Router>
  );
}

export default App;
