const favoriteController = require("../controllers/favoriteController");
const { isAuthenticated } = require("../middleware/authMiddleware");

function handleFavoriteRoutes(req, res) {
  const { url, method } = req;
  const pathParts = url.split("/").filter((part) => part !== "");
  const resource = pathParts[1]; // 'users' ili 'favorites'

  // Ruta za dodavanje automobila u favorite (za ulogovane korisnike)
  if (
    resource === "favorites" &&
    method === "POST" &&
    isAuthenticated(req, res)
  ) {
    favoriteController.addCarToFavorites(req, res);
    return true;
  }

  // Ruta za uklanjanje automobila iz favorita (za ulogovane korisnike)
  if (
    resource === "favorites" &&
    method === "DELETE" &&
    pathParts.length === 3 &&
    isAuthenticated(req, res)
  ) {
    req.params.carId = pathParts[2];
    favoriteController.removeCarFromFavorites(req, res);
    return true;
  }

  // Ruta za dobavljanje svih favorita ulogovanog korisnika (za ulogovane korisnike)
  if (
    resource === "users" &&
    pathParts.length === 3 &&
    method === "GET" &&
    isAuthenticated(req, res) &&
    pathParts[2] === "favorites"
  ) {
    favoriteController.getUserFavorites(req, res);
    return true;
  }

  // Ruta za proveru da li je automobil u favoritima ulogovanog korisnika (za ulogovane korisnike)
  if (
    resource === "favorites" &&
    method === "GET" &&
    pathParts.length === 3 &&
    isAuthenticated(req, res)
  ) {
    req.params.carId = pathParts[2];
    favoriteController.isCarInFavorites(req, res);
    return true;
  }

  // Ruta za brojanje favorita ulogovanog korisnika (za ulogovane korisnike)
  if (
    resource === "users" &&
    pathParts.length === 4 &&
    method === "GET" &&
    isAuthenticated(req, res) &&
    pathParts[2] === "favorites" &&
    pathParts[3] === "count"
  ) {
    favoriteController.countUserFavorites(req, res);
    return true;
  }

  return false; // Ruta nije obrađena ovde
}

module.exports = handleFavoriteRoutes;
