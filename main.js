const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");

function createWindow() {
  const win = new BrowserWindow({
    width: 854,
    height: 480,
    frame: false,
    resizable: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  ipcMain.handle("minimize", () => {
    win.minimize();
  });

  ipcMain.handle("close", () => {
    win.close();
  });

  // const url = "http://localhost:3000";

  // win.loadURL(url);

  // main.js 파일이 있는 디렉토리의 정적 파일에 접근하기 위해 path 모듈을 사용하여 절대 경로를 생성합니다.
  const filePath = path.join(__dirname, "static", "index.html");

  // 정적 파일을 로드합니다.
  mainWindow.loadFile(filePath);
}

app.whenReady().then(() => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.allowRendererProcessReuse = true;
