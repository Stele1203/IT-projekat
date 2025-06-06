const adminController = require("../controllers/adminController");
const { isAuthenticated } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/roleMiddleware");

function handleAdminRoutes(req, res) {
  const { url, method } = req;
  const pathParts = url.split("/").filter((part) => part !== "");
  const resource = pathParts[2]; // Pretpostavljamo da je /api/admin/...

  // --- Korisnici ---
  // Dobavljanje svih korisnika (admin only)
  if (
    resource === "users" &&
    method === "GET" &&
    isAuthenticated(req, res) &&
    isAdmin(req, res)
  ) {
    adminController.getAllUsers(req, res);
    return true;
  }

  // Dobavljanje jednog korisnika po ID-u (admin only)
  if (
    resource === "users" &&
    method === "GET" &&
    pathParts.length === 4 &&
    isAuthenticated(req, res) &&
    isAdmin(req, res)
  ) {
    req.params.id = pathParts[3];
    adminController.getUserById(req, res);
    return true;
  }

  // Banovanje korisnika po ID-u (admin only)
  if (
    resource === "users" &&
    method === "PATCH" &&
    pathParts.length === 4 &&
    isAuthenticated(req, res) &&
    isAdmin(req, res) &&
    url.endsWith("/ban")
  ) {
    req.params.id = pathParts[3].replace("/ban", "");
    adminController.banUser(req, res);
    return true;
  }

  // Od-banovanje korisnika po ID-u (admin only)
  if (
    resource === "users" &&
    method === "PATCH" &&
    pathParts.length === 4 &&
    isAuthenticated(req, res) &&
    isAdmin(req, res) &&
    url.endsWith("/unban")
  ) {
    req.params.id = pathParts[3].replace("/unban", "");
    adminController.unbanUser(req, res);
    return true;
  }

  // Ažuriranje uloge korisnika po ID-u (admin only)
  if (
    resource === "users" &&
    method === "PATCH" &&
    pathParts.length === 4 &&
    isAuthenticated(req, res) &&
    isAdmin(req, res) &&
    !url.endsWith("/ban") &&
    !url.endsWith("/unban")
  ) {
    req.params.id = pathParts[3];
    adminController.updateUserRole(req, res);
    return true;
  }

  // --- Ponude ---
  // Dobavljanje svih ponuda (admin only)
  if (
    resource === "bids" &&
    method === "GET" &&
    isAuthenticated(req, res) &&
    isAdmin(req, res)
  ) {
    adminController.getAllBids(req, res);
    return true;
  }

  // Brisanje ponude po ID-u (admin only)
  if (
    resource === "bids" &&
    method === "DELETE" &&
    pathParts.length === 4 &&
    isAuthenticated(req, res) &&
    isAdmin(req, res)
  ) {
    req.params.id = pathParts[3];
    adminController.deleteBid(req, res);
    return true;
  }

  // --- Zahtevi za aukciju (ako niste kreirali poseban adminAuctionRequestRoutes) ---
  // Dobavljanje svih zahteva za aukciju (admin only)
  if (
    resource === "auction-requests" &&
    method === "GET" &&
    isAuthenticated(req, res) &&
    isAdmin(req, res)
  ) {
    // Pretpostavljam da koristite funkciju iz auctionRequestController
    const auctionRequestController = require("../controllers/auctionRequestController");
    auctionRequestController.getAllAuctionRequests(req, res);
    return true;
  }

  // Dobavljanje jednog zahteva za aukciju po ID-u (admin only)
  if (
    resource === "auction-requests" &&
    method === "GET" &&
    pathParts.length === 4 &&
    isAuthenticated(req, res) &&
    isAdmin(req, res)
  ) {
    const auctionRequestController = require("../controllers/auctionRequestController");
    req.params.id = pathParts[3];
    auctionRequestController.getAuctionRequestById(req, res);
    return true;
  }

  // Ažuriranje statusa zahteva za aukciju (admin only)
  if (
    resource === "auction-requests" &&
    method === "PATCH" &&
    pathParts.length === 4 &&
    isAuthenticated(req, res) &&
    isAdmin(req, res) &&
    !url.endsWith("/approve") &&
    !url.endsWith("/reject")
  ) {
    const auctionRequestController = require("../controllers/auctionRequestController");
    req.params.id = pathParts[3];
    auctionRequestController.updateAuctionRequestStatus(req, res);
    return true;
  }

  // Odobravanje zahteva za aukciju (admin only)
  if (
    resource === "auction-requests" &&
    method === "PATCH" &&
    pathParts.length === 4 &&
    isAuthenticated(req, res) &&
    isAdmin(req, res) &&
    url.endsWith("/approve")
  ) {
    const auctionRequestController = require("../controllers/auctionRequestController");
    req.params.id = pathParts[3].replace("/approve", "");
    auctionRequestController.approveAuctionRequest(req, res);
    return true;
  }

  // Odbijanje zahteva za aukciju (admin only)
  if (
    resource === "auction-requests" &&
    method === "PATCH" &&
    pathParts.length === 4 &&
    isAuthenticated(req, res) &&
    isAdmin(req, res) &&
    url.endsWith("/reject")
  ) {
    const auctionRequestController = require("../controllers/auctionRequestController");
    req.params.id = pathParts[3].replace("/reject", "");
    auctionRequestController.rejectAuctionRequest(req, res);
    return true;
  }

  return false; // Ruta nije obrađena ovde
}

module.exports = handleAdminRoutes;
