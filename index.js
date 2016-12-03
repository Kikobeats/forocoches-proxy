'use strict'

const Iconv = require('iconv').Iconv
const get = require('simple-get')

function replaceCharset (html) {
  return html.replace(
    `<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1" />`,
    `<meta charset="UTF-8">`
  )
}

const CONST = {
  URL: 'https://www.forocoches.com/foro/forumdisplay.php?f=2'
}

const iconv = new Iconv('iso8859-1', 'utf-8')

function proxy (req, res) {
  const { query } = req
  const url = `${CONST.URL}&page=${query.page || 1}`

  function concat (cb) {
    get(url, function (err, stream) {
      if (err) return cb(err)

      let buffer = []

      stream.on('data', function (chunk) {
        buffer.push(iconv.convert(chunk))
      })

      stream.once('end', function () {
        const html = buffer.toString()
        return cb(null, replaceCharset(html))
      })

      stream.once('error', cb)
    })
  }

  concat(function (err, body) {
    if (err) return res.status(500).send(err)
    return res.send(body)
  })
}

module.exports = proxy
