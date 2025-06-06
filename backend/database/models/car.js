const db = require("../index");

async function createCar(
  sellerId,
  title,
  description,
  year,
  startPrice,
  currentPrice,
  imagePath,
  auctionEndDate
) {
  try {
    const [result] = await db.execute(
      "INSERT INTO cars (seller_id, title, description, year, start_price, current_price, image_path, auction_end_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        sellerId,
        title,
        description,
        year,
        startPrice,
        currentPrice,
        imagePath,
        auctionEndDate,
      ]
    );
    return result.insertId;
  } catch (error) {
    console.error("Greška pri kreiranju automobila za aukciju:", error);
    throw error;
  }
}

async function getCarById(id) {
  try {
    const [rows] = await db.execute("SELECT * FROM cars WHERE id = ?", [id]);
    return rows[0];
  } catch (error) {
    console.error(`Greška pri pronalaženju automobila sa ID-jem ${id}:`, error);
    throw error;
  }
}

async function getAllCars(limit = 10, offset = 0) {
  try {
    const [rows] = await db.execute("SELECT * FROM cars LIMIT ? OFFSET ?", [
      limit,
      offset,
    ]);
    return rows;
  } catch (error) {
    console.error("Greška pri pronalaženju svih automobila:", error);
    throw error;
  }
}

async function getAllActiveCars(limit = 10, offset = 0) {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM cars WHERE status = "active" LIMIT ? OFFSET ?',
      [limit, offset]
    );
    return rows;
  } catch (error) {
    console.error("Greška pri pronalaženju svih aktivnih automobila:", error);
    throw error;
  }
}

async function getAllEndedCars(limit = 10, offset = 0) {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM cars WHERE status = "ended" LIMIT ? OFFSET ?',
      [limit, offset]
    );
    return rows;
  } catch (error) {
    console.error("Greška pri pronalaženju svih završenih automobila:", error);
    throw error;
  }
}

async function getCarsBySellerId(sellerId, limit = 10, offset = 0) {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM cars WHERE seller_id = ? LIMIT ? OFFSET ?",
      [sellerId, limit, offset]
    );
    return rows;
  } catch (error) {
    console.error(
      `Greška pri pronalaženju automobila prodavca sa ID-jem ${sellerId}:`,
      error
    );
    throw error;
  }
}

async function updateCar(
  id,
  title,
  description,
  year,
  startPrice,
  currentPrice,
  imagePath,
  auctionEndDate,
  status
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
  if (currentPrice !== undefined) {
    updates.current_price = currentPrice;
    params.push(currentPrice);
  }
  if (imagePath !== undefined) {
    updates.image_path = imagePath;
    params.push(imagePath);
  }
  if (auctionEndDate !== undefined) {
    updates.auction_end_date = auctionEndDate;
    params.push(auctionEndDate);
  }
  if (status !== undefined) {
    updates.status = status;
    params.push(status);
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
      `UPDATE cars SET ${updateClauses}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      params
    );
    return result.affectedRows;
  } catch (error) {
    console.error(`Greška pri ažuriranju automobila sa ID-jem ${id}:`, error);
    throw error;
  }
}

async function deleteCar(id) {
  try {
    const [result] = await db.execute("DELETE FROM cars WHERE id = ?", [id]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error(`Greška pri brisanju automobila sa ID-jem ${id}:`, error);
    throw error;
  }
}

async function updateCurrentPrice(carId, newPrice) {
  try {
    const [result] = await db.execute(
      "UPDATE cars SET current_price = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [newPrice, carId]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error(
      `Greška pri ažuriranju trenutne cene automobila sa ID-jem ${carId}:`,
      error
    );
    throw error;
  }
}

async function searchCars(query) {
  try {
    const searchTerm = `%${query}%`;
    const [rows] = await db.execute(
      "SELECT * FROM cars WHERE title LIKE ? OR description LIKE ?",
      [searchTerm, searchTerm]
    );
    return rows;
  } catch (error) {
    console.error(`Greška pri pretrazi automobila sa upitom: ${query}`, error);
    throw error;
  }
}

async function filterCars(filters = {}, limit = 10, offset = 0) {
  const conditions = [];
  const params = [];

  if (filters.priceFrom !== undefined) {
    conditions.push("current_price >= ?");
    params.push(filters.priceFrom);
  }
  if (filters.priceTo !== undefined) {
    conditions.push("current_price <= ?");
    params.push(filters.priceTo);
  }
  if (filters.yearFrom !== undefined) {
    conditions.push("year >= ?");
    params.push(filters.yearFrom);
  }
  if (filters.yearTo !== undefined) {
    conditions.push("year <= ?");
    params.push(filters.yearTo);
  }
  if (
    filters.status !== undefined &&
    ["active", "ended"].includes(filters.status)
  ) {
    conditions.push("status = ?");
    params.push(filters.status);
  }

  let whereClause = "";
  if (conditions.length > 0) {
    whereClause = `WHERE ${conditions.join(" AND ")}`;
  }

  const query = `SELECT * FROM cars ${whereClause} LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  try {
    const [rows] = await db.execute(query, params);
    return rows;
  } catch (error) {
    console.error("Greška pri filtriranju automobila:", error);
    throw error;
  }
}

async function countAllCars() {
  try {
    const [rows] = await db.execute("SELECT COUNT(*) AS total FROM cars");
    return rows[0].total;
  } catch (error) {
    console.error("Greška pri brojanju svih automobila:", error);
    throw error;
  }
}

async function countActiveCars() {
  try {
    const [rows] = await db.execute(
      'SELECT COUNT(*) AS total FROM cars WHERE status = "active"'
    );
    return rows[0].total;
  } catch (error) {
    console.error("Greška pri brojanju aktivnih automobila:", error);
    throw error;
  }
}

async function countEndedCars() {
  try {
    const [rows] = await db.execute(
      'SELECT COUNT(*) AS total FROM cars WHERE status = "ended"'
    );
    return rows[0].total;
  } catch (error) {
    console.error("Greška pri brojanju završenih automobila:", error);
    throw error;
  }
}

module.exports = {
  createCar,
  getCarById,
  getAllCars,
  getAllActiveCars,
  getAllEndedCars,
  getCarsBySellerId,
  updateCar,
  deleteCar,
  updateCurrentPrice,
  searchCars,
  filterCars,
  countAllCars,
  countActiveCars,
  countEndedCars,
};
