export interface IEvent {
  type: string
}

export default class EventBus {
  private subscribers: Map<string, Array<Function>>;

  constructor() {
    this.subscribers = new Map();
  }

  //Подписка на событие
  subscribe(eventType: string, callback: Function): void {
    if (!this.subscribers.has(eventType)){
      this.subscribers.set(eventType, []);
    }
    this.subscribers.get(eventType)!.push(callback);
  }

  //Отписка от события
  unsubscribe(eventType: string, callback: Function): void {
    if(!this.subscribers.has(eventType)){
      return;
    }
    const subscribers = this.subscribers.get(eventType)!;
    const index = subscribers.indexOf(callback);
    if (index !== -1) {
      subscribers.splice(index, 1);
    }
  }

  //Публикация события
  publish(event: IEvent): void {
    const subscribers = this.subscribers.get(event.type);
    if(subscribers){
      subscribers.forEach((callback) => callback(event));
    }
  }
}