const { app, BrowserWindow, dialog, ipcMain } = require('electron')
const path = require("path")

app.whenReady().then(() => {
    const win = new BrowserWindow({
        icon: __dirname+"/sprite.ico",
        width: 750,
        height: 650,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            nodeIntegrationInWorker: true,
            enableRemoteModule: true,
            contextIsolation: false,
            sandbox:false,
        }
    })
    win.loadFile('./src/index.html')
    // win.webContents.openDevTools()
    // ipcMain.handle("runThread", (event, _function, arguments) => {
    //   const worker = new Worker('./src/code/worker-thread.mjs', { workerData: {function: _function, arguments: arguments} })
    // })
})


ipcMain.handle("homeDir", (event) => {
  return __dirname
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })
