import { app, BrowserWindow, ipcMain, shell } from 'electron'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { registerProjectHandlers } from './ipc/projects.js'
import { registerAIHandlers } from './ipc/ai.js'
import { registerSatelliteHandlers } from './ipc/satellite.js'
import { registerConfigHandlers } from './ipc/config.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const isDev = !!process.env.VITE_DEV_SERVER_URL

let mainWindow: BrowserWindow | null = null

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1480,
    height: 920,
    minWidth: 1100,
    minHeight: 720,
    backgroundColor: '#0b1220',
    title: 'Landscape Studio',
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  })

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  if (isDev && process.env.VITE_DEV_SERVER_URL) {
    await mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
    mainWindow.webContents.openDevTools({ mode: 'detach' })
  } else {
    await mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

app.whenReady().then(async () => {
  registerConfigHandlers(ipcMain)
  registerProjectHandlers(ipcMain)
  registerAIHandlers(ipcMain)
  registerSatelliteHandlers(ipcMain)
  await createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
