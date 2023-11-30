import React, { useState, useEffect } from 'react';
import './App.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


function Q2() {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedStartYear, setSelectedStartYear] = useState('');
  const [selectedEndYear, setSelectedEndYear] = useState('');
  const [chartData, setChartData] = useState([]);
  const [countries, setCountries] = useState([]);
  const [years, setYears] = useState([]);

  const handleStartYearChange = (e) => {
    setSelectedStartYear(e.target.value);
  };

  const handleEndYearChange = (e) => {
    setSelectedEndYear(e.target.value);
  };


  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
  };

  

  const handleApplyClick = (e) => {
    e.preventDefault();
    // Make an API call with selected data
    fetch(`http://localhost:3001/q2/main?selectedCountry=${selectedCountry}&selectedStartYear=${selectedStartYear}&selectedEndYear=${selectedEndYear}`)
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
      year: item[0], // Replace 'date' with your date key
      Co2_Emission: item[1], 
      Population_Growth : item[2]// Replace 'value' with your value key
    }));
  };

  const fetchYears = async () => {
    let val = 'year'
    try {
      const response = await fetch(`http://localhost:3001/q2?val=${val}`);
      if (!response.ok) {
        throw new Error('Failed to fetch years');
      }
      const data = await response.json();
      // Assuming data is an array of country names
      const sortedYears = data.sort((a, b) => a - b);
      setYears(sortedYears);
    } catch (error) {
      console.error('Error fetching years:', error);
    }
  };

  useEffect(() => {
    // Fetch countries when the component mounts
    fetchYears();
  }, []);
  // Fetch countries
  const fetchCountries = async () => {
    let val = 'country'
    try {
      const response = await fetch(`http://localhost:3001/q2?val=${val}`);
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
        <h3>CO2 Emission and Population Growth correlation on {selectedCountry} from {selectedStartYear} to {selectedEndYear}</h3>
      </div>

      <div className='charts'>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={300}
          data={chartData}
          margin={{
            top: 5,
            right: 20,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Co2_Emission" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="Population_Growth" stroke="#82ca9d" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>

        <form className='form-container'>
          <label htmlFor='countrySelector' className='form-label'>
            Country:
          </label>
          <select
            id='countrySelector'
            name='country'
            onChange={handleCountryChange}
            value={selectedCountry}
            className='form-select'
          >
            <option value=''>Select Country</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
            <br></br>
            <label htmlFor="startYear" className='form-label'>Start Year:</label>
            <select
            id='startYearSelector'
            name='startYear'
            onChange={handleStartYearChange}
            value={selectedStartYear}
            className='form-select'
          >
            <option value=''>Select Start Year </option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
            <br></br>
          <label htmlFor="endYear" className='form-label'>To Year:</label>
            <select
            id='endYear'
            name='endYear'
            onChange={handleEndYearChange}
            value={selectedEndYear}
            className='form-select'
          >
            <option value=''>Select End Year </option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
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

export default Q2
