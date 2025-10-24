import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http"; // Import createServer
import { Server } from "socket.io"; // Import Socket.IO Server
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";

dotenv.config();

connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("TaxiMoto backend is running 🚀");
});

import userRoutes from "./routes/userRoutes.js";
import fareRoutes from "./routes/fareRoutes.js";
import rideRoutes from "./routes/rideRoutes.js";
import promoCodeRoutes from "./routes/promoCodeRoutes.js";
import driverRoutes from "./routes/driverRoutes.js";

app.use("/api/users", userRoutes);
app.use("/api/fares", fareRoutes);
app.use("/api/rides", rideRoutes);
app.use("/api/promocodes", promoCodeRoutes);
app.use("/api/drivers", driverRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Create HTTP server and integrate Socket.IO
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Adjust as per your frontend URL
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User connected with id: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`User disconnected with id: ${socket.id}`);
  });
});

httpServer.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

export default app;
