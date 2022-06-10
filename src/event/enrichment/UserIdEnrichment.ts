import BufferReader from '../../util/BufferReader'

class UserIdEnrichment {
  enrichments = ['useridWithSteamId'];

  unserialize (bufferReader: BufferReader, keyValue: any): { value: any, steamId: string } {
    const steamId = bufferReader.readBigUInt64LE().toString()

    return {
      value: keyValue,
      steamId
    }
  }
}

export default UserIdEnrichment
