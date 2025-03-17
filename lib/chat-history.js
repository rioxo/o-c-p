'use label';

const ChatHistoryView = require('./chat-history-view.js');

class ChatHistory {

  constructor(state){
    this.name = "new Chat"
    this.history = [];
    if(state) {
      this.name = state.name
      this.history = state.history;
    }
    this.historyView = new ChatHistoryView(this.history);
  }

  serialize(){
    return {
      name: this.name,
      history: this.history
    }
  }

  addMessage(role, message){
    this.history.push({
      role: role,
      content: message
    });
    this.historyView.addMessage(role, message);
  }

  getHistory(){
    return this.history;
  }

  getElement(){
    return this.historyView.getElement();
  }

  getName(){
    return this.name;
  }

  setName(name){
    this.name = name;
  }
}

module.exports = ChatHistory;
