const db = require("../index");
const bcrypt = require("bcrypt"); // Za heširanje lozinki

// Funkcija za kreiranje novog korisnika
async function createUser(username, password, email, role = "regular") {
  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Heširanje lozinke sa saltom od 10
    const [result] = await db.execute(
      "INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)",
      [username, hashedPassword, email, role]
    );
    return result.insertId; // Vraća ID novokreiranog korisnika
  } catch (error) {
    console.error("Greška pri kreiranju korisnika:", error);
    throw error;
  }
}

// Funkcija za pronalaženje korisnika po korisničkom imenu
async function getUserByUsername(username) {
  try {
    const [rows] = await db.execute("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
    return rows[0]; // Vraća prvog korisnika sa tim korisničkim imenom (ako postoji)
  } catch (error) {
    console.error(
      `Greška pri pronalaženju korisnika sa korisničkim imenom ${username}:`,
      error
    );
    throw error;
  }
}

// Funkcija za pronalaženje korisnika po ID-u
async function getUserById(id) {
  try {
    const [rows] = await db.execute("SELECT * FROM users WHERE id = ?", [id]);
    return rows[0];
  } catch (error) {
    console.error(`Greška pri pronalaženju korisnika sa ID-jem ${id}:`, error);
    throw error;
  }
}

// Funkcija za pronalaženje korisnika po email-u
async function getUserByEmail(email) {
  try {
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    return rows[0];
  } catch (error) {
    console.error(
      `Greška pri pronalaženju korisnika sa email-om ${email}:`,
      error
    );
    throw error;
  }
}

// Funkcija za pronalaženje svih korisnika (sa opcijom za paginaciju)
async function getAllUsers(limit = 10, offset = 0) {
  try {
    const [rows] = await db.execute("SELECT * FROM users LIMIT ? OFFSET ?", [
      limit,
      offset,
    ]);
    return rows;
  } catch (error) {
    console.error("Greška pri pronalaženju svih korisnika:", error);
    throw error;
  }
}

// Funkcija za ažuriranje informacija o korisniku po ID-u
async function updateUser(id, username, email) {
  try {
    const [result] = await db.execute(
      "UPDATE users SET username = ?, email = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [username, email, id]
    );
    return result.affectedRows > 0; // Vraća true ako je bar jedan red ažuriran
  } catch (error) {
    console.error(`Greška pri ažuriranju korisnika sa ID-jem ${id}:`, error);
    throw error;
  }
}

// Funkcija za promenu lozinke korisnika po ID-u
async function updateUserPassword(id, newPassword) {
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const [result] = await db.execute(
      "UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [hashedPassword, id]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error(
      `Greška pri ažuriranju lozinke korisnika sa ID-jem ${id}:`,
      error
    );
    throw error;
  }
}

// Funkcija za promenu uloge korisnika po ID-u (za admina)
async function updateUserRole(id, role) {
  try {
    const [result] = await db.execute(
      "UPDATE users SET role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [role, id]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error(
      `Greška pri ažuriranju uloge korisnika sa ID-jem ${id}:`,
      error
    );
    throw error;
  }
}

// Funkcija za banovanje korisnika po ID-u (za admina)
async function banUser(id) {
  try {
    const [result] = await db.execute(
      "UPDATE users SET is_banned = TRUE WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error(`Greška pri banovanju korisnika sa ID-jem ${id}:`, error);
    throw error;
  }
}

// Funkcija za od-banovanje korisnika po ID-u (za admina)
async function unbanUser(id) {
  try {
    const [result] = await db.execute(
      "UPDATE users SET is_banned = FALSE WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error(`Greška pri od-banovanju korisnika sa ID-jem ${id}:`, error);
    throw error;
  }
}

// Funkcija za brisanje korisnika po ID-u
async function deleteUser(id) {
  try {
    const [result] = await db.execute("DELETE FROM users WHERE id = ?", [id]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error(`Greška pri brisanju korisnika sa ID-jem ${id}:`, error);
    throw error;
  }
}

module.exports = {
  createUser,
  getUserByUsername,
  getUserById,
  getUserByEmail,
  getAllUsers,
  updateUser,
  updateUserPassword,
  updateUserRole,
  banUser,
  unbanUser,
  deleteUser,
};
