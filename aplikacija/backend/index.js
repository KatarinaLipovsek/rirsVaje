const express = require("express");
const mysql = require("mysql2");
const dotenv = require("dotenv");
const cors = require("cors"); 
const bcrypt = require('bcrypt');

// Load environment variables from .env file
dotenv.config({ path: "../.env" });

// Initialize Express app
const app = express();
const port = 5000;

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// Create MySQL connection using environment variables
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// Connect to MySQL database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

// Test route to check if the server and database are connected
app.get("/api/employees", (req, res) => {
  console.log("Fetching employees from the database...");
  const query = "SELECT * FROM employees";
  
  db.query(query, (err, results) => {
    if (err) {
      console.error("Failed to fetch employees:", err);
      return res.status(500).json({ error: "Failed to fetch employees" });
    }
    console.log("Employees fetched successfully:", results);
    res.json(results);
  });
});

// Login route
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body; 
  console.log("Login attempt:", { username }); 

  const query = "SELECT * FROM employees WHERE username = ?";
  db.query(query, [username], async (err, results) => {
      if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Database error" });
      }
      if (results.length === 0) {
          console.warn("Invalid credentials: User not found");
          return res.status(401).json({ success: false, message: "Invalid credentials" });
      }

      const user = results[0];
      console.log("Fetched user:", user);

      const match = await bcrypt.compare(password, user.password);
      
      if (match) {
          console.log("Login successful for user:", user.username);
          return res.json({ success: true, user }); 
      } else {
          console.warn("Invalid credentials: Incorrect password");
          return res.status(401).json({ success: false, message: "Invalid credentials" });
      }
  });
});





// Get work entries for a specific employee
app.get("/api/entries", (req, res) => {
  const employeeId = req.query.employeeId; 
  console.log("Fetching entries for employee ID:", employeeId);
  const query = "SELECT * FROM work_entries WHERE employee_id = ?";
  
  db.query(query, [employeeId], (err, results) => {
    if (err) {
      console.error("Failed to fetch entries:", err);
      return res.status(500).json({ error: "Failed to fetch entries" });
    }
    console.log("Fetched entries:", results);
    res.json(results); 
  });
});

// Update a specific work entry by ID
app.put("/api/entries/:id", (req, res) => {
  const id = req.params.id;
  const { hoursWorked, date, description } = req.body;

  console.log(`Updating entry with ID: ${id}`, { hoursWorked, date, description });

  const query = "UPDATE work_entries SET hours_worked = ?, date = ?, description = ? WHERE id = ?";
  
  db.query(query, [hoursWorked, date, description, id], (err, result) => {
      if (err) {
          console.error("Failed to update data:", err);
          return res.status(500).json({ error: "Failed to update data" });
      }
      console.log("Data updated successfully for ID:", id);
      res.status(200).json({ message: "Data updated successfully" });
  });
});

app.get("/api/entries/month", (req, res) => {
  const { employeeId, month } = req.query;

  if (!employeeId) {
    return res.status(400).json({ message: "Employee ID is required" });
  }

  console.log("Fetching total hours for month:", month, "and employee ID:", employeeId);

  let query = `
    SELECT 
      employees.*,  -- Select all columns from the employees table
      SUM(work_entries.hours_worked) AS total_hours
    FROM 
      work_entries
    LEFT JOIN 
      employees ON work_entries.employee_id = employees.id
    WHERE 
      MONTH(work_entries.date) = ?
  `;
  const queryParams = [month];

  // Check if employeeId is provided
  query += " AND employee_id = ?";  
  queryParams.push(employeeId);

  query += " GROUP BY work_entries.employee_id";  

  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error("Failed to fetch entries:", err);
      return res.status(500).json({ error: "Failed to fetch entries" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No entries found for the given criteria" });
    }

    console.log("Results:", results);
    res.json(results);  
  });
});

app.post("/api/dopust", (req, res) => {
  const { startDate, endDate, reason } = req.body;

  if (!startDate || !endDate || !reason) {
    return res.status(400).json({
      error: "Missing required fields",
    });
  }


    const query = `
  INSERT INTO dopust (employeeId, \`from\`, \`to\`, reason, status)
  VALUES (3, ?, ?, ?, 0)
`;

  db.query(query, [ startDate, endDate, reason], (err, result) => {
    if (err) {
      console.error("Failed to insert 'dopust' entry:", err);
      return res.status(500).json({ error: "Failed to insert 'dopust' entry" });
    }

    console.log("'Dopust' entry added successfully:", result);
    res.status(201).json({ message: "'Dopust' entry added successfully", id: result.insertId });
  });
});

app.post("/api/bolniska", (req, res) => {
  const { startDate, endDate, reason } = req.body;

  if (!startDate || !endDate ) {
    return res.status(400).json({
      error: "Missing required fields",
    });
  }


    const query = `
  INSERT INTO bolniska (employeeId, \`from\`, \`to\`, reason, status)
  VALUES (3, ?, ?, 0, 0)
`;

  db.query(query, [ startDate, endDate, reason], (err, result) => {
    if (err) {
      console.error("Failed to insert 'bolniska' entry:", err);
      return res.status(500).json({ error: "Failed to insert 'bolniska' entry" });
    }

    console.log("'bolniska' entry added successfully:", result);
    res.status(201).json({ message: "'bolniska' entry added successfully", id: result.insertId });
  });
});



if (process.env.NODE_ENV !== 'test') {
  app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
  });
}
module.exports = app; 
