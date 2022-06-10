import BufferReader from '../util/BufferReader'
import UserIdEnrichment from './enrichment/UserIdEnrichment'
import GameEvent from './GameEvent'

class GameEventDescription {
  eventId: number;
  eventName: string;
  keys: Array<{name: string, type: number}> = [];
  enrichments: {[key: string]: UserIdEnrichment} = {};

  constructor (bufferReader: BufferReader) {
    this.eventId = bufferReader.readInt32LE()
    this.eventName = bufferReader.readCString()

    while (bufferReader.readBoolean()) {
      const name = bufferReader.readCString()
      const type = bufferReader.readInt32LE()

      this.keys.push({ name, type })
    }
  }

  setEnrichments (enrichments: {[key: string]: UserIdEnrichment}): void {
    this.enrichments = enrichments
  }

  unserialize (bufferReader: BufferReader): GameEvent {
    const clientTime = bufferReader.readFloatLE()

    const result = new GameEvent(this.eventName, clientTime)

    for (let i = 0; i < this.keys.length; i++) {
      const key = this.keys[i]
      let keyValue: any

      switch (key.type) {
        case 1:
          keyValue = bufferReader.readCString()
          break
        case 2:
          keyValue = bufferReader.readFloatLE()
          break
        case 3:
          keyValue = bufferReader.readInt32LE()
          break
        case 4:
          keyValue = bufferReader.readInt16LE()
          break
        case 5:
          keyValue = bufferReader.readInt8()
          break
        case 6:
          keyValue = bufferReader.readBoolean()
          break
        case 7:
          keyValue = bufferReader.readBigUInt64LE()
          break
        default:
          console.log('invalid key type found')
      }

      if (this.enrichments?.[key.name] !== undefined) {
        keyValue = this.enrichments[key.name].unserialize(bufferReader, keyValue)
      }

      result.keys[key.name] = keyValue
    }

    return result
  }
}

export default GameEventDescription
