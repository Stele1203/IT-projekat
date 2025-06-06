const carModel = require("../database/models/car");

// Kreiranje nove aukcije automobila (samo za admina)
async function createCar(req, res) {
  try {
    const {
      title,
      description,
      year,
      startPrice,
      currentPrice,
      imagePath,
      auctionEndDate,
    } = req.body;
    const sellerId = req.user.id; // Pretpostavljamo da je admin takođe korisnik sa ID-jem

    const carId = await carModel.createCar(
      sellerId,
      title,
      description,
      year,
      startPrice,
      currentPrice,
      imagePath,
      auctionEndDate
    );

    res
      .status(201)
      .json({ message: "Aukcija automobila uspešno kreirana", carId });
  } catch (error) {
    console.error("Greška pri kreiranju aukcije automobila:", error);
    res
      .status(500)
      .json({ message: "Došlo je do greške pri kreiranju aukcije automobila" });
  }
}

// Dobavljanje jednog automobila po ID-u (za sve korisnike)
async function getCarById(req, res) {
  try {
    const carId = req.params.id;
    const car = await carModel.getCarById(carId);

    if (!car) {
      return res
        .status(404)
        .json({ message: "Aukcija automobila nije pronađena" });
    }

    res.status(200).json(car);
  } catch (error) {
    console.error(
      `Greška pri dobavljanju aukcije automobila sa ID-jem ${req.params.id}:`,
      error
    );
    res
      .status(500)
      .json({
        message: "Došlo je do greške pri dobavljanju aukcije automobila",
      });
  }
}

// Dobavljanje svih aktivnih automobila (za sve korisnike)
async function getAllActiveCars(req, res) {
  try {
    const cars = await carModel.getAllActiveCars();
    res.status(200).json(cars);
  } catch (error) {
    console.error(
      "Greška pri dobavljanju svih aktivnih aukcija automobila:",
      error
    );
    res
      .status(500)
      .json({ message: "Došlo je do greške pri dobavljanju aktivnih aukcija" });
  }
}

// Ažuriranje aukcije automobila po ID-u (samo za admina)
async function updateCar(req, res) {
  try {
    const carId = req.params.id;
    const {
      title,
      description,
      year,
      startPrice,
      currentPrice,
      imagePath,
      auctionEndDate,
      status,
    } = req.body;

    const updated = await carModel.updateCar(
      carId,
      title,
      description,
      year,
      startPrice,
      currentPrice,
      imagePath,
      auctionEndDate,
      status
    );

    if (updated > 0) {
      res.status(200).json({ message: "Aukcija automobila uspešno ažurirana" });
    } else {
      res.status(404).json({ message: "Aukcija automobila nije pronađena" });
    }
  } catch (error) {
    console.error(
      `Greška pri ažuriranju aukcije automobila sa ID-jem ${req.params.id}:`,
      error
    );
    res
      .status(500)
      .json({ message: "Došlo je do greške pri ažuriranju aukcije" });
  }
}

// Brisanje aukcije automobila po ID-u (samo za admina)
async function deleteCar(req, res) {
  try {
    const carId = req.params.id;
    const deleted = await carModel.deleteCar(carId);

    if (deleted > 0) {
      res.status(200).json({ message: "Aukcija automobila uspešno obrisana" });
    } else {
      res.status(404).json({ message: "Aukcija automobila nije pronađena" });
    }
  } catch (error) {
    console.error(
      `Greška pri brisanju aukcije automobila sa ID-jem ${req.params.id}:`,
      error
    );
    res
      .status(500)
      .json({ message: "Došlo je do greške pri brisanju aukcije" });
  }
}

// Pretraga automobila (za sve korisnike)
async function searchCars(req, res) {
  try {
    const { query } = req.query;
    const results = await carModel.searchCars(query);
    res.status(200).json(results);
  } catch (error) {
    console.error(
      `Greška pri pretrazi automobila sa upitom: ${req.query.query}`,
      error
    );
    res
      .status(500)
      .json({ message: "Došlo je do greške pri pretrazi automobila" });
  }
}

// Detaljna pretraga/filtriranje automobila (za sve korisnike)
async function filterCars(req, res) {
  try {
    const filters = req.query; // Pretpostavljamo da su filteri prosleđeni kao query parametri
    const results = await carModel.filterCars(filters);
    res.status(200).json(results);
  } catch (error) {
    console.error("Greška pri filtriranju automobila:", error);
    res
      .status(500)
      .json({ message: "Došlo je do greške pri filtriranju automobila" });
  }
}

module.exports = {
  createCar,
  getCarById,
  getAllActiveCars,
  updateCar,
  deleteCar,
  searchCars,
  filterCars,
};
