import React, { useState }  from 'react'
 import './App.css';
 import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


function Q3() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('');

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };

    const handleCountryChange = (e) => {
        setSelectedCountry(e.target.value);
    };

    const handleApplyClick = (e) => {
        e.preventDefault();
        console.log('Selected Country:', selectedCountry);
        console.log('Start Date:', startDate);
        console.log('End Date:', endDate);
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
            <AreaChart
          width={500}
          height={400}
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
        </AreaChart>
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
          <button type="submit" onClick={handleApplyClick} className='form-button'>
            Apply
          </button>
        </form>
            
        </div>
    </main>
  )
}

export default Q3