class BufferReader {
  buffer: Buffer;
  index = 0;

  constructor (buffer: Buffer) {
    this.buffer = buffer
  }

  readInt8 () {
    const result = this.buffer.readInt8(this.index)
    this.index++

    return result
  }

  readUInt8 () {
    const result = this.buffer.readUInt8(this.index)
    this.index++

    return result
  }

  readInt16LE () {
    const result = this.buffer.readInt16LE(this.index)
    this.index += 2

    return result
  }

  readInt32LE () {
    const result = this.buffer.readInt32LE(this.index)
    this.index += 4

    return result
  }

  readUInt32LE () {
    const result = this.buffer.readUInt32LE(this.index)
    this.index += 4

    return result
  }

  readBigUInt64LE () {
    const lo = this.readUInt32LE()
	  const hi = this.readUInt32LE()

    return BigInt(lo) | (BigInt(hi) << 32n)
  }

  readFloatLE () {
    const result = this.buffer.readFloatLE(this.index)
    this.index += 4

    return result
  }

  readBoolean () {
    return this.readUInt8() != 0
  }

  readCString () {
    const beginning = this.index
    for (let i = this.index; i < this.buffer.length; i++) {
      const bin = this.buffer.readInt8(i)

      if (bin === 0) {
        this.index = i + 1
        return this.buffer.toString('utf-8', beginning, i)
      }
    }

    this.index = this.buffer.length - 1
    return this.buffer.toString('utf-8')
  }
}

export default BufferReader
