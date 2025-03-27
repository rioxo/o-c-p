'use babel';

class ChatRenameView {

  /**
    function constructor()
    constructor ef the class
  **/
  constructor() {
    // create root element
    this.root = document.createElement('div');
    this.root.classList.add('o-c-p');
    this.root.classList.add('rename');
    this.root.classList.add('root');

    // create chatName element
    this.txtChatName = atom.workspace.buildTextEditor({mini: true});
    this.txtChatName.element.classList.add('o-c-p');
    this.txtChatName.element.classList.add('rename');
    this.txtChatName.element.classList.add('chat-name');
    this.txtChatName.element.id = 'o-c-p_rename_chat-name';
    this.txtChatName.element.addEventListener('keyup', (event) => {
      switch (event.key) {
        case "Enter":
          atom.commands.dispatch(this.txtChatName.element, 'o-c-p:rename');
          break;
        case "Escape":
          atom.commands.dispatch(this.txtChatName.element, 'o-c-p:hide-rename');
          break;
        default:
      }
    })
    this.root.appendChild(this.txtChatName.element);
  }

  /**
    function serialize()
    save the state
  **/
  serialize() {
  }

  /**
    function destroy()
    Tear down any state and detach
  **/
  destroy() {
    this.root.remove();
  }

  /**
    function getElement()
    return element root
    @return HtmlElement
    the root element
  **/
  getElement() {
    return this.root;
  }

  /**
    function setChatName()
    set the text in the text chat element
    @param String
    the text to set
  **/
  setChatName(text) {
    if (!text) {
      text = "";
    }
    this.txtChatName.setText(text);
  }

  /**
    function getChatName()
    return the text in the text chat element
    @return String
    the text of the input
  **/
  getChatName(){
    return this.txtChatName.getText();
  }
}

module.exports = ChatRenameView;
