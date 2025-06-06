const adminUserController = require("../controllers/adminUserController");
const { isAuthenticated } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/roleMiddleware");

function handleAdminUserRoutes(req, res) {
  const { url, method } = req;
  const pathParts = url.split("/").filter((part) => part !== "");
  const resource = pathParts[2]; // Pretpostavljamo da je /api/admin/users/...

  // Ruta za dobavljanje svih korisnika (admin only)
  if (
    pathParts[0] === "api" &&
    pathParts[1] === "admin" &&
    resource === "users" &&
    method === "GET" &&
    isAuthenticated(req, res) &&
    isAdmin(req, res)
  ) {
    adminUserController.getAllUsers(req, res);
    return true;
  }

  // Ruta za dobavljanje jednog korisnika po ID-u (admin only)
  if (
    pathParts[0] === "api" &&
    pathParts[1] === "admin" &&
    resource === "users" &&
    method === "GET" &&
    pathParts.length === 4 &&
    isAuthenticated(req, res) &&
    isAdmin(req, res)
  ) {
    req.params.id = pathParts[3];
    adminUserController.getUserById(req, res);
    return true;
  }

  // Ruta za banovanje korisnika po ID-u (admin only)
  if (
    pathParts[0] === "api" &&
    pathParts[1] === "admin" &&
    resource === "users" &&
    method === "PATCH" &&
    pathParts.length === 4 &&
    isAuthenticated(req, res) &&
    isAdmin(req, res) &&
    url.endsWith("/ban")
  ) {
    req.params.id = pathParts[3].replace("/ban", "");
    adminUserController.banUser(req, res);
    return true;
  }

  // Ruta za od-banovanje korisnika po ID-u (admin only)
  if (
    pathParts[0] === "api" &&
    pathParts[1] === "admin" &&
    resource === "users" &&
    method === "PATCH" &&
    pathParts.length === 4 &&
    isAuthenticated(req, res) &&
    isAdmin(req, res) &&
    url.endsWith("/unban")
  ) {
    req.params.id = pathParts[3].replace("/unban", "");
    adminUserController.unbanUser(req, res);
    return true;
  }

  // Ruta za promenu uloge korisnika po ID-u (admin only)
  if (
    pathParts[0] === "api" &&
    pathParts[1] === "admin" &&
    resource === "users" &&
    method === "PATCH" &&
    pathParts.length === 4 &&
    isAuthenticated(req, res) &&
    isAdmin(req, res) &&
    !url.endsWith("/ban") &&
    !url.endsWith("/unban")
  ) {
    req.params.id = pathParts[3];
    adminUserController.updateUserRole(req, res);
    return true;
  }

  return false; // Ruta nije obrađena ovde
}

module.exports = handleAdminUserRoutes;
