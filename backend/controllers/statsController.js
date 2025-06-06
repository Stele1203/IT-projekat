const userModel = require("../database/models/user");
const carModel = require("../database/models/car");
const auctionRequestModel = require("../database/models/auctionRequest");
const bidModel = require("../database/models/bid");
const favoriteModel = require("../database/models/favorite");
const commentModel = require("../database/models/comment");

async function getUserCounts(req, res) {
  try {
    const totalUsers = await userModel.countAllUsers();
    const regularUsers = await userModel.countRegularUsers();
    const adminUsers = await userModel.countAdminUsers();
    res
      .status(200)
      .json({ total: totalUsers, regular: regularUsers, admin: adminUsers });
  } catch (error) {
    console.error("Greška pri dobavljanju broja korisnika:", error);
    res
      .status(500)
      .json({ message: "Došlo je do greške pri dobavljanju broja korisnika" });
  }
}

async function getAuctionCounts(req, res) {
  try {
    const totalAuctions = await carModel.countAllCars();
    const activeAuctions = await carModel.countActiveCars();
    const endedAuctions = await carModel.countEndedCars();
    res.status(200).json({
      total: totalAuctions,
      active: activeAuctions,
      ended: endedAuctions,
    });
  } catch (error) {
    console.error("Greška pri dobavljanju broja aukcija:", error);
    res
      .status(500)
      .json({ message: "Došlo je do greške pri dobavljanju broja aukcija" });
  }
}

async function getAuctionRequestCounts(req, res) {
  try {
    const totalRequests = await auctionRequestModel.countAllAuctionRequests();
    const pendingRequests =
      await auctionRequestModel.countAuctionRequestsByStatus("pending");
    const acceptedRequests =
      await auctionRequestModel.countAuctionRequestsByStatus("accepted");
    const rejectedRequests =
      await auctionRequestModel.countAuctionRequestsByStatus("rejected");
    res.status(200).json({
      total: totalRequests,
      pending: pendingRequests,
      accepted: acceptedRequests,
      rejected: rejectedRequests,
    });
  } catch (error) {
    console.error("Greška pri dobavljanju broja zahteva za aukciju:", error);
    res.status(500).json({
      message: "Došlo je do greške pri dobavljanju broja zahteva za aukciju",
    });
  }
}

async function getTopBids(req, res) {
  try {
    const allBids = await bidModel.getAllBids();
    const topBids = allBids
      .sort((a, b) => b.bid_amount - a.bid_amount)
      .slice(0, 10);
    res.status(200).json(topBids);
  } catch (error) {
    console.error("Greška pri dobavljanju top ponuda:", error);
    res
      .status(500)
      .json({ message: "Došlo je do greške pri dobavljanju top ponuda" });
  }
}

async function getMostExpensiveOldtimer(req, res) {
  try {
    const endedCars = await carModel.getAllEndedCars();
    const mostExpensive = endedCars.sort(
      (a, b) => b.current_price - a.current_price
    )[0];
    res.status(200).json(mostExpensive || {});
  } catch (error) {
    console.error("Greška pri dobavljanju najskupljeg oldtimera:", error);
    res.status(500).json({
      message: "Došlo je do greške pri dobavljanju najskupljeg oldtimera",
    });
  }
}

async function getTotalBidCount(req, res) {
  try {
    const totalBids = await bidModel.countAllBids();
    res.status(200).json({ total: totalBids });
  } catch (error) {
    console.error("Greška pri dobavljanju ukupnog broja ponuda:", error);
    res.status(500).json({
      message: "Došlo je do greške pri dobavljanju ukupnog broja ponuda",
    });
  }
}

async function getMostPopularOldtimers(req, res) {
  try {
    const popularCars = await favoriteModel.getMostPopularCars(10); // Dobavimo top 10 najpopularnijih
    res.status(200).json(popularCars);
  } catch (error) {
    console.error("Greška pri dobavljanju najpopularnijih oldtimera:", error);
    res.status(500).json({
      message: "Došlo je do greške pri dobavljanju najpopularnijih oldtimera",
    });
  }
}

async function getTotalCommentCount(req, res) {
  try {
    const totalComments = await commentModel.countAllComments();
    res.status(200).json({ total: totalComments });
  } catch (error) {
    console.error("Greška pri dobavljanju ukupnog broja komentara:", error);
    res.status(500).json({
      message: "Došlo je do greške pri dobavljanju ukupnog broja komentara",
    });
  }
}

module.exports = {
  getUserCounts,
  getAuctionCounts,
  getAuctionRequestCounts,
  getTopBids,
  getMostExpensiveOldtimer,
  getTotalBidCount,
  getMostPopularOldtimers,
  getTotalCommentCount,
};
