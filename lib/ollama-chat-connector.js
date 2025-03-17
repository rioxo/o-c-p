'use babel';

class OllamaChatConnector {
  http: null;
  constructor() {
    this.http ??= require('http');
  }

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
