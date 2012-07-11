var consts = require('./consts');
var TAG = consts.TAG, STATUS = consts.STATUS, OP = consts.OP,
    LAST_DELIM_TAG = consts.LAST_DELIM_TAG;

module.exports = function(data, isResponse) {
  var ret = {}, p = 8, groupTag, valTag, name, nameLen, fmtVal, valLen;

  if (!Buffer.isBuffer(data) || data.length < 9)
    throw new Error('IPP Parser Error: data must be a Buffer with length >= 9');

  // version number
  ret.version = data[0] + '.' + data[1];

  // operation id for requests, status code for responses
  if (isResponse)
    ret['statusCode'] = STATUS[data.readInt16BE(2, true)];
  else
    ret['operation'] = OP[data.readInt16BE(2, true)];

  if (isResponse && (ret.statusCode < 0 || ret.statusCode > 0x7FFF)) {
    throw new Error('IPP Parser Error: invalid response status-code: 0x' +
                    ret.statusCode.toString(16));
  }

  // request id
  ret.reqId = data.readInt32BE(4, true);

  while (data[p] !== TAG.END) {
    if (data[p] <= LAST_DELIM_TAG) {
      // delimiter
      groupTag = TAG[data[p++]];

      if (!ret.groups)
        ret.groups = {};
      ret.groups[groupTag] = {};

      name = undefined;
    } else {
      // attribute
      valTag = data[p++];

      nameLen = data.readInt16BE(p, true);
      p += 2;

      if (nameLen) {
        name = data.toString('utf8', p, p + nameLen);
        if (ret.groups[groupTag][name] !== undefined)
          throw new Error('IPP Parser Error: unexpected duplicate name');
        p += nameLen;
      } else if (name === undefined)
        throw new Error('IPP Parser Error: unexpected zero-length name');

      valLen = data.readInt16BE(p, true);
      p += 2;

      if (valLen) {
        var newTag = false;
        if (valTag === TAG.EXTENDED) {
          valTag = data.readUInt32BE(p, true);
          newTag = true;
        }
        /*if (!lengthCheck(name, valLen)) {
          throw new Error('IPP Parser Error: invalid value length for '
                          + name + ' (' + valLen + ' bytes)')
        }*/
        if (newTag)
          fmtVal = formatValue(valTag, data, p + 4, valLen - 4);
        else
          fmtVal = formatValue(valTag, data, p, valLen);

        if (ret.groups[groupTag][name] === undefined)
          ret.groups[groupTag][name] = fmtVal;
        else if (!Array.isArray(ret.groups[groupTag][name]))
          ret.groups[groupTag][name] = [ret.groups[groupTag][name], fmtVal];
        else
          ret.groups[groupTag][name].push(fmtVal);

        p += valLen;
      }
    }
  }

  // body
  if (++p < data.length)
    ret.body = data.slice(p);

  return ret;
};

/*function lengthCheck(name, len) {
  switch (name) {
    case 'status-message':
      return len <= 255;
      break;
    case 'detailed-status-message':
    case 'document-access-error':
      return len <= 1023;
      break;
  }
  return true;
}*/

function formatValue(tag, buf, start, len) {
  var ret;
  switch (tag) {
    case TAG.INTEGER:
    case TAG.ENUM:
      ret = buf.readInt32BE(start, true);
      break;
    case TAG.BOOLEAN:
      ret = (buf[start] === 0x01);
      break;
    case TAG.DATETIME:
      var year = buf.readInt16BE(start, true),
          month = buf[start + 2],
          day = buf[start + 3],
          hour = buf[start + 4],
          min = buf[start + 5],
          sec = buf[start + 6],
          decisec = buf[start + 7];
      if (len === 8) {
        // local time
        ret = new Date(year, month, day, hour, min, sec, decisec * 100);
      } else {
        // additional timezone info
        ret = new Date('' + year + '-' + pad2(month) + '-' + pad2(day) + 'T' +
                       pad2(hour) + ':' + pad2(min) + ':' + pad2(sec) + '.' +
                       decisec + buf[start + 8] + pad2(buf[start + 9]) + ':' +
                       pad2(buf[start + 10]));
      }
      break;
    case TAG.RESOLUTION:
      // [cross feed direction resolution, feed direction resolution, units]
      ret = [
        buf.readInt32BE(start, true),
        buf.readInt32BE(start + 4, true),
        (buf[start + 5] === 0x03 ? 'dpi' : 'dpcm')
      ];
      break;
    case TAG.RANGE:
      // [lower bound, upper bound]
      ret = [buf.readInt32BE(start, true), buf.readInt32BE(start + 4, true)];
      break;
    case TAG.STRING:
    case TAG.TEXT:
    case TAG.NAME:
      // For TAG.TEXT and TAG.NAME:
      //   language for the value is not defined inline and thus is dependent
      //   on the language specified elsewhere in the request/response
      ret = buf.slice(start, start + len);
      break;
    case TAG.TEXTLANG:
    case TAG.NAMELANG:
      // language for string defined inline
      var langLen = buf.readInt16BE(start, true),
          strStart = start + 2 + langLen + 2;
      ret = [
        buf.slice(strStart, strStart + buf.readInt16BE(strStart - 2, true)),
        buf.toString('ascii', start + 2, start + 2 + langLen)
      ];
      break;
    case TAG.KEYWORD:
    case TAG.URI:
    case TAG.URISCHEME:
    case TAG.CHARSET:
    case TAG.LANGUAGE:
    case TAG.MIMETYPE:
    //case TAG.MEMBERNAME: // <- I'm assuming this one is ASCII, RFC does not say
      ret = buf.toString('ascii', start, start + len);
      break;
    default:
      ret = null;
  }
  return ret;
}

function pad2(v) {
  return (v < 10 ? '0' : '') + v;
}
