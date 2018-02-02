# detect-content-type
Javascript module to determine the Content-Type of the given data, using the algorithm specified in the [MIME Sniffing Standard](https://mimesniff.spec.whatwg.org/).

This module is useful in cases where it is not possible to determine the Content-Type of the data using filename extension, either because file does not have an extension or the filename is not available.

## Installation

```
npm install detect-content-type
```

or

```
yarn add detect-content-type
```


## Import
ES6 and above:
```javascript
import detectContentType from 'detect-content-type'
```

Using CommonJS:
```javascript
var detectContentType = require('detect-content-type')
```

## Usage 
`detectContentType` takes a Buffer, and determines its Content-Type. It considers at most
512 bytes of data. `detectContentType` always returns a valid MIME type. If it cannot determine a
more specific one, it returns `application/octet-stream`.
 
```javascript
let ct = detectContentType(Buffer.from("<html><body></body></html>")) // returns 'text/html; charset=utf-8'
```

## Credits
The code in this module is ported nearly line-by-line from the [http.DetectContentType][DetectContentType] method in the Go standard library.

[DetectContentType]: https://golang.org/pkg/net/http/#DetectContentType
