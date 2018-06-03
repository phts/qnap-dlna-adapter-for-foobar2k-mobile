#!/usr/bin/env node

const express = require('express')
const app = express()

const HOST = '0.0.0.0'
const PORT = 8782

app.get('/DeviceDescription.xml', (req, res) => {
  // TODO redirect to /rootDesc.xml
  console.log('get /DeviceDescription.xml', req)
  res.status(500).send('get /DeviceDescription.xml')
})

app.get('*', (req, res) => {
  console.log('get *', req)
  res.status(500).send('get *')
})

app.post('*', (req, res) => {
  console.log('post *', req)
  res.status(500).send('post *')
})

app.listen(PORT, HOST, () => {
  console.info(`Listening on ${HOST}:${PORT}.`)
})
