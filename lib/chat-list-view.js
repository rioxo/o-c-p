'use babel';

class ChatListView {

  /**
    function constructor(chatList)
    the constructor of the class
    @param chatList Array<ChatHistory>
    the saved chatList
  **/
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

  /**
    function addChat(chat)
    add a chat to the list
    @param chat ChatHistory
    the chat to add
  **/
  addChat(chat) {
    var chatLine = document.createElement('li');
    chatLine.classList.add('o-c-p');
    chatLine.classList.add('chat-list');
    chatLine.classList.add('line');
    chatLine.id = 'o-c-p_chat-list_line:' + chat.getUuid();
    chatLine.appendChild(chat.getNameElement());
    this.chatUl.appendChild(chatLine);
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
    get the root element
    @return HtmlElement
    the root element
  **/
  getElement() {
    return this.root;
  }

  /**
    function removeLine(uuid)
    remove chat line by uuid
    @param uuid
    the Uuid of the chat
  **/
  removeLine(uuid) {
    var line = document.getElementById('o-c-p_chat-list_line:' + uuid);
    this.chatUl.removeChild(line);
  }
}

module.exports = ChatListView;
