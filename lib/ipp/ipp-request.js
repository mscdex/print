var consts = require('./consts');
var util = require('util');
var TAG = consts.TAG;

var OP_ATTRIBUTES = {
  'print-job': {
    required: [
      'attributes-charset',
      'attributes-natural-language',
      'printer-uri'
    ],
    optional: [
      'requesting-user-name',
      'job-name',
      'ipp-attribute-fidelity',
      'compression',
      'document-name',
      'document-format',
      'document-natural-language', // server implementation optional
      'job-k-octets', // server implementation optional
      'job-impressions', // server implementation optional
      'job-media-sheets' // server implementation optional
    ]
  },
  'validate-job': { 
    required: [
      'attributes-charset',
      'attributes-natural-language',
      'printer-uri'
    ],
    optional: [
      'requesting-user-name',
      'job-name',
      'ipp-attribute-fidelity',
      'compression',
      'document-name',
      'document-format',
      'document-natural-language', // server implementation optional
      'job-k-octets', // server implementation optional
      'job-impressions', // server implementation optional
      'job-media-sheets' // server implementation optional
    ]
  },
  'print-uri': { // server implementation optional
    required: [
      'attributes-charset',
      'attributes-natural-language',
      'printer-uri',
      'document-uri'
    ],
    optional: [
      'requesting-user-name',
      'job-name',
      'ipp-attribute-fidelity',
      'compression',
      'document-name',
      'document-format',
      'document-natural-language', // server implementation optional
      'job-k-octets', // server implementation optional
      'job-impressions', // server implementation optional
      'job-media-sheets' // server implementation optional
    ]
  },
  'create-job': { // server implementation optional
    required: [
      'attributes-charset',
      'attributes-natural-language',
      'printer-uri'
    ],
    optional: [
      'requesting-user-name',
      'job-name',
      'ipp-attribute-fidelity',
      'job-k-octets', // server implementation optional
      'job-impressions', // server implementation optional
      'job-media-sheets' // server implementation optional
    ]
  },
  'get-printer-attributes': {
    required: [
      'attributes-charset',
      'attributes-natural-language',
      'printer-uri'
    ],
    optional: [
      'requesting-user-name',
      'requested-attributes',
      'document-format'
    ]
  },
  'get-jobs': {
    required: [
      'attributes-charset',
      'attributes-natural-language',
      'printer-uri'
    ],
    optional: [
      'requesting-user-name',
      'limit',
      'requested-attributes',
      'which-jobs',
      'my-jobs'
    ]
  },
  'send-document': { // server implementation optional
    required: [
      'attributes-charset',
      'attributes-natural-language',
      'last-document'
      // Additionally: ('printer-uri' && 'job-id') || 'job-uri'
    ],
    optional: [
      'requesting-user-name',
      'compression',
      'document-name',
      'document-format',
      'document-natural-language' // server implementation optional
    ]
  },
  'send-uri': { // server implementation optional
    required: [
      'attributes-charset',
      'attributes-natural-language',
      'last-document',
      'document-uri'
      // Additionally: ('printer-uri' && 'job-id') || 'job-uri'
    ],
    optional: [
      'requesting-user-name',
      'compression',
      'document-name',
      'document-format',
      'document-natural-language' // server implementation optional
    ]
  },
  'cancel-job': {
    required: [
      'attributes-charset',
      'attributes-natural-language',
      // Additionally: ('printer-uri' && 'job-id') || 'job-uri'
    ],
    optional: [
      'requesting-user-name',
      'message' // server implementation optional
    ]
  },
  'release-job': {
    required: [
      'attributes-charset',
      'attributes-natural-language',
      // Additionally: ('printer-uri' && 'job-id') || 'job-uri'
    ],
    optional: [
      'requesting-user-name',
      'message' // server implementation optional
    ]
  },
  'get-job-attributes': {
    required: [
      'attributes-charset',
      'attributes-natural-language',
      // Additionally: ('printer-uri' && 'job-id') || 'job-uri'
    ],
    optional: [
      'requesting-user-name',
      'requested-attributes'
    ]
  },
  'pause-printer': { // server implementation optional
    required: [
      'attributes-charset',
      'attributes-natural-language',
      'printer-uri'
    ],
    optional: [
      'requesting-user-name'
    ]
  },
  'resume-printer': { // server implementation optional
    required: [
      'attributes-charset',
      'attributes-natural-language',
      'printer-uri'
    ],
    optional: [
      'requesting-user-name'
    ]
  },
  'purge-printer': { // server implementation optional
    required: [
      'attributes-charset',
      'attributes-natural-language',
      'printer-uri'
    ],
    optional: [
      'requesting-user-name'
    ]
  },
  'hold-job': { // server implementation optional
    required: [
      'attributes-charset',
      'attributes-natural-language',
      // Additionally: ('printer-uri' && 'job-id') || 'job-uri'
    ],
    optional: [
      'requesting-user-name',
      'job-hold-until',
      'message' // server implementation optional
    ]
  },
  'restart-job': { // server implementation optional
    required: [
      'attributes-charset',
      'attributes-natural-language',
      // Additionally: ('printer-uri' && 'job-id') || 'job-uri'
    ],
    optional: [
      'requesting-user-name',
      'job-hold-until',
      'message' // server implementation optional
    ]
  }
};

/*
  info = {
    reqid: 1,
    op: 'get-jobs',
    attributes: {
      'printer-uri': 'ipp://foo/bar'
    }
  };
*/
module.exports = function(info) {
  if (!info.reqid || info.reqid < 1 || info.reqid > consts.MAX_REQID)
    throw new Error('Invalid request id');
  else if (!info.op || consts.OP[info.op] === undefined ||
           typeof info.op !== 'string')
    throw new Error('Invalid operation');
  else if (!info.attributes || !info.attributes.op || !info.attributes.op.length)
    throw new Error('Missing operation attributes');
  else if (info.body && !Buffer.isBuffer(info.body))
    throw new Error('Body must be a Buffer');

  // validate attributes
  var op = info.op, opAttrKeys = Object.keys(info.attributes.op),
      attrs = { op: [], job: [], printer: [] },
      defAttrs = OP_ATTRIBUTES[op];

  // check all required op attributes exist
  for (var i=0,len=defAttrs.required.length; i<len; ++i) {
    if (opAttrKeys.indexOf(defAttrs.required[i]) === -1)
      throw new Error('Missing required operation attribute: ' + defAttrs[i]);
  }
  if ((op === 'send-document' || op === 'send-uri' || op === 'cancel-job' ||
       op === 'get-job-attributes' || op === 'hold-job' || op === 'restart-job')
      && !((opAttrKeys.indexOf('printer-uri') !== -1 &&
            opAttrKeys.indexOf('job-id') !== -1)
           || opAttrKeys.indexOf('job-uri') !== -1
          )) {
    throw new Error('This operation requires either (`printer-uri` and ' +
                    '`job-id`) OR `job-uri` attributes');
  }
  for (var i=0,len=opAttrKeys.length; i<len; ++i) {
    var isValid = true, rule, rules = consts.ATTR.OP[opAttrKeys[i]], val;
    if (defAttrs.required.indexOf(opAttrKeys[i]) === -1 &&
        defAttrs.optional.indexOf(opAttrKeys[i]) === -1) {
      throw new Error('Invalid attribute \'' + opAttrKeys[i] +
                      '\' for this operation');
    }
    val = info.attributes.op[opAttrKeys[i]];
    if (rules === undefined) {
      throw new Error('Syntax rule(s) for attribute \'' + opAttrKeys[i] +
                      '\' not found');
    }
    isValid = checkVal(opAttrKeys[i], val, rules);
    if (!isValid)
      throw new Error('Invalid syntax for attribute \'' + opAttrKeys[i] + '\'');
  }
};

