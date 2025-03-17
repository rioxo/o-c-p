'use babel';

const ChatHistory = require('./chat-history.js');
const OllamaChatConnector = require('./ollama-chat-connector.js');

var http;

export default class OCPView {

  constructor(serializedState) {

    this.chatList = [];
    if (serializedState) {
      for (var serializedChat of serializedState){
        this.chatList.push(new ChatHistory(serializedChat));
      }
    }
    else {
      this.chatList.push(new ChatHistory());
    }

    // Create OllamaChatConnector
    this.ollamaChatConnector = new OllamaChatConnector();
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('o-c-p');

    // Create Parameter Block
    var paramBlock = document.createElement('div');
    paramBlock.classList.add('o-c-p');
    paramBlock.classList.add('param_block');
    this.element.appendChild(paramBlock)

    // Create AI List
    var aiList = document.createElement('select');
    aiList.classList.add('o-c-p');
    aiList.classList.add('ai_list');
    aiList.id = 'aiList';
    paramBlock.appendChild(aiList)

    // Create No Select
    var noAiOption = document.createElement('option');
    noAiOption.innerText = "Select An AI ...";
    noAiOption.value = 0;
    aiList.appendChild(noAiOption);

    this.ollamaChatConnector.getTags((chunk) => {
      var body = JSON.parse(chunk.toString());
      for (var model of body.models){
        var modelOption = document.createElement('option');
        modelOption.innerText = model.name;
        modelOption.value = model.name;
        aiList.appendChild(modelOption);
      }
    });

    // Create New Chat Button
    var newChat = document.createElement('input');
    newChat.type = 'button';
    newChat.value = 'New';
    newChat.classList.add('o-c-p');
    newChat.classList.add('new_chat');
    newChat.addEventListener('click', () => {
      this.addChat();
    })
    paramBlock.appendChild(newChat);

    // Create Chat List
    var chatList = document.createElement('ul');
    chatList.classList.add('o-c-p');
    chatList.classList.add('chatList');
    chatList.id = 'chatList';
    paramBlock.appendChild(chatList);

    // Create ChatHistoryList
    for(var chat of this.chatList) {
      var chatLine = this.createChatLine(chat);
      chatList.appendChild(chatLine);
    }

    // Create chat element
    var chatBlock = document.createElement('div');
    chatBlock.classList.add('o-c-p');
    chatBlock.classList.add('chat_block');
    this.element.appendChild(chatBlock);

    // Create history element
    var historyBlock = document.createElement('div');
    historyBlock.id = 'messageHistory';
    historyBlock.classList.add('o-c-p');
    historyBlock.classList.add('message_history');
    this.chatHistory = this.chatList[0];
    historyBlock.appendChild(this.chatHistory.getElement());
    chatBlock.appendChild(historyBlock);

    // Create communication block
    var messageBlock = document.createElement('div');
    messageBlock.classList.add('o-c-p');
    messageBlock.classList.add('message_block');
    chatBlock.appendChild(messageBlock);


    // Create message input
    this.messageInput = atom.workspace.buildTextEditor();
    //messageInput.rows = 2;
    this.messageInput.element.classList.add('o-c-p');
    this.messageInput.element.classList.add('message_input');
    this.messageInput.element.id = 'chatMessageInput';
    messageBlock.appendChild(this.messageInput.element);

    // Create send button
    var sendButton = document.createElement('input');
    sendButton.type = 'button';
    sendButton.value = 'send';
    sendButton.classList.add('o-c-p');
    sendButton.classList.add('send_button');
    sendButton.addEventListener('click', () => {
      this.sendMessage();
    });
    messageBlock.appendChild(sendButton);
  }

  sendMessage() {
    var chatList = document.getElementById('aiList');
    var modelName = chatList.selectedOptions[0].value;
    if (modelName != '0'){
      var chatHistory = this.chatHistory;
      chatHistory.addMessage('user', this.messageInput.getText());
      this.messageInput.setText("");
      this.busyRegistry.begin('o-c-p.sendChat.' + chatHistory.getName, 'Send Message to model AI');
      this.ollamaChatConnector.sendMessage(
        chatHistory,
        modelName,
        (chunk) => {
          var body = JSON.parse(chunk.toString());
          this.busyRegistry.end('o-c-p.sendChat.' + chatHistory.getName);
          chatHistory.addMessage(
            body.message.role,
            body.message.content
          );
        }
      )
    }
    else {
      atom.notifications.addWarning('Select An Ai model');
    }
  }

  setBusy(registry) {
    this.busyRegistry = registry;
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {
    var serializedChat = [];
    for (var chat of this.chatList) {
      serializedChat.push(chat.serialize());
    }
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
    return ['bottom'];
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

  setChatHistory(history) {
    this.chatHistory = history;
    var historyBlock = document.getElementById('messageHistory');
    if (historyBlock.childElementCount > 0) {
      for (var child of historyBlock.children) {
        historyBlock.removeChild(child);
      }
    }
    historyBlock.appendChild(this.chatHistory.getElement());
  }

  addChat(){
    var newChatHistory = new ChatHistory();
    this.chatList.push(newChatHistory);
    this.setChatHistory(newChatHistory);
    var chatList = document.getElementById('chatList');
    var chatLine = this.createChatLine(this.chatHistory)
    chatList.appendChild(chatLine);
  }

  createChatLine(chatHistory){
    var chatLine = document.createElement('li');
    var chatText = document.createElement('div');
    chatText.innerText = chatHistory.getName();
    chatText.addEventListener('click', (event) => {
      this.setChatHistory(this.chatList[Array.from(event.path[2].childNodes).indexOf(event.path[1])]);
    });
    chatLine.appendChild(chatText);
    var cmdChatDel = document.createElement('input');
    cmdChatDel.type = 'button';
    cmdChatDel.value = 'Del';
    cmdChatDel.addEventListener('click', (event) => {
      var chatIndex = Array.from(event.path[2].childNodes).indexOf(event.path[1]);
      event.path[2].removeChild(event.path[1]);
      var deletedHistory = this.chatList.splice(chatIndex, 1);
      if (this.chatList.length > 0){
        if(chatIndex >= this.chatList.length) {
          chatIndex = this.chatList.length - 1;
        }
        if(this.chatHistory === deletedHistory[0]){
          this.setChatHistory(this.chatList[chatIndex]);
        }
      }
      else {
        this.addChat();
      }
    });
    chatLine.appendChild(cmdChatDel);
    return chatLine;
  }

}
