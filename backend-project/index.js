
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

  app.get('/q1/country', async (req, res) => {
    try {
      // Your code to fetch data from Oracle DB
      const connection = await oracledb.getConnection(dbConfig);
      const result = await connection.execute('select distinct(country) from co2_sectorwise');
      await connection.close();
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/q1/sector', async (req, res) => {
    try {
      // Your code to fetch data from Oracle DB
      const connection = await oracledb.getConnection(dbConfig);
      const result = await connection.execute('select distinct(sector) from co2_sectorwise');
      await connection.close();
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


  // Q1 - Sector wise co2 emission % analysis compared to previous year growth 
  // Main Bar graph

  app.get('/q1/main', async (req, res) => {
    try {
      // Extract query parameters from the request URL
      let {  selectedCountry, sector } = req.query;
  
      // Modify your SQL query using the extracted parameters
      const query = `WITH SectorEmissions AS (
        SELECT
            CO2_SECTORWISE.COUNTRY,
            CO2_SECTORWISE.YEAR,
            CO2_SECTORWISE.SECTOR,
            SUM(CO2_SECTORWISE.VALUE) AS SECTOR_CO2_EMISSION
            --SUM(SUM(CO2_SECTORWISE.VALUE)) OVER (PARTITION BY CO2_SECTORWISE.COUNTRY, CO2_SECTORWISE.YEAR) AS TOTAL_EMISSIONS_YEAR
        FROM
            CO2_SECTORWISE
        GROUP BY
            CO2_SECTORWISE.COUNTRY,
            CO2_SECTORWISE.YEAR,
            CO2_SECTORWISE.SECTOR
    ),
    -- Calculating Total Emissions for Each Country and Year
    TotalEmissions AS (
        SELECT
            COUNTRY,
            YEAR,
            SUM(SECTOR_CO2_EMISSION) AS TOTAL_EMISSIONS
        FROM
            SectorEmissions
        GROUP BY
            COUNTRY,
            YEAR
    )
    ,
    -- Calculating Final Contribution Percentage for Each Sector
    FinalCte AS (
        SELECT
        SE.COUNTRY,
        SE.YEAR,
        SE.SECTOR,
        SE.SECTOR_CO2_EMISSION,
        TE.TOTAL_EMISSIONS,
            -- Calculating sector contribution percentage to total emissions
        (SE.SECTOR_CO2_EMISSION / TE.TOTAL_EMISSIONS) * 100 AS SECTOR_CONTRIBUTION_PERCENTAGE
        --SE.SECTOR_CO2_EMISSION - LAG(SE.SECTOR_CO2_EMISSION) OVER (PARTITION BY SE.COUNTRY, SE.SECTOR ORDER BY SE.YEAR) AS PREVIOUS_YEAR_SECTOR_EMISSION
    FROM
        SectorEmissions SE
    JOIN
        TotalEmissions TE ON SE.COUNTRY = TE.COUNTRY AND SE.YEAR = TE.YEAR
    ORDER BY
        SE.COUNTRY,
        SE.YEAR,
        SE.SECTOR)
    --main q Year and Sector Contribution Percentage
    
    SELECT Year,
    SECTOR_CONTRIBUTION_PERCENTAGE as sp
    FROM FinalCte
    where  country='${selectedCountry}' 
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

  // Pie Chart

  app.get('/q1/side', async (req, res) => {
    try {
      // Extract query parameters from the request URL
      let {  selectedCountry, selectedYear } = req.query;
  
      // Modify your SQL query using the extracted parameters
      const query = `WITH SectorEmissions AS (
        SELECT
            CO2_SECTORWISE.COUNTRY,
            CO2_SECTORWISE.YEAR,
            CO2_SECTORWISE.SECTOR,
            SUM(CO2_SECTORWISE.VALUE) AS SECTOR_CO2_EMISSION
            --SUM(SUM(CO2_SECTORWISE.VALUE)) OVER (PARTITION BY CO2_SECTORWISE.COUNTRY, CO2_SECTORWISE.YEAR) AS TOTAL_EMISSIONS_YEAR
        FROM
            CO2_SECTORWISE
        GROUP BY
            CO2_SECTORWISE.COUNTRY,
            CO2_SECTORWISE.YEAR,
            CO2_SECTORWISE.SECTOR
    ),
    -- Calculating Total Emissions for Each Country and Year
    TotalEmissions AS (
        SELECT
            COUNTRY,
            YEAR,
            SUM(SECTOR_CO2_EMISSION) AS TOTAL_EMISSIONS
        FROM
            SectorEmissions
        GROUP BY
            COUNTRY,
            YEAR
    )
    ,
    -- Calculating Final Contribution Percentage for Each Sector
    FinalCte AS (
        SELECT
        SE.COUNTRY,
        SE.YEAR,
        SE.SECTOR,
        SE.SECTOR_CO2_EMISSION,
        TE.TOTAL_EMISSIONS,
            -- Calculating sector contribution percentage to total emissions
        (SE.SECTOR_CO2_EMISSION / TE.TOTAL_EMISSIONS) * 100 AS SECTOR_CONTRIBUTION_PERCENTAGE
        --SE.SECTOR_CO2_EMISSION - LAG(SE.SECTOR_CO2_EMISSION) OVER (PARTITION BY SE.COUNTRY, SE.SECTOR ORDER BY SE.YEAR) AS PREVIOUS_YEAR_SECTOR_EMISSION
    FROM
        SectorEmissions SE
    JOIN
        TotalEmissions TE ON SE.COUNTRY = TE.COUNTRY AND SE.YEAR = TE.YEAR
    ORDER BY
        SE.COUNTRY,
        SE.YEAR,
        SE.SECTOR)
    --main q Year and Sector Contribution Percentage
    
    SELECT Sector,
    SECTOR_CONTRIBUTION_PERCENTAGE as sp
    FROM FinalCte
    where  country='${selectedCountry}' 
      AND year = '${selectedYear}'
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

//Q2


  app.get('/q2', async (req, res) => {
    try {
      // Your code to fetch data from Oracle DB
      let {val} = req.query;
      const connection = await oracledb.getConnection(dbConfig);
      let result = await connection.execute(`WITH PopulationGrowth AS (
        SELECT
            P1.COUNTRY,
            P1.YEAR,
            P1.VALUE AS POPULATION,
		-- Calculate percentage growth in population
            ((P1.VALUE - P0.VALUE) / P0.VALUE) * 100 AS POPULATION_GROWTH,
            (P1.VALUE - P0.VALUE)  AS POPULATION_GROWTH1  -- Calculate absolute growth in population
        FROM
            POPULATION P1
        JOIN
            POPULATION P0 ON P1.COUNTRY = P0.COUNTRY AND P1.YEAR = P0.YEAR + 1
    ),
-- Calculate Total CO2 Emissions for Each Year
    CO2Emission AS (
        SELECT
            C.COUNTRY,
            C.YEAR,
            SUM(C.VALUE) AS CO2_EMISSION
        FROM
            CO2_GREENHOUSE C
        GROUP BY C.COUNTRY,C.YEAR
    )
    , POpulationCO2 AS (
        SELECT DISTINCT
        PG.COUNTRY,
        PG.YEAR,
        PG.POPULATION_GROWTH,
        PG.POPULATION_GROWTH1,
        CE.CO2_EMISSION
    FROM
        PopulationGrowth PG
    JOIN
        CO2Emission CE ON PG.COUNTRY = CE.COUNTRY AND PG.YEAR = CE.YEAR
    ORDER BY
        PG.COUNTRY, PG.YEAR)
    , 
-- Calculate Rates of Change for Population Growth and CO2 Emission
RateChange AS (
        SELECT 
        COUNTRY,
        YEAR,
        POPULATION_GROWTH,
        POPULATION_GROWTH1,
        CO2_EMISSION,
-- Calculate lagged values for comparison
        LAG(POPULATION_GROWTH) OVER (PARTITION BY COUNTRY ORDER BY YEAR) as PopulationLag,
-- Calculate change in population growth
        POPULATION_GROWTH - LAG(POPULATION_GROWTH) OVER (PARTITION BY COUNTRY ORDER BY YEAR) AS PopulationChange,
-- Calculate lagged values for absolute growth
        LAG(POPULATION_GROWTH1) OVER (PARTITION BY COUNTRY ORDER BY YEAR) as PopulationLag1,
-- Calculate change in absolute population growth
        POPULATION_GROWTH1 - LAG(POPULATION_GROWTH1) OVER (PARTITION BY COUNTRY ORDER BY YEAR) AS PopulationChange1,
-- Calculate lagged values for CO2 emissions
        LAG(CO2_EMISSION) OVER (PARTITION BY COUNTRY ORDER BY YEAR) AS CO2Lag,
-- Calculate change in CO2 emissions        
CO2_EMISSION - LAG(CO2_EMISSION) OVER (PARTITION BY COUNTRY ORDER BY YEAR) AS CO2Change
        FROM POpulationCO2
    )

    SELECT 
    distinct(${val})
    FROM RateChange
    where PopulationChange<0
    and CO2Change<0
    and PopulationChange is NOT NULL
    AND CO2Change IS NOT NULL
    `);
  
      await connection.close();
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

  app.get('/q2/main', async (req, res) => {
    try {
      // Extract query parameters from the request URL
      let {  selectedCountry, selectedStartYear, selectedEndYear } = req.query;
      if (isNaN(selectedStartYear) || isNaN(selectedEndYear)) {
        res.status(400).json({ error: 'Invalid year format' });
        return;
      }
      
  
      // Modify your SQL query using the extracted parameters
      const query = `WITH PopulationGrowth AS (
        SELECT
            P1.COUNTRY,
            P1.YEAR,
            P1.VALUE AS POPULATION,
		-- Calculate percentage growth in population
            ((P1.VALUE - P0.VALUE) / P0.VALUE) * 100 AS POPULATION_GROWTH,
            (P1.VALUE - P0.VALUE)  AS POPULATION_GROWTH1  -- Calculate absolute growth in population
        FROM
            POPULATION P1
        JOIN
            POPULATION P0 ON P1.COUNTRY = P0.COUNTRY AND P1.YEAR = P0.YEAR + 1
    ),
-- Calculate Total CO2 Emissions for Each Year
    CO2Emission AS (
        SELECT
            C.COUNTRY,
            C.YEAR,
            SUM(C.VALUE) AS CO2_EMISSION
        FROM
            CO2_GREENHOUSE C
        GROUP BY C.COUNTRY,C.YEAR
    )
    , POpulationCO2 AS (
        SELECT DISTINCT
        PG.COUNTRY,
        PG.YEAR,
        PG.POPULATION_GROWTH,
        PG.POPULATION_GROWTH1,
        CE.CO2_EMISSION
    FROM
        PopulationGrowth PG
    JOIN
        CO2Emission CE ON PG.COUNTRY = CE.COUNTRY AND PG.YEAR = CE.YEAR
    ORDER BY
        PG.COUNTRY, PG.YEAR)
    , 
-- Calculate Rates of Change for Population Growth and CO2 Emission
RateChange AS (
        SELECT 
        COUNTRY,
        YEAR,
        POPULATION_GROWTH,
        POPULATION_GROWTH1,
        CO2_EMISSION,
-- Calculate lagged values for comparison
        LAG(POPULATION_GROWTH) OVER (PARTITION BY COUNTRY ORDER BY YEAR) as PopulationLag,
-- Calculate change in population growth
        POPULATION_GROWTH - LAG(POPULATION_GROWTH) OVER (PARTITION BY COUNTRY ORDER BY YEAR) AS PopulationChange,
-- Calculate lagged values for absolute growth
        LAG(POPULATION_GROWTH1) OVER (PARTITION BY COUNTRY ORDER BY YEAR) as PopulationLag1,
-- Calculate change in absolute population growth
        POPULATION_GROWTH1 - LAG(POPULATION_GROWTH1) OVER (PARTITION BY COUNTRY ORDER BY YEAR) AS PopulationChange1,
-- Calculate lagged values for CO2 emissions
        LAG(CO2_EMISSION) OVER (PARTITION BY COUNTRY ORDER BY YEAR) AS CO2Lag,
-- Calculate change in CO2 emissions        
CO2_EMISSION - LAG(CO2_EMISSION) OVER (PARTITION BY COUNTRY ORDER BY YEAR) AS CO2Change
        FROM POpulationCO2
    )
    SELECT Year,
    CO2_EMISSION,
    Population_Growth1 as Population_growth
    FROM RateChange
    where  country='${selectedCountry}' -- Parameter for selected country
    AND YEAR BETWEEN '${selectedStartYear}' AND '${selectedEndYear}' -- Parameters for selected year range
    and PopulationChange<0 -- Filter for negative population change
    and CO2Change<0 -- Filter for negative CO2 emission change
    and PopulationChange is NOT NULL -- Ensure non-null population change values
    AND CO2Change IS NOT NULL -- Ensure non-null CO2 emission change values


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


// Q3


app.get('/q3', async (req, res) => {
    try {
      // Your code to fetch data from Oracle DB
      let {val} = req.query;
      const connection = await oracledb.getConnection(dbConfig);
      let result = await connection.execute(`WITH CO2TaxData AS (
        SELECT distinct 
            CG.COUNTRY,
            CG.YEAR,
            CG.VALUE AS CO2_EMISSION,
            ET.EMISSIONS_TAXED,
     -- Subquery to get the maximum CO2 emissions from the previous year       
(
                SELECT MAX(PREVIOUS_CO2.VALUE)
                FROM CO2_GREENHOUSE PREVIOUS_CO2
                WHERE PREVIOUS_CO2.COUNTRY = CG.COUNTRY
                AND PREVIOUS_CO2.YEAR = CG.YEAR - 1
            ) AS PREVIOUS_CO2_EMISSION,
-- Subquery to get the maximum emissions taxed from the previous year
            (
                SELECT MAX(PREVIOUS_TAX.EMISSIONS_TAXED)
                FROM ENVIRONMENTAL_TAX PREVIOUS_TAX
                WHERE PREVIOUS_TAX.COUNTRY = ET.COUNTRY
                AND PREVIOUS_TAX.YEAR = ET.YEAR - 1
            ) AS PREVIOUS_EMISSIONS_TAXED
        FROM
            CO2_GREENHOUSE CG
        JOIN
            ENVIRONMENTAL_TAX ET ON CG.COUNTRY = ET.COUNTRY AND CG.YEAR = ET.YEAR
    )
    , 

-- Calculate Total CO2 Emissions and Total Tax for Each Year
TotalEmissionTax AS (
        SELECT distinct
        COUNTRY,
        YEAR,
        SUM(CO2_EMISSION) AS TotalCO2_EMISSION, -- Sum of CO2 emissions for the year
        SUM(EMISSIONS_TAXED) as TotalEMISSIONS_TAXED -- Sum of emissions taxed for the year
    FROM
        CO2TaxData
    GROUP BY
        COUNTRY, YEAR
    ), 
-- Calculate Rate of Change for CO2 Emissions and Tax
RateChange AS (
        SELECT distinct 
        c.COUNTRY,
        c.YEAR,
        TotalCO2_EMISSION,
        PREVIOUS_CO2_EMISSION,
        TotalEMISSIONS_TAXED,
        PREVIOUS_EMISSIONS_TAXED,
-- Calculate change in CO2 emissions
        TotalCO2_EMISSION - PREVIOUS_CO2_EMISSION AS CO2_EMISSION_CHANGE,
-- Calculate change in emissions taxed
        TotalEMISSIONS_TAXED - PREVIOUS_EMISSIONS_TAXED AS TAX_CHANGE
    FROM
        CO2TaxData c
        JOIN TotalEmissionTax t
        on c.country=t.country and c.year=t.year
    ORDER BY
        COUNTRY, YEAR
    ), 
-- Calculate Correlation Between CO2 Emission and Tax Change
CorrValue AS (
        SELECT YEAR,COUNTRY,
    -- Calculate correlation between CO2 emission change and tax change
CORR(CO2_EMISSION_CHANGE, TAX_CHANGE) OVER (PARTITION BY COUNTRY ORDER BY YEAR) as CO2_TAX_CORRELATION
        FROM RateChange
        WHERE
        CO2_EMISSION_CHANGE is not null
        and tax_change is not null
    )
-- Select Distinct Values from Correlation Data
    SELECT
    distinct(${val})
    From CorrValue

    `);
  
      await connection.close();
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

  app.get('/q3/main', async (req, res) => {
    try {
      // Extract query parameters from the request URL
      let {  selectedCountry, selectedStartYear, selectedEndYear } = req.query;
      if (isNaN(selectedStartYear) || isNaN(selectedEndYear)) {
        res.status(400).json({ error: 'Invalid year format' });
        return;
      }
      
  
      // Modify your SQL query using the extracted parameters
      const query = `
      WITH CO2TaxData AS (
        SELECT distinct 
            CG.COUNTRY,
            CG.YEAR,
            CG.VALUE AS CO2_EMISSION,
            ET.EMISSIONS_TAXED,
     -- Subquery to get the maximum CO2 emissions from the previous year       
(
                SELECT MAX(PREVIOUS_CO2.VALUE)
                FROM CO2_GREENHOUSE PREVIOUS_CO2
                WHERE PREVIOUS_CO2.COUNTRY = CG.COUNTRY
                AND PREVIOUS_CO2.YEAR = CG.YEAR - 1
            ) AS PREVIOUS_CO2_EMISSION,
-- Subquery to get the maximum emissions taxed from the previous year
            (
                SELECT MAX(PREVIOUS_TAX.EMISSIONS_TAXED)
                FROM ENVIRONMENTAL_TAX PREVIOUS_TAX
                WHERE PREVIOUS_TAX.COUNTRY = ET.COUNTRY
                AND PREVIOUS_TAX.YEAR = ET.YEAR - 1
            ) AS PREVIOUS_EMISSIONS_TAXED
        FROM
            CO2_GREENHOUSE CG
        JOIN
            ENVIRONMENTAL_TAX ET ON CG.COUNTRY = ET.COUNTRY AND CG.YEAR = ET.YEAR
    )
    , 

-- Calculate Total CO2 Emissions and Total Tax for Each Year
TotalEmissionTax AS (
        SELECT distinct
        COUNTRY,
        YEAR,
        SUM(CO2_EMISSION) AS TotalCO2_EMISSION, -- Sum of CO2 emissions for the year
        SUM(EMISSIONS_TAXED) as TotalEMISSIONS_TAXED -- Sum of emissions taxed for the year
    FROM
        CO2TaxData
    GROUP BY
        COUNTRY, YEAR
    ), 
-- Calculate Rate of Change for CO2 Emissions and Tax
RateChange AS (
        SELECT distinct 
        c.COUNTRY,
        c.YEAR,
        TotalCO2_EMISSION,
        PREVIOUS_CO2_EMISSION,
        TotalEMISSIONS_TAXED,
        PREVIOUS_EMISSIONS_TAXED,
-- Calculate change in CO2 emissions
        TotalCO2_EMISSION - PREVIOUS_CO2_EMISSION AS CO2_EMISSION_CHANGE,
-- Calculate change in emissions taxed
        TotalEMISSIONS_TAXED - PREVIOUS_EMISSIONS_TAXED AS TAX_CHANGE
    FROM
        CO2TaxData c
        JOIN TotalEmissionTax t
        on c.country=t.country and c.year=t.year
    ORDER BY
        COUNTRY, YEAR
    ), 
-- Calculate Correlation Between CO2 Emission and Tax Change
CorrValue AS (
        SELECT YEAR,COUNTRY,
    -- Calculate correlation between CO2 emission change and tax change
CORR(CO2_EMISSION_CHANGE, TAX_CHANGE) OVER (PARTITION BY COUNTRY ORDER BY YEAR) as CO2_TAX_CORRELATION
        FROM RateChange
        WHERE
        CO2_EMISSION_CHANGE is not null
        and tax_change is not null
    )
-- Select Distinct Values from Correlation Data
    SELECT YEAR,
    CO2_TAX_CORRELATION
    FROM CorrValue
    WHERE COUNTRY='${selectedCountry}'
        AND YEAR BETWEEN '${selectedStartYear}' AND '${selectedEndYear}'
        AND CO2_TAX_CORRELATION IS NOT NULL
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

  // Q4

  app.get('/q4', async (req, res) => {
    try {
      // Your code to fetch data from Oracle DB
      let {val} = req.query;
      const connection = await oracledb.getConnection(dbConfig);
      let result = await connection.execute(`WITH CO2_GDP AS (
        SELECT
          CG.COUNTRY,
          CG.YEAR,
          SUM(CG.VALUE) AS CO2_EMISSION,
          SUM(GDP.VALUE) AS GDP_VALUE
        FROM
          CO2_GREENHOUSE CG
          INNER JOIN GDP ON CG.COUNTRY = GDP.COUNTRY AND CG.YEAR = GDP.YEAR
        GROUP BY
          CG.COUNTRY, CG.YEAR
      ),
      -- Calculate Normalized Aggregate Rate and CO2 Score    
      CO2_SCORES AS (
        SELECT
          COUNTRY,
          YEAR,
          -- Calculate the normalized aggregate rate (CO2 Emission / GDP)
          CO2_EMISSION / GDP_VALUE AS NORMALIZED_AGGREGATE_RATE,
          CASE
          -- Assign CO2 scores based on CO2 emission thresholds
            WHEN CO2_EMISSION < 1000 THEN 5
            WHEN CO2_EMISSION < 5000 THEN 4
            WHEN CO2_EMISSION < 10000 THEN 3
            WHEN CO2_EMISSION < 20000 THEN 2
            ELSE 1
          END AS CO2_SCORE
        FROM
          CO2_GDP
      )
      
      SELECT
        distinct(${val})
      FROM
        CO2_SCORES
      `);
  
      await connection.close();
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


  app.get('/q4/main', async (req, res) => {
    try {
      // Extract query parameters from the request URL
      let {  selectedCountry, selectedStartYear, selectedEndYear } = req.query;
      if (isNaN(selectedStartYear) || isNaN(selectedEndYear)) {
        res.status(400).json({ error: 'Invalid year format' });
        return;
      }
      
  
      // Modify your SQL query using the extracted parameters
      const query = `WITH CO2_GDP AS (
        SELECT
          CG.COUNTRY,
          CG.YEAR,
          SUM(CG.VALUE) AS CO2_EMISSION, -- Sum of CO2 emissions for the selected year range and country
          SUM(GDP.VALUE) AS GDP_VALUE   -- Sum of GDP values for the selected year range and country
        FROM
          CO2_GREENHOUSE CG
          INNER JOIN GDP ON CG.COUNTRY = GDP.COUNTRY AND CG.YEAR = GDP.YEAR
        WHERE
          CG.YEAR between '${selectedStartYear}' and '${selectedEndYear}' -- Filter by selected year range
          and cg.Country = '${selectedCountry}' -- Filter by selected country
        GROUP BY
          CG.COUNTRY, CG.YEAR
      ),
 -- Calculate Normalized Aggregate Rate and CO2 Score    
      CO2_SCORES AS (
        SELECT
          COUNTRY,
          YEAR,
        -- Calculate the normalized aggregate rate (CO2 Emission / GDP)
          CO2_EMISSION / GDP_VALUE AS NORMALIZED_AGGREGATE_RATE,
        -- Assign CO2 scores based on CO2 emission thresholds
          CASE
            WHEN CO2_EMISSION < 1000 THEN 5
            WHEN CO2_EMISSION < 5000 THEN 4
            WHEN CO2_EMISSION < 10000 THEN 3
            WHEN CO2_EMISSION < 20000 THEN 2
            ELSE 1
          END AS CO2_SCORE
        FROM
          CO2_GDP
      )
      
      SELECT
        YEAR,
    -- Calculate the final aggregate value (Normalized Aggregate Rate * CO2 Score)
        NORMALIZED_AGGREGATE_RATE * CO2_SCORE AS FINAL_AGGREGATE_VALUE
      FROM
        CO2_SCORES
        ORDER BY YEAR

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

  // Q5

  app.get('/q5', async (req, res) => {
    try {
      const connection = await oracledb.getConnection(dbConfig);
      let result = await connection.execute(`WITH LandTemp AS (
        SELECT
          COUNTRY,
          YEAR,
          AVG(VALUE) AS AVG_LAND_TEMP
        FROM
          LANDTEMPDATA2
        GROUP BY
          COUNTRY, YEAR
      ),
      CO2Emissions AS (
        SELECT
          COUNTRY,
          YEAR,
          SUM(VALUE) AS TOTAL_CO2_EMISSIONS
        FROM
          CO2_GREENHOUSE
      --  WHERE
      --    POLUTANT = 'CO2'  -- Adjust the pollutant as needed
        GROUP BY
          COUNTRY, YEAR
      ),
      TemperatureScore AS (
        SELECT
          COUNTRY,
          YEAR,
          AVG_LAND_TEMP,
          CASE
            WHEN AVG_LAND_TEMP < 0 THEN 'Freezing'  -- Score for below freezing temperatures
            WHEN AVG_LAND_TEMP >= 0 AND AVG_LAND_TEMP < 10 THEN 'Cold'  -- Score for cold temperatures
            WHEN AVG_LAND_TEMP >= 10 AND AVG_LAND_TEMP < 20 THEN 'Mild'  -- Score for mild temperatures
            WHEN AVG_LAND_TEMP >= 20 AND AVG_LAND_TEMP < 30 THEN 'Warm'  -- Score for warm temperatures
            ELSE 'Hot'  -- Score for hot temperatures
          END AS TEMP_Range
        FROM
          LandTemp
      ), FinalData AS (
      SELECT
        TS.COUNTRY,
        TS.YEAR,
        TS.AVG_LAND_TEMP,
        CE.TOTAL_CO2_EMISSIONS,
        TS.TEMP_Range,
        CASE
            WHEN TOTAL_CO2_EMISSIONS >= 1 AND TOTAL_CO2_EMISSIONS < 1000000 THEN 'Low'  -- Score for Low CO2 emissions
            WHEN TOTAL_CO2_EMISSIONS >= 1000000 AND TOTAL_CO2_EMISSIONS < 3000000 THEN 'Average'  --Score for average CO2 emissions
            WHEN TOTAL_CO2_EMISSIONS >= 3000000 AND TOTAL_CO2_EMISSIONS < 10000000 THEN 'High'  -- Score for high CO2 emissions
            ELSE 'High'
          END AS CO2_RANGE
        -- Complicated scoring logic for Y axis
        --(TS.TEMP_SCORE * CE.TOTAL_CO2_EMISSIONS) / 100 AS COMPLICATED_Y_AXIS_CALCULATION
      FROM
        TemperatureScore TS
      JOIN
        CO2Emissions CE ON TS.COUNTRY = CE.COUNTRY AND TS.YEAR = CE.YEAR
      ORDER BY
        TS.COUNTRY, TS.YEAR
      )
      SELECT distinct(country)
      FROM FINALDATA
      
      `);
  
      await connection.close();
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


  app.get('/q5/main', async (req, res) => {
    try {
      // Extract query parameters from the request URL
      let {  selectedCountry, selectedTempRange, selectedCo2Range } = req.query;
      
  
      // Modify your SQL query using the extracted parameters
      const query = `WITH LandTemp AS (
        SELECT
          COUNTRY,
          YEAR,
          AVG(VALUE) AS AVG_LAND_TEMP
        FROM
          LANDTEMPDATA2
        GROUP BY
          COUNTRY, YEAR
      ),
      CO2Emissions AS (
        SELECT
          COUNTRY,
          YEAR,
          SUM(VALUE) AS TOTAL_CO2_EMISSIONS
        FROM
          CO2_GREENHOUSE
      --  WHERE
      --    POLUTANT = 'CO2'  -- Adjust the pollutant as needed
        GROUP BY
          COUNTRY, YEAR
      ),
      TemperatureScore AS (
        SELECT
          COUNTRY,
          YEAR,
          AVG_LAND_TEMP,
          CASE
            WHEN AVG_LAND_TEMP < 0 THEN 'Freezing'  -- Score for below freezing temperatures
            WHEN AVG_LAND_TEMP >= 0 AND AVG_LAND_TEMP < 10 THEN 'Cold'  -- Score for cold temperatures
            WHEN AVG_LAND_TEMP >= 10 AND AVG_LAND_TEMP < 20 THEN 'Mild'  -- Score for mild temperatures
            WHEN AVG_LAND_TEMP >= 20 AND AVG_LAND_TEMP < 30 THEN 'Warm'  -- Score for warm temperatures
            ELSE 'Hot'  -- Score for hot temperatures
          END AS TEMP_Range
        FROM
          LandTemp
      ), FinalData AS (
      SELECT
        TS.COUNTRY,
        TS.YEAR,
        TS.AVG_LAND_TEMP,
        CE.TOTAL_CO2_EMISSIONS,
        TS.TEMP_Range,
        CASE
            WHEN TOTAL_CO2_EMISSIONS >= 1 AND TOTAL_CO2_EMISSIONS < 1000000 THEN 'Low'  -- Score for Low CO2 emissions
            WHEN TOTAL_CO2_EMISSIONS >= 1000000 AND TOTAL_CO2_EMISSIONS < 3000000 THEN 'Average'  --Score for average CO2 emissions
            WHEN TOTAL_CO2_EMISSIONS >= 3000000 AND TOTAL_CO2_EMISSIONS < 10000000 THEN 'High'  -- Score for high CO2 emissions
            ELSE 'High'
          END AS CO2_RANGE
        -- Complicated scoring logic for Y axis
        --(TS.TEMP_SCORE * CE.TOTAL_CO2_EMISSIONS) / 100 AS COMPLICATED_Y_AXIS_CALCULATION
      FROM
        TemperatureScore TS
      JOIN
        CO2Emissions CE ON TS.COUNTRY = CE.COUNTRY AND TS.YEAR = CE.YEAR
      ORDER BY
        TS.COUNTRY, TS.YEAR
      )
      SELECT Year, TOTAL_CO2_EMISSIONS
      FROM FINALDATA
      WHERE TEMP_RANGE='${selectedTempRange}' -- Input drop down - Freezing, Cold, Mild, Warm, Hot
      and CO2_RANGE='${selectedCo2Range}'   -- Input drop down - Low, Average, High
      and country='${selectedCountry}'   
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
