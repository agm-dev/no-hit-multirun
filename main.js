const { app, BrowserWindow } = require('electron')
const express = require('express')
const WebSocket = require('ws')

const CONFIG = {
  http_port: 8888,
}

const expressApp = express()
const server = require('http').createServer(expressApp)

expressApp.use(express.urlencoded())
expressApp.use('/assets', express.static(`${__dirname}/www/assets`))
expressApp.use('/games', (_req, res) => res.sendFile(`${__dirname}/www/games.html`))
expressApp.use('/', (_req, res) => res.sendFile(`${__dirname}/www/index.html`))

const wss = new WebSocket.Server({ server: server })

const getUniqueId = () => {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }

  return s4() + s4() + '-' + s4();
}

wss.on('connection', (ws, req) => {
  ws.id = getUniqueId()

  const sendAll = (message) => {
    const stringified = JSON.stringify(message)
    console.log(`Sending message to all clients:`, stringified)
    wss.clients.forEach((client) => client.send(stringified))
  }

  ws.on('close', () => console.log(`Client ${ws.id} disconnected`))
  
  ws.on('message', (rawData) => {
    // console.log('event', rawData)
    const data = rawData.toString()
    // console.log('data', data)
    const message = JSON.parse(data)
    console.log(`Message received from ${ws.id}:`, message)
    sendAll(message)
  })
})

server.listen(CONFIG.http_port, () => {
  console.log(`Server started on http://localhost:${CONFIG.http_port}`)
})

const createWindow = () => {
  const win = new BrowserWindow({
    width: 600,
    height: 800,
    autoHideMenuBar: true,
    useContentSize: true,
    acceptFirstMouse: true,
  })

  win.loadURL(`http://localhost:${CONFIG.http_port}`)
  win.focus()

  // win.webContents.openDevTools()

  win.on('closed', () => {
    win.destroy()
  })
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})