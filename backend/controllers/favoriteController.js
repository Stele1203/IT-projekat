const favoriteModel = require("../database/models/favorite");
const carModel = require("../database/models/car"); // Za dobavljanje detalja o automobilima

async function addCarToFavorites(req, res) {
  try {
    const { carId } = req.body;
    const userId = req.user.id;

    // Proveri da li automobil postoji
    const carExists = await carModel.getCarById(carId);
    if (!carExists) {
      return res
        .status(404)
        .json({ message: "Aukcija automobila nije pronađena" });
    }

    // Proveri da li je automobil već u favoritima korisnika
    const isFavorite = await favoriteModel.isCarInFavorites(userId, carId);
    if (isFavorite) {
      return res
        .status(409)
        .json({ message: "Aukcija automobila je već u vašim favoritima" });
    }

    const added = await favoriteModel.addCarToFavorites(userId, carId);
    if (added) {
      res.status(201).json({ message: "Aukcija automobila dodata u favorite" });
    } else {
      res
        .status(500)
        .json({ message: "Došlo je do greške pri dodavanju u favorite" });
    }
  } catch (error) {
    console.error("Greška pri dodavanju automobila u favorite:", error);
    res
      .status(500)
      .json({ message: "Došlo je do greške pri dodavanju u favorite" });
  }
}

async function removeCarFromFavorites(req, res) {
  try {
    const carId = req.params.carId;
    const userId = req.user.id;

    const removed = await favoriteModel.removeCarFromFavorites(userId, carId);
    if (removed) {
      res
        .status(200)
        .json({ message: "Aukcija automobila uklonjena iz favorita" });
    } else {
      return res.status(404).json({
        message: "Aukcija automobila nije pronađena u vašim favoritima",
      });
    }
  } catch (error) {
    console.error("Greška pri uklanjanju automobila iz favorita:", error);
    res
      .status(500)
      .json({ message: "Došlo je do greške pri uklanjanju iz favorita" });
  }
}

async function getUserFavorites(req, res) {
  try {
    const userId = req.user.id;
    const favorites = await favoriteModel.getUserFavorites(userId);
    res.status(200).json(favorites);
  } catch (error) {
    console.error("Greška pri dobavljanju favorita korisnika:", error);
    res
      .status(500)
      .json({ message: "Došlo je do greške pri dobavljanju favorita" });
  }
}

async function isCarInFavorites(req, res) {
  try {
    const carId = req.params.carId;
    const userId = req.user.id;
    const isFavorite = await favoriteModel.isCarInFavorites(userId, carId);
    res.status(200).json({ isFavorite });
  } catch (error) {
    console.error("Greška pri proveri da li je automobil u favoritima:", error);
    res
      .status(500)
      .json({ message: "Došlo je do greške pri proveri favorita" });
  }
}

async function countUserFavorites(req, res) {
  try {
    const userId = req.user.id;
    const count = await favoriteModel.countUserFavorites(userId);
    res.status(200).json({ count });
  } catch (error) {
    console.error("Greška pri brojanju favorita korisnika:", error);
    res
      .status(500)
      .json({ message: "Došlo je do greške pri brojanju favorita" });
  }
}

module.exports = {
  addCarToFavorites,
  removeCarFromFavorites,
  getUserFavorites,
  isCarInFavorites,
  countUserFavorites,
};
