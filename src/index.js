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
}

function isWS(b) {
  // FIXME implement
  console.log(b)
}
