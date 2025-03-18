'use babel';

class ChatHistoryView {
  constructor(history, name, uuid){
    this.root = document.createElement('div');
    this.root.classList.add('o-c-p');
    this.root.classList.add('chat-history');
    this.root.classList.add('root');
    for(var message of history){
      this.addMessage(message.role, message.content);
    }
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

  // Tear down any state and detach
  destroy() {
    this.root.remove();
  }

  addMessage(role, message){
    switch (role) {
      case 'user':
      case 'assistant':
        var messageBlock = document.createElement('div');
        messageBlock.classList.add('o-c-p');
        messageBlock.classList.add('chat-history');
        messageBlock.classList.add('message');
        messageBlock.classList.add(role);
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

  getElement(){
    return this.root;
  }

  getName() {
    return this.chatName;
  }

  setName(name) {
    this.chatName.innerText = name;
  }
}

module.exports = ChatHistoryView;
