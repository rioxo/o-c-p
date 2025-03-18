'use label';

const ChatHistoryView = require('./chat-history-view.js');
const Uuid = require('uuid');

class ChatHistory {

  constructor(state){
    this.name = "new Chat"
    this.history = [];
    if(state) {
      this.name = state.name
      this.history = state.history;
      this.uuid = state.uuid;
    }
    if (!this.uuid) {
      this.uuid = Uuid.v4();
    }
    this.historyView = new ChatHistoryView(this.history, this.name, this.uuid);
  }

  destroy() {
    this.historyView.destroy();
  }

  serialize(){
    return {
      name: this.name,
      history: this.history,
      uuid: this.uuid
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

  getNameElement() {
    return this.historyView.getName();
  }

  setName(name){
    this.name = name;
    this.historyView.setName(name);
  }

  getUuid() {
    return this.uuid
  }
}

module.exports = ChatHistory;
