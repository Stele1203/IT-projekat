const commentModel = require("../database/models/comment");
const carModel = require("../database/models/car"); // Da proverimo da li aukcija postoji

async function createComment(req, res) {
  try {
    const { carId, commentText } = req.body;
    const userId = req.user.id;

    // Proveri da li aukcija postoji
    const carExists = await carModel.getCarById(carId);
    if (!carExists) {
      return res
        .status(404)
        .json({ message: "Aukcija automobila nije pronađena" });
    }

    const commentId = await commentModel.createComment(
      userId,
      carId,
      commentText
    );
    res.status(201).json({ message: "Komentar uspešno postavljen", commentId });
  } catch (error) {
    console.error("Greška pri postavljanju komentara:", error);
    res
      .status(500)
      .json({ message: "Došlo je do greške pri postavljanju komentara" });
  }
}

async function getCommentById(req, res) {
  try {
    const commentId = req.params.id;
    const comment = await commentModel.getCommentById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Komentar nije pronađen" });
    }
    res.status(200).json(comment);
  } catch (error) {
    console.error(
      `Greška pri dobavljanju komentara sa ID-jem ${req.params.id}:`,
      error
    );
    res
      .status(500)
      .json({ message: "Došlo je do greške pri dobavljanju komentara" });
  }
}

async function getCommentsByCarId(req, res) {
  try {
    const carId = req.params.carId;
    const comments = await commentModel.getCommentsByCarId(carId);
    res.status(200).json(comments);
  } catch (error) {
    console.error(
      `Greška pri dobavljanju komentara za automobil sa ID-jem ${req.params.carId}:`,
      error
    );
    res
      .status(500)
      .json({ message: "Došlo je do greške pri dobavljanju komentara" });
  }
}

async function getCommentsByUserId(req, res) {
  try {
    const userId = req.user.id;
    const comments = await commentModel.getCommentsByUserId(userId);
    res.status(200).json(comments);
  } catch (error) {
    console.error(
      `Greška pri dobavljanju komentara korisnika sa ID-jem ${req.user.id}:`,
      error
    );
    res.status(500).json({
      message: "Došlo je do greške pri dobavljanju komentara korisnika",
    });
  }
}

async function updateComment(req, res) {
  try {
    const commentId = req.params.id;
    const { commentText } = req.body;
    const userId = req.user.id; // Da proverimo da li je korisnik vlasnik komentara

    // TODO: Dodati proveru da li je korisnik vlasnik komentara ili admin
    const updated = await commentModel.updateComment(commentId, commentText);
    if (updated > 0) {
      res.status(200).json({ message: "Komentar uspešno ažuriran" });
    } else {
      return res.status(404).json({
        message: "Komentar nije pronađen ili nemate dozvolu da ga ažurirate",
      });
    }
  } catch (error) {
    console.error(
      `Greška pri ažuriranju komentara sa ID-jem ${req.params.id}:`,
      error
    );
    res
      .status(500)
      .json({ message: "Došlo je do greške pri ažuriranju komentara" });
  }
}

async function deleteComment(req, res) {
  try {
    const commentId = req.params.id;
    const userId = req.user.id; // Da proverimo da li je korisnik vlasnik komentara

    // TODO: Dodati proveru da li je korisnik vlasnik komentara ili admin
    const deleted = await commentModel.deleteComment(commentId);
    if (deleted > 0) {
      res.status(200).json({ message: "Komentar uspešno obrisan" });
    } else {
      return res.status(404).json({
        message: "Komentar nije pronađen ili nemate dozvolu da ga obrišete",
      });
    }
  } catch (error) {
    console.error(
      `Greška pri brisanju komentara sa ID-jem ${req.params.id}:`,
      error
    );
    res
      .status(500)
      .json({ message: "Došlo je do greške pri brisanju komentara" });
  }
}

async function getCommentsCountByCarId(req, res) {
  try {
    const carId = req.params.carId;
    const count = await commentModel.countCommentsByCarId(carId);
    res.status(200).json({ count });
  } catch (error) {
    console.error(
      `Greška pri brojanju komentara za automobil sa ID-jem ${req.params.carId}:`,
      error
    );
    res
      .status(500)
      .json({ message: "Došlo je do greške pri brojanju komentara" });
  }
}

module.exports = {
  createComment,
  getCommentById,
  getCommentsByCarId,
  getCommentsByUserId,
  updateComment,
  deleteComment,
  getCommentsCountByCarId,
};
