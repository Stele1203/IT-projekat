const auctionRequestModel = require("../database/models/auctionRequest");
const carModel = require("../database/models/car"); // Za kreiranje aukcije nakon odobrenja
const userModel = require("../database/models/user"); // Za dobavljanje informacija o korisniku

async function createAuctionRequest(req, res) {
  try {
    const { title, description, year, startPrice, imagePath } = req.body;
    const userId = req.user.id; // Pretpostavljamo da je user ID dostupan kroz autentifikaciju

    const requestId = await auctionRequestModel.createAuctionRequest(
      userId,
      title,
      description,
      year,
      startPrice,
      imagePath
    );

    res
      .status(201)
      .json({ message: "Zahtev za aukciju uspešno kreiran", requestId });
    // TODO: Implementirati notifikaciju za admina o novom zahtevu
  } catch (error) {
    console.error("Greška pri kreiranju zahteva za aukciju:", error);
    res
      .status(500)
      .json({ message: "Došlo je do greške pri kreiranju zahteva za aukciju" });
  }
}

async function getAllAuctionRequests(req, res) {
  try {
    const requests = await auctionRequestModel.getAllAuctionRequests();
    res.status(200).json(requests);
  } catch (error) {
    console.error("Greška pri dobavljanju svih zahteva za aukciju:", error);
    res.status(500).json({
      message: "Došlo je do greške pri dobavljanju zahteva za aukciju",
    });
  }
}

async function getAuctionRequestById(req, res) {
  try {
    const requestId = req.params.id;
    const request = await auctionRequestModel.getAuctionRequestById(requestId);

    if (!request) {
      return res
        .status(404)
        .json({ message: "Zahtev za aukciju nije pronađen" });
    }

    res.status(200).json(request);
  } catch (error) {
    console.error(
      `Greška pri dobavljanju zahteva za aukciju sa ID-jem ${req.params.id}:`,
      error
    );
    res.status(500).json({
      message: "Došlo je do greške pri dobavljanju zahteva za aukciju",
    });
  }
}

async function updateAuctionRequestStatus(req, res) {
  try {
    const requestId = req.params.id;
    const { status } = req.body;

    const updated = await auctionRequestModel.updateAuctionRequestStatus(
      requestId,
      status
    );

    if (updated > 0) {
      res
        .status(200)
        .json({ message: "Status zahteva za aukciju uspešno ažuriran" });
    } else {
      res.status(404).json({ message: "Zahtev za aukciju nije pronađen" });
    }
    // TODO: Implementirati notifikaciju za korisnika o promeni statusa zahteva
  } catch (error) {
    console.error(
      `Greška pri ažuriranju statusa zahteva za aukciju sa ID-jem ${req.params.id}:`,
      error
    );
    res
      .status(500)
      .json({ message: "Došlo je do greške pri ažuriranju statusa zahteva" });
  }
}

async function deleteAuctionRequest(req, res) {
  try {
    const requestId = req.params.id;
    const deleted = await auctionRequestModel.deleteAuctionRequest(requestId);

    if (deleted > 0) {
      res.status(200).json({ message: "Zahtev za aukciju uspešno obrisan" });
    } else {
      res.status(404).json({ message: "Zahtev za aukciju nije pronađen" });
    }
  } catch (error) {
    console.error(
      `Greška pri brisanju zahteva za aukciju sa ID-jem ${req.params.id}:`,
      error
    );
    res
      .status(500)
      .json({ message: "Došlo je do greške pri brisanju zahteva" });
  }
}

// Administratorske funkcije za odobravanje i odbijanje zahteva
async function approveAuctionRequest(req, res) {
  try {
    const requestId = req.params.id;
    const request = await auctionRequestModel.getAuctionRequestById(requestId);

    if (!request) {
      return res
        .status(404)
        .json({ message: "Zahtev za aukciju nije pronađen" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Zahtev već obrađen" });
    }

    const { title, description, year, startPrice, imagePath, user_id } =
      request;
    const currentPrice = startPrice; // Početna cena je i trenutna na početku aukcije
    const auctionEndDate = new Date();
    auctionEndDate.setDate(auctionEndDate.getDate() + 7); // Postavimo aukciju da traje 7 dana (primer)

    const carId = await carModel.createCar(
      user_id,
      title,
      description,
      year,
      startPrice,
      currentPrice,
      imagePath,
      auctionEndDate
    );

    // Obriši zahtev nakon odobrenja
    await auctionRequestModel.deleteAuctionRequest(requestId);

    res
      .status(200)
      .json({ message: "Zahtev odobren, aukcija kreirana sa ID-jem:", carId });
    // TODO: Implementirati notifikaciju za korisnika o odobrenju zahteva
  } catch (error) {
    console.error(
      `Greška pri odobravanju zahteva za aukciju sa ID-jem ${req.params.id}:`,
      error
    );
    res
      .status(500)
      .json({ message: "Došlo je do greške pri odobravanju zahteva" });
  }
}

async function rejectAuctionRequest(req, res) {
  try {
    const requestId = req.params.id;
    const request = await auctionRequestModel.getAuctionRequestById(requestId);

    if (!request) {
      return res
        .status(404)
        .json({ message: "Zahtev za aukciju nije pronađen" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Zahtev već obrađen" });
    }

    await auctionRequestModel.updateAuctionRequestStatus(requestId, "rejected");
    res.status(200).json({ message: "Zahtev odbijen" });
    // TODO: Implementirati notifikaciju za korisnika o odbijanju zahteva
  } catch (error) {
    console.error(
      `Greška pri odbijanju zahteva za aukciju sa ID-jem ${req.params.id}:`,
      error
    );
    res
      .status(500)
      .json({ message: "Došlo je do greške pri odbijanju zahteva" });
  }
}

module.exports = {
  createAuctionRequest,
  getAllAuctionRequests,
  getAuctionRequestById,
  updateAuctionRequestStatus,
  deleteAuctionRequest,
  approveAuctionRequest,
  rejectAuctionRequest,
};
