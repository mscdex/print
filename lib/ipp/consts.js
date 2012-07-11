var TAG = exports.TAG = {
  /* Delimiter attribute tags */
  ZERO: 0x00,
  OPERATION: 0x01,
  JOB: 0x02,
  END: 0x03,
  PRINTER: 0x04,
  UNSUPPORTED_GROUP: 0x05,
  SUBSCRIPTION: 0x06, // RFC3995
  EVENT_NOTIFICATION: 0x07, // RFC3995

  /* Value attribute tags */
  /*   -- Out-of-band values */
  UNSUPPORTED_VALUE: 0x10,
  UNKNOWN: 0x12,
  NOVALUE: 0x13,
  NOTSETTABLE: 0x15, // RFC3380
  DELETEATTR: 0x16, // RFC3380
  ADMINDEFINE: 0x17, // RFC3380
  /*   -- Integer values */
  INTEGER: 0x21,
  BOOLEAN: 0x22,
  ENUM: 0x23,
  /*   -- Octet string values */
  STRING: 0x30,
  DATETIME: 0x31,
  RESOLUTION: 0x32,
  RANGE: 0x33,
  BEGIN_COLLECTION: 0x34, // RFC3382
  TEXTLANG: 0x35,
  NAMELANG: 0x36,
  END_COLLECTION: 0x37, // RFC3382
  /*   -- Character string values */
  TEXT: 0x41,
  NAME: 0x42,
  KEYWORD: 0x44,
  URI: 0x45,
  URISCHEME: 0x46,
  CHARSET: 0x47,
  LANGUAGE: 0x48,
  MIMETYPE: 0x49,
  MEMBERNAME: 0x4A, // RFC3382
  /*  -- Other values */
  EXTENDED: 0x7F,
  SET: 0x80, // only used internally within this module
  COLLECTION: 0x81 // only used internally within this module
};
for (var i=0,keys=Object.keys(exports.TAG),len=keys.length; i<len; ++i)
  exports.TAG[exports.TAG[keys[i]]] = keys[i].toLowerCase().replace(/_/g, '-');

