const statsController = require("../controllers/statsController");
const { isAuthenticated } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/roleMiddleware");

function handleStatsRoutes(req, res) {
  const { url, method } = req;
  const pathParts = url.split("/").filter((part) => part !== "");
  const resource = pathParts[2]; // Pretpostavljamo da je /api/admin/stats/...

  // Ruta za dobavljanje broja korisnika (admin only)
  if (
    resource === "users" &&
    method === "GET" &&
    isAuthenticated(req, res) &&
    isAdmin(req, res)
  ) {
    statsController.getUserCounts(req, res);
    return true;
  }

  // Ruta za dobavljanje broja aukcija (admin only)
  if (
    resource === "auctions" &&
    method === "GET" &&
    isAuthenticated(req, res) &&
    isAdmin(req, res)
  ) {
    statsController.getAuctionCounts(req, res);
    return true;
  }

  // Ruta za dobavljanje broja zahteva za aukciju (admin only)
  if (
    resource === "auction-requests" &&
    method === "GET" &&
    isAuthenticated(req, res) &&
    isAdmin(req, res)
  ) {
    statsController.getAuctionRequestCounts(req, res);
    return true;
  }

  // Ruta za dobavljanje top ponuda (admin only)
  if (
    resource === "top-bids" &&
    method === "GET" &&
    isAuthenticated(req, res) &&
    isAdmin(req, res)
  ) {
    statsController.getTopBids(req, res);
    return true;
  }

  // Ruta za dobavljanje najskupljeg oldtimera (admin only)
  if (
    resource === "most-expensive" &&
    method === "GET" &&
    isAuthenticated(req, res) &&
    isAdmin(req, res)
  ) {
    statsController.getMostExpensiveOldtimer(req, res);
    return true;
  }

  // Ruta za dobavljanje ukupnog broja ponuda (admin only)
  if (
    resource === "total-bids" &&
    method === "GET" &&
    isAuthenticated(req, res) &&
    isAdmin(req, res)
  ) {
    statsController.getTotalBidCount(req, res);
    return true;
  }

  // Ruta za dobavljanje najpopularnijih oldtimera (admin only)
  if (
    resource === "popular-oldtimers" &&
    method === "GET" &&
    isAuthenticated(req, res) &&
    isAdmin(req, res)
  ) {
    statsController.getMostPopularOldtimers(req, res);
    return true;
  }

  // Ruta za dobavljanje ukupnog broja komentara (admin only)
  if (
    resource === "total-comments" &&
    method === "GET" &&
    isAuthenticated(req, res) &&
    isAdmin(req, res)
  ) {
    statsController.getTotalCommentCount(req, res);
    return true;
  }

  return false; // Ruta nije obrađena ovde
}

module.exports = handleStatsRoutes;
