'use babel';

const ChatHistory = require('./chat-history.js');
const ChatListView = require('./chat-list-view.js');

class ChatList {

  /**
    function constructor(serializedChatList)
    Constructor of the class
    @param serializedChatList Array
    chat list saved
  **/
  constructor(serializedChatList) {
    // prepare chat list
    this.chatList = [];
    if (serializedChatList) {
      for (var serializedChat of serializedChatList){
        this.chatList.push(new ChatHistory(serializedChat));
      }
    }
    // if no chat list
    if(this.chatList.length == 0) {
      this.chatList.push(new ChatHistory());
    }
    // prepare the view
    this.view = new ChatListView(this.chatList);
  }

  /**
    function serialize()
    save the chatlist
    @return Array
    the chatlist to save
  **/
  serialize() {
    var serializedChatList = [];
    for (var chat of this.chatList) {
      serializedChatList.push(chat.serialize());
    }
    return serializedChatList
  }

  /**
    function addChat()
    add a chat to the list
    @return ChatHistory
    the new Chat
  **/
  addChat(){
    var chat = new ChatHistory()
    this.chatList.push(chat);
    this.view.addChat(chat);
    return chat;
  }

  /**
    function destroy()
    destroy the view
  **/
  destroy() {
    this.view.destroy();
  }

  /**
    function getChatList()
    return the element view
    @return HtmlElement
    the root element of the view
  **/
  getChatList() {
    return this.view.getElement()
  }

  /**
    function getChat(index)
    get chat by index
    @param index Int
    index of the chat
    @return ChatHistory
    the chat called
  **/
  getChat(index) {
    return this.chatList[index];
  }

  /**
    function getChatByUuid(uuid)
    get chat by uuid
    @param uuid String
    Uuid of the chat
    @return ChatHistory
    the chat called
  **/
  getChatByUuid(uuid){
    return this.chatList.find((chat) => chat.getUuid() == uuid);
  }

  /**
    function getIndex(uuid)
    get Index by Uuid
    @param uuid String
    Uuid of the chat
    @return Int
    the index of the chat
  **/
  getIndex(uuid) {
    return this.chatList.findIndex((chat) => chat.getUuid() == uuid);
  }

  /**
    function getLength()
    get the length of the chatList
    @return Int
    the length of the chatList
  **/
  getLength() {
    return this.chatList.length;
  }

  /**
    function removeChat(index)
    remove the chat by his index
    @param index Int
    the index of the chat
  **/
  removeChat(index) {
    var chat = this.chatList[index];
    this.view.removeLine(chat.getUuid());
    chat.destroy();
    this.chatList.splice(index, 1);
    if (this.chatList.length == 0) {
      this.addChat();
    }
  }

  /**
    function removeChatByUuid(uuid)
    remove chat bu his uuid
    @param uuid String
    the Uuid of the chat
  **/
  removeChatByUuid(uuid){
    this.removeChat(this.getIndex(uuid));
  }
}


module.exports = ChatList;
