import { Wekit } from "./core/Wekit";
import { injectHookAfter, injectHookBefore } from "@wekit/shared";
import { Wk } from "./core/Wk";
import { multiBindPageHook } from "./utils/multiBindPageHook";
import { wekitBehavior } from "./helper/wekitBehavior";

export type DefPageOptions<
  TData extends AnyObject,
  TCustom extends AnyObject
> = WechatMiniprogram.Page.Options<TData, TCustom> & {
  behaviors: any[];
  onPreload?: (
    options: Record<string, string | undefined>
  ) => void | Promise<void>;
};

export type Noop = () => void;

export function defPage<TData extends AnyObject, TCustom extends AnyObject>(
  options: DefPageOptions<TData, TCustom>
) {
  const wekit = Wekit.globalWekit;

  const wk = new Wk(options, "Page");

  options.behaviors = options.behaviors || [];
  options.behaviors.push(wekitBehavior);

  injectHookBefore(options, "onLoad", (ctx, opts) => {
    wk.lifecycle.set("onUnload", false);
    wk.lifecycle.set("onLoad", true);
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
    wk.emitter.emit("onUnload", ctx);
  });

  multiBindPageHook(
    "pageEventEmitter",
    options,
    wekit.pluginManager.getNeedHook("Page")
  );

  wekit.pageEventEmitter.emit("onInitPage", options);
  Wekit.Page(options);
  return options;
}
