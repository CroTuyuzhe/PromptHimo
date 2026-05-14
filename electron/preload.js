const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  saveImage: (arrayBuffer, filename) =>
    ipcRenderer.invoke("save-image", arrayBuffer, filename),
  deleteImage: (filename) =>
    ipcRenderer.invoke("delete-image", filename),
  getImageUrl: (filename) => `app://images/${filename}`,
  isElectron: true,
});
