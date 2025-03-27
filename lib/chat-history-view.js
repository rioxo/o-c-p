'use babel';

class ChatHistoryView {

  /**
    function constructor(history, name, uuid)
    class constructor
    @param history Array
    message history of the chat
    @param name String
    name of the chat
    @param uuid String
    uuid of the chat
  **/
  constructor(history, name, uuid){
    // create the root element
    this.root = document.createElement('div');
    this.root.classList.add('o-c-p');
    this.root.classList.add('chat-history');
    this.root.classList.add('root');
    // prepare message history
    for(var message of history){
      this.addMessage(message.role, message.content);
    }
    // prepare chat line
    this.chatName = document.createElement('div');
    this.chatName.classList.add('o-c-p');
    this.chatName.classList.add('chat-history');
    this.chatName.classList.add('name');
    this.chatName.uuid = uuid;
    this.chatName.innerText = name;
    this.chatName.addEventListener('click', (event) => {
      atom.commands.dispatch(this.chatName, 'o-c-p:select-chat');
    })
  }

  /**
    function destroy()
    Tear down any state and detach
  **/
  destroy() {
    this.root.remove();
  }

  /**
    function addMessage(role, message)
    add a message to the history
    @param role String
    the role os the sender
    @param message String
    the message to show
  **/
  addMessage(role, message){
    // we show the message of the user and assistant
    switch (role) {
      case 'user':
      case 'assistant':
        // create the message block
        var messageBlock = document.createElement('div');
        messageBlock.classList.add('o-c-p');
        messageBlock.classList.add('chat-history');
        messageBlock.classList.add('message');
        messageBlock.classList.add(role);
        // render the markdown
        var html = atom.ui.markdown.render(message, {
          renderMode: "fragment",
          breaks: atom.config.get('markdown-preview.breakOnSingleNewline'),
          useDefaultEmoji: true,
          sanitizeAllowUnknownProtocols: atom.config.get('markdown-preview.allowUnsafeProtocols')
        });
        messageBlock.appendChild(atom.ui.markdown.convertToDOM(html));
        this.root.appendChild(messageBlock);
        break;
      default:
        break;
    }
  }

  /**
    function getElement()
    return the root element
  **/
  getElement(){
    return this.root;
  }

  /**
    function getName()
    return the name of the chat
  **/
  getName() {
    return this.chatName;
  }

  /**
    function setName(name)
    set the name of the chat
    @param name
    the name of the chat
  **/
  setName(name) {
    this.chatName.innerText = name;
  }
}

module.exports = ChatHistoryView;
