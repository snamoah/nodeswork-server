mongoose                = require 'mongoose'


{TimestampModelPlugin}  = require './utils'
errors                  = require '../errors'

exports.DeviceSchema = DeviceSchema = mongoose.Schema {

  user:
    type:       mongoose.Schema.ObjectId
    ref:        'User'
    required:   true
    index:      true

  deviceId:
    type:       String
    required:   true

  status:
    enum:       ["ONLINE", "OFFLINE", "UNVERIFIED"]
    type:       String
    default:    "UNVERIFIED"

  errMsg:       String

}, collection: 'devices', discriminatorKey: 'deviceType'

  .plugin TimestampModelPlugin
