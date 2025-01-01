const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
const PORT = process.env.PORT;
const IP = process.env.IP;

app.use(cors());

//Create connection to MySQL
const con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: "shop",
});

con.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database.");
});

const readUsers = async () => {
  return new Promise((res, rej) => {
    const sql = "SELECT * FROM products";
    con.query(sql, (err, results) => {
      if (err) {
        console.error("Error fetching users:", err);
        rej(err);
      }
      res(results);
    });
  });
};

// Define an API endpoint
app.get("/products", async (req, res) => {
  result = await readUsers();
  return res.json(result);
});

// Start the server
app.listen(PORT, IP, () => {
  console.log(`Server is running on http://${IP}:${PORT}`);
});
