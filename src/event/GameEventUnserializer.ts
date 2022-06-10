import BufferReader from '../util/BufferReader'
import UserIdEnrichment from './enrichment/UserIdEnrichment'
import GameEventDescription from './GameEventDescription'

class GameEventUnserializer {
  enrichments: {[key: string]: {[key: string]: UserIdEnrichment}} = {};
  eventDescriptions: {[key: number]: GameEventDescription} = {};

  constructor (enrichments: {[key: string]: {[key: string]: UserIdEnrichment}} = {}) {
    this.enrichments = enrichments
  }

  unserialize (bufferReader: BufferReader) {
    const eventId = bufferReader.readInt32LE()
    let gameEventDescription: GameEventDescription

    if (eventId === 0) {
      gameEventDescription = new GameEventDescription(bufferReader)
      this.eventDescriptions[gameEventDescription.eventId] = gameEventDescription

      if (this.enrichments[gameEventDescription.eventName]) {
        gameEventDescription.setEnrichments(this.enrichments[gameEventDescription.eventName])
      }
    } else {
      gameEventDescription = this.eventDescriptions[eventId]
    }

    if (!gameEventDescription) {
      console.log('Cannot find game event description for event id.')
      return {}
    }

    return gameEventDescription.unserialize(bufferReader)
  }
}

export default GameEventUnserializer
