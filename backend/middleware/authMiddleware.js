const jwt = require("jsonwebtoken");
const config = require("../config/auth.json"); // Preporučljivo je čuvati tajni ključ u konfiguraciji
const userModel = require("../database/models/user"); // Za pronalaženje korisnika po ID-u iz tokena

// Funkcija za proveru da li je korisnik autentifikovan (ima validan JWT token)
async function isAuthenticated(req, res, next) {
  try {
    // Proveravamo da li postoji Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Niste autentifikovani" }); // Unauthorized
    }

    // Izdvajamo token iz Authorization header-a (nakon 'Bearer ')
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Niste autentifikovani" }); // Unauthorized
    }

    // Verifikujemo token koristeći tajni ključ
    jwt.verify(token, config.secret, async (err, decoded) => {
      if (err) {
        console.error("Greška pri verifikaciji tokena:", err);
        return res.status(401).json({ message: "Token je nevažeći" }); // Unauthorized
      }

      // Ako je token validan, 'decoded' sadrži informacije iz tokena (npr., userId)
      req.user = { id: decoded.userId }; // Prilažemo ID korisnika u 'req.user'

      // Opciono: Možete dodatno proveriti da li korisnik sa tim ID-jem i dalje postoji u bazi
      const user = await userModel.getUserById(decoded.userId);
      if (!user) {
        return res.status(401).json({ message: "Korisnik više ne postoji" }); // Unauthorized
      }

      // Ako je sve u redu, prelazimo na sledeći middleware ili rutu
      next();
    });
  } catch (error) {
    console.error("Greška u isAuthenticated middleware-u:", error);
    return res
      .status(500)
      .json({ message: "Došlo je do greške pri autentifikaciji" }); // Internal Server Error
  }
}

module.exports = {
  isAuthenticated,
};
