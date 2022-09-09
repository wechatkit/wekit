import { injectHookBefore, injectHookAfter } from "@wekit/shared";
import { Wekit } from "./core/Wekit";
import { Wk } from "./core/Wk";

export type DefComponentOptions<
  TData extends WechatMiniprogram.Component.DataOption,
  TProperty extends WechatMiniprogram.Component.PropertyOption,
  TMethod extends WechatMiniprogram.Component.MethodOption,
  TCustomInstanceProperty extends AnyObject = {},
  TIsPage extends boolean = false
> = WechatMiniprogram.Component.Options<
  TData,
  TProperty,
  TMethod,
  TCustomInstanceProperty,
  TIsPage
>;

export function defComponent<
  TData extends WechatMiniprogram.Component.DataOption,
  TProperty extends WechatMiniprogram.Component.PropertyOption,
  TMethod extends WechatMiniprogram.Component.MethodOption,
  TCustomInstanceProperty extends AnyObject = {},
  TIsPage extends boolean = false
>(
  options: DefComponentOptions<
    TData,
    TProperty,
    TMethod,
    TCustomInstanceProperty,
    TIsPage
  >
) {
  const wekit = Wekit.globalWekit;

  options.lifetimes = options.lifetimes || {};

  const wk = new Wk(options);

  injectHookBefore(options.lifetimes, "created", (ctx, opts) => {
    wk.lifecycle.set("created", true);
    wk.load(ctx);
  });

  injectHookBefore(options.lifetimes, "attached", (ctx) => {
    wk.lifecycle.set("detached", false);
    wk.lifecycle.set("attached", true);
  });
  injectHookBefore(options.lifetimes, "ready", (ctx) => {
    wk.lifecycle.set("ready", true);
  });

  injectHookBefore(options.lifetimes, "moved", (ctx) => {
    wk.lifecycle.set("moved", true);
  });

  injectHookAfter(options.lifetimes, "detached", (ctx: any) => {
    wk.lifecycle.set("detached", true);
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
  Component(options);
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