function checkVal(attr, val, rule) {
  var ret = false;
  if (Array.isArray(rule) && Array.isArray(rule[0])) {
    for (var i=0,len=rule.length; i<len; ++i) {
      if (checkVal(attr, val, rule[i])) {
        ret = true;
        break;
      }
    }
  } else {
    var hasArgs = Array.isArray(rule),
        type = (hasArgs ? rule[0] : rule),
        lower, upper;
    switch(type) {
      case TAG.NOVALUE:
        ret = (val === undefined);
        break;
      case TAG.INTEGER:
        lower = -consts.MAX_INTEGER;
        upper = consts.MAX_INTEGER;
        if (hasArgs && rule[1] != undefined) {
          if (rule[2] != undefined) {
            lower = rule[1];
            upper = rule[2];
          } else
            upper = rule[1];
        }
        ret = (val === parseInt(val) && val <= upper && val >= lower);
        break;
      case TAG.BOOLEAN:
        ret = (val === true || val === false);
        break;
      case TAG.ENUM:
        ret = (consts.ENUM[attr] && consts.ENUM[attr].indexOf(val) > -1);
        break;
      case TAG.STRING:
        ret = (Buffer.isBuffer(val) &&
               (hasArgs && rule[1] != undefined && val.length <= rule[1]));
        break;
      case TAG.DATETIME:
        ret = util.isDate(val);
        break;
      case TAG.RESOLUTION:
        var matches;
        ret = (typeof val === 'string');
        if (!ret)
          break;
        matches = /^(\d+)x(\d+)(?:\s*(?:in|cm))?$/i.exec(val)
        if (matches) {
          matches[1] = parseInt(matches[1]);
          matches[2] = parseInt(matches[2]);
        }
        ret = (matches &&
               matches[1] >= -consts.MAX_INTEGER &&
               matches[1] <= consts.MAX_INTEGER &&
               matches[2] >= consts.MAX_INTEGER &&
               matches[2] <= -consts.MAX_INTEGER);
        break;
      case TAG.RANGE:
        ret = (typeof val === 'string');
        if (!ret)
          break;
        var matches = matches = /^(\d+)-(\d+)$/i.exec(val),
            lower = -consts.MAX_INTEGER,
            upper = consts.MAX_INTEGER;
        if (matches) {
          matches[1] = parseInt(matches[1]);
          matches[2] = parseInt(matches[2]);
          if (hasArgs) {
            lower = rule[1];
            upper = rule[2];
          }
        }
        ret = (matches && matches[1] >= lower && matches[1] <= upper &&
               matches[2] >= lower && matches[2] <= upper);
        break;
      /*case TAG.TEXTLANG:
        break;
      case TAG.NAMELANG:
        break;*/
      case TAG.TEXT:
        ret = (typeof val === 'string' && hasArgs &&
               Buffer.byteLength(val) <= rule[1]);
        break;
      case TAG.NAME:
        ret = (typeof val === 'string' && hasArgs &&
               Buffer.byteLength(val) <= rule[1]);
        break;
      case TAG.KEYWORD:
        break;
      case TAG.URI:
        ret = (typeof val === 'string' && hasArgs &&
                Buffer.byteLength(val) <= rule[1]);
        break;
      case TAG.URISCHEME:
        ret = (typeof val === 'string' && hasArgs &&
                Buffer.byteLength(val) <= rule[1]);
        break;
      case TAG.CHARSET:
        ret = (typeof val === 'string' && hasArgs &&
                Buffer.byteLength(val) <= rule[1]);
        break;
      case TAG.LANGUAGE:
        ret = (typeof val === 'string' && hasArgs &&
                Buffer.byteLength(val) <= rule[1]);
        break;
      case TAG.MIMETYPE:
        ret = (typeof val === 'string' && hasArgs &&
                Buffer.byteLength(val) <= rule[1]);
        break;
      /*case TAG.MEMBERNAME:
        break;*/
      case TAG.SET:
        ret = (Array.isArray(val) && val.length > 0 && hasArgs);
        if (!ret)
          break;
        for (var i=0,len=val.length; i<len; ++i) {
          // XXX I'm not sure if this is the expected behavior
          //     e.g. all elements must match same type or can be one of several
          //     in the case of a set which can house different types
          if (!checkVal(attr, val[i], rule[1])) {
            ret = false;
            break;
          }
        }
        break;
      /*case TAG.COLLECTION:
        break;*/
      default:
        throw new Error('Unrecognized tag type');
    }
  }

  return ret;
}