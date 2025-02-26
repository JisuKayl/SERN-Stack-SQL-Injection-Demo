require("dotenv").config();
const express = require("express");
const app = express();
const port = 3000;
const mysql = require("mysql2");
const cors = require("cors");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL Database!");
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Vulnerable to SQL injection
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length > 0) {
      return res.status(200).json({
        success: true,
        user: {
          id: results[0].id,
          username: results[0].username,
          role: results[0].role,
        },
      });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }
  });
});

app.get("/users", (req, res) => {
  db.query("SELECT id, username, role FROM users", (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json(results);
  });
});

app.get("/users/:id", (req, res) => {
  const id = req.params.id;

  // Vulnerable to SQL injection
  const query = `SELECT id, username, role FROM users WHERE id = ${id}`;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length > 0) {
      res.status(200).json(results[0]);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  });
});

app.post("/users", (req, res) => {
  const { username, password, role } = req.body;

  // Vulnerable to SQL injection
  const query = `INSERT INTO users (username, password, role) VALUES ('${username}', '${password}', '${role}')`;

  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }

    res.status(201).json({
      id: result.insertId,
      username,
      role,
    });
  });
});

app.put("/users/:id", (req, res) => {
  const id = req.params.id;
  const { username, password, role } = req.body;

  // Vulnerable to SQL injection
  const query = `UPDATE users SET username = '${username}', password = '${password}', role = '${role}' WHERE id = ${id}`;

  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }

    if (result.affectedRows > 0) {
      res.status(200).json({ id, username, role });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  });
});

app.delete("/users/:id", (req, res) => {
  const id = req.params.id;

  // Vulnerable to SQL injection
  const query = `DELETE FROM users WHERE id = ${id}`;

  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }

    if (result.affectedRows > 0) {
      res.status(200).json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
