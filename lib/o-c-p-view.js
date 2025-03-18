'use babel';

const ChatHistory = require('./chat-history.js');

var http;

export default class OCPView {

  constructor(chatList, currentChat, ollamaChatConnector) {

    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('o-c-p');

    // Create Parameter Block
    var paramBlock = document.createElement('div');
    paramBlock.classList.add('o-c-p');
    paramBlock.classList.add('param-block');
    this.element.appendChild(paramBlock)

    // Create AI List
    this.aiList = document.createElement('select');
    this.aiList.classList.add('o-c-p');
    this.aiList.classList.add('ai-list');
    paramBlock.appendChild(this.aiList)

    // Create No Select
    var noAiOption = document.createElement('option');
    noAiOption.innerText = "Select An AI ...";
    noAiOption.value = 0;
    this.aiList.appendChild(noAiOption);

    ollamaChatConnector.getTags((chunk) => {
      var body = JSON.parse(chunk.toString());
      for (var model of body.models){
        var modelOption = document.createElement('option');
        modelOption.innerText = model.name;
        modelOption.value = model.name;
        this.aiList.appendChild(modelOption);
      }
    });

    // Create New Chat Button
    var newChat = document.createElement('input');
    newChat.type = 'button';
    newChat.value = 'New';
    newChat.classList.add('o-c-p');
    newChat.classList.add('new-chat');
    newChat.addEventListener('click', () => {
      atom.commands.dispatch(newChat, 'o-c-p:add-chat');
    })
    paramBlock.appendChild(newChat);

    // Create Chat List ChatList
    paramBlock.appendChild(chatList.getChatList());

    // Create history element
    this.historyBlock = document.createElement('div');
    this.historyBlock.classList.add('o-c-p');
    this.historyBlock.classList.add('message-history');
    this.historyBlock.appendChild(chatList.getChatByUuid(currentChat).getElement());
    this.element.appendChild(this.historyBlock);

    // Create communication block
    var messageBlock = document.createElement('div');
    messageBlock.classList.add('o-c-p');
    messageBlock.classList.add('message-block');
    this.element.appendChild(messageBlock);

    // Create message input
    this.messageInput = atom.workspace.buildTextEditor();
    //messageInput.rows = 2;
    this.messageInput.element.classList.add('o-c-p');
    this.messageInput.element.classList.add('message-input');
    this.messageInput.element.id = 'chatMessageInput';
    messageBlock.appendChild(this.messageInput.element);

    // Create send button
    var sendButton = document.createElement('input');
    sendButton.type = 'button';
    sendButton.value = 'send';
    sendButton.classList.add('o-c-p');
    sendButton.classList.add('send-button');
    sendButton.addEventListener('click', () => {
      atom.commands.dispatch(sendButton, 'o-c-p:send-message');
    });
    messageBlock.appendChild(sendButton);
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {
    var serializedChat = [];
    return serializedChat;
  }

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getDefaultLocation() {
    return 'bottom';
  }

  getAllowedLocations() {
    return ['bottom', 'right'];
  }

  getTitle() {
    return 'Ollama Chat Pannel';
  }

  getURI(){
    return 'atom://ocp';
  }

  getElement() {
    return this.element;
  }

  getMessage() {
    return this.messageInput.getText();
  }

  setMessage(message) {
    this.messageInput.setText(message);
  }

  getModel() {
    return this.aiList.selectedOptions[0].value;
  }

  setChatHistory(history) {
    if (this.historyBlock.childElementCount > 0) {
      for (var child of this.historyBlock.children) {
        this.historyBlock.removeChild(child);
      }
    }
    this.historyBlock.appendChild(history.getElement());
  }

}
