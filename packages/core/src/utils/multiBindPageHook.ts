import { injectHookAfter } from "@wekit/shared";
import { Wekit } from "../core/Wekit";

export function multiBindPageHook(options: any, events: string[]) {
  const wekit = Wekit.globalWekit;
  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    injectHookAfter(options, event, (...args) => {
      wekit.pageEventEmitter.emit(event, ...args);
    });
  }
}
