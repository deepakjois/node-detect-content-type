// detectContentType implements the algorithm described at
// http://mimesniff.spec.whatwg.org/ to determine the Content-Type of the given
// data. It considers at most the first 512 bytes of data.
//
// detectContentType always returns a valid MIME type: if it cannot determine a
// more specific one, it returns "application/octet-stream".
export default function detectContentType(content) {

}
