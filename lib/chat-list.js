'use babel';

const ChatHistory = require('./chat-history.js');
const ChatListView = require('./chat-list-view.js');

class ChatList {

  constructor(serializedChatList) {
    this.chatList = [];
    if (serializedChatList) {
      for (var serializedChat of serializedChatList){
        this.chatList.push(new ChatHistory(serializedChat));
      }
    }
    if(this.chatList.length == 0) {
      this.chatList.push(new ChatHistory());
    }
    this.view = new ChatListView(this.chatList);
  }

  addChat(){
    var chat = new ChatHistory()
    this.chatList.push(chat);
    this.view.addChat(chat);
    return chat;
  }

  destroy() {
    this.view.destroy();
  }

  getChatList() {
    return this.view.getElement()
  }

  getChat(index) {
    return this.chatList[index];
  }

  getChatByUuid(uuid){
    return this.chatList.find((chat) => chat.getUuid() == uuid);
  }

  getIndex(uuid) {
    return this.chatList.findIndex((chat) => chat.getUuid() == uuid);
  }

  getLength() {
    return this.chatList.length;
  }

  removeChat(index) {
    var chat = this.chatList[index];
    this.view.removeLine(chat.getUuid());
    chat.destroy();
    this.chatList.splice(index, 1);
    if (this.chatList.length == 0) {
      this.addChat();
    }
  }

  removeChatByUuid(uuid){
    this.removeChat();
  }

  serialize() {
    var serializedChatList = [];
    for (var chat of this.chatList) {
      serializedChatList.push(chat.serialize());
    }
    return serializedChatList
  }
}


module.exports = ChatList;
