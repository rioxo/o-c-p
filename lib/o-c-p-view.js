'use babel';

export default class OCPView {

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('o-c-p');

    // Create message element
    const message = document.createElement('div');
    message.textContent = 'The OCP package is Alive! It\'s ALIVE!';
    message.classList.add('message');
    this.element.appendChild(message);
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
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
