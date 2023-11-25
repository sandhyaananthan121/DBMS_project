import React from 'react'
import 
{BsCart3, BsGrid1X2Fill, BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, 
  BsListCheck, BsMenuButtonWideFill, BsFillGearFill, BsGlobeAmericas}
 from 'react-icons/bs'
 import { Link } from 'react-router-dom';

function Sidebar({openSidebarToggle, OpenSidebar}) {
  return (
    <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive": ""}>
        <div className='sidebar-title'>
            <div className='sidebar-brand'>
                <BsGlobeAmericas className='icon_header'/>Climate Change
            </div>
            <span className='icon close_icon' onClick={OpenSidebar}>X</span>
        </div>

        <ul className='sidebar-list'>
            <li className='sidebar-list-item'>
                <Link to="/q1" className="home-link">
                    <p> CO2 Produced by each sector </p>
                </Link>
            </li>
            <li className='sidebar-list-item'>
                <Link to="/q2" className="home-link">
                    <p>Co2 vs Greenhouse Gases Produced by each country per sqr fr</p>
                </Link>
            </li>
            <li className='sidebar-list-item'>
                <Link to="/q3" className="home-link">
                    <p>Co2 Produced By Country In comparision with GDP or Population</p>
                </Link>
            </li>
            <li className='sidebar-list-item'>
                <Link to="/q4" className="home-link">
                    <p>Global Surface Temperatures and Co2 Emissions vs Population Growth</p>
                </Link>
            </li>
            <li className='sidebar-list-item'>
                <Link to="/q5" className="home-link">
                    <p>Surface Temperature Change in Each Country </p>
                </Link>
            </li>
            <li className='sidebar-list-item'>
                <Link to="/q6" className="home-link">
                    <p>Co2 Emissions vs the Environmental Tax imposed on Each Country</p>
                </Link>
            </li>
        </ul>
    </aside>
  )
}

export default Sidebar