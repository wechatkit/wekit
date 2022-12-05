import { injectHookAfter, injectHookBefore } from "@wekit/shared";
import { Wekit } from "../core/Wekit";

export function multiBindPageHook(
  type:
    | "pageEventEmitter"
    | "appEventEmitter"
    | "componentEventEmitter"
    | "behaviorEventEmitter",
  options: any,
  events: string[]
) {
  const wekit = Wekit.globalWekit;
  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    const beforeEvent = event;
    const afterEvent = event + "After";
    injectHookBefore(
      options,
      event,
      (...args) => {
        wekit[type].emit(beforeEvent, ...args);
      },
      (err) => {
        wekit[type].emit("onPluginError", err, beforeEvent);
      }
    );
    injectHookAfter(
      options,
      event,
      (...args) => {
        wekit[type].emit(afterEvent, ...args);
      },
      (err) => {
        wekit[type].emit("onPluginError", err, afterEvent);
      }
    );
  }
}
