import HLAEServer from './HLAEClient'
import WSServer from './WSServer'

const wsServer = new WSServer()

wsServer.on('connection', (server: HLAEServer) => {
  server.on('hello', () => {
    console.log('received hello')

    server.enableEvents()

    server.sendTransBegin()
    server.sendExecCommand('echo MIRV PGL connected!')
    server.sendTransEnd()
  })
})
