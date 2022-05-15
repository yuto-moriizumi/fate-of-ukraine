export class Observable<T> {
  private value!: T;
  private observers = new Set<(val: T) => void>();

  constructor(initial?: T) {
    if (initial) this.val = initial;
  }

  public get val() {
    return this.value;
  }
  public set val(val: T) {
    this.value = val;
    this.observers.forEach((observer) => observer(val));
  }
  public addObserver(observer: (val: T) => void) {
    this.observers.add(observer);
  }
  public removeObserver(observer: (val: T) => void) {
    this.observers.delete(observer);
  }
}
