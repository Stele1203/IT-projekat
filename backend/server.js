const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); // Ako ti treba Cross-Origin Resource Sharing
const setupWebSocketServer = require("./websocket/websocketServer"); // WebSocket server

// Import rute
const adminRoutes = require("./routes/adminRoutes");
const adminUserRoutes = require("./routes/adminUserRoutes");
const auctionRequestRoutes = require("./routes/auctionRequestRoutes");
const bidRoutes = require("./routes/bidRoutes");
const carRoutes = require("./routes/carRoutes");
const commentRoutes = require("./routes/commentRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const statsRoutes = require("./routes/statsRoutes");

// Import database
const db = require("./database/index");

const app = express();
const port = process.env.PORT || 3000; // Koristi port iz okruženja ili 3000 kao default

// Middleware
app.use(cors()); // Konfiguriši CORS prema potrebama
app.use(bodyParser.json()); // Za parsiranje JSON tela zahteva

// Rute
app.use("/api/admin", (req, res) => {
  // Ovo je malo neobično, ali ti tako organizuješ rute
  if (!adminRoutes(req, res)) {
    if (!adminUserRoutes(req, res)) {
      if (!statsRoutes(req, res)) {
        res.status(404).json({ message: "Ruta nije pronađena" });
      }
    }
  }
});

app.use("/api", auctionRequestRoutes);
app.use("/api", bidRoutes);
app.use("/api", carRoutes);
app.use("/api", commentRoutes);
app.use("/api", favoriteRoutes);

// Ostale rute možeš dodati ovde...

// Middleware za obradu grešaka (ovo mora biti DEFINISANO POSLE svih ruta)
app.use((err, req, res, next) => {
  console.error(err.stack); // Loguj grešku za debug
  res.status(500).json({ message: "Došlo je do greške na serveru" });
});

// Pokretanje servera
const server = app.listen(port, () => {
  console.log(`Server pokrenut na portu ${port}`);
});

// Pokretanje WebSocket servera
setupWebSocketServer(server);
