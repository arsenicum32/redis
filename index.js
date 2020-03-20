const redis = require('redis')
const express = require('express')
const bodyParser = require('body-parser')

const client = redis.createClient()
const app = express()

app.use(bodyParser.json())

client.on("error", error => {
  throw new Error(error.message)
})

app.get('/:k', ({ params }, res) => {
  client.get(params.k , (err, done ) => {
    if ( err )
      return res.json({ value: null})
    res.json({ value: done})
  })
})

app.post('/:k', ({ params, body }, res) => {
  client.set( params.k, body.value , (err, done ) => {
    if ( err )
      return res.json({ result: null })
    res.json({ result: done })
  })
})


app.all('*', (req,res) => {
  res.json(
    {
      time: Date.now()
    }
  )
})

app.listen(8000)
