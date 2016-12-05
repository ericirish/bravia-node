var express = require('express'),
    app = express(),
    bravia = require('./lib'),
    http = require('http'),
    bodyParser = require('body-parser')

var app = express()

var port = process.env.PORT

// parse application/x-www-form-urlencoded
//app.use(bodyParser.urlencoded())

// parse application/json
app.use(bodyParser.json())

app.listen(port)
console.log('Listening for Command on ' + port)

app.post("/", function (req, res) {
  
  if(req.body.action) {
    res.status(200).send('success')
    bravia(req.body.ip, req.body.secret, function(client) {
      client.command(req.body.action)
    })
  } else {
    res.status(500).send('Error on parsing command')
  }

  console.log('Listening for Command on ' + port)
})


