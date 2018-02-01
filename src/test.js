import detectContentType from '.'
import { describe, it } from 'mocha'
import assert from 'assert'

const sniffTests = [
  { desc: 'PDF', data: Buffer.from('%PDF-'), contentType: 'application/pdf' }
]

describe('detectContentType', function() {
  for (let test of sniffTests) {
    it(`should detect content type for ${test.desc}`, function() {
      let ct = detectContentType(test.data)
      assert(ct == test.contentType)
    })
  }
})
