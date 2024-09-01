const express = require("express");
const multer = require("multer");
const path = require("path");
const ipfsApi = require("ipfs-api"); // Use ipfs-api instead of ipfs-http-client
const fs = require("fs");
const formidable = require("formidable");
const cors = require("cors");

const app = express();
const upload = multer({ dest: "uploads/" });

// Configure IPFS client
const ipfs = new ipfsApi({
  host: process.env.IPFS_HOST || "localhost",
  port: process.env.IPFS_PORT || 5001,
  protocol: "http",
});

// Enable CORS
app.use(cors());

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Route for handling file uploads
app.post("/upload", upload.single("file"), async (req, res) => {
  // Your existing code for handling file uploads
});

// Route for handling directory uploads
app.post("/upload-folder", (req, res) => {
  // Your existing code for handling directory uploads
});

// Route for retrieving pinned files
app.get("/pinned-files", async (req, res) => {
  // Your existing code for retrieving pinned files
});

// Route for retrieving node info
app.get("/ipfs-info", async (req, res) => {
  // Your existing code for retrieving IPFS node info
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
