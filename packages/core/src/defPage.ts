import { Wekit } from "./core/Wekit";
import { injectHookAfter, injectHookBefore } from "@wekit/shared";
import { Wk } from "./core/Wk";
import { callPreload } from "./helper/injectPreloadEvent";
import { defProp } from "./utils/defProp";

export type DefPageOptions<
  TData extends AnyObject,
  TCustom extends AnyObject
> = WechatMiniprogram.Page.Options<TData, TCustom> & {
  onPreload?: (
    options: Record<string, string | undefined>
  ) => void | Promise<void>;
};

export function defPage<TData extends AnyObject, TCustom extends AnyObject>(
  options: DefPageOptions<TData, TCustom>
) {
  const wekit = Wekit.globalWekit;

  const wk = new Wk(options);

  defProp(options, "$getSelf", function $getInstance() {
    return wk.wait("onLoad");
  });

  injectHookBefore(options, "onLoad", (ctx, opts) => {
    wk.lifecycle.set("onUnload", false);
    wk.lifecycle.set("onLoad", true);
    callPreload(ctx);
    wk.load(ctx);
    wk.emitter.emit("onLoad", ctx);
  });

  injectHookBefore(options, "onReady", (ctx) => {
    wk.lifecycle.set("onReady", true);
    wk.emitter.emit("onReady", ctx);
  });

  injectHookBefore(options, "onShow", (ctx) => {
    wk.lifecycle.set("onShow", true);
  });

  injectHookAfter(options, "onUnload", (ctx: any) => {
    wk.lifecycle.set("onUnload", true);
    wk.unload();
  });

  multiBindPageHook(options, [
    "onPreload",
    "onLoad",
    "onReady",
    "onShow",
    "onHide",
    "onPullDownRefresh",
    "onReachBottom",
    "onShareAppMessage",
    "onShareTimeline",
    "onAddToFavorites",
    "onPageScroll",
    "onResize",
    "onTabItemTap",
    "onSaveExitState",
  ]);

  wekit.pageEventEmitter.emit("onCreate", options);
  Page(options);
  return options;
}

function multiBindPageHook(options: any, events: string[]) {
  const wekit = Wekit.globalWekit;
  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    injectHookAfter(options, event, (...args) => {
      wekit.pageEventEmitter.emit(event, ...args);
    });
  }
}
