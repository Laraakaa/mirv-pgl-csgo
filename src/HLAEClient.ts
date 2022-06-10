import { EventEmitter, WebSocket } from 'ws'
import UserIdEnrichment from './event/enrichment/UserIdEnrichment'

import GameEventUnserializer from './event/GameEventUnserializer'
import BufferReader from './util/BufferReader'

class HLAEServer extends EventEmitter {
  socket: WebSocket;
  userIdEnrichment = new UserIdEnrichment();
  enrichments: {[type: string]: {[type: string]: UserIdEnrichment}} = {}

  gameEventUnserializer: GameEventUnserializer;

  constructor (socket: WebSocket) {
    super()
    this.socket = socket
    this.enrichments = {
      player_death: {
        userid: this.userIdEnrichment,
        attacker: this.userIdEnrichment,
        assister: this.userIdEnrichment
      }
    }
    this.gameEventUnserializer = new GameEventUnserializer(this.enrichments)
  }

  handleData = (data: Buffer) => {
    const bufferReader = new BufferReader(data)
    const command = bufferReader.readCString()

    switch (command) {
      case 'hello':
        this.handleHello(bufferReader)
        break
      case 'gameEvent':
        this.handleGameEvent(bufferReader)
        break
      default:
        console.log('received unknown command: ' + command)
    }
  }

  handleHello = (bufferReader: BufferReader) => {
    const version = bufferReader.readInt8()
    console.log(`HLAE said hello with version ${version}`)

    if (version !== 2) {
      console.log('This library version has not been tested with this HLAE version.')
    }

    this.emit('hello', version)
  }

  handleGameEvent = (bufferReader: BufferReader) => {
    const gameEvent = this.gameEventUnserializer.unserialize(bufferReader)

    if (gameEvent) {
      this.emit('gameEvent', gameEvent)
    }
  }

  sendString = (str: String) => {
    const buf = Buffer.from(str, 'utf-8')
    this.socket.send(new Uint8Array(buf), { binary: true })
  }

  sendTransBegin = () => {
    this.sendString('transBegin\0')
  }

  sendTransEnd = () => {
    this.sendString('transEnd\0')
  }

  sendExecCommand = (command: String) => {
    const str = `exec\0${command}\0`
    this.sendString(str)
  }

  enableEvents = (whitelist: string[] = []) => {
    this.sendTransBegin()
    this.sendExecCommand('mirv_pgl events enrich clientTime 1')
    for (const eventName in this.enrichments) {
      for (const keyName in this.enrichments[eventName]) {
        const arrEnrich = this.enrichments[eventName][keyName].enrichments

        arrEnrich.forEach(enrichment => this.sendExecCommand(`mirv_pgl events enrich eventProperty "${enrichment}" "${eventName}" "${keyName}"`))
      }
    }
    this.sendExecCommand('mirv_pgl events enabled 1')
    this.sendExecCommand('mirv_pgl events useCache 0')
    this.sendExecCommand('mirv_pgl events whitelist clear')
    whitelist.forEach(entry => {
      this.sendExecCommand('mirv_pgl events whitelist add ' + entry)
    })
    this.sendTransEnd()
  }
}

export default HLAEServer
