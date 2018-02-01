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
    case '\t':
    case '\n':
    case '\x0c':
    case '\r':
    case ' ':
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

const sniffSignatures = [
  new exactSig(Buffer.from('%PDF-'), 'application/pdf'),
  new maskedSig(
    Buffer.from([0xff, 0xff, 0xff, 0xff, 0xff]),
    Buffer.concat([Buffer.from('OggS'), Buffer.from([0x00])]),
    false,
    'application/ogg'
  )
]
