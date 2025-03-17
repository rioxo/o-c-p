'use babel';

import OCPView from './o-c-p-view';
import { CompositeDisposable, Disposable } from 'atom';

export default {

  subscriptions: null,
  view: null,

  activate(state) {
    this.subscriptions = new CompositeDisposable(
      atom.workspace.addOpener((uri) => {
        if (uri === 'atom://ocp') {
          this.view = new OCPView(state.oCPViewState);
          this.view.setBusy(this.busyRegistry);
          return this.view;
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

  consumeBusy(registry) {
    this.busyRegistry = registry;
    return new Disposable();
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  serialize() {
    return {
      oCPViewState: this.view.serialize()
    };
  },

  toggle() {
    atom.workspace.toggle('atom://ocp');
  }

};
