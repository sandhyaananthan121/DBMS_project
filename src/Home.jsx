import React, { useState } from 'react'
 import './App.css';
 import 
 { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } 
 from 'recharts';

function Home() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [sector, setSector] = useState('');
  const [chartData, setChartData] = useState([]);

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
  };
  const handleSector = (e) => {
    setSector(e.target.value);
  };

  const handleApplyClick = (e) => {
    e.preventDefault();
    console.log('Selected Country:', selectedCountry);
    console.log('Start Date:', startDate);
    console.log('End Date:', endDate);

    // Make an API call with selected data
    fetch(`http://localhost:3001/q1?selectedCountry=${selectedCountry}&startDate=${startDate}&endDate=${endDate}&sector=${sector}`)
      .then((response) => response.json())
      .then((data) => {
          const sortedData = [...data].sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );
          setChartData(sortedData);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  const transformDataForChart = (data) => {
    return data.map(([value, date]) => ({
      value,
      date,
    }));
  };

    // Perform some action with the selected data, e.g., make an API call
    


    const data = [
        {
          name: 'Page A',
          uv: 4000,
          pv: 2400,
          amt: 2400,
        },
        {
          name: 'Page B',
          uv: 3000,
          pv: 1398,
          amt: 2210,
        },
        {
          name: 'Page C',
          uv: 2000,
          pv: 9800,
          amt: 2290,
        },
        {
          name: 'Page D',
          uv: 2780,
          pv: 3908,
          amt: 2000,
        },
        {
          name: 'Page E',
          uv: 1890,
          pv: 4800,
          amt: 2181,
        },
        {
          name: 'Page F',
          uv: 2390,
          pv: 3800,
          amt: 2500,
        },
        {
          name: 'Page G',
          uv: 3490,
          pv: 4300,
          amt: 2100,
        },
      ];
     

  return (
    
    <main className='main-container'>
        <div className='main-title'>
            <h3>CO2 Produced by each sector</h3>
        </div>

        <div className='main-cards'>
            
        </div>

        <div className='charts'>
            <ResponsiveContainer width="100%" height="100%">
            <BarChart
            width={500}
            height={300}
            data={transformDataForChart(chartData)}
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
            }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
            
        <form className='form-container'>
        <label htmlFor="countrySelector" className='form-label'>Country:</label>
          <select
            id="countrySelector"
            name="country"
            onChange={handleCountryChange}
            value={selectedCountry}
            className="form-select"
          >
            <option value="">Select Country</option>
            <option value="USA">USA</option>
            <option value="Canada">Canada</option>
            <option value="UK">UK</option>
            {/* Add more country options here */}
          </select>
            <br></br>
          <label htmlFor="startDate" className='form-label'>Start Date:</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={startDate}
            onChange={handleStartDateChange}
            className='form-date-input'
          />
            <br></br>
          <label htmlFor="endDate" className='form-label'>End Date:</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={endDate}
            onChange={handleEndDateChange}
            className='form-date-input'
          />
            <br></br>
            <label htmlFor="sectorSelector" className='form-label'>Sector:</label>
            <select
            id="sectorSelector"
            name="sector"
            onChange={handleSector}
            value={sector}
            className="form-select"
          >
            <option value="">Select Sector</option>
            <option value="Power">Power</option>
            <option value="Residential">Residential</option>
            <option value="International Aviation">International Aviation</option>
            <option value="Ground Transport">Ground Transport</option>
            <option value="Domestic Aviation">Domestic Aviation</option>
            <option value="Industry">Industry</option>
            {/* Add more country options here */}
          </select>
          <br></br>
          <button type="submit" onClick={handleApplyClick} className='form-button'>
            Apply
          </button>
        </form>
            
        </div>
    </main>
  )
}

export default Home
