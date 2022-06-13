import { injectHookBefore } from "./injectHook";
import { FunctionArgs } from "./type-tools";

export const createEvent = <Payload>(event: string) =>
  (event as unknown) as Payload;

export class Emitter {
  private eventMap = new Map<any, Set<AnyFunction>>();

  on<E = AnyObject>(event: string | E, eventCb: E) {
    let events = this.eventMap.get(event);
    if (!events) {
      events = new Set();
      this.eventMap.set(event, events);
    }
    events.add((eventCb as unknown) as AnyFunction);
    return this;
  }

  off<E = AnyObject>(event: string | E, eventCb: E) {
    const events = this.eventMap.get(event);
    if (events) {
      events.delete((eventCb as unknown) as AnyFunction);
    }
    return this;
  }

  emit<E = AnyObject, T = unknown>(
    event: string | E,
    ...args: FunctionArgs<E> | T[]
  ) {
    const events = this.eventMap.get(event);
    if (events) {
      events.forEach((eventCb) => eventCb(...args));
    }
    return this;
  }

  destroy() {
    this.eventMap.clear();
  }

  getEventNames() {
    return Array.from(this.eventMap.keys());
  }

  bindListener<T>(options: T) {
    this.getEventNames().forEach((name) => {
      injectHookBefore(options, name, (...args) => this.emit(name, ...args));
    });
  }
}
