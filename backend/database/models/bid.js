const db = require("../index");

async function createBid(userId, carId, bidAmount) {
  try {
    const [result] = await db.execute(
      "INSERT INTO bids (user_id, car_id, bid_amount) VALUES (?, ?, ?)",
      [userId, carId, bidAmount]
    );
    return result.insertId;
  } catch (error) {
    console.error("Greška pri kreiranju ponude:", error);
    throw error;
  }
}

async function getBidById(id) {
  try {
    const [rows] = await db.execute("SELECT * FROM bids WHERE id = ?", [id]);
    return rows[0];
  } catch (error) {
    console.error(`Greška pri pronalaženju ponude sa ID-jem ${id}:`, error);
    throw error;
  }
}

async function getBidsByCarId(carId, limit = 10, offset = 0) {
  try {
    const [rows] = await db.execute(
      "SELECT b.*, u.username FROM bids b JOIN users u ON b.user_id = u.id WHERE b.car_id = ? ORDER BY b.bid_amount DESC, b.bid_time DESC LIMIT ? OFFSET ?",
      [carId, limit, offset]
    );
    return rows;
  } catch (error) {
    console.error(
      `Greška pri pronalaženju ponuda za automobil sa ID-jem ${carId}:`,
      error
    );
    throw error;
  }
}

async function getBidsByUserId(userId, limit = 10, offset = 0) {
  try {
    const [rows] = await db.execute(
      "SELECT b.*, c.title AS car_title FROM bids b JOIN cars c ON b.car_id = c.id WHERE b.user_id = ? ORDER BY b.bid_time DESC LIMIT ? OFFSET ?",
      [userId, limit, offset]
    );
    return rows;
  } catch (error) {
    console.error(
      `Greška pri pronalaženju ponuda korisnika sa ID-jem ${userId}:`,
      error
    );
    throw error;
  }
}

async function getHighestBidByCarId(carId) {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM bids WHERE car_id = ? ORDER BY bid_amount DESC LIMIT 1",
      [carId]
    );
    return rows[0];
  } catch (error) {
    console.error(
      `Greška pri pronalaženju najviše ponude za automobil sa ID-jem ${carId}:`,
      error
    );
    throw error;
  }
}

async function getAllBids(limit = 10, offset = 0) {
  try {
    const [rows] = await db.execute(
      "SELECT b.*, u.username, c.title AS car_title FROM bids b JOIN users u ON b.user_id = u.id JOIN cars c ON b.car_id = c.id ORDER BY b.bid_time DESC LIMIT ? OFFSET ?",
      [limit, offset]
    );
    return rows;
  } catch (error) {
    console.error("Greška pri pronalaženju svih ponuda:", error);
    throw error;
  }
}

async function deleteBid(id) {
  try {
    const [result] = await db.execute("DELETE FROM bids WHERE id = ?", [id]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error(`Greška pri brisanju ponude sa ID-jem ${id}:`, error);
    throw error;
  }
}

async function countBidsByCarId(carId) {
  try {
    const [rows] = await db.execute(
      "SELECT COUNT(*) AS total FROM bids WHERE car_id = ?",
      [carId]
    );
    return rows[0].total;
  } catch (error) {
    console.error(
      `Greška pri brojanju ponuda za automobil sa ID-jem ${carId}:`,
      error
    );
    throw error;
  }
}

async function countBidsByUserId(userId) {
  try {
    const [rows] = await db.execute(
      "SELECT COUNT(*) AS total FROM bids WHERE user_id = ?",
      [userId]
    );
    return rows[0].total;
  } catch (error) {
    console.error(
      `Greška pri brojanju ponuda korisnika sa ID-jem ${userId}:`,
      error
    );
    throw error;
  }
}

async function countAllBids() {
  try {
    const [rows] = await db.execute("SELECT COUNT(*) AS total FROM bids");
    return rows[0].total;
  } catch (error) {
    console.error("Greška pri brojanju svih ponuda:", error);
    throw error;
  }
}

module.exports = {
  createBid,
  getBidById,
  getBidsByCarId,
  getBidsByUserId,
  getHighestBidByCarId,
  getAllBids,
  deleteBid,
  countBidsByCarId,
  countBidsByUserId,
  countAllBids,
};
