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
import Q6 from './Q6';


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
          <Route path="/q1"  render={() => (
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
