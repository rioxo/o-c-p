'use babel';

const ChatRenameView = require('./chat-rename-view.js');

class ChatRename {

  constructor() {
    this.view = new ChatRenameView();
  }

  setChat(chat) {
    this.chat = chat;
    this.view.setChatName(chat.getName());
  }

  setChatName() {
    this.chat.setName(this.view.getChatName());
  }

  getView() {
    return this.view.getElement();
  }


}

module.exports = ChatRename;
