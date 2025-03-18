'use babel';

class ChatRenameView {
  constructor() {
    this.root = document.createElement('div');
    this.root.classList.add('o-c-p');
    this.root.classList.add('rename');
    this.root.classList.add('root');

    this.txtChatName = document.createElement('input');
    this.txtChatName.classList.add('o-c-p');
    this.txtChatName.classList.add('rename');
    this.txtChatName.classList.add('chat-name');
    this.txtChatName.id = 'o-c-p_rename_chat-name';
    this.txtChatName.addEventListener('keyup', (event) => {
      if(event.key == "Enter"){
        atom.commands.dispatch(this.txtChatName, 'o-c-p:hide-rename');
      }
    })
    this.root.appendChild(this.txtChatName);

  }

  serialize() {

  }

  destroy() {
    this.root.remove();
  }

  getElement() {
    return this.root;
  }

  setChatName(text) {
    this.txtChatName.value = text;
  }

  getChatName(){
    return this.txtChatName.value;
  }
}

module.exports = ChatRenameView;
