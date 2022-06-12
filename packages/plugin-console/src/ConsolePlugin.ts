import { Plugin, Wekit } from "@wekit/core";
import { injectHookBefore } from "@wekit/shared";

export class ConsolePlugin implements Plugin {
  install(ctx: Wekit) {
    console.log(ctx);
    ctx.pageEventEmitter.on("onInit", (wk: any) => {
      const options = wk.meta.options;
      console.log(options);
      const ignoreMethods = [
        "setData",
        "onLoad",
        "onUnload",
        "onShow",
        "onHide",
      ];

      for (const key in options) {
        if (
          !ignoreMethods.includes(key) &&
          typeof options[key] === "function"
        ) {
          injectHookBefore(options, key, (ctx, e) => {
            if (typeof e === "object" && e && e.touches) {
              console.log(key, e);
            }
          });
        }
      }
    });
  }
  uninstall() {
    throw new Error("Method not implemented.");
  }
}
