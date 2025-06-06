const mysql = require("mysql2");
const dbConfig = require("../config/database");

const pool = mysql.createPool(dbConfig);

pool.getConnection((err, connection) => {
  if (err) {
    console.error("Greška pri povezivanju sa bazom podataka:", err);
    return;
  }
  console.log("Uspešno povezano sa MySQL bazom podataka!");
  connection.release();
});

module.exports = pool.promise();
