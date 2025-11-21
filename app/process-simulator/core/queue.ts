export default class Queue<T> {
  items: T[] = [];

  constructor() {
    this.items = [];
  }

  enqueue(element: T) {
    this.items.push(element);
  }

  dequeue() {
    return this.isEmpty() ? null : this.items.shift() as T;
  }

  peek() {
    return this.isEmpty() ? null : this.items[0];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }
}
