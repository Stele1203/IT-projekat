// middleware/roleMiddleware.js

// Funkcija za proveru da li ulogovani korisnik ima administratorsku ulogu
function isAdmin(req, res, next) {
  try {
    // Prethodni middleware (isAuthenticated) je već postavio req.user.id
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Niste autentifikovani" }); // Ako nema korisničkih informacija
    }

    // Pretpostavljamo da u modelu korisnika imate funkciju za dobavljanje korisnika po ID-u
    const userModel = require("../database/models/user");

    // Asinhrono dobavljamo korisnika iz baze podataka na osnovu ID-ja iz tokena
    userModel
      .getUserById(req.user.id)
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: "Korisnik nije pronađen" }); // Ako korisnik ne postoji
        }

        // Proveravamo ulogu korisnika
        if (user.role === "admin") {
          // Ako je uloga 'admin', dozvoljavamo pristup ruti
          next();
        } else {
          // Ako uloga nije 'admin', vraćamo zabranjen pristup
          return res.status(403).json({
            message: "Pristup zabranjen: potrebna je administratorska uloga",
          }); // Forbidden
        }
      })
      .catch((error) => {
        console.error(
          "Greška pri dobavljanju korisnika za proveru uloge:",
          error
        );
        return res
          .status(500)
          .json({ message: "Došlo je do greške pri autorizaciji" }); // Internal Server Error
      });
  } catch (error) {
    console.error("Greška u isAdmin middleware-u:", error);
    return res
      .status(500)
      .json({ message: "Došlo je do greške pri autorizaciji" }); // Internal Server Error
  }
}

// Funkcija za proveru da li ulogovani korisnik ima regularnu ulogu (ili admin)
// Ovo može biti korisno za rute kojima pristupaju svi ulogovani korisnici
function isRegularUser(req, res, next) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Niste autentifikovani" });
    }

    const userModel = require("../database/models/user");

    userModel
      .getUserById(req.user.id)
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: "Korisnik nije pronađen" });
        }

        if (user.role === "regular" || user.role === "admin") {
          next();
        } else {
          return res.status(403).json({
            message:
              "Pristup zabranjen: potrebna je regularna ili administratorska uloga",
          });
        }
      })
      .catch((error) => {
        console.error(
          "Greška pri dobavljanju korisnika za proveru uloge:",
          error
        );
        return res
          .status(500)
          .json({ message: "Došlo je do greške pri autorizaciji" });
      });
  } catch (error) {
    console.error("Greška u isRegularUser middleware-u:", error);
    return res
      .status(500)
      .json({ message: "Došlo je do greške pri autorizaciji" });
  }
}

// Opciono: Funkcija za proveru da li ulogovani korisnik ima određenu ulogu
function hasRole(roleToCheck) {
  return function (req, res, next) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Niste autentifikovani" });
      }

      const userModel = require("../database/models/user");

      userModel
        .getUserById(req.user.id)
        .then((user) => {
          if (!user) {
            return res.status(404).json({ message: "Korisnik nije pronađen" });
          }

          if (user.role === roleToCheck) {
            next();
          } else {
            return res.status(403).json({
              message: `Pristup zabranjen: potrebna je uloga ${roleToCheck}`,
            });
          }
        })
        .catch((error) => {
          console.error(
            "Greška pri dobavljanju korisnika za proveru uloge:",
            error
          );
          return res
            .status(500)
            .json({ message: "Došlo je do greške pri autorizaciji" });
        });
    } catch (error) {
      console.error(`Greška u hasRole(${roleToCheck}) middleware-u:`, error);
      return res
        .status(500)
        .json({ message: "Došlo je do greške pri autorizaciji" });
    }
  };
}

module.exports = {
  isAdmin,
  isRegularUser,
  hasRole,
};
