_                           = require 'underscore'
KoaRouter                   = require 'koa-router'

{
  requireLogin
  overrideUserToQuery
  overrideUserToDoc
}                           = require './middlewares'
{Device, UserApplet}        = require '../models'


exports.deviceRouter = deviceRouter = new KoaRouter prefix: '/devices'

deviceRouter.use requireLogin


deviceRouter

  .get '/', overrideUserToQuery(), Device.findMiddleware()

  .get '/:deviceId', overrideUserToQuery(), Device.getMiddleware {
    fieldName: 'deviceId'
  }

  .post('/', overrideUserToDoc(),
    Device.createMiddleware(),
    (ctx) -> ctx.object.withFieldsToJSON 'deviceToken'
  )

  .post('/:deviceId', overrideUserToQuery(),
    Device.updateMiddleware omits: ['user', 'deviceToken']
    (ctx) ->
      if ctx.params.deviceToken == null
        ctx.object.regenerateDeviceToken()
        ctx.object.withFieldsToJSON 'deviceToken'
  )

  .get('/:deviceId/applets',
    overrideUserToQuery(),
    Device.getMiddleware fieldName: 'deviceId', writeToBody: false
    (ctx) ->
      device = ctx.object

      ctx.response.body = await UserApplet.find {
        user:    ctx.user
        device:  device
        status:  "ON"
      }
        .populate 'applet'
  )
