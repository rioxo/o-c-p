'use babel';

import OCPView from './o-c-p-view';
import ChatList from './chat-list';
import ChatRename from './chat-rename';
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

  activate(state) {
    this.ollamaChatConnector = new OllamaChatConnector();
    this.chatList = new ChatList(state.chatList);
    this.chatRename = new ChatRename();
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
    this.subscriptions = new CompositeDisposable(
      atom.workspace.addOpener((uri) => {
        if (uri === 'atom://ocp') {
          this.view = new OCPView(
            this.chatList,
            this.currentChat,
            this.ollamaChatConnector
          );
          return this.view;
        }
      }),
      atom.commands.add("atom-workspace", {
        "o-c-p:delete-chat": (event) => this.deleteChat(event),
        "o-c-p:add-chat": () => this.addChat(),
        "o-c-p:select-chat": (event) => this.selectChat(event),
        "o-c-p:send-message": () => this.sendMessage(),
        "o-c-p:toggle": () => this.toggle(),
        "o-c-p:rename": (event) => this.rename(event),
        "o-c-p:hide-rename": () => this.hideRename()
      })
      ,
      new Disposable(() => {
        atom.workspace.getPaneItems().forEach((item) => {
          if(item instanceof OCPView) {
            item.destroy();
          }
        });
      })
    );
  },

  consumeBusy(registry) {
    this.busyRegistry = registry;
    return new Disposable();
  },

  deactivate() {
    this.renamePannel.destroy();
    this.subscriptions.dispose();
    this.chatRename.destroy();
  },

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

  selectChat(event) {
    this.currentChat = event.target.uuid;
    var chat = this.chatList.getChatByUuid(this.currentChat);
    this.view.setChatHistory(chat);
  },

  addChat() {
    var newChat = this.chatList.addChat();
    atom.commands.dispatch(newChat.getNameElement(), 'o-c-p:select-chat');
  },

  sendMessage() {
    var modelName = this.view.getModel();
    if (modelName == '0'){
      atom.notifications.addWarning('Select An Ai model');
    }
    else {
      var chatHistory = this.chatList.getChatByUuid(this.currentChat);
      chatHistory.addMessage('user', this.view.getMessage());
      this.view.setMessage("");
      this.busyRegistry.begin('o-c-p.sendChat.' + chatHistory.getUuid(), 'Send Message to model AI');
      this.ollamaChatConnector.sendMessage(
        chatHistory,
        modelName,
        (chunk) => {
          var body = JSON.parse(chunk.toString());
          this.busyRegistry.end('o-c-p.sendChat.' + chatHistory.getUuid());
          chatHistory.addMessage(
            body.message.role,
            body.message.content
          );
        }
      );
    }
  },

  serialize() {
    return {
      chatList: this.chatList.serialize(),
      currentChat: this.currentChat
    };
  },

  toggle() {
    atom.workspace.toggle('atom://ocp');
  },

  rename(event) {
    this.chatRename.setChat(this.chatList.getChatByUuid(event.target.uuid));
    this.renamePannel.show();
  },

  hideRename() {
    this.chatRename.setChatName();
    this.renamePannel.hide();
  }

};
