import detectContentType from '.'
import { describe, it } from 'mocha'
import assert from 'assert'

const sniffTests = [
  { desc: 'PDF', data: Buffer.from('%PDF-'), contentType: 'application/pdf' },
  {
    desc: 'Ogg audio',
    data: Buffer.concat([
      Buffer.from('OggS'),
      Buffer.from([
        0x00,
        0x02,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x7e,
        0x46,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x1f,
        0xf6,
        0xb4,
        0xfc,
        0x01,
        0x1e,
        0x01,
        0x76,
        0x6f,
        0x72
      ])
    ]),
    contentType: 'application/ogg'
  },
  {
    desc: 'HTML document #3 (leading whitespace)',
    data: Buffer.from('   <!DOCTYPE HTML>...'),
    contentType: 'text/html; charset=utf-8'
  }
]

describe('detectContentType', function() {
  for (let test of sniffTests) {
    it(`should detect content type for ${test.desc}`, function() {
      let ct = detectContentType(test.data)
      assert.equal(ct, test.contentType)
    })
  }
})
