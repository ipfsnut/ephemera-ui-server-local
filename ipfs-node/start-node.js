const { spawn } = require("child_process");

const ipfsPath = "/home/runner/.nix-profile/bin/ipfs";

const ipfsProcess = spawn(ipfsPath, ["daemon"], {
  detached: true,
  stdio: "inherit",
});

ipfsProcess.unref();

console.log("IPFS node started");