var MAX = 1023;
exports.MAX_INTEGER = 2147483647;
var ATTR = exports.ATTR = {
  EVENT_NOTIFICATIONS: {
    'notify-subscribed-event': TAG.KEYWORD,
    'notify-text': [TAG.TEXT, MAX]
  },
  OP: {
    'attributes-charset': [TAG.CHARSET, 63],
    'attributes-natural-language': [TAG.LANGUAGE, 63],
    'compression': TAG.KEYWORD,
    'detailed-status-message': [TAG.TEXT, MAX],
    'document-access-error': [TAG.TEXT, MAX],
    'document-format': [TAG.MIMETYPE, 255],
    'document-name': [TAG.NAME, MAX],
    'document-natural-language': [TAG.LANGUAGE, 63],
    'ipp-attribute-fidelity': TAG.BOOLEAN,
    'job-hold-until': [[TAG.KEYWORD], [TAG.NAME, MAX]],
    'job-id': [TAG.INTEGER, 1, MAX],
    'job-impressions': [TAG.INTEGER, 0, MAX],
    'job-k-octets': [TAG.INTEGER, 0, MAX],
    'job-media-sheets': [TAG.INTEGER, 0, MAX],
    'job-message-from-operator': [TAG.TEXT, 127],
    'job-name': [TAG.NAME, MAX],
    'job-state': TAG.ENUM,
    'job-state-message': [TAG.TEXT, MAX],
    'job-state-reasons': [TAG.SET, TAG.KEYWORD],
    'job-uri': [TAG.URI, 1023],
    'last-document': TAG.BOOLEAN,
    'limit': [TAG.INTEGER, 1, MAX],
    'message': [TAG.TEXT, 127],
    'my-jobs': TAG.BOOLEAN,
    'original-requesting-user-name': [TAG.NAME, MAX],
    'printer-message-from-operator': [TAG.TEXT, 127],
    'printer-uri': [TAG.URI, 1023],
    'requested-attributes': [TAG.SET, TAG.KEYWORD],
    'requesting-user-name': [TAG.NAME, MAX],
    'status-message': [TAG.TEXT, 255],
    'which-jobs': TAG.KEYWORD
  },
  JOB: {
    'attributes-charset': [TAG.CHARSET, 63],
    'attributes-natural-language': [TAG.LANGUAGE, 63],
    'date-time-at-completed': [[TAG.DATETIME], [TAG.NOVALUE]],
    'date-time-at-creation': TAG.DATETIME,
    'date-time-at-processing': [[TAG.DATETIME], [TAG.NOVALUE]],
    'impressions-completed-current-copy': [TAG.INTEGER, 0, MAX],
    'job-collation-type': TAG.ENUM,
    'job-detailed-status-messages': [TAG.SET, [TAG.TEXT, MAX]],
    'job-document-access-errors': [TAG.SET, [TAG.TEXT, MAX]],
    'job-id': [TAG.INTEGER, 1, MAX],
    'job-impressions': [TAG.INTEGER, 0, MAX],
    'job-impressions-completed': [TAG.INTEGER, 0, MAX],
    'job-k-octets': [TAG.INTEGER, 0, MAX],
    'job-k-octets-processed': [TAG.INTEGER, 0, MAX],
    'job-media-sheets': [TAG.INTEGER, 0, MAX],
    'job-media-sheets-completed': [TAG.INTEGER, 0, MAX],
    'job-message-from-operator': [TAG.TEXT, 127],
    'job-more-info': [TAG.URI, 1023],
    'job-name': [TAG.NAME, MAX],
    'job-originating-user-name': [TAG.NAME, MAX],
    'job-printer-up-time': [TAG.INTEGER, 1, MAX],
    'job-printer-uri': [TAG.URI, 1023],
    'job-state': [[TAG.ENUM], [TAG.UNKNOWN]],
    'job-state-message': [TAG.TEXT, MAX],
    'job-state-reasons': [TAG.SET, TAG.KEYWORD],
    'job-uri': [TAG.URI, 1023],
    'number-of-documents': [TAG.INTEGER, 0, MAX],
    'number-of-intervening-jobs': [TAG.INTEGER, 0, MAX],
    'original-requesting-user-name': [TAG.NAME, MAX],
    'output-device-assigned': [TAG.NAME, 127],
    'sheet-completed-copy-number': [TAG.INTEGER, 0, MAX],
    'sheet-completed-document-number': [TAG.INTEGER, 0, MAX],
    'time-at-completed': [[TAG.INTEGER, MIN, MAX], [TAG.NOVALUE]],
    'time-at-creation': [TAG.INTEGER, MIN, MAX],
    'time-at-processing': [[TAG.INTEGER, MIN, MAX], [TAG.NOVALUE]]
  },
  JOB_TEMPLATE: {
    'copies': [TAG.INTEGER, 1, MAX],
    'copies-default': [TAG.INTEGER, 1, MAX],
    'copies-supported': [TAG.SET, [TAG.RANGE, 1, MAX]],
    'cover-front': [[TAG.KEYWORD], [TAG.NAME, MAX]],
    'cover-back': [[TAG.KEYWORD], [TAG.NAME, MAX]],
    'finishings': [TAG.SET, TAG.ENUM],
    'finishings-default': [TAG.SET, TAG.ENUM],
    'finishings-supported': [TAG.SET, TAG.ENUM],
    'insert-sheet': [[TAG.KEYWORD], [TAG.NAME, MAX]],
    'job-accounting-sheets': [[TAG.KEYWORD], [TAG.NAME, MAX]],
    'job-hold-until': [[TAG.KEYWORD], [TAG.NAME, MAX]],
    'job-hold-until-default': [[TAG.KEYWORD], [TAG.NAME, MAX]],
    'job-hold-until-supported': [TAG.SET, [[TAG.KEYWORD], [TAG.NAME, MAX]]],
    'job-priority': [TAG.INTEGER, 1, 100],
    'job-priority-default': [TAG.INTEGER, 1, 100],
    'job-priority-supported': [TAG.INTEGER, 1, 100],
    'job-sheets': [[TAG.KEYWORD], [TAG.NAME, MAX]],
    'job-sheets-col': [[TAG.KEYWORD], [TAG.NAME, MAX]],
    'job-sheets-default': [[TAG.KEYWORD], [TAG.NAME, MAX]],
    'job-sheets-supported': [TAG.SET, [[TAG.KEYWORD], [TAG.NAME, MAX]]],
    'media': [[TAG.KEYWORD], [TAG.NAME, MAX]],
    'media-default': [[TAG.NOVALUE], [TAG.KEYWORD], [TAG.NAME, MAX]],
    'media-supported': [TAG.SET, [[TAG.KEYWORD], [TAG.NAME, MAX]]],
    'media-ready': [TAG.SET, [[TAG.KEYWORD], [TAG.NAME, MAX]]],
    'multiple-document-handling': TAG.KEYWORD,
    'multiple-document-handling-default': TAG.KEYWORD,
    'multiple-document-handling-supported': [TAG.SET, TAG.KEYWORD],
    'number-up': [TAG.INTEGER, 1, MAX],
    'number-up-default': [TAG.INTEGER, 1, MAX],
    'number-up-supported': [[TAG.INTEGER, 1, MAX], [TAG.RANGE, 1, MAX]],
    'orientation-requested': TAG.ENUM,
    'orientation-requested-default': [[TAG.NOVALUE], [TAG.ENUM]],
    'orientation-requested-supported': [TAG.SET, TAG.ENUM],
    'page-ranges': [TAG.SET, [TAG.RANGE, 1, MAX]],
    'page-ranges-supported': TAG.BOOLEAN,
    'printer-resolution': TAG.RESOLUTION,
    'printer-resolution-default': TAG.RESOLUTION,
    'printer-resolution-supported': TAG.RESOLUTION,
    'print-quality': TAG.ENUM,
    'print-quality-default': TAG.ENUM,
    'print-quality-supported': [TAG.SET, TAG.ENUM],
    'separator-sheets': [[TAG.KEYWORD], [TAG.NAME, MAX]],
    'sheet-collate': TAG.KEYWORD,
    'sheet-collate-default': TAG.KEYWORD,
    'sheet-collate-supported': [TAG.SET, TAG.KEYWORD],
    'sides': TAG.KEYWORD,
    'sides-default': TAG.KEYWORD,
    'sides-supported': [TAG.SET, TAG.KEYWORD]
  },
  PRINTER: {
    'charset-configured': [TAG.CHARSET, 63],
    'charset-supported': [TAG.SET, [TAG.CHARSET, 63]],
    'color-supported': TAG.BOOLEAN,
    'compression-supported': [TAG.SET, TAG.KEYWORD],
    'document-format-default': [TAG.MIMETYPE, 255],
    'document-format-supported': [TAG.SET, [TAG.MIMETYPE, 255]],
    'document-format-varying-attributes': [TAG.SET, TAG.KEYWORD],
    'generated-natural-language-supported': [TAG.SET, [TAG.LANGUAGE, 63]],
    'ippget-event-life': [TAG.INTEGER, 15, MAX],
    'ipp-versions-supported': [TAG.SET, TAG.KEYWORD],
    'job-impressions-supported': [TAG.RANGE, 0, MAX],
    'job-k-octets-supported': [TAG.RANGE, 0, MAX],
    'job-media-sheets-supported': [TAG.RANGE, 0, MAX],
    'job-settable-attributes-supported': [TAG.SET, TAG.KEYWORD],
    'multiple-document-jobs-supported': TAG.BOOLEAN,
    'multiple-operation-time-out': [TAG.INTEGER, 1, MAX],
    'natural-language-configured': [TAG.LANGUAGE, 63],
    'operations-supported': [TAG.SET, TAG.ENUM],
    'pages-per-minute': [TAG.INTEGER, 0, MAX],
    'pages-per-minute-color': [TAG.INTEGER, 0, MAX],
    'parent-printers-supported': [TAG.SET, [TAG.URI, 1023]],
    'pdl-override-supported': TAG.KEYWORD,
    'printer-current-time': TAG.DATETIME,
    'printer-driver-installer': [TAG.URI, 1023],
    'printer-info': [TAG.TEXT, 127],
    'printer-is-accepting-jobs': TAG.BOOLEAN,
    'printer-location': [TAG.TEXT, 127],
    'printer-make-and-model': [TAG.TEXT, 127],
    'printer-message-date-time': TAG.DATETIME,
    'printer-message-from-operator': [TAG.TEXT, 127],
    'printer-message-time': [TAG.INTEGER, MIN, MAX],
    'printer-more-info': [TAG.URI, 1023],
    'printer-more-info-manufacturer': [TAG.URI, 1023],
    'printer-name': [TAG.NAME, 127],
    'printer-settable-attributes-supported': [TAG.SET, TAG.KEYWORD],
    'printer-state': TAG.ENUM,
    'printer-state-change-date-time': TAG.DATETIME,
    'printer-state-change-time': [TAG.INTEGER, 1, MAX],
    'printer-state-message': [TAG.TEXT, MAX],
    'printer-state-reasons': [TAG.SET, TAG.KEYWORD],
    'printer-up-time': [TAG.INTEGER, 1, MAX],
    'printer-uri-supported': [TAG.SET, [TAG.URI, 1023]],
    'printer-xri-supported': [TAG.SET, TAG.COLLECTION],
    'xri-authentication': TAG.KEYWORD,
    'xri-security': TAG.KEYWORD,
    'xri-uri': [TAG.URI, 1023],
    'queued-job-count': [TAG.INTEGER, 0, MAX],
    'reference-uri-schemes-supported': [TAG.SET, [TAG.URISCHEME, 63]],
    'subordinate-printers-supported': [TAG.SET, [TAG.URI, 1023]],
    'uri-authentication-supported': [TAG.SET, TAG.KEYWORD],
    'uri-security-supported': [TAG.SET, TAG.KEYWORD],
    'xri-authentication-supported': [TAG.SET, TAG.KEYWORD],
    'xri-security-supported': [TAG.SET, TAG.KEYWORD],
    'xri-uri-scheme-supported': [TAG.SET, [TAG.URISCHEME, 63]]
  },
  SUBSCRIPTION: {
    'notify-job-id': [TAG.INTEGER, 1, MAX],
    'notify-lease-expiration-time': [TAG.INTEGER, 0, MAX],
    'notify-printer-up-time': [TAG.INTEGER, 1, MAX],
    'notify-printer-uri': [TAG.URI, 1023],
    'notify-sequence-number': [TAG.INTEGER, 0, MAX],
    'notify-subscriber-user-name': [TAG.NAME, MAX],
    'notify-subscription-id': [TAG.INTEGER, 1, MAX]
  },
  SUBSCRIPTION_TEMPLATE: {
    'notify-attributes': [TAG.SET, TAG.KEYWORD],
    'notify-attributes-supported': [TAG.SET, TAG.KEYWORD],
    'notify-charset': [TAG.CHARSET, 63],
    'notify-events': [TAG.SET, TAG.KEYWORD],
    'notify-events-default': [TAG.SET, TAG.KEYWORD],
    'notify-events-supported': [TAG.SET, TAG.KEYWORD],
    'notify-lease-duration': [TAG.INTEGER, 0, 67108863],
    'notify-lease-duration-default': [TAG.INTEGER, 0, 67108863],
    'notify-lease-duration-supported': [[TAG.SET, [TAG.INTEGER, 0, 67108863]],
                                        [TAG.RANGE, 0, 67108863]],
    'notify-max-events-supported': [TAG.INTEGER, 2, MAX],
    'notify-natural-language': [TAG.LANGUAGE, 63],
    'notify-pull-method': TAG.KEYWORD,
    'notify-pull-method-supported': [TAG.SET, TAG.KEYWORD],
    'notify-recipient-uri': [TAG.URI, 1023],
    'notify-schemes-supported': [TAG.SET, [TAG.URISCHEME, 63]],
    'notify-time-interval': [TAG.INTEGER, 0, MAX],
    'notify-user-data': [TAG.STRING, 63]
  }
};
for (var i=0,attrs,keys=Object.keys(ATTR),len=keys.length; i<len; ++i) {
  attrs = ATTR[keys[i]];
  for (var j=0,keys2=Object.keys(attrs),len2=keys2.length; j<len2; ++j)
    ATTR[keys2[j]] = attrs[keys2[j]];
}

var finishings = [
  'none', 'staple', 'punch', 'cover', 'bind', 'saddle-stitch', 'edge-stitch',
  'Unassigned', 'staple-top-left', 'staple-bottom-left', 'staple-top-right',
  'staple-bottom-right', 'edge-stitch-left', 'edge-stitch-top',
  'edge-stitch-right', 'edge-stitch-bottom', 'staple-dual-left',
  'staple-dual-top', 'staple-dual-right', 'staple-dual-bottom'
], orientations = [
  'portrait', 'landscape', 'reverse-landscape', 'reverse-portrait'
], printQualities = [ 'draft', 'normal', 'high' ];
exports.ENUM = {
  'finishings': finishings,
  'finishings-default:' finishings,
  'finishings-supported:' finishings,
  'finishings-ready:' finishings,
  'job-collation-type': [
    'uncollated-sheets', 'collated-documents', 'uncollated-documents'
  ],
  'job-state': [
    'pending', 'pending-held', 'processing', 'processing-stopped', 'canceled',
    'aborted', 'completed'
  ],
  'operations-supported': Object.keys(OP).map(function(x) {
    return x.toLowerCase().replace(/_/g, '-');
  }),
  'orientation-requested': orientations,
  'orientation-requested-default': orientations,
  'orientation-requested-supported': orientations,
  'print-quality': printQualities,
  'print-quality-default': printQualities,
  'print-quality-supported': printQualities,
  'printer-state': [
    'idle', 'processing', 'stopped'
  ]
};

var compression = [
  'compress', 'deflate', 'gzip', 'none'
], jobHoldUntil = [
  'day-time', 'evening', 'indefinite', 'night', 'no-hold', 'second-shift',
  'third-shift', 'weekend'
], jobSheets = [
  'none', 'standard'
], jobStateReasons = [
  'aborted-by-system', 'compression-error', 'document-access-error',
  'document-format-error', 'job-canceled-at-device', 'job-canceled-by-operator',
  'job-canceled-by-user', 'job-completed-successfully',
  'job-completed-with-errors', 'job-completed-with-warnings',
  'job-data-insufficient', 'job-hold-until-specified', 'job-incoming',
  'job-interpreting', 'job-outgoing', 'job-printing', 'job-queued',
  'job-queued-for-marker', 'job-restartable', 'job-suspended',
  'job-transforming', 'none', 'printer-stopped', 'printer-stopped-partly',
  'processing-to-stop-point', 'queued-in-device', 'resources-are-not-ready',
  'service-off-line', 'submission-interrupted', 'unsupported-compression',
  'unsupported-document-format'
],
    
/*exports.KEYWORD = {
  
};*/

var OP = exports.OP = {
  /* Operation IDs */
  PRINT_JOB: 0x0002,
  PRINT_URI: 0x0003,
  VALIDATE_JOB: 0x0004,
  CREATE_JOB: 0x0005,
  SEND_DOCUMENT: 0x0006,
  SEND_URI: 0x0007,
  CANCEL_JOB: 0x0008,
  GET_JOB_ATTRIBUTES: 0x0009,
  GET_JOBS: 0x000A,
  GET_PRINTER_ATTRIBUTES: 0x000B,
  HOLD_JOB: 0x000C,
  RELEASE_JOB: 0x000D,
  RESTART_JOB: 0x000E,
  PAUSE_PRINTER: 0x0010,
  RESUME_PRINTER: 0x0011,
  PURGE_JOBS: 0x0012,
  SET_PRINTER_ATTRIBUTES: 0x0013, // RFC3380
  SET_JOB_ATTRIBUTES: 0x0014, // RFC3380
  GET_PRINTER_SUPPORTED_VALUES: 0x0015, // RFC3380
  CREATE_PRINTER_SUBSCRIPTIONS: 0x0016, // RFC3995
  CREATE_JOB_SUBSCRIPTIONS: 0x0017, // RFC3995
  GET_SUBSCRIPTION_ATTRIBUTES: 0x0018, // RFC3995
  GET_SUBSCRIPTIONS: 0x0019, // RFC3995
  RENEW_SUBSCRIPTION: 0x001A, // RFC3995
  CANCEL_SUBSCRIPTION: 0x001B, // RFC3995
  GET_NOTIFICATIONS: 0x001C, // RFC3996
  ENABLE_PRINTER: 0x0022, // RFC3998
  DISABLE_PRINTER: 0x0023, // RFC3998
  PAUSE_PRINTER_AFTER_CURRENT_JOB: 0x0024, // RFC3998
  HOLD_NEW_JOBS: 0x0025, // RFC3998
  RELEASE_HELD_NEW_JOBS: 0x0026, // RFC3998
  DEACTIVATE_PRINTER: 0x0027, // RFC3998
  ACTIVATE_PRINTER: 0x0028, // RFC3998
  RESTART_PRINTER: 0x0029, // RFC3998
  SHUTDOWN_PRINTER: 0x002A, // RFC3998
  STARTUP_PRINTER: 0x002B, // RFC3998
  REPROCESS_JOB: 0x002C, // RFC3998
  CANCEL_CURRENT_JOB: 0x002D, // RFC3998
  SUSPEND_CURRENT_JOB: 0x002E, // RFC3998
  RESUME_JOB: 0x002F, // RFC3998
  PROMOTE_JOB: 0x0030, // RFC3998
  SCHEDULE_JOB_AFTER: 0x0031, // RFC3998
  PRIVATE: 0x4000
};
for (var i=0,keys=Object.keys(exports.OP),len=keys.length; i<len; ++i)
  exports.OP[exports.OP[keys[i]]] = keys[i].toLowerCase().replace(/_/g, '-');

exports.STATUS = {
  /* Success 0x0000 - 0x00FF */
  OK: 0x0000,
  OK_SUBST: 0x0001,
  OK_CONFLICT: 0x0002,
  OK_IGNORED_SUBSCRIPTIONS: 0x0003,
  OK_IGNORED_NOTIFICATIONS: 0x0004,
  OK_TOO_MANY_EVENTS: 0x0005,
  OK_BUT_CANCEL_SUBSCRIPTION: 0x0006,
  OK_EVENTS_COMPLETE: 0x0007,

  /* Informational 0x0100 - 0x01FF */

  /* Redirection 0x0300 - 0x03FF */
  REDIRECTION_OTHER_SITE: 0x0300,

  /* Client error 0x0400 - 0x04FF */
  BAD_REQUEST: 0x0400,
  FORBIDDEN: 0x0401,
  NOT_AUTHENTICATED: 0x0402,
  NOT_AUTHORIZED: 0x0403,
  NOT_POSSIBLE: 0x0404,
  TIMEOUT: 0x0405,
  NOT_FOUND: 0x0406,
  GONE: 0x0407,
  REQUEST_ENTITY: 0x0408,
  REQUEST_VALUE: 0x0409,
  DOCUMENT_FORMAT: 0x040A,
  ATTRIBUTES: 0x040B,
  URI_SCHEME: 0x040C,
  CHARSET: 0x040D,
  CONFLICT: 0x040E,
  COMPRESSION_NOT_SUPPORTED: 0x040F,
  COMPRESSION_ERROR: 0x0410,
  DOCUMENT_FORMAT_ERROR: 0x0411,
  DOCUMENT_ACCESS_ERROR: 0x0412,
  ATTRIBUTES_NOT_SETTABLE: 0x0413,
  IGNORED_ALL_SUBSCRIPTIONS: 0x0414,
  TOO_MANY_SUBSCRIPTIONS: 0x0415,
  IGNORED_ALL_NOTIFICATIONS: 0x0416,
  PRINT_SUPPORT_FILE_NOT_FOUND: 0x0417,

  /* Server error 0x0500 - 0x05FF */
  INTERNAL_ERROR: 0x0500,
  OPERATION_NOT_SUPPORTED: 0x0501,
  SERVICE_UNAVAILABLE: 0x0502,
  VERSION_NOT_SUPPORTED: 0x0503,
  DEVICE_ERROR: 0x0504,
  TEMPORARY_ERROR: 0x0505,
  NOT_ACCEPTING_JOBS: 0x0506,
  BUSY: 0x0507,
  JOB_CANCELED: 0x0508,
  MULTIPLE_JOBS_NOT_SUPPORTED: 0x0509,
  PRINTER_IS_DEACTIVATED: 0x050A,
  TOO_MANY_JOBS: 0x050B,
  TOO_MANY_DOCS: 0x050C
};
for (var i=0,keys=Object.keys(exports.STATUS),len=keys.length; i<len; ++i)
  exports.STATUS[exports.STATUS[keys[i]]] = keys[i].toLowerCase()
                                                   .replace(/_/g, '-');

exports.LAST_DELIM_TAG = 0x0F;
exports.MAX_REQID = Math.pow(2, 31) - 1;