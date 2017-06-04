module.exports = {
  FUT_TWO_FACTOR_CODE_REQUIRED: 'FUT Two factor code required.'
  FUT_TWO_FACTOR_FUNCTION_NOT_FOUND: 'FUT Two factor function not found.'
  FUT_API_CLIENT_IS_NOT_AUTHORIZED: 'FUT client is not authorized.'

  NodesworkError: NodesworkError = (@message, @errorCode=422) ->

  ParameterValidationError: (@message, @errorCode=422) ->
}

NodesworkError.required = (target, key) ->
  unless target[key]?
    throw new NodesworkError "Missing parameter #{key}"

NodesworkError.unkownValue = ({key, value}) ->
  throw new NodesworkError "Unkown parameter #{key} with value #{value}"

NodesworkError.mongooseError = (e) ->
  switch
    when e.name == 'MongoError' and e.code == 11000
      throw new NodesworkError "Duplicate record detected."
    else throw new NodesworkError "Unknown MongoError"

NodesworkError.parseJSON = (jsonStr) ->
  try
    JSON.parse jsonStr ? '{}'
  catch e
    throw new NodesworkError "JSON parse failed for #{jsonStr}"

NodesworkError.parseNumber = (numStr) ->
  try
    parseInt numStr
  catch e
    throw new NodesworkError "Number parse failed for #{numStr}"
