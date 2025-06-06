const db = require("../index");

async function addCarToFavorites(userId, carId) {
  try {
    const [result] = await db.execute(
      "INSERT INTO favorites (user_id, car_id) VALUES (?, ?)",
      [userId, carId]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Greška pri dodavanju automobila u favorite:", error);
    throw error;
  }
}

async function removeCarFromFavorites(userId, carId) {
  try {
    const [result] = await db.execute(
      "DELETE FROM favorites WHERE user_id = ? AND car_id = ?",
      [userId, carId]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Greška pri uklanjanju automobila iz favorita:", error);
    throw error;
  }
}

async function getUserFavorites(userId, limit = 10, offset = 0) {
  try {
    const [rows] = await db.execute(
      "SELECT c.* FROM favorites f JOIN cars c ON f.car_id = c.id WHERE f.user_id = ? LIMIT ? OFFSET ?",
      [userId, limit, offset]
    );
    return rows;
  } catch (error) {
    console.error(
      `Greška pri pronalaženju favorita korisnika sa ID-jem ${userId}:`,
      error
    );
    throw error;
  }
}

async function isCarInFavorites(userId, carId) {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM favorites WHERE user_id = ? AND car_id = ?",
      [userId, carId]
    );
    return rows.length > 0;
  } catch (error) {
    console.error(
      `Greška pri proveri da li je automobil sa ID-jem ${carId} u favoritima korisnika sa ID-jem ${userId}:`,
      error
    );
    throw error;
  }
}

async function countUserFavorites(userId) {
  try {
    const [rows] = await db.execute(
      "SELECT COUNT(*) AS total FROM favorites WHERE user_id = ?",
      [userId]
    );
    return rows[0].total;
  } catch (error) {
    console.error(
      `Greška pri brojanju favorita korisnika sa ID-jem ${userId}:`,
      error
    );
    throw error;
  }
}

module.exports = {
  addCarToFavorites,
  removeCarFromFavorites,
  getUserFavorites,
  isCarInFavorites,
  countUserFavorites,
};
