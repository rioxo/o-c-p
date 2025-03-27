'use babel';

import OCPView from './o-c-p-view';
import ChatList from './chat-list';
import ChatRename from './chat-rename';
import ChatRenameView from './chat-rename-view';
import OllamaChatConnector from './ollama-chat-connector.js';
import { CompositeDisposable, Disposable } from 'atom';

export default {

  chatList: null,
  chatRename: null,
  ollamaChatConnector: null,
  renamePannel: null,
  subscriptions: null,
  view: null,
  currentChat: "",

  /**
   function activate(state)
   Function to initialise module
   @param state Object
   saved state
  **/
  activate(state) {
    console.log(state)
    // Prepare the instances
    this.ollamaChatConnector = new OllamaChatConnector();
    this.chatList = new ChatList(state.chatList);
    this.chatRename = new ChatRename();
    // Get the chat to show
    if (state.currentChat) {
      this.currentChat = state.currentChat;
    }
    else {
      this.currentChat = this.chatList.getChat(0).getUuid();
    }
    this.renamePannel = atom.workspace.addModalPanel({
      item: this.chatRename.getView(),
      visible: false,
    });
    // Subscribe to the Disposables
    this.subscriptions = new CompositeDisposable(
      atom.workspace.addOpener((uri) => {
        this.view = new OCPView(
          this.chatList,
          this.currentChat,
          this.ollamaChatConnector
        );
        if (uri === 'atom://ocp') {
          return this.view;
        }
      }),
      atom.commands.add("atom-workspace", {
        "o-c-p:delete-chat": (event) => this.deleteChat(event),
        "o-c-p:add-chat": () => this.addChat(),
        "o-c-p:select-chat": (event) => this.selectChat(event),
        "o-c-p:send-message": () => this.sendMessage(),
        "o-c-p:toggle": () => this.toggle(),
        "o-c-p:show-rename": (event) => this.showRename(event),
        "o-c-p:rename": (event) => this.rename(event),
        "o-c-p:hide-rename": () => this.hideRename()
      })
      ,
      new Disposable(() => {
        atom.workspace.getPaneItems().forEach((item) => {
          if(item instanceof OCPView || item instanceof ChatRenameView) {
            item.destroy();
          }
        });
      })
    );
  },

  /**
    function serialize
    save the chatList and the current chat view
    @return Object
    the data to save
  **/
  serialize() {
    return {
      chatList: this.chatList.serialize(),
      currentChat: this.currentChat
    };
  },

  /**
    function deactivate
    function called when we desactivate the module
  **/
  deactivate() {
    this.renamePannel.destroy();
    this.subscriptions.dispose();
    this.chatRename.destroy();
  },

  /**
    function deleteChat(event)
    delete a chat
    @param event Event
    the caller event
  **/
  deleteChat(event) {
    var index = this.chatList.getIndex(event.target.uuid);
    this.chatList.removeChat(index);
    if(this.currentChat == event.target.uuid){
      if (index >= this.chatList.getLength()){
        index = this.chatList.getLength() - 1;
      }
      atom.commands.dispatch(this.chatList.getChat(index).getNameElement(), 'o-c-p:select-chat');
    }
  },

  /**
    function selectChat(event)
    select the chat called
    @param event Event
    the caller event
  **/
  selectChat(event) {
    this.currentChat = event.target.uuid;
    var chat = this.chatList.getChatByUuid(this.currentChat);
    this.view.setChatHistory(chat);
  },

  /**
   function addChat()
   add a new chat
  **/
  addChat() {
    var newChat = this.chatList.addChat();
    atom.commands.dispatch(newChat.getNameElement(), 'o-c-p:select-chat');
  },

  /**
    function sendMessage()
    send a message to the ollama AI Model
  **/
  sendMessage() {
    // get the model name
    var modelName = this.view.getModel();
    if (modelName == '0'){
      // if no model is selected
      atom.notifications.addWarning('Select An Ai model');
    }
    else {
      // if a model is selected
      // get Chat History to add the user message
      var chatHistory = this.chatList.getChatByUuid(this.currentChat);
      chatHistory.addMessage('user', this.view.getMessage());
      // empty the messagebox
      this.view.setMessage("");
      // send the message
      this.ollamaChatConnector.sendMessage(
        chatHistory,
        modelName,
        (chunk) => {
          // read the chunk
          var body = JSON.parse(chunk.toString());
          // add AI message to the history
          chatHistory.addMessage(
            body.message.role,
            body.message.content
          );
        }
      );
    }
  },

  /**
   function toggle()
   toggle the main pannel
  **/
  toggle() {
    atom.workspace.toggle('atom://ocp');
  },

  /**
    function rename(event)
    show the rename pannel
    @param event Event
    the caller event
  **/
  showRename(event) {
    this.chatRename.setChat(this.chatList.getChatByUuid(event.target.uuid));
    this.renamePannel.show();
  },

  /**
    function rename(event)
    rename the chat
    @param event Event
    the caller event
  **/
  rename(event) {
    this.chatRename.setChatName();
    this.renamePannel.hide();
  },

  /**
    function hideRename()
    hide the rename pannel
  **/
  hideRename() {
    this.renamePannel.hide();
  }

};
