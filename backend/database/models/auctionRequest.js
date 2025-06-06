const db = require("../index");

async function createAuctionRequest(
  userId,
  title,
  description,
  year,
  startPrice,
  imagePath
) {
  try {
    const [result] = await db.execute(
      "INSERT INTO auction_requests (user_id, title, description, year, start_price, image_path) VALUES (?, ?, ?, ?, ?, ?)",
      [userId, title, description, year, startPrice, imagePath]
    );
    return result.insertId;
  } catch (error) {
    console.error("Greska pri kreiranju zahteva za aukciju:", error);
    throw error;
  }
}

async function getAllAuctionRequests(limit = 10, offset = 0) {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM auction_requests LIMIT ? OFFSET ?",
      [limit, offset]
    );
    return rows;
  } catch (error) {
    console.error("Greška pri pronalaženju svih zahteva za aukciju:", error);
    throw error;
  }
}

async function getAuctionRequestById(id) {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM auction_requests WHERE id = ?",
      [id]
    );
    return rows[0];
  } catch (error) {
    console.error(
      `Greška pri pronalaženju zahteva za aukciju sa ID-jem ${id}:`,
      error
    );
    throw error;
  }
}

async function getAuctionRequestsByUser(userId, limit = 10, offset = 0) {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM auction_requests WHERE user_id = ? LIMIT ? OFFSET ?",
      [userId, limit, offset]
    );
    return rows;
  } catch (error) {
    console.error(
      `Greška pri pronalaženju zahteva za aukciju korisnika sa ID-jem ${userId}:`,
      error
    );
    throw error;
  }
}

async function getAuctionRequestsByStatus(status, limit = 10, offset = 0) {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM auction_requests WHERE status = ? LIMIT ? OFFSET ?",
      [status, limit, offset]
    );
    return rows;
  } catch (error) {
    console.error(
      `Greška pri pronalaženju zahteva za aukciju sa statusom ${status}:`,
      error
    );
    throw error;
  }
}

async function updateAuctionRequestStatus(id, status) {
  try {
    const [result] = await db.execute(
      "UPDATE auction_requests SET status = ? WHERE id = ?",
      [status, id]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error(
      `Greška pri ažuriranju statusa zahteva za aukciju sa ID-jem ${id}:`,
      error
    );
    throw error;
  }
}

async function updateAuctionRequest(
  id,
  title,
  description,
  year,
  startPrice,
  imagePath
) {
  const updates = {};
  const params = [];

  if (title !== undefined) {
    updates.title = title;
    params.push(title);
  }
  if (description !== undefined) {
    updates.description = description;
    params.push(description);
  }
  if (year !== undefined) {
    updates.year = year;
    params.push(year);
  }
  if (startPrice !== undefined) {
    updates.start_price = startPrice;
    params.push(startPrice);
  }
  if (imagePath !== undefined) {
    updates.image_path = imagePath;
    params.push(imagePath);
  }

  if (Object.keys(updates).length === 0) {
    return 0; // Nema podataka za ažuriranje
  }

  const updateClauses = Object.keys(updates)
    .map((key) => `${key} = ?`)
    .join(", ");
  params.push(id);

  try {
    const [result] = await db.execute(
      `UPDATE auction_requests SET ${updateClauses} WHERE id = ?`,
      params
    );
    return result.affectedRows;
  } catch (error) {
    console.error(
      `Greška pri ažuriranju zahteva za aukciju sa ID-jem ${id}:`,
      error
    );
    throw error;
  }
}

async function deleteAuctionRequest(id) {
  try {
    const [result] = await db.execute(
      "DELETE FROM auction_requests WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error(
      `Greška pri brisanju zahteva za aukciju sa ID-jem ${id}:`,
      error
    );
    throw error;
  }
}

async function countAllAuctionRequests() {
  try {
    const [rows] = await db.execute(
      "SELECT COUNT(*) AS total FROM auction_requests"
    );
    return rows[0].total;
  } catch (error) {
    console.error("Greška pri brojanju svih zahteva za aukciju:", error);
    throw error;
  }
}

async function countAuctionRequestsByStatus(status) {
  try {
    const [rows] = await db.execute(
      "SELECT COUNT(*) AS total FROM auction_requests WHERE status = ?",
      [status]
    );
    return rows[0].total;
  } catch (error) {
    console.error(
      `Greška pri brojanju zahteva za aukciju sa statusom ${status}:`,
      error
    );
    throw error;
  }
}

async function countAuctionRequestsByUser(userId) {
  try {
    const [rows] = await db.execute(
      "SELECT COUNT(*) AS total FROM auction_requests WHERE user_id = ?",
      [userId]
    );
    return rows[0].total;
  } catch (error) {
    console.error(
      `Greška pri brojanju zahteva za aukciju korisnika sa ID-jem ${userId}:`,
      error
    );
    throw error;
  }
}

module.exports = {
  createAuctionRequest,
  getAllAuctionRequests,
  getAuctionRequestById,
  getAuctionRequestsByUser,
  getAuctionRequestsByStatus,
  updateAuctionRequestStatus,
  updateAuctionRequest,
  deleteAuctionRequest,
  countAllAuctionRequests,
  countAuctionRequestsByStatus,
  countAuctionRequestsByUser,
};
