'use babel';

import OCPView from './o-c-p-view';
import { CompositeDisposable, Disposable } from 'atom';

export default {

  subscriptions: null,

  activate(state) {
    this.subscriptions = new CompositeDisposable(
      atom.workspace.addOpener((uri) => {
        if (uri === 'atom://ocp') {
          return new OCPView(state.oCPViewState);
        }
      }),
      atom.commands.add("atom-workspace", {
        "o-c-p:toggle": () => this.toggle(),
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

  deactivate() {
    this.subscriptions.dispose();
  },

  toggle() {
    console.log('OCP was toggled!');
    atom.workspace.toggle('atom://ocp');
  }

};
