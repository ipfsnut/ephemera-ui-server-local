// utils/ipfs.js
const addFileToIPFS = async (fileBuffer, ipfs) => {
  const fileAdded = await ipfs.add(fileBuffer);
  const cid = fileAdded.cid.toString();
  return cid;
};

const pinFileToIPFS = async (cid, ipfs) => {
  await ipfs.pin.add(cid);
};

const getPinnedFiles = async (ipfs) => {
  const pinnedFiles = await ipfs.pin.ls();
  return pinnedFiles.map((file) => file.cid.toString());
};

module.exports = {
  addFileToIPFS,
  pinFileToIPFS,
  getPinnedFiles,
};
