'use babel';

const ChatRenameView = require('./chat-rename-view.js');

class ChatRename {

  /**
   function constructor()
   constructor of the class
  **/
  constructor() {
    this.view = new ChatRenameView();
  }

  /**
    function setChat(chat)
    set the chat to rename
    @param chat
    chat to rename
  **/
  setChat(chat) {
    this.chat = chat;
    this.view.setChatName(chat.getName());
  }

  /**
    function setChatName()
    modify the name of the chat seted
  **/
  setChatName() {
    this.chat.setName(this.view.getChatName());
  }

  /**
    function getView()
    return the view element
    @return HtmlElement
    the root element of the view
  **/
  getView() {
    return this.view.getElement();
  }


}

module.exports = ChatRename;
