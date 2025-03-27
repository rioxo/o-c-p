'use babel';

var http;

export default class OCPView {

  /**
    function constructor(chatList, currentChat, ollamaChatConnector)
    class constructor
    @param chatList ChatList
    List of chat history
    @param currentChat String
    Uuid of the chat to show
    @param ollamaChatConnector OllamaChatConnector
    Connector class with the Ollama server
  **/
  constructor(chatList, currentChat, ollamaChatConnector) {

    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('o-c-p');

    // Create Parameter Block
    var paramBlock = document.createElement('div');
    paramBlock.classList.add('o-c-p');
    paramBlock.classList.add('param-block');
    this.element.appendChild(paramBlock)

    // Create AI List
    this.aiList = document.createElement('select');
    this.aiList.classList.add('o-c-p');
    this.aiList.classList.add('ai-list');
    paramBlock.appendChild(this.aiList)

    // Create No Select
    var noAiOption = document.createElement('option');
    noAiOption.innerText = "Select An AI ...";
    noAiOption.value = 0;
    this.aiList.appendChild(noAiOption);

    // get the AI model tagNames.
    ollamaChatConnector.getTags((chunk) => {
      var body = JSON.parse(chunk.toString());
      for (var model of body.models){
        var modelOption = document.createElement('option');
        modelOption.innerText = model.name;
        modelOption.value = model.name;
        this.aiList.appendChild(modelOption);
      }
    });

    // Create Chat List ChatList
    paramBlock.appendChild(chatList.getChatList());

    // Create history element
    this.historyBlock = document.createElement('div');
    this.historyBlock.classList.add('o-c-p');
    this.historyBlock.classList.add('message-history');
    this.historyBlock.appendChild(chatList.getChatByUuid(currentChat).getElement());
    this.element.appendChild(this.historyBlock);

    // Create communication block
    var messageBlock = document.createElement('div');
    messageBlock.classList.add('o-c-p');
    messageBlock.classList.add('message-block');
    this.element.appendChild(messageBlock);

    // Create message input
    this.messageInput = atom.workspace.buildTextEditor();
    //messageInput.rows = 2;
    this.messageInput.element.classList.add('o-c-p');
    this.messageInput.element.classList.add('message-input');
    this.messageInput.element.id = 'chatMessageInput';
    messageBlock.appendChild(this.messageInput.element);

    // Create send button
    var sendButton = document.createElement('input');
    sendButton.type = 'button';
    sendButton.value = 'send';
    sendButton.classList.add('o-c-p');
    sendButton.classList.add('send-button');
    sendButton.addEventListener('click', () => {
      atom.commands.dispatch(sendButton, 'o-c-p:send-message');
    });
    messageBlock.appendChild(sendButton);
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
    this.element.remove();
  }

  /**
   function getDefaultLocation()
   return the default location of the Pannel
   @return String
   the default location
  **/
  getDefaultLocation() {
    return 'bottom';
  }

  /**
    function getAllowedLocations()
    return the location where the pannel can go
    @return Array<String>
    Allowed location
  **/
  getAllowedLocations() {
    return ['bottom', 'right'];
  }

  /**
    function getTitle()
    return the title of the pannel
    @return String

  **/
  getTitle() {
    return 'Ollama Chat Pannel';
  }

  /**
    function getURI()
    return the URI of the pannel
    @return String
  **/
  getURI(){
    return 'atom://ocp';
  }

  /**
    function getElement()
    return the root element to show
    @return HtmlElement
    the root element
  **/
  getElement() {
    return this.element;
  }

  /**
    function getMessage()
    return the text of the message Input
    @return String
    the text of the message Input
  **/
  getMessage() {
    return this.messageInput.getText();
  }

  /**
    function setMessage(message)
    modify the text of the message Input
    @param message String
    the text at set
  **/
  setMessage(message) {
    this.messageInput.setText(message);
  }

  /**
    function getElement()
    return the name of the selected model
    @return String
    the name of the model
  **/
  getModel() {
    return this.aiList.selectedOptions[0].value;
  }

  /**
    function setChatHistory(history)
    set the chat history to show
    @param history
    the new chat history
  **/
  setChatHistory(history) {
    if (this.historyBlock.childElementCount > 0) {
      for (var child of this.historyBlock.children) {
        this.historyBlock.removeChild(child);
      }
    }
    this.historyBlock.appendChild(history.getElement());
  }

}
