export default class EventEmitter {
    constructor() {//constructor method is executed when a new instance of the class is made
      this.listeners = {};
    }
  
    on(message, listener) {
      if (!this.listeners[message]) {
        this.listeners[message] = [];
      }
      this.listeners[message].push(listener);
    }
  
    emit(message, payload = null) {
      if (this.listeners[message]) {
        this.listeners[message].forEach((l) => l(message, payload));
      }
    }
}