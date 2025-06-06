const db = require("../index");

async function createComment(userId, carId, commentText) {
  try {
    const [result] = await db.execute(
      "INSERT INTO comments (user_id, car_id, comment_text) VALUES (?, ?, ?)",
      [userId, carId, commentText]
    );
    return result.insertId;
  } catch (error) {
    console.error("Greška pri kreiranju komentara:", error);
    throw error;
  }
}

async function getCommentById(id) {
  try {
    const [rows] = await db.execute(
      "SELECT c.*, u.username FROM comments c JOIN users u ON c.user_id = u.id WHERE c.id = ?",
      [id]
    );
    return rows[0];
  } catch (error) {
    console.error(`Greška pri pronalaženju komentara sa ID-jem ${id}:`, error);
    throw error;
  }
}

async function getCommentsByCarId(carId, limit = 10, offset = 0) {
  try {
    const [rows] = await db.execute(
      "SELECT c.*, u.username FROM comments c JOIN users u ON c.user_id = u.id WHERE c.car_id = ? ORDER BY c.created_at DESC LIMIT ? OFFSET ?",
      [carId, limit, offset]
    );
    return rows;
  } catch (error) {
    console.error(
      `Greška pri pronalaženju komentara za automobil sa ID-jem ${carId}:`,
      error
    );
    throw error;
  }
}

async function getCommentsByUserId(userId, limit = 10, offset = 0) {
  try {
    const [rows] = await db.execute(
      "SELECT c.*, ca.title AS car_title FROM comments c JOIN cars ca ON c.car_id = ca.id WHERE c.user_id = ? ORDER BY c.created_at DESC LIMIT ? OFFSET ?",
      [userId, limit, offset]
    );
    return rows;
  } catch (error) {
    console.error(
      `Greška pri pronalaženju komentara korisnika sa ID-jem ${userId}:`,
      error
    );
    throw error;
  }
}

async function updateComment(id, commentText) {
  try {
    const [result] = await db.execute(
      "UPDATE comments SET comment_text = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [commentText, id]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error(`Greška pri ažuriranju komentara sa ID-jem ${id}:`, error);
    throw error;
  }
}

async function deleteComment(id) {
  try {
    const [result] = await db.execute("DELETE FROM comments WHERE id = ?", [
      id,
    ]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error(`Greška pri brisanju komentara sa ID-jem ${id}:`, error);
    throw error;
  }
}

async function countCommentsByCarId(carId) {
  try {
    const [rows] = await db.execute(
      "SELECT COUNT(*) AS total FROM comments WHERE car_id = ?",
      [carId]
    );
    return rows[0].total;
  } catch (error) {
    console.error(
      `Greška pri brojanju komentara za automobil sa ID-jem ${carId}:`,
      error
    );
    throw error;
  }
}

async function countCommentsByUserId(userId) {
  try {
    const [rows] = await db.execute(
      "SELECT COUNT(*) AS total FROM comments WHERE user_id = ?",
      [userId]
    );
    return rows[0].total;
  } catch (error) {
    console.error(
      `Greška pri brojanju komentara korisnika sa ID-jem ${userId}:`,
      error
    );
    throw error;
  }
}

async function countAllComments() {
  try {
    const [rows] = await db.execute("SELECT COUNT(*) AS total FROM comments");
    return rows[0].total;
  } catch (error) {
    console.error("Greška pri brojanju svih komentara:", error);
    throw error;
  }
}

module.exports = {
  createComment,
  getCommentById,
  getCommentsByCarId,
  getCommentsByUserId,
  updateComment,
  deleteComment,
  countCommentsByCarId,
  countCommentsByUserId,
  countAllComments,
};
