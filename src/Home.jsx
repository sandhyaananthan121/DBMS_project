import React, { useState, useEffect } from 'react';
import './App.css';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Sector, Cell, } from 'recharts';

function Home() {
  
  const [selectedCountry, setSelectedCountry] = useState('');
  const [year, setSelectedYear] = useState('');
  const [sector, setSector] = useState('');
  const [chartData, setChartData] = useState([]);
  const [chartData1, setChartData1] = useState([]);
  const [countries, setCountries] = useState([]);
  const [sectors, setSectors] = useState([]);

  // pie chart variable
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#ff7300', '#413ea0'];


  const RADIAN = Math.PI / 180;

  
  const handleYear = (e) => {
    setSelectedYear(e.target.value);
  };

  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
  };

  const handleSector = (e) => {
    setSector(e.target.value);
  };

  const fetchSector = async () => {
    try {
      const response = await fetch(`https://climatechangesandhya.onrender.com/q1/sector`);
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

  const handleApplyClick1 = (e) => {
    e.preventDefault();
    // Make an API call with selected data
    fetch(`https://climatechangesandhya.onrender.com/q1/main?selectedCountry=${selectedCountry}&sector=${sector}`)
      .then((response) => response.json())
      .then((data1) => {
        setChartData1(transformDataForChart1(data1));
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
      console.log(chartData1);
  };

  const transformDataForChart1 = (data) => {
    return data.map((item) => ({
      year: item[0], // Replace 'date' with your date key
      Sector_Contribution_Percentage: item[1], // Replace 'value' with your value key
    }));
  };

  const handleApplyClick = (e) => {
    e.preventDefault();
    // Make an API call with selected data
    fetch(`https://climatechangesandhya.onrender.com/q1/side?selectedCountry=${selectedCountry}&selectedYear=${year}`)
      .then((response) => response.json())
      .then((data) => {
        setChartData(transformDataForChart(data));
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
      console.log(chartData);
  };

  const transformDataForChart = (data) => {
    return data.map((item) => ({
      sector: item[0], // Replace 'date' with your date key
      value: item[1], // Replace 'value' with your value key
    }));
  };

  


  // Fetch countries
  const fetchCountries = async () => {
    try {
      const response = await fetch(`https://climatechangesandhya.onrender.com/q1/country`);
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
        <h3>CO2 Contribution % by {selectedCountry} in {sector} Sector</h3>
      </div>
      <div className='a1'>
        <p>Unit in % Co2 emission</p>
      </div>
      <div className='charts'>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart
            width={500}
            height={500}
            data={chartData1}
            margin={{
              top: 5,
              right: 20,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='year' />
            <YAxis />
            
            <Tooltip />
            <Legend />
            <Bar dataKey='Sector_Contribution_Percentage' fill='#6784d8' />
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
          </select>
          <br></br>
          <button type="submit" onClick={handleApplyClick1} className='form-button'>
            Apply
          </button>
        </form>
        </div>
        <div className='mid'>
            <h4> Pie Chart of Co2 % contributed by all sectors in {selectedCountry} at {year} </h4>
        </div>
        <div className='charts'>
          
        <ResponsiveContainer width="100%" height="100%">
    <PieChart width={400} height={300}>
      <Pie
        data={chartData}
        cx="50%"
        cy="50%"
        labelLine={false}
        label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
          const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
          const x = cx + radius * Math.cos(-midAngle * RADIAN);
          const y = cy + radius * Math.sin(-midAngle * RADIAN);

          return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
              {`${chartData[index].sector}: ${(percent * 100).toFixed(0)}%`}
            </text>
          );
        }}
        outerRadius={120}
        fill="#8884d8"
        dataKey="value"
      >
        {chartData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
    </PieChart>
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
            <label htmlFor="sectorYear" className='form-label'>Year:</label>
            <select
            id="sectorYear"
            name="year"
            onChange={handleYear}
            value={year}
            className="form-select"
          >
            <option value="">Select Year</option>
            <option value="2019">2019</option>
            <option value="2020">2020</option>
            <option value="2021">2021</option>
            <option value="2022">2022</option>
            <option value="2023">2023</option>
            
            
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
