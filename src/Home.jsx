import React, { useState, useEffect } from 'react';
import './App.css';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

function Home() {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [year, setSelectedYear] = useState(''); // Default year value here
  const [sector, setSector] = useState('');
  const [chartData, setChartData] = useState([]);
  const [chartData1, setChartData1] = useState([]);
  const [countries, setCountries] = useState([]);
  const [sectors, setSectors] = useState([]);
  
  // Pie chart color variable
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
      setSectors(data);
      if (data.length > 0) {
        setSector(data[0]); // Set default value for sector if available
      }
    } catch (error) {
      console.error('Error fetching sector:', error);
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await fetch(`https://climatechangesandhya.onrender.com/q1/country`);
      if (!response.ok) {
        throw new Error('Failed to fetch countries');
      }
      const data = await response.json();
      setCountries(data);
      if (data.length > 0) {
        setSelectedCountry(data[0]); // Set default value for country if available
      }
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  useEffect(() => {
    fetchSector();
    fetchCountries();
  }, []);

  useEffect(() => {
    if (selectedCountry && year) {
      fetch(`https://climatechangesandhya.onrender.com/q1/side?selectedCountry=${selectedCountry}&selectedYear=${year}`)
        .then((response) => response.json())
        .then((data) => {
          setChartData(transformDataForChart(data));
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }
  }, [selectedCountry, year]);

  useEffect(() => {
    if (selectedCountry && sector) {
      fetch(`https://climatechangesandhya.onrender.com/q1/main?selectedCountry=${selectedCountry}&sector=${sector}`)
        .then((response) => response.json())
        .then((data1) => {
          setChartData1(transformDataForChart1(data1));
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }
  }, [selectedCountry, sector]);

  const transformDataForChart1 = (data) => {
    return data.map((item) => ({
      year: item[0],
      Sector_Contribution_Percentage: item[1],
    }));
  };

  const transformDataForChart = (data) => {
    return data.map((item) => ({
      sector: item[0],
      value: item[1],
    }));
  };

  const handleApplyClick1 = (e) => {
    e.preventDefault(); // Prevent form submission
    if (selectedCountry && sector) {
      fetch(`https://climatechangesandhya.onrender.com/q1/main?selectedCountry=${selectedCountry}&sector=${sector}`)
        .then((response) => response.json())
        .then((data1) => {
          setChartData1(transformDataForChart1(data1));
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }
  };

  const handleApplyClick = (e) => {
    e.preventDefault(); // Prevent form submission
    if (selectedCountry && year) {
      fetch(`https://climatechangesandhya.onrender.com/q1/side?selectedCountry=${selectedCountry}&selectedYear=${year}`)
        .then((response) => response.json())
        .then((data) => {
          setChartData(transformDataForChart(data));
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }
  };

  return (
    <main className='main-container'>
      <div className='main-title'>
        <h3>CO2 Contribution % by {selectedCountry} in {sector} Sector</h3>
      </div>
      <div className='a1'>
        <p>Unit in % CO2 emission</p>
      </div>
      <div className='charts'>
        {chartData1.length > 0 && (
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
        )}

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
          <br />
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
              <option key={sector} value={sector}>{sector}</option>
            ))}
          </select>
          <br />
          <button type="submit" onClick={handleApplyClick1} className='form-button'>
            Apply
          </button>
        </form>
      </div>
      <div className='mid'>
        <h4> Pie Chart of CO2 % contributed by all sectors in {selectedCountry} at {year} </h4>
      </div>
      <div className='charts'>
        {chartData.length > 0 && (
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
        )}

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
          <br />
          <label htmlFor='yearSelector' className='form-label'>
            Year:
          </label>
          <select
            id='yearSelector'
            name='year'
            onChange={handleYear}
            value={year}
            className='form-select'
          >
            <option value=''>Select Year</option>
            {/* Populate with available years if known */}
            <option value='2020'>2020</option>
            <option value='2021'>2021</option>
            <option value='2022'>2022</option>
            {/* Add more years as needed */}
          </select>
          <br />
          <button type="submit" onClick={handleApplyClick} className='form-button'>
            Apply
          </button>
        </form>
      </div>
    </main>
  );
}

export default Home;
