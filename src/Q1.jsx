import React, { useState, useEffect } from 'react';
import './App.css';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Q1() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [sector, setSector] = useState('');
  const [chartData, setChartData] = useState([]);
  const [countries, setCountries] = useState([]);
  const [sectors, setSectors] = useState([]);

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

  const fetchSector = async () => {
    try {
      const response = await fetch(`http://localhost:3001/q1/sector`);
      if (!response.ok) {
        throw new Error('Failed to fetch sectors');
      }
      const data = await response.json();
      // Assuming data is an array of country names
      setSectors(data);
    } catch (error) {
      console.error('Error fetching sector:', error);
    }
  };


  
  useEffect(() => {
    // Fetch countries when the component mounts
    fetchSector();
  }, []);

  

  const handleApplyClick = (e) => {
    e.preventDefault();
    // Make an API call with selected data
    fetch(`http://localhost:3001/q1?selectedCountry=${selectedCountry}&startDate=${startDate}&endDate=${endDate}&sector=${sector}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const sortedData = [...data].sort((a, b) => new Date(b.date) - new Date(a.date));
        setChartData(transformDataForChart(sortedData));
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
      console.log(chartData);
  };

  const transformDataForChart = (data) => {
    return data.map((item) => ({
      date: item[1], // Replace 'date' with your date key
      value: item[0], // Replace 'value' with your value key
    }));
  };

  


  // Fetch countries
  const fetchCountries = async () => {
    try {
      const response = await fetch(`http://localhost:3001/q1/country`);
      if (!response.ok) {
        throw new Error('Failed to fetch countries');
      }
      const data = await response.json();
      // Assuming data is an array of country names
      setCountries(data);
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  useEffect(() => {
    // Fetch countries when the component mounts
    fetchCountries();
  }, []);

  return (
    <main className='main-container'>
      <div className='main-title'>
        <h3>CO2 Produced By by {selectedCountry} in {sector} Sector </h3>
      </div>
      
        <div className='charts'>
          
            <ResponsiveContainer width="100%" height="100%">
            <BarChart
            width={500}
            height={300}
            data={chartData}
            margin={{
                top: 5,
                right: 20,
                left: 20,
                bottom: 35,
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
            {countries.map((country) => (
              <option key = {country} value={country}>{country}</option>
            ))}
          </select>
            <br></br>
            <p> (Dates available from 01-26-2019 to 01-26-2023)</p>
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
            {sectors.map((sector) => (
              <option key = {sector} value={sector}>{sector}</option>
            ))}
            
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

export default Q1
