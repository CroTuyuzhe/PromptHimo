const { app, BrowserWindow, ipcMain, protocol, net } = require("electron");
const path = require("path");
const fs = require("fs");

const staticDir = path.join(__dirname, "..", "out");
const imagesDir = path.join(app.getPath("userData"), "preset-images");

fs.mkdirSync(imagesDir, { recursive: true });

protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { standard: true, secure: true, supportFetchAPI: true } },
]);

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: "Prompt Himo",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile(path.join(staticDir, "index.html"));

  // mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  protocol.handle("app", (request) => {
    const url = new URL(request.url);
    if (url.hostname === "images") {
      const filePath = path.join(imagesDir, path.basename(url.pathname));
      return net.fetch(`file://${filePath}`);
    }
    return new Response("Not found", { status: 404 });
  });

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

ipcMain.handle("save-image", async (_event, arrayBuffer, filename) => {
  const filePath = path.join(imagesDir, path.basename(filename));
  fs.writeFileSync(filePath, Buffer.from(arrayBuffer));
  return { ok: true, filename };
});

ipcMain.handle("delete-image", async (_event, filename) => {
  const filePath = path.join(imagesDir, path.basename(filename));
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  return { ok: true };
});
