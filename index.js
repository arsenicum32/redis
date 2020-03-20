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
  client.get( params.k , (err, done ) => {
    if ( err )
      return res.json({ value: null})

    try {
      res.json({ value: JSON.parse( done ) })
    } catch (e) {
      res.json({ value: null })
    }
  })
})

app.post('/:k', ({ params, body }, res) => {
  try {
    const value = JSON.stringify( body.value )
    client.set( params.k, value , (err, done ) => {
      if ( err )
        return res.json({ result: null })
      res.json({ result: done })
    })

  } catch (e) {
    res.json({ result: null })
  }
})


app.all('*', (req,res) => {
  res.json(
    {
      time: Date.now()
    }
  )
})

app.listen(8000)
