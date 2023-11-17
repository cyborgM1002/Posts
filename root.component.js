import express from "express";
import http from "http"; // Import the HTTP module
import { Server } from "socket.io"; // Import the Socket.IO module
import postRouter from "./src/routes/postRouter.js";
import userRouter from "./src/routes/userRoutes.js";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./src/middlewares/error.js";
import { config } from "dotenv";
import cors from "cors";
config({
  path: "./.env",
});

const URL =
  process.env.NODE_ENV === "Development"
    ? process.env.FRONTEND_URI_DEVELOPMENT
    : process.env.FRONTEND_URI_PRODUCTION;

const app = express();
const server = http.createServer(app); // Create an HTTP server instance
const io = new Server(server, {
  cors: {
    origin: [URL], // Allow requests from your client's origin
    methods: ["GET", "POST"],
  },
}); // Create a Socket.IO server instance

// middlewares
app.use(errorMiddleware);
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// cors
app.use(
  cors({
    origin: [URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
// static path
app.use(express.static("./server/dist"));
// routes
app.use("/users", userRouter);
app.use("/posts", postRouter);

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle chat messages
  socket.on("chat", (msg) => {
    // Broadcast the message to all connected clients
    io.emit("chat", msg);
  });

  // Handle disconnections
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

export { server }; // Export the modified server instance
