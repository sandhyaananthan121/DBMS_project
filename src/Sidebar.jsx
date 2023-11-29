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