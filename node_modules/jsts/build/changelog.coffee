request = require 'request'
request 'https://api.github.com/repos/bjornharrtell/jsts/issues?milestone=11&state=closed', (error, response, body) ->
  if not error and response.statusCode is 200
    json = JSON.parse body
    json.forEach (issue) ->
        console.log "#{issue.title} (##{issue.number})"

