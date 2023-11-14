import React, { useState } from 'react';
import './App.css';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

function Q2() {
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

  // Replace the sample data with your own dataset for the line graph
 

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>CO2 </h3>
      </div>

      <div className="main-cards"></div>

      <div className="charts">
        

        <form className="form-container">
          <label htmlFor="countrySelector" className="form-label">
            Country:
          </label>
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
          <label htmlFor="startDate" className="form-label">
            Start Date:
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={startDate}
            onChange={handleStartDateChange}
            className="form-date-input"
          />
          <br></br>
          <label htmlFor="endDate" className="form-label">
            End Date:
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={endDate}
            onChange={handleEndDateChange}
            className="form-date-input"
          />
          <br></br>
          <button type="submit" onClick={handleApplyClick} className="form-button">
            Apply
          </button>
        </form>
      </div>
    </main>
  );
}

export default Q2;
