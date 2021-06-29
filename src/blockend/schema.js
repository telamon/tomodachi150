// This file is auto generated by the protocol-buffers compiler

/* eslint-disable quotes */
/* eslint-disable indent */
/* eslint-disable no-redeclare */
/* eslint-disable camelcase */

// Remember to `npm install --save protocol-buffers-encodings`
var encodings = require('protocol-buffers-encodings')
var varint = encodings.varint
var skip = encodings.skip

var Profile = exports.Profile = {
  buffer: true,
  encodingLength: null,
  encode: null,
  decode: null
}

var Report = exports.Report = {
  buffer: true,
  encodingLength: null,
  encode: null,
  decode: null
}

var Transaction = exports.Transaction = {
  buffer: true,
  encodingLength: null,
  encode: null,
  decode: null
}

var Rumor = exports.Rumor = {
  buffer: true,
  encodingLength: null,
  encode: null,
  decode: null
}

defineProfile()
defineReport()
defineTransaction()
defineRumor()

function defineProfile () {
  Profile.encodingLength = encodingLength
  Profile.encode = encode
  Profile.decode = decode

  function encodingLength (obj) {
    var length = 0
    if (defined(obj.seq)) {
      var len = encodings.varint.encodingLength(obj.seq)
      length += 1 + len
    }
    if (defined(obj.date)) {
      var len = encodings.varint.encodingLength(obj.date)
      length += 1 + len
    }
    if (defined(obj.alias)) {
      var len = encodings.string.encodingLength(obj.alias)
      length += 1 + len
    }
    if (defined(obj.tagline)) {
      var len = encodings.string.encodingLength(obj.tagline)
      length += 1 + len
    }
    return length
  }

  function encode (obj, buf, offset) {
    if (!offset) offset = 0
    if (!buf) buf = Buffer.allocUnsafe(encodingLength(obj))
    var oldOffset = offset
    if (defined(obj.seq)) {
      buf[offset++] = 8
      encodings.varint.encode(obj.seq, buf, offset)
      offset += encodings.varint.encode.bytes
    }
    if (defined(obj.date)) {
      buf[offset++] = 16
      encodings.varint.encode(obj.date, buf, offset)
      offset += encodings.varint.encode.bytes
    }
    if (defined(obj.alias)) {
      buf[offset++] = 26
      encodings.string.encode(obj.alias, buf, offset)
      offset += encodings.string.encode.bytes
    }
    if (defined(obj.tagline)) {
      buf[offset++] = 34
      encodings.string.encode(obj.tagline, buf, offset)
      offset += encodings.string.encode.bytes
    }
    encode.bytes = offset - oldOffset
    return buf
  }

  function decode (buf, offset, end) {
    if (!offset) offset = 0
    if (!end) end = buf.length
    if (!(end <= buf.length && offset <= buf.length)) throw new Error("Decoded message is not valid")
    var oldOffset = offset
    var obj = {
      seq: 0,
      date: 0,
      alias: "",
      tagline: ""
    }
    while (true) {
      if (end <= offset) {
        decode.bytes = offset - oldOffset
        return obj
      }
      var prefix = varint.decode(buf, offset)
      offset += varint.decode.bytes
      var tag = prefix >> 3
      switch (tag) {
        case 1:
        obj.seq = encodings.varint.decode(buf, offset)
        offset += encodings.varint.decode.bytes
        break
        case 2:
        obj.date = encodings.varint.decode(buf, offset)
        offset += encodings.varint.decode.bytes
        break
        case 3:
        obj.alias = encodings.string.decode(buf, offset)
        offset += encodings.string.decode.bytes
        break
        case 4:
        obj.tagline = encodings.string.decode(buf, offset)
        offset += encodings.string.decode.bytes
        break
        default:
        offset = skip(prefix & 7, buf, offset)
      }
    }
  }
}

function defineReport () {
  Report.encodingLength = encodingLength
  Report.encode = encode
  Report.decode = decode

  function encodingLength (obj) {
    var length = 0
    if (defined(obj.seq)) {
      var len = encodings.varint.encodingLength(obj.seq)
      length += 1 + len
    }
    if (defined(obj.date)) {
      var len = encodings.varint.encodingLength(obj.date)
      length += 1 + len
    }
    if (defined(obj.mood)) {
      var len = encodings.sint64.encodingLength(obj.mood)
      length += 1 + len
    }
    if (defined(obj.rumors)) {
      for (var i = 0; i < obj.rumors.length; i++) {
        if (!defined(obj.rumors[i])) continue
        var len = Rumor.encodingLength(obj.rumors[i])
        length += varint.encodingLength(len)
        length += 1 + len
      }
    }
    return length
  }

  function encode (obj, buf, offset) {
    if (!offset) offset = 0
    if (!buf) buf = Buffer.allocUnsafe(encodingLength(obj))
    var oldOffset = offset
    if (defined(obj.seq)) {
      buf[offset++] = 8
      encodings.varint.encode(obj.seq, buf, offset)
      offset += encodings.varint.encode.bytes
    }
    if (defined(obj.date)) {
      buf[offset++] = 16
      encodings.varint.encode(obj.date, buf, offset)
      offset += encodings.varint.encode.bytes
    }
    if (defined(obj.mood)) {
      buf[offset++] = 24
      encodings.sint64.encode(obj.mood, buf, offset)
      offset += encodings.sint64.encode.bytes
    }
    if (defined(obj.rumors)) {
      for (var i = 0; i < obj.rumors.length; i++) {
        if (!defined(obj.rumors[i])) continue
        buf[offset++] = 34
        varint.encode(Rumor.encodingLength(obj.rumors[i]), buf, offset)
        offset += varint.encode.bytes
        Rumor.encode(obj.rumors[i], buf, offset)
        offset += Rumor.encode.bytes
      }
    }
    encode.bytes = offset - oldOffset
    return buf
  }

  function decode (buf, offset, end) {
    if (!offset) offset = 0
    if (!end) end = buf.length
    if (!(end <= buf.length && offset <= buf.length)) throw new Error("Decoded message is not valid")
    var oldOffset = offset
    var obj = {
      seq: 0,
      date: 0,
      mood: 0,
      rumors: []
    }
    while (true) {
      if (end <= offset) {
        decode.bytes = offset - oldOffset
        return obj
      }
      var prefix = varint.decode(buf, offset)
      offset += varint.decode.bytes
      var tag = prefix >> 3
      switch (tag) {
        case 1:
        obj.seq = encodings.varint.decode(buf, offset)
        offset += encodings.varint.decode.bytes
        break
        case 2:
        obj.date = encodings.varint.decode(buf, offset)
        offset += encodings.varint.decode.bytes
        break
        case 3:
        obj.mood = encodings.sint64.decode(buf, offset)
        offset += encodings.sint64.decode.bytes
        break
        case 4:
        var len = varint.decode(buf, offset)
        offset += varint.decode.bytes
        obj.rumors.push(Rumor.decode(buf, offset, offset + len))
        offset += Rumor.decode.bytes
        break
        default:
        offset = skip(prefix & 7, buf, offset)
      }
    }
  }
}

function defineTransaction () {
  Transaction.encodingLength = encodingLength
  Transaction.encode = encode
  Transaction.decode = decode

  function encodingLength (obj) {
    var length = 0
    if (defined(obj.seq)) {
      var len = encodings.varint.encodingLength(obj.seq)
      length += 1 + len
    }
    if (defined(obj.date)) {
      var len = encodings.varint.encodingLength(obj.date)
      length += 1 + len
    }
    if (defined(obj.pk)) {
      var len = encodings.bytes.encodingLength(obj.pk)
      length += 1 + len
    }
    if (defined(obj.asset)) {
      var len = encodings.sint64.encodingLength(obj.asset)
      length += 1 + len
    }
    if (defined(obj.value)) {
      var len = encodings.double.encodingLength(obj.value)
      length += 1 + len
    }
    return length
  }

  function encode (obj, buf, offset) {
    if (!offset) offset = 0
    if (!buf) buf = Buffer.allocUnsafe(encodingLength(obj))
    var oldOffset = offset
    if (defined(obj.seq)) {
      buf[offset++] = 8
      encodings.varint.encode(obj.seq, buf, offset)
      offset += encodings.varint.encode.bytes
    }
    if (defined(obj.date)) {
      buf[offset++] = 16
      encodings.varint.encode(obj.date, buf, offset)
      offset += encodings.varint.encode.bytes
    }
    if (defined(obj.pk)) {
      buf[offset++] = 26
      encodings.bytes.encode(obj.pk, buf, offset)
      offset += encodings.bytes.encode.bytes
    }
    if (defined(obj.asset)) {
      buf[offset++] = 32
      encodings.sint64.encode(obj.asset, buf, offset)
      offset += encodings.sint64.encode.bytes
    }
    if (defined(obj.value)) {
      buf[offset++] = 41
      encodings.double.encode(obj.value, buf, offset)
      offset += encodings.double.encode.bytes
    }
    encode.bytes = offset - oldOffset
    return buf
  }

  function decode (buf, offset, end) {
    if (!offset) offset = 0
    if (!end) end = buf.length
    if (!(end <= buf.length && offset <= buf.length)) throw new Error("Decoded message is not valid")
    var oldOffset = offset
    var obj = {
      seq: 0,
      date: 0,
      pk: null,
      asset: 0,
      value: 0
    }
    while (true) {
      if (end <= offset) {
        decode.bytes = offset - oldOffset
        return obj
      }
      var prefix = varint.decode(buf, offset)
      offset += varint.decode.bytes
      var tag = prefix >> 3
      switch (tag) {
        case 1:
        obj.seq = encodings.varint.decode(buf, offset)
        offset += encodings.varint.decode.bytes
        break
        case 2:
        obj.date = encodings.varint.decode(buf, offset)
        offset += encodings.varint.decode.bytes
        break
        case 3:
        obj.pk = encodings.bytes.decode(buf, offset)
        offset += encodings.bytes.decode.bytes
        break
        case 4:
        obj.asset = encodings.sint64.decode(buf, offset)
        offset += encodings.sint64.decode.bytes
        break
        case 5:
        obj.value = encodings.double.decode(buf, offset)
        offset += encodings.double.decode.bytes
        break
        default:
        offset = skip(prefix & 7, buf, offset)
      }
    }
  }
}

function defineRumor () {
  Rumor.encodingLength = encodingLength
  Rumor.encode = encode
  Rumor.decode = decode

  function encodingLength (obj) {
    var length = 0
    if (defined(obj.pk)) {
      var len = encodings.bytes.encodingLength(obj.pk)
      length += 1 + len
    }
    if (defined(obj.token)) {
      var len = encodings.varint.encodingLength(obj.token)
      length += 1 + len
    }
    return length
  }

  function encode (obj, buf, offset) {
    if (!offset) offset = 0
    if (!buf) buf = Buffer.allocUnsafe(encodingLength(obj))
    var oldOffset = offset
    if (defined(obj.pk)) {
      buf[offset++] = 10
      encodings.bytes.encode(obj.pk, buf, offset)
      offset += encodings.bytes.encode.bytes
    }
    if (defined(obj.token)) {
      buf[offset++] = 16
      encodings.varint.encode(obj.token, buf, offset)
      offset += encodings.varint.encode.bytes
    }
    encode.bytes = offset - oldOffset
    return buf
  }

  function decode (buf, offset, end) {
    if (!offset) offset = 0
    if (!end) end = buf.length
    if (!(end <= buf.length && offset <= buf.length)) throw new Error("Decoded message is not valid")
    var oldOffset = offset
    var obj = {
      pk: null,
      token: 0
    }
    while (true) {
      if (end <= offset) {
        decode.bytes = offset - oldOffset
        return obj
      }
      var prefix = varint.decode(buf, offset)
      offset += varint.decode.bytes
      var tag = prefix >> 3
      switch (tag) {
        case 1:
        obj.pk = encodings.bytes.decode(buf, offset)
        offset += encodings.bytes.decode.bytes
        break
        case 2:
        obj.token = encodings.varint.decode(buf, offset)
        offset += encodings.varint.decode.bytes
        break
        default:
        offset = skip(prefix & 7, buf, offset)
      }
    }
  }
}

function defined (val) {
  return val !== null && val !== undefined && (typeof val !== 'number' || !isNaN(val))
}
