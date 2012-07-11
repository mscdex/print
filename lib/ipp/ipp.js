// Note: requires node >= 0.6.11 for tls.connect support for upgrading sockets

var http = require('http'), https = require('http'), tls = require('tls'),
    inspect = require('util').inspect;
var parser = require('./ipp-parser');

function IPP(cfg) {
  this._host = cfg.host || 'localhost';
  this._port = cfg.port || 631;
  this._secure = cfg.secure;
  this._user = cfg.username || '';
  this._pwd = cfg.password || '';

  this._reqid = 1;
}

IPP.prototype.

IPP.prototype._sendReq = function(path, body, cb/*, prevCode*/) {
  var self = this,
      headers = {
        'Content-Type': 'application/ipp',
        'Content-Length': body.length
      }, method = 'POST';
  /*if (prevCode === 426 || (!prevCode && this._secure === true)) {
  } else if (!prevCode && this._secure === 'force') {
  }*/
  var req = (this._secure ? https : http).request({
    host: self._host,
    port: self._port,
    path: path,
    method: method,
    headers: headers
  }, function(res) {
    switch (res.statusCode) {
      /*case 101:
        if (isTLSUpgrade(res)) {
          res.connection = tls.connect({ socket: res.connection }, function() {
            // connection upgraded
            handleSuccess(res.connection, cb);
          });
        } else
          handleUpgradeError(res, cb);
        break;*/
      case 200:
        handleSuccess(res, cb);
        break;
      /*case 426:
        if (isTLSUpgrade(res)) {
          // send upgrade request
        } else
          handleUpgradeError(res, cb);
        break;*/
      default:
        var body = '';
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
          body += chunk;
        });
        res.on('end', function() {
          var err = new Error('Unexpected HTTP status code: ' + res.statusCode +
                              '\nBody: ' + inspect(body));
          cb(err);
        });
    }
  });
  req.on('error', function(err) {
    cb(err);
  });
  req.end(body);
};

/*function isTLSUpgrade(res) {
  return (res.headers.upgrade &&
          res.headers.upgrade.toLowerCase().indexOf('tls/') > -1);
}

function handleUpgradeError(res, cb) {
  var body = '';
  res.setEncoding('utf8');
  res.on('data', function(chunk) {
    body += chunk;
  });
  res.on('end', function() {
    cb(new Error('Received HTTP status code ' + res.statusCode + ', but '
                 + 'expected TLS in Upgrade header: ' +
                 req.headers.upgrade + '\nBody: ' + inspect(body)
    ));
  });
}*/

function handleSuccess(res, cb) {
  var data = [], dataLen = 0;
  res.on('data', function(chunk) {
    data.push(chunk);
    dataLen += chunk.length;
  });
  res.on('end', function() {
    var buf, nBufs = data.length;
    if (nBufs) {
      if (nBufs === 1)
        buf = data[0];
      else {
        buf = new Buffer(dataLen);
        for (var i=0,b=0,len=nBufs; i<len; ++i) {
          data[i].copy(buf, b);
          b += data[i].length;
        }
      }
      cb(undefined, parser(buf));
    } else
      cb(new Error('Received no data from server'));
  });
}