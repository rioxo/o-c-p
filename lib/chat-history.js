'use label';

const ChatHistoryView = require('./chat-history-view.js');
const Uuid = require('uuid');

class ChatHistory {

  /**
    function constructor(state)
    constructor of the chatHistory
    @param state Object
    serialized state of the chatHistory
  **/
  constructor(state){
    // preparation of the data
    this.name = "new Chat"
    this.history = [];
    // if the state exist we use the data
    if(state) {
      this.name = state.name
      this.history = state.history;
      this.uuid = state.uuid;
    }
    // if the state has no uuid, we create it
    if (!this.uuid) {
      this.uuid = Uuid.v4();
    }
    // preparation of the view
    this.historyView = new ChatHistoryView(this.history, this.name, this.uuid);
  }

  /**
    function destroy()
    Tear down any state and detach
  **/
  destroy() {
    this.historyView.destroy();
  }

  /**
    function serialize()
    Returns an object that can be retrieved when package is activated
  **/
  serialize(){
    return {
      name: this.name,
      history: this.history,
      uuid: this.uuid
    }
  }

  /**
    function addMessage(role, message)
    add a message to the history
    @param role String
    the role of the sender
    @param message String
    the message to add
  **/
  addMessage(role, message){
    this.history.push({
      role: role,
      content: message
    });
    this.historyView.addMessage(role, message);
  }

  /**
    function getHistory()
    return the history of the chat
    @return Array
    the history of the chat
  **/
  getHistory(){
    return this.history;
  }

  /**
    function getElement()
    return the element of the view
    @return HtmlElement
    the element of the view
  **/
  getElement(){
    return this.historyView.getElement();
  }

  /**
    function getName()
    return the name of the history
    @return String
    the name of the chat History
  **/
  getName(){
    return this.name;
  }

  /**
    function getNameElement()
    return the name of the view
    @return String
    the name of the view
  **/
  getNameElement() {
    return this.historyView.getName();
  }

  /**
    function setName(name)
    set the name of the view
    @param name String
    the name to set
  **/
  setName(name){
    this.name = name;
    this.historyView.setName(name);
  }

  /**
    function getUuid()
    return the uuid of the history
  **/
  getUuid() {
    return this.uuid
  }
}

module.exports = ChatHistory;
