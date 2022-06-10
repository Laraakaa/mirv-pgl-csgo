import BufferReader from "../../util/BufferReader";

class UserIdEnrichment {
  enrichments = ['useridWithSteamId'];

  unserialize(bufferReader: BufferReader, keyValue: any) {
    const steamId = bufferReader.readBigUInt64LE().toString();

    return {
      value: keyValue,
      steamId
    }
  }
}

export default UserIdEnrichment;