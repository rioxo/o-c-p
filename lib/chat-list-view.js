'use babel';

class ChatListView {
  constructor(chatList) {
    this.root = document.createElement('div');
    this.root.classList.add('o-c-p');
    this.root.classList.add('chat-list');
    this.root.classList.add('root');
    this.chatUl = document.createElement('ul');
    this.chatUl.classList.add('o-c-p');
    this.chatUl.classList.add('chat-list');
    this.chatUl.classList.add('list');
    this.root.appendChild(this.chatUl);

    for (var chat of chatList) {
      this.addChat(chat);
    }
  }

  addChat(chat) {
    var chatLine = document.createElement('li');
    chatLine.classList.add('o-c-p');
    chatLine.classList.add('chat-list');
    chatLine.classList.add('line');
    chatLine.id = 'o-c-p_chat-list_line:' + chat.getUuid();
    chatLine.appendChild(chat.getNameElement());
    this.chatUl.appendChild(chatLine);
  }

  serialize() {
  }

  destroy() {
    this.root.remove();
  }

  getElement() {
    return this.root;
  }

  removeLine(uuid) {
    var line = document.getElementById('o-c-p_chat-list_line:' + uuid);
    this.chatUl.removeChild(line);
  }
}

module.exports = ChatListView;
