const commentController = require("../controllers/commentController");
const { isAuthenticated } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/roleMiddleware"); // Ako imate middleware za admin ulogu

function handleCommentRoutes(req, res) {
  const { url, method } = req;
  const pathParts = url.split("/").filter((part) => part !== "");
  const resource = pathParts[1]; // 'auctions', 'comments' ili 'admin'

  // Ruta za postavljanje novog komentara na aukciju (za ulogovane korisnike)
  if (
    resource === "comments" &&
    method === "POST" &&
    isAuthenticated(req, res)
  ) {
    commentController.createComment(req, res);
    return true;
  }

  // Ruta za dobavljanje jednog komentara po ID-u (za admin ili vlasnika komentara - implementirati proveru u kontroleru)
  if (
    resource === "comments" &&
    method === "GET" &&
    pathParts.length === 3 &&
    isAuthenticated(req, res)
  ) {
    req.params.id = pathParts[2];
    commentController.getCommentById(req, res);
    return true;
  }

  // Ruta za dobavljanje svih komentara za određeni automobil
  if (
    resource === "auctions" &&
    pathParts.length === 3 &&
    method === "GET" &&
    pathParts[2] &&
    url.includes("/comments")
  ) {
    req.params.carId = pathParts[2];
    commentController.getCommentsByCarId(req, res);
    return true;
  }

  // Ruta za dobavljanje svih komentara ulogovanog korisnika
  if (
    resource === "users" &&
    pathParts.length === 3 &&
    method === "GET" &&
    isAuthenticated(req, res) &&
    pathParts[2] === "comments"
  ) {
    commentController.getCommentsByUserId(req, res);
    return true;
  }

  // Ruta za ažuriranje komentara po ID-u (za vlasnika komentara ili admina - implementirati proveru u kontroleru)
  if (
    resource === "comments" &&
    method === "PATCH" &&
    pathParts.length === 3 &&
    isAuthenticated(req, res)
  ) {
    req.params.id = pathParts[2];
    commentController.updateComment(req, res);
    return true;
  }

  // Ruta za brisanje komentara po ID-u (za vlasnika komentara ili admina - implementirati proveru u kontroleru)
  if (
    resource === "comments" &&
    method === "DELETE" &&
    pathParts.length === 3 &&
    isAuthenticated(req, res)
  ) {
    req.params.id = pathParts[2];
    commentController.deleteComment(req, res);
    return true;
  }

  // Ruta za dobavljanje broja komentara za određeni automobil
  if (
    resource === "auctions" &&
    pathParts.length === 4 &&
    method === "GET" &&
    pathParts[2] &&
    pathParts[3] === "comments-count"
  ) {
    req.params.carId = pathParts[2];
    commentController.getCommentsCountByCarId(req, res);
    return true;
  }

  return false; // Ruta nije obrađena ovde
}

module.exports = handleCommentRoutes;
