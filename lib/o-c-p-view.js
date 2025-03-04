'use babel';

export default class OCPView {

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('o-c-p');

    // Create chat element
    var chatBlock = document.createElement('div');
    chatBlock.classList.add('o-c-p');
    chatBlock.classList.add('chat_block');

    // Create history element
    var historyBlock = document.createElement('div');
    historyBlock.id = 'messageHistory';
    historyBlock.classList.add('o-c-p');
    historyBlock.classList.add('message_history');

    // Create communication block
    var messageBlock = document.createElement('div');
    messageBlock.classList.add('o-c-p');
    messageBlock.classList.add('message_block');


    // Create message input
    var messageInput = document.createElement('input');
    messageInput.type = 'textBox';
    messageInput.classList.add('o-c-p');
    messageInput.classList.add('message_input');
    messageBlock.appendChild(messageInput);

    // Create send button
    var sendButton = document.createElement('input');
    sendButton.type = 'button';
    sendButton.value = 'send';
    sendButton.classList.add('o-c-p');
    sendButton.classList.add('send_button');
    messageBlock.appendChild(sendButton);



    // Add chat to root
    chatBlock.appendChild(historyBlock);
    chatBlock.appendChild(messageBlock);
    this.element.appendChild(chatBlock);
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getDefaultLocation() {
    return 'bottom';
  }

  getAllowedLocations() {
    return ['bottom'];
  }

  getTitle() {
    return 'Ollama Chat Pannel';
  }

  getURI(){
    return 'atom://ocp';
  }

  getElement() {
    return this.element;
  }

}
