import { EventEmitter, WebSocketServer } from 'ws'

import HLAEServer from './HLAEClient'

class WSServer extends EventEmitter {
  wsServer: WebSocketServer

  constructor () {
    super()
    this.wsServer = new WebSocketServer({ port: 3003 })
    console.log('WS server listening on localhost:3003')

    this.registerEvents()
  }

  registerEvents = () => {
    this.wsServer.on('connection', (ws) => {
      console.log('new ws connection')

      const server = new HLAEServer(ws)

      this.emit('connection', server)

      ws.on('message', (data) => {
        server.handleData(data as Buffer)
      })
    })
  }
}

export default WSServer
