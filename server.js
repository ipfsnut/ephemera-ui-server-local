const express = require("express");
const multer = require("multer");
const path = require("path");
const ipfsClient = require("ipfs-http-client");
const { exec } = require("child_process");
const fs = require("fs");
const formidable = require("formidable"); // Import formidable

const app = express();
const upload = multer({ dest: "uploads/" });

// Configure IPFS client
const ipfs = ipfsClient.create({
  host: process.env.IPFS_HOST || "localhost",
  port: process.env.IPFS_PORT || 5001,
  protocol: "http",
});

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Route for handling file uploads
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).send("No file uploaded");
    }

    const fileAdded = await ipfs.add(file.buffer);
    const cid = fileAdded.cid.toString();
    await ipfs.pin.add(cid);
    res.send(`File uploaded and pinned to IPFS with CID: ${cid}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error uploading and pinning file");
  }
});

// Route for handling directory uploads
app.post("/upload-folder", (req, res) => {
  const form = formidable({ multiples: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error uploading directory");
    }

    const uploadedDir = files.file.path; // Assuming the field name is 'file'

    try {
      const dirAdded = await ipfs.add(fs.createReadStream(uploadedDir), {
        recursive: true,
      });
      const dirCid = dirAdded.cid.toString();
      await ipfs.pin.add(dirCid);
      res.send(`Directory uploaded and pinned to IPFS with CID: ${dirCid}`);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error uploading and pinning directory");
    }
  });
});

// Route for retrieving pinned files
app.get("/pinned-files", async (req, res) => {
  try {
    const pinnedFiles = await ipfs.pin.ls();
    const cids = pinnedFiles.map((file) => file.cid.toString());
    res.json(cids);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving pinned files");
  }
});

// Route for retrieving node info
app.get("/ipfs-info", async (req, res) => {
  try {
    exec("ipfs id", (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return res.status(500).send("Error getting IPFS node information");
      }
      res.send(`IPFS Node Information:\n${stdout}`);
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error getting IPFS node information");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
