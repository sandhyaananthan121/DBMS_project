import React, { useState, useEffect } from 'react';
import './App.css';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


function Q5() {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedTempRange, setSelectedTempRange] = useState('');
  const [chartData, setChartData] = useState([]);
  const [countries, setCountries] = useState([]);
  const co2Ranges = ['Low', 'Average', 'High']; // Define co2Ranges here



  const handleTempRangeChange = (e) => {
    setSelectedTempRange(e.target.value);
  };


  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
  };

  

  const handleApplyClick = (e) => {
    e.preventDefault();
  
    Promise.all(
      co2Ranges.map((range) =>
        fetch(`http://localhost:3001/q5/main?selectedCountry=${selectedCountry}&selectedTempRange=${selectedTempRange}&selectedCo2Range=${range}`)
          .then((response) => response.json())
          .then((data) => ({
            range,
            data: data.map((item) => ({
              year: item[0], // Replace with your date key
              [`${range}_CO2_EMISSIONS`]: item[1], // Replace with your value key
            })),
          }))
      )
    )
      .then((results) => {
        const combinedData = results.reduce((acc, result) => {
          result.data.forEach((item) => {
            const existing = acc.find((entry) => entry.year === item.year);
            if (existing) {
              existing[`${result.range}_CO2_EMISSIONS`] = item[`${result.range}_CO2_EMISSIONS`];
            } else {
              acc.push(item);
            }
          });
          return acc;
        }, []);
  
        setChartData(combinedData);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };
  


  // Fetch countries
  const fetchCountries = async () => {
    try {
      const response = await fetch(`http://localhost:3001/q5`);
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
        <BarChart
          width={500}
          height={300}
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          {co2Ranges.map((range, index) => (
            <Bar key={index} dataKey={`${range}_CO2_EMISSIONS`} fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`} />
          ))}
        </BarChart>
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
            <label htmlFor="startYear" className='form-label'>Temp Range:</label>
            <select
            id='tempRange'
            name='tempRange'
            onChange={handleTempRangeChange}
            value={selectedTempRange}
            className='form-select'
          >
            <option value=''>Select Temperature Range </option>
            <option value='Freezing'>Freezing</option>
            <option value='Cold'>Cold</option>
            <option value='Mild'>Mild</option>
            <option value='Warm'>Warm</option>
            <option value='Hot'>Hot</option>
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

export default Q5
