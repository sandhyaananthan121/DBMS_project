import React , { useState, useEffect } from 'react'
import 
{BsCart3, BsGrid1X2Fill, BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, 
  BsListCheck, BsMenuButtonWideFill, BsFillGearFill, BsGlobeAmericas}
 from 'react-icons/bs'
 import { Link } from 'react-router-dom';
 import PopupMessage from './PopupMessage';

function Sidebar({openSidebarToggle, OpenSidebar}) {
    const [data, setData] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const fetchDataFromBackend = () => {
        fetch('http://localhost:3001/total') // Replace with your actual backend endpoint
          .then(response => response.json())
          .then(data => {
            setData(data);
            setIsPopupOpen(true); // Display the fetched data
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
      };
    
      const handleButtonClick = () => {
        console.log('Button clicked');
        fetchDataFromBackend();
      };

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
                <Link to="/" className="home-link">
                    <p> CO2 Emission Contribution Percentage in Each Sector</p>
                </Link>
            </li>
            <li className='sidebar-list-item'>
                <Link to="/q1" className="home-link">
                    <p> CO2 Produced by each sector during a Time Period</p>
                </Link>
            </li>
            <li className='sidebar-list-item'>
                <Link to="/q2" className="home-link">
                    <p>CO2 Emission and Population Growth correlation During Given Period</p>
                </Link>
            </li>
            <li className='sidebar-list-item'>
                <Link to="/q3" className="home-link">
                    <p>CO2 Emission levels affected by Environmental Tax Correlation between two countries on a given period</p>
                </Link>
            </li>
            <li className='sidebar-list-item'>
                <Link to="/q4" className="home-link">
                    <p>Normalized Aggregate rate for CO2 emission taking into account GDP over a period</p>
                </Link>
            </li>
            <li className='sidebar-list-item'>
                <Link to="/q5" className="home-link">
                    <p>Total Co2 Emissions affected by Temperature Range grouped by level of Co2 emission on a country</p>
                </Link>
            </li>
            <li className='sidebar-list-item'>
                <button onClick={handleButtonClick}>Get Total Number of Tupes Across Data</button>
            </li>
            <PopupMessage
            isOpen={isPopupOpen}
            onClose={() => setIsPopupOpen(false)}
            data={data}
            />
        </ul>
    </aside>
  )
}

export default Sidebar