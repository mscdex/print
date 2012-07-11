var parse = require('../ipp-parser');
var buf;

function toArray(str, encoding) {
  var ret = [], buf = new Buffer(str, encoding);
  for (var i=0,len=buf.length; i<len; ++i)
    ret[i] = buf[i];
  return ret;
}

buf = new Buffer([
  0x01, 0x01,
  0x00, 0x0A,
  0x00, 0x00 ,0x00, 0x01,
  0x01,
  0x47,
  0x00, 0x12]
  .concat(toArray('attributes-charset', 'utf8'))
  .concat([
  0x00, 0x05
  ])
  .concat(toArray('utf-8', 'utf8'))
  .concat([
  0x48,
  0x00, 0x1B
  ])
  .concat(toArray('attributes-natural-language', 'utf8'))
  .concat([
  0x00, 0x02
  ])
  .concat(toArray('en', 'utf8'))
  .concat([
  0x45,
  0x00, 0x0B
  ])
  .concat(toArray('printer-uri', 'utf8'))
  .concat([
  0x00, 0x0D
  ])
  .concat(toArray('ipp://foo/bar', 'utf8'))
  .concat([
  0x03
  ])
);

console.dir(parse(buf));