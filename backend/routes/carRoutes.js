const carController = require("../controllers/carController");
const { isAuthenticated } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/roleMiddleware");

function handleCarRoutes(req, res) {
  const { url, method } = req;
  const pathParts = url.split("/").filter((part) => part !== "");
  const resource = pathParts[1]; // 'auctions' ili 'admin'

  // Ruta za kreiranje nove aukcije (admin)
  if (
    url === "/api/admin/auctions" &&
    method === "POST" &&
    isAuthenticated(req, res) &&
    isAdmin(req, res)
  ) {
    carController.createCar(req, res);
    return true;
  }

  // Ruta za dobavljanje jednog automobila po ID-u (svi korisnici)
  if (resource === "auctions" && method === "GET" && pathParts.length === 3) {
    req.params.id = pathParts[2];
    carController.getCarById(req, res);
    return true;
  }

  // Ruta za dobavljanje svih aktivnih automobila (svi korisnici)
  if (url === "/api/auctions/active" && method === "GET") {
    carController.getAllActiveCars(req, res);
    return true;
  }

  // Ruta za ažuriranje aukcije automobila po ID-u (admin)
  if (
    resource === "admin" &&
    pathParts[2] === "auctions" &&
    method === "PATCH" &&
    pathParts.length === 4 &&
    isAuthenticated(req, res) &&
    isAdmin(req, res)
  ) {
    req.params.id = pathParts[3];
    carController.updateCar(req, res);
    return true;
  }

  // Ruta za brisanje aukcije automobila po ID-u (admin)
  if (
    resource === "admin" &&
    pathParts[2] === "auctions" &&
    method === "DELETE" &&
    pathParts.length === 4 &&
    isAuthenticated(req, res) &&
    isAdmin(req, res)
  ) {
    req.params.id = pathParts[3];
    carController.deleteCar(req, res);
    return true;
  }

  // Ruta za pretragu automobila (svi korisnici)
  if (url.startsWith("/api/auctions/search") && method === "GET") {
    carController.searchCars(req, res);
    return true;
  }

  // Ruta za detaljnu pretragu/filtriranje automobila (svi korisnici)
  if (url.startsWith("/api/auctions/filter") && method === "GET") {
    carController.filterCars(req, res);
    return true;
  }

  return false; // Ruta nije obrađena ovde
}

module.exports = handleCarRoutes;
