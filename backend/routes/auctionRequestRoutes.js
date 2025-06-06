const auctionRequestController = require("../controllers/auctionRequestController");
const { isAuthenticated } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/roleMiddleware");

function handleAuctionRequestRoutes(req, res) {
  const { url, method } = req;
  const pathParts = url.split("/").filter((part) => part !== "");
  const resource = pathParts[1]; // 'auction-requests' ili 'admin'

  // Ruta za kreiranje novog zahteva (za regularne korisnike)
  if (
    resource === "auction-requests" &&
    method === "POST" &&
    isAuthenticated(req, res)
  ) {
    auctionRequestController.createAuctionRequest(req, res);
    return true;
  }

  // Ruta za dobavljanje svih zahteva (za admin korisnike)
  if (
    resource === "admin" &&
    pathParts[2] === "auction-requests" &&
    method === "GET" &&
    isAuthenticated(req, res) &&
    isAdmin(req, res)
  ) {
    auctionRequestController.getAllAuctionRequests(req, res);
    return true;
  }

  // Ruta za dobavljanje jednog zahteva po ID-u (za admin i vlasnika)
  if (
    resource === "auction-requests" &&
    method === "GET" &&
    pathParts.length === 3 &&
    isAuthenticated(req, res)
  ) {
    req.params.id = pathParts[2];
    auctionRequestController.getAuctionRequestById(req, res);
    return true;
  }

  // Ruta za ažuriranje statusa zahteva po ID-u (za admin korisnike)
  if (
    resource === "admin" &&
    pathParts[2] === "auction-requests" &&
    method === "PATCH" &&
    pathParts.length === 4 &&
    isAuthenticated(req, res) &&
    isAdmin(req, res)
  ) {
    req.params.id = pathParts[3];
    auctionRequestController.updateAuctionRequestStatus(req, res);
    return true;
  }

  // Ruta za brisanje zahteva po ID-u (za vlasnika ili admina)
  if (
    resource === "auction-requests" &&
    method === "DELETE" &&
    pathParts.length === 3 &&
    isAuthenticated(req, res)
  ) {
    req.params.id = pathParts[2];
    auctionRequestController.deleteAuctionRequest(req, res);
    return true;
  }

  // Ruta za odobravanje zahteva po ID-u (za admin korisnike)
  if (
    resource === "admin" &&
    pathParts[2] === "auction-requests" &&
    method === "PATCH" &&
    pathParts.length === 4 &&
    isAuthenticated(req, res) &&
    isAdmin(req, res) &&
    url.endsWith("/approve")
  ) {
    req.params.id = pathParts[3].replace("/approve", "");
    auctionRequestController.approveAuctionRequest(req, res);
    return true;
  }

  // Ruta za odbijanje zahteva po ID-u (za admin korisnike)
  if (
    resource === "admin" &&
    pathParts[2] === "auction-requests" &&
    method === "PATCH" &&
    pathParts.length === 4 &&
    isAuthenticated(req, res) &&
    isAdmin(req, res) &&
    url.endsWith("/reject")
  ) {
    req.params.id = pathParts[3].replace("/reject", "");
    auctionRequestController.rejectAuctionRequest(req, res);
    return true;
  }

  return false; // Ruta nije obrađena ovde
}

module.exports = handleAuctionRequestRoutes;
