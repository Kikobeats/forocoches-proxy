'use strict'

const express = require('express')
const morgan = require('morgan')
const proxy = require('..')

const CONST = {
  PORT: process.env.PORT || 1337,
  IS_PRODUCTION: process.env.NODE_ENV === 'production'
}

const app = express()

if (CONST.IS_PRODUCTION) app.use(morgan('combined'))

app.get('/', proxy)
app.get('/:url', proxy)

app.listen(CONST.PORT, () => console.log(`listening on localhost:${CONST.PORT}`))
