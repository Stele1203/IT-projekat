const userModel = require("../database/models/user");
const bidModel = require("../database/models/bid");

// --- Upravljanje korisnicima ---
async function getAllUsers(req, res) {
  try {
    const users = await userModel.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error("Greška pri dobavljanju svih korisnika:", error);
    res
      .status(500)
      .json({ message: "Došlo je do greške pri dobavljanju korisnika" });
  }
}

async function getUserById(req, res) {
  try {
    const userId = req.params.id;
    const user = await userModel.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "Korisnik nije pronađen" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(
      `Greška pri dobavljanju korisnika sa ID-jem ${req.params.id}:`,
      error
    );
    res
      .status(500)
      .json({ message: "Došlo je do greške pri dobavljanju korisnika" });
  }
}

async function banUser(req, res) {
  try {
    const userId = req.params.id;
    const userToBan = await userModel.getUserById(userId);
    if (!userToBan) {
      return res.status(404).json({ message: "Korisnik nije pronađen" });
    }
    if (userToBan.role === "admin") {
      return res
        .status(403)
        .json({ message: "Nije dozvoljeno banovati administratora" });
    }
    const banned = await userModel.banUser(userId);
    if (banned) {
      res.status(200).json({ message: "Korisnik uspešno banovan" });
    } else {
      res
        .status(500)
        .json({ message: "Došlo je do greške pri banovanju korisnika" });
    }
  } catch (error) {
    console.error(
      `Greška pri banovanju korisnika sa ID-jem ${req.params.id}:`,
      error
    );
    res
      .status(500)
      .json({ message: "Došlo je do greške pri banovanju korisnika" });
  }
}

async function unbanUser(req, res) {
  try {
    const userId = req.params.id;
    const userToUnban = await userModel.getUserById(userId);
    if (!userToUnban) {
      return res.status(404).json({ message: "Korisnik nije pronađen" });
    }
    const unbanned = await userModel.unbanUser(userId);
    if (unbanned) {
      res.status(200).json({ message: "Korisnik uspešno od-banovan" });
    } else {
      res
        .status(500)
        .json({ message: "Došlo je do greške pri od-banovanju korisnika" });
    }
  } catch (error) {
    console.error(
      `Greška pri od-banovanju korisnika sa ID-jem ${req.params.id}:`,
      error
    );
    res
      .status(500)
      .json({ message: "Došlo je do greške pri od-banovanju korisnika" });
  }
}

async function updateUserRole(req, res) {
  try {
    const userId = req.params.id;
    const { role } = req.body;
    const allowedRoles = ["regular", "admin"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Neispravna uloga korisnika" });
    }
    const userToUpdate = await userModel.getUserById(userId);
    if (!userToUpdate) {
      return res.status(404).json({ message: "Korisnik nije pronađen" });
    }
    const updated = await userModel.updateUserRole(userId, role);
    if (updated) {
      res.status(200).json({ message: "Uloga korisnika uspešno ažurirana" });
    } else {
      res
        .status(500)
        .json({ message: "Došlo je do greške pri ažuriranju uloge korisnika" });
    }
  } catch (error) {
    console.error(
      `Greška pri ažuriranju uloge korisnika sa ID-jem ${req.params.id}:`,
      error
    );
    res
      .status(500)
      .json({ message: "Došlo je do greške pri ažuriranju uloge korisnika" });
  }
}

// --- Upravljanje ponudama ---
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

async function deleteBid(req, res) {
  try {
    const bidId = req.params.id;
    const deleted = await bidModel.deleteBid(bidId);
    if (deleted > 0) {
      res.status(200).json({ message: "Ponuda uspešno obrisana" });
    } else {
      return res.status(404).json({ message: "Ponuda nije pronađena" });
    }
  } catch (error) {
    console.error(
      `Greška pri brisanju ponude sa ID-jem ${req.params.id}:`,
      error
    );
    res.status(500).json({ message: "Došlo je do greške pri brisanju ponude" });
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  banUser,
  unbanUser,
  updateUserRole,
  getAllBids,
  deleteBid,
};
