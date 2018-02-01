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

const sniffSignatures = []

function isWS(b) {
  // FIXME implement
  console.log(b)
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
