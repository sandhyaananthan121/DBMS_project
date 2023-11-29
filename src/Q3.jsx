import React, { useState, useEffect } from 'react';
import './App.css';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';



function Q3() {
  const [selectedCountry1, setSelectedCountry1] = useState('');
  const [selectedCountry2, setSelectedCountry2] = useState('');
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


  const handleCountryChange1 = (e) => {
    setSelectedCountry1(e.target.value);
  };
  const handleCountryChange2 = (e) => {
    setSelectedCountry2(e.target.value);
  };

  

  const handleApplyClick = (e) => {
    e.preventDefault();
    // Make API calls for both selected countries
    Promise.all([
      fetch(`http://localhost:3001/q3/main?selectedCountry=${selectedCountry1}&selectedStartYear=${selectedStartYear}&selectedEndYear=${selectedEndYear}`),
      fetch(`http://localhost:3001/q3/main?selectedCountry=${selectedCountry2}&selectedStartYear=${selectedStartYear}&selectedEndYear=${selectedEndYear}`)
    ])
      .then((responses) => Promise.all(responses.map((response) => response.json())))
      .then((data) => {
        const [dataCountry1, dataCountry2] = data;
        const sortedDataCountry1 = [...dataCountry1].sort((a, b) => new Date(b.date) - new Date(a.date));
        const sortedDataCountry2 = [...dataCountry2].sort((a, b) => new Date(b.date) - new Date(a.date));

        const chartData = transformDataForChart(sortedDataCountry1, sortedDataCountry2);
        setChartData(chartData);
      })
      .catch((error) => {
        console.error('Error fetching data for both countries:', error);
      });
  };

  const transformDataForChart = (dataCountry1 = [], dataCountry2 = []) => {
    // Check if either dataset is empty or undefined
    if (!dataCountry1.length || !dataCountry2.length) {
      console.error('Data for one or both countries is missing');
      return [];
    }
  
    // Determine the length of the shorter dataset
    const minLength = Math.min(dataCountry1.length, dataCountry2.length);
  
    // Combine the data for both countries into a single dataset up to the length of the shorter dataset
    const combinedData = [];
    for (let i = 0; i < minLength; i++) {
      combinedData.push({
        year: dataCountry1[i][0], // Replace with your date key
        Co2_Tax_correlation_country1: dataCountry1[i][1], // Replace with your value key for country 1
        Co2_Tax_correlation_country2: dataCountry2[i][1] // Replace with your value key for country 2
      });
    }
  
    return combinedData;
  };
  



  const fetchYears = async () => {
    let val = 'year'
    try {
      const response = await fetch(`http://localhost:3001/q3?val=${val}`);
      if (!response.ok) {
        throw new Error('Failed to fetch years');
      }
      const data = await response.json();
      // Assuming data is an array of country names
      setYears(data);
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
      const response = await fetch(`http://localhost:3001/q3?val=${val}`);
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
        <h3>CO2 Contribution % by  Sector</h3>
      </div>

      <div className='charts'>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          width={500}
          height={400}
          data={chartData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="Co2_Tax_correlation_country1" stackId="1" stroke="#8884d8" fill="#8884d8" />
          <Area type="monotone" dataKey="Co2_Tax_correlation_country2" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
        </AreaChart>
      </ResponsiveContainer>

        <form className='form-container'>
          <label htmlFor='countrySelector' className='form-label'>
            Country 1:
          </label>
          <select
            id='countrySelector'
            name='country'
            onChange={handleCountryChange1}
            value={selectedCountry1}
            className='form-select'
          >
            <option value=''>Select Country -1 </option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          
          </select>

            <br></br>
            <label htmlFor='countrySelector' className='form-label'>
            Country 2:
          </label>
            <select
            id='countrySelector'
            name='country'
            onChange={handleCountryChange2}
            value={selectedCountry2}
            className='form-select'
          >
            <option value=''>Select Country -2 </option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
            <br></br>
            <label htmlFor="startYear" className='form-label'>Start Year:</label>
            <select
            id='startYear'
            name='startYear'
            onChange={handleStartYearChange}
            value={selectedStartYear}
            className='form-select'
          >
            <option value=''>Select Start Year: </option>
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
            <option value=''>Select End Year: </option>
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

export default Q3
