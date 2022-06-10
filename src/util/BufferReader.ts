class BufferReader {
  buffer: Buffer;
  index = 0;

  constructor(buffer: Buffer) {
    this.buffer = buffer;
  }

  readInt8() {
    let result = this.buffer.readInt8(this.index);
    this.index++;

    return result;
  }

  readUInt8() {
    let result = this.buffer.readUInt8(this.index);
    this.index++;

    return result;
  }

  readInt16LE() {
    let result = this.buffer.readInt16LE(this.index);
    this.index += 2;

    return result;
  }

  readInt32LE() {
    let result = this.buffer.readInt32LE(this.index);
    this.index += 4;

    return result;
  }

  readUInt32LE() {
    let result = this.buffer.readUInt32LE(this.index);
    this.index += 4;

    return result;
  }

  readBigUInt64LE() {
    var lo = this.readUInt32LE();
	  var hi = this.readUInt32LE();

    return BigInt(lo) | (BigInt(hi) << 32n);
  }

  readFloatLE() {
    let result = this.buffer.readFloatLE(this.index);
    this.index += 4;

    return result;
  }

  readBoolean() {
    return 0 != this.readUInt8();
  }

  readCString() {
    let beginning = this.index;
    for (let i = this.index; i < this.buffer.length; i++) {
      const bin = this.buffer.readInt8(i);
  
      if (bin === 0) {
        this.index = i + 1;
        return this.buffer.toString("utf-8", beginning, i);
      }
    }

    this.index = this.buffer.length - 1;
    return this.buffer.toString("utf-8");
  }
}

export default BufferReader;