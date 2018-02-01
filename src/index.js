// detectContentType implements the algorithm described at
// http://mimesniff.spec.whatwg.org/ to determine the Content-Type of the given
// data. It considers at most the first 512 bytes of data.
//
// detectContentType always returns a valid MIME type: if it cannot determine a
// more specific one, it returns "application/octet-stream".
export default function detectContentType(content) {
  const data = content.slice(0, 512)

  let firstNonWS = 0
  while (firstNonWS < data.length && isWS(data[firstNonWS])) {
    firstNonWS++
  }

  for (let sig of sniffSignatures) {
    let ct = sig.match(data, firstNonWS)
    if (ct != '') {
      return ct
    }
  }
  return 'application/octet-stream' // fallback
}

function isWS(b) {
  switch (b) {
    case '\t'.charCodeAt(0):
    case '\n'.charCodeAt(0):
    case '\x0c'.charCodeAt(0):
    case '\r'.charCodeAt(0):
    case ' '.charCodeAt(0):
      return true
  }
  return false
}

class exactSig {
  constructor(sig, ct) {
    Object.assign(this, { sig, ct })
  }

  match(data) {
    if (Buffer.compare(this.sig, data.slice(0, this.sig.length)) == 0) {
      return this.ct
    }
    return ''
  }
}

class maskedSig {
  constructor(mask, pat, skipWS, ct) {
    Object.assign(this, { mask, pat, skipWS, ct })
  }

  match(data, firstNonWS) {
    if (this.skipWs) {
      data = data.slice(firstNonWS)
    }
    if (this.pat.length != this.mask.length) {
      return ''
    }
    if (data.length < this.mask.length) {
      return ''
    }
    for (let i = 0; i < this.mask.length; i++) {
      let db = data[i] & this.mask[i]
      if (db != this.pat[i]) {
        return ''
      }
    }
    return this.ct
  }
}

class htmlSig {
  constructor(h) {
    this.h = Buffer.from(h)
  }

  match(data, firstNonWS) {
    data = data.slice(firstNonWS)
    if (data.length < this.h.length + 1) {
      return ''
    }

    for (let i = 0; i < this.h.length; i++) {
      let b = this.h[i]
      let db = data[i]
      if ('A'.charCodeAt(0) <= b && b <= 'Z'.charCodeAt(0)) {
        db &= 0xdf
      }
      if (b != db) {
        return ''
      }
    }
    // Next byte must be space or right angle bracket.
    let db = String.fromCharCode(data[this.h.length])
    if (db != ' ' && db != '>') {
      return ''
    }
    return 'text/html; charset=utf-8'
  }
}

let mp4ftype = Buffer.from('ftyp')
let mp4 = Buffer.from('mp4')

class mp4Sig {
  match(data) {
    // https://mimesniff.spec.whatwg.org/#signature-for-mp4
    // c.f. section 6.2.1
    if (data.length < 12) {
      return ''
    }
    let boxSize = data.readUInt32BE(0)
    if (boxSize % 4 != 0 || data.length < boxSize) {
      return ''
    }
    if (Buffer.compare(data.slice(4, 8), mp4ftype) != 0) {
      return ''
    }
    for (let st = 8; st < boxSize; st += 4) {
      if (st == 12) {
        // minor version number
        continue
      }
      if (Buffer.compare(data.slice(st, st + 3), mp4) == 0) {
        return 'video/mp4'
      }
    }
    return ''
  }
}

const sniffSignatures = [
  new exactSig(Buffer.from('%PDF-'), 'application/pdf'),
  new maskedSig(
    Buffer.from([0xff, 0xff, 0xff, 0xff, 0xff]),
    Buffer.concat([Buffer.from('OggS'), Buffer.from([0x00])]),
    false,
    'application/ogg'
  ),
  new htmlSig('<!DOCTYPE HTML'),
  new mp4Sig()
]
