const bidController = require("../controllers/bidController");
const { isAuthenticated } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/roleMiddleware"); // Ako imate middleware za admin ulogu

function handleBidRoutes(req, res) {
  const { url, method } = req;
  const pathParts = url.split("/").filter((part) => part !== "");
  const resource = pathParts[1]; // 'auctions' ili 'bids' ili 'admin'

  // Ruta za postavljanje nove ponude (za ulogovane korisnike)
  if (resource === "bids" && method === "POST" && isAuthenticated(req, res)) {
    bidController.createBid(req, res);
    return true;
  }

  // Ruta za dobavljanje jedne ponude po ID-u (za admin ili vlasnika ponude - implementirati proveru u kontroleru)
  if (
    resource === "bids" &&
    method === "GET" &&
    pathParts.length === 3 &&
    isAuthenticated(req, res)
  ) {
    req.params.id = pathParts[2];
    bidController.getBidById(req, res);
    return true;
  }

  // Ruta za dobavljanje svih ponuda za određeni automobil
  if (
    resource === "auctions" &&
    pathParts.length === 3 &&
    method === "GET" &&
    pathParts[2] &&
    url.includes("/bids")
  ) {
    req.params.id = pathParts[2];
    bidController.getBidsByCarId(req, res);
    return true;
  }

  // Ruta za dobavljanje svih ponuda ulogovanog korisnika
  if (
    resource === "users" &&
    pathParts.length === 3 &&
    method === "GET" &&
    isAuthenticated(req, res) &&
    pathParts[2] === "bids"
  ) {
    bidController.getBidsByUserId(req, res);
    return true;
  }

  // Ruta za brisanje ponude po ID-u (za admin - implementirati proveru u kontroleru)
  if (
    resource === "admin" &&
    pathParts[2] === "bids" &&
    method === "DELETE" &&
    pathParts.length === 4 &&
    isAuthenticated(req, res) &&
    isAdmin(req, res)
  ) {
    req.params.id = pathParts[3];
    bidController.deleteBid(req, res);
    return true;
  }

  // Ruta za dobavljanje svih ponuda (samo za admin)
  if (
    resource === "admin" &&
    pathParts[2] === "bids" &&
    method === "GET" &&
    isAuthenticated(req, res) &&
    isAdmin(req, res)
  ) {
    bidController.getAllBids(req, res);
    return true;
  }

  return false; // Ruta nije obrađena ovde
}

module.exports = handleBidRoutes;
