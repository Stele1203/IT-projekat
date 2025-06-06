const bidModel = require("../database/models/bid");
const carModel = require("../database/models/car"); // Da bismo proverili trenutnu cenu

async function createBid(req, res) {
  try {
    const { carId, bidAmount } = req.body;
    const userId = req.user.id; // ID korisnika koji postavlja ponudu

    // Provera da li aukcija postoji i da li je aktivna
    const car = await carModel.getCarById(carId);
    if (!car || car.status !== "active") {
      return res
        .status(400)
        .json({ message: "Aukcija ne postoji ili nije aktivna" });
    }

    // Provera da li je ponuda veća od trenutne cene
    const highestBid = await bidModel.getHighestBidByCarId(carId);
    const currentPrice = highestBid ? highestBid.bid_amount : car.start_price;

    if (bidAmount <= currentPrice) {
      return res
        .status(400)
        .json({ message: "Ponuda mora biti veća od trenutne cene" });
    }

    const bidId = await bidModel.createBid(userId, carId, bidAmount);

    // Ažuriraj trenutnu cenu automobila
    await carModel.updateCurrentPrice(carId, bidAmount);

    res.status(201).json({ message: "Ponuda uspešno postavljena", bidId });

    // TODO: Implementirati slanje notifikacija o novoj ponudi putem WebSocket-a
  } catch (error) {
    console.error("Greška pri postavljanju ponude:", error);
    res
      .status(500)
      .json({ message: "Došlo je do greške pri postavljanju ponude" });
  }
}

async function getBidById(req, res) {
  try {
    const bidId = req.params.id;
    const bid = await bidModel.getBidById(bidId);
    if (!bid) {
      return res.status(404).json({ message: "Ponuda nije pronađena" });
    }
    res.status(200).json(bid);
  } catch (error) {
    console.error(
      `Greška pri dobavljanju ponude sa ID-jem ${req.params.id}:`,
      error
    );
    res
      .status(500)
      .json({ message: "Došlo je do greške pri dobavljanju ponude" });
  }
}

async function getBidsByCarId(req, res) {
  try {
    const carId = req.params.id;
    const bids = await bidModel.getBidsByCarId(carId);
    res.status(200).json(bids);
  } catch (error) {
    console.error(
      `Greška pri dobavljanju ponuda za automobil sa ID-jem ${req.params.id}:`,
      error
    );
    res
      .status(500)
      .json({ message: "Došlo je do greške pri dobavljanju ponuda" });
  }
}

async function getBidsByUserId(req, res) {
  try {
    const userId = req.user.id; // Pretpostavljamo da je korisnik ulogovan
    const bids = await bidModel.getBidsByUserId(userId);
    res.status(200).json(bids);
  } catch (error) {
    console.error(
      `Greška pri dobavljanju ponuda korisnika sa ID-jem ${req.user.id}:`,
      error
    );
    res
      .status(500)
      .json({ message: "Došlo je do greške pri dobavljanju ponuda korisnika" });
  }
}

async function deleteBid(req, res) {
  try {
    const bidId = req.params.id;
    // TODO: Dodati proveru da li je korisnik admin ili vlasnik ponude pre brisanja
    const deleted = await bidModel.deleteBid(bidId);
    if (deleted > 0) {
      res.status(200).json({ message: "Ponuda uspešno obrisana" });
    } else {
      res.status(404).json({ message: "Ponuda nije pronađena" });
    }
  } catch (error) {
    console.error(
      `Greška pri brisanju ponude sa ID-jem ${req.params.id}:`,
      error
    );
    res.status(500).json({ message: "Došlo je do greške pri brisanju ponude" });
  }
}

async function getAllBids(req, res) {
  try {
    const bids = await bidModel.getAllBids();
    res.status(200).json(bids);
  } catch (error) {
    console.error("Greška pri dobavljanju svih ponuda:", error);
    res
      .status(500)
      .json({ message: "Došlo je do greške pri dobavljanju svih ponuda" });
  }
}

module.exports = {
  createBid,
  getBidById,
  getBidsByCarId,
  getBidsByUserId,
  deleteBid,
  getAllBids,
};
