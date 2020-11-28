require('electron-reload')(__dirname)
const { app, BrowserWindow } = require('electron')

function createWindow () {
  const win = new BrowserWindow({
    frame: false,
    // transparent: true,
    width: 400,
    height: 600,
    icon: __dirname + '/test.png',
    minWidth: 400,
    minHeight: 600,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      enableRemoteModule: true,
    }
  })

  win.loadFile('./src/index.html')
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
