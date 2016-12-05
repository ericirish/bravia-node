
var request = require('request'),
    readline = require('readline'),
    debug = require('debug')('Lib')
    fs = require('fs'),
    commands = require('../commands.json')


var Bravia = function( ip, secret, callback) {

  var that = this

  this.ip = ip
  this.secret = secret

  if(callback !== undefined) {
    callback(that)
  }

}

Bravia.prototype.command = function(command) {
  var that = this

  //////////////////////////////////////////
  /////// Special Command Instructions
  //////////////////////////////////////////

  if(command == 'on' || command == 'WakeUp') {
    this.checkPowerStatus(function(isOn) {
      if(isOn) {
        console.log('TV is Already On')
        return
      } else {
        that.exec('WakeUp')
      }
    });
  } else if (command == 'off' || command == 'PowerOff') {
    this.checkPowerStatus(function(isOn) {
      if(!isOn) {
        console.log('TV is Already Off')
        return
      } else {
        that.exec('PowerOff')
      }
    });
  } else {
    that.exec(command)
  }
}

Bravia.prototype.exec = function(command) {

  var that = this

  debug('Making command request: ',command)
  var body = '<?xml version="1.0"?>' +
    '<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">' +
      '<s:Body>' +
        '<u:X_SendIRCC xmlns:u="urn:schemas-sony-com:service:IRCC:1">' +
          '<IRCCCode>' + commands[command] +'</IRCCCode>' +
        '</u:X_SendIRCC>' +
      '</s:Body>' +
    '</s:Envelope>'

  this.request({
    path: '/sony/IRCC',
    body: body,
    headers: {
      'X-Auth-PSK':that.secret,
      'Content-Type': 'text/xml charset=UTF-8',
      'SOAPACTION': '"urn:schemas-sony-com:service:IRCC:1#X_SendIRCC"'
    }
  }, function(response) {
    debug(response)
  })
}

Bravia.prototype.checkPowerStatus = function(callback) {
  var that = this

  body = JSON.stringify({
      'method': 'getPowerStatus',
      'version': '1.0',
      'params': [],
      'id': 101
    })

  this.request({
    path: '/sony/system',
    body: body,
    headers: {
      'X-Auth-PSK': that.secret,
      'Content-Type': 'text/xml charset=UTF-8',
      'SOAPACTION': '"urn:schemas-sony-com:service:IRCC:1#X_SendIRCC"'
    }
  }, function(response) {
    response = JSON.parse(response)
    if(response.result) {

      response.result[0].status == 'active' ? status = true : status = false

      if(callback !== undefined) {
        callback(status)
      }
    }
  })
}

Bravia.prototype.request = function(options, callback) {

  options.url = 'http://' + this.ip + options.path

  request.post(options, function(error, response, body) {
    if(error) {
      debug(error)
    } else if(callback !== undefined) {
      callback(body)
    }
  })
}

module.exports = function(ip, secret, callback) {
  return new Bravia(ip, secret, callback)
}
