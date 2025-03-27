'use babel';

class OllamaChatConnector {
  http: null;

  /**
    function constructor()
    constructor of the class
  **/
  constructor() {
    this.http ??= require('http');
  }

  /**
    function getTags(callback)
    get nameTag of the LLM Models on the Ollama server
    @param callback Callable
    the callback of the function
  **/
  getTags(callback) {
  var req = this.http.request(
    atom.config.get('o-c-p.ollamaServerUri') + '/api/tags',
    {method: 'GET'},
    (res) => {
      res.on(
        'data',
        callback
        )
    });
  req.end();
  }

  /**
    function sendMessage(history, model, callback)
    send a message to a model
    @param history ChatHistory
    the history of the chat
    @param model String
    the name of the model
    @param callback Callable
    the callback of the function

  **/
  sendMessage(history, model, callback) {
    var data = JSON.stringify({
      model: model,
      messages: history.getHistory(),
      stream: false
    });
    var req = this.http.request(
      atom.config.get('o-c-p.ollamaServerUri') + '/api/chat',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
        }
      },
      (res) => {
        res.on(
          'data',
          callback
          )
      });
    req.write(data);
    req.end();
  }
}

module.exports = OllamaChatConnector;
