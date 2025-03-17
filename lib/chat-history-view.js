'use label';

class ChatHistoryView {
  constructor(history){
    this.element = document.createElement('div');
    this.element.classList.add('o-c-p');
    this.element.classList.add('chat_history');
    for(var message of history){
      this.addMessage(message.role, message.content);
    }
  }

  addMessage(role, message){
    switch (role) {
      case 'user':
      case 'assistant':
        var messageBlock = document.createElement('div');
        messageBlock.classList.add('o-c-p');
        messageBlock.classList.add('message_history');
        messageBlock.classList.add(role);
        var html = atom.ui.markdown.render(message, {
          renderMode: "fragment",
          breaks: atom.config.get('markdown-preview.breakOnSingleNewline'),
          useDefaultEmoji: true,
          sanitizeAllowUnknownProtocols: atom.config.get('markdown-preview.allowUnsafeProtocols')
        });
        messageBlock.appendChild(atom.ui.markdown.convertToDOM(html));
        this.element.appendChild(messageBlock);
        break;
      default:
        break;
    }
  }

  getElement(){
    return this.element
  }
}

module.exports = ChatHistoryView;
