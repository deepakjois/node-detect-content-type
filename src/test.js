import detectContentType from '.'
import { describe, it } from 'mocha'
import assert from 'assert'

const sniffTests = [
  // Some nonsense.
  {
    desc: 'Empty',
    data: Buffer.from([]),
    contentType: 'text/plain; charset=utf-8'
  },
  {
    desc: 'Binary',
    data: Buffer.from([1, 2, 3]),
    contentType: 'application/octet-stream'
  },

  {
    desc: 'HTML document #1',
    data: Buffer.from(`<HtMl><bOdY>blah blah blah</body></html>`),
    contentType: 'text/html; charset=utf-8'
  },
  {
    desc: 'HTML document #2',
    data: Buffer.from(`<HTML></HTML>`),
    contentType: 'text/html; charset=utf-8'
  },
  {
    desc: 'HTML document #3 (leading whitespace)',
    data: Buffer.from('   <!DOCTYPE HTML>...'),
    contentType: 'text/html; charset=utf-8'
  },
  {
    desc: 'HTML document #4 (leading CRLF)',
    data: Buffer.from('\r\n<html>...'),
    contentType: 'text/html; charset=utf-8'
  },
  {
    desc: 'Plain text',
    data: Buffer.from('This is not HTML. It has ☃ though.', 'utf8'),
    contentType: 'text/plain; charset=utf-8'
  },

  { desc: 'PDF', data: Buffer.from('%PDF-'), contentType: 'application/pdf' },

  {
    desc: 'XML',
    data: Buffer.from('\n<?xml!'),
    contentType: 'text/xml; charset=utf-8'
  },

  // Image types.
  { desc: 'GIF 87a', data: Buffer.from(`GIF87a`), contentType: 'image/gif' },
  { desc: 'GIF 89a', data: Buffer.from(`GIF89a...`), contentType: 'image/gif' },

  // Audio types.
  {
    desc: 'MIDI audio',
    data: Buffer.concat([
      Buffer.from('MThd'),
      Buffer.from([0x00, 0x00, 0x00, 0x06, 0x00, 0x01])
    ]),
    contentType: 'audio/midi'
  },
  {
    desc: 'MP3 audio/MPEG audio',
    data: Buffer.concat([
      Buffer.from('ID3'),
      Buffer.from([0x03, 0x00, 0x00, 0x00, 0x00, 0x0f])
    ]),
    contentType: 'audio/mpeg'
  },
  {
    desc: 'WAV audio #1',
    data: Buffer.concat([
      Buffer.from('RIFFb'),
      Buffer.from([0xb8, 0x00, 0x00]),
      Buffer.from('WAVEfmt '),
      Buffer.from([0x12, 0x00, 0x00, 0x00, 0x06])
    ]),
    contentType: 'audio/wave'
  },
  {
    desc: 'WAV audio #2',
    data: Buffer.concat([
      Buffer.from('RIFF,'),
      Buffer.from([0x00, 0x00, 0x00]),
      Buffer.from('WAVEfmt '),
      Buffer.from([0x12, 0x00, 0x00, 0x00, 0x06])
    ]),
    contentType: 'audio/wave'
  },
  {
    desc: 'AIFF audio #1',
    data: Buffer.concat([
      Buffer.from('FORM'),
      Buffer.from([0x00, 0x00, 0x00, 0x00]),
      Buffer.from('AIFFCOMM'),
      Buffer.from([
        0x00,
        0x00,
        0x00,
        0x12,
        0x00,
        0x01,
        0x00,
        0x00,
        0x57,
        0x55,
        0x00,
        0x10,
        0x40,
        0x0d,
        0xf3,
        0x34
      ])
    ]),
    contentType: 'audio/aiff'
  },

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
    desc: 'Must not match OGG',
    data: Buffer.from('owow\x00'),
    contentType: 'application/octet-stream'
  },
  {
    desc: 'Must not match OGG',
    data: Buffer.from('oooS\x00'),
    contentType: 'application/octet-stream'
  },
  {
    desc: 'Must not match OGG',
    data: Buffer.from('oggS\x00'),
    contentType: 'application/octet-stream'
  },

  // Video types.
  {
    desc: 'MP4 video',
    data: Buffer.concat([
      Buffer.from([0x00, 0x00, 0x00, 0x18]),
      Buffer.from('ftypmp42'),
      Buffer.from([0x00, 0x00, 0x00, 0x00]),
      Buffer.from('mp42isom<'),
      Buffer.from([0x06, 't'.charCodeAt(0), 0xbf]),
      Buffer.from('mdat')
    ]),
    contentType: 'video/mp4'
  },
  {
    desc: 'AVI video #1',
    data: Buffer.from('RIFF,O\n\x00AVI LISTÀ'),
    contentType: 'video/avi'
  },
  {
    desc: 'AVI video #2',
    data: Buffer.from('RIFF,\n\x00\x00AVI LISTÀ'),
    contentType: 'video/avi'
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
