
const express = require('express');
const cors = require('cors'); // Import the 'cors' package
const app = express();
const oracledb = require('oracledb');

app.use(express.json());
app.use(cors()); // Use the 'cors' middleware to allow CORS requests

// ... Your other routes and configurations
// Oracle DB connection configuration
const dbConfig = {
    user: 'sandhyaananthan',
    password: 'WAw3TCvjPxzWj9uan52LsK3j',
    connectString: 'oracle.cise.ufl.edu:1521/orcl' // Change this to your Oracle connection string
  };
// Example endpoint to retrieve data
app.get('/total', async (req, res) => {
  try {
    // Your code to fetch data from Oracle DB
    const connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute('select sum(t) from (SELECT count(*) as t from co2_sectorwise union all select count(*) from co2_greenhouse union all select count(*) from envi_co2 union all select count(*) from environmental_tax union all select count(*) from gdp union all select count(*) from gdp_co2 union all select count(*) from landtemp_co2 union all select count(*) from landtempdata union all select count(*) from population union all select count(*) from population_co2)');
    await connection.close();
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/q1', async (req, res) => {
    try {
      // Extract query parameters from the request URL
      let { startDate, endDate, selectedCountry, sector } = req.query;
      if (!isNaN(Date.parse(startDate)) && !isNaN(Date.parse(endDate))) {
        startDate = formatDate(startDate);
        endDate = formatDate(endDate);
      } else {
        // Handle invalid date format
        res.status(400).json({ error: "Invalid date format" });
        return;
      }
  
      // Modify your SQL query using the extracted parameters
      const query = `SELECT value, date_recorded 
      FROM co2_sectorwise 
      WHERE TO_DATE(date_recorded, 'DD/MM/YYYY') BETWEEN TO_DATE('${startDate}', 'DD/MM/YYYY') AND TO_DATE('${endDate}', 'DD/MM/YYYY') 
      AND country='${selectedCountry}' 
      AND sector = '${sector}'
      `;
  
      // Your code to fetch data from Oracle DB using the modified query
      const connection = await oracledb.getConnection(dbConfig);
      const result = await connection.execute(query);
      await connection.close();
  
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

function formatDate(dateString) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
    }
    const day = date.getDate()+1;
    const month = date.getMonth() +1; // Months are zero-indexed
    const year = date.getFullYear();
  
    return `${day}/${month}/${year}`;
  }
