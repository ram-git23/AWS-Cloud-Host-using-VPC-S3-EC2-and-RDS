const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 5000;
const mysql = require("mysql2");

app.use(cors());

//Create connection to MySQL
const con = mysql.createConnection({
  host: "<host>",
  user: "<username>",
  password: "<password>",
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
app.listen(PORT, "<public_IP>", () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
