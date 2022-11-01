import { Wekit } from "./core/Wekit";
import { injectHookAfter, injectHookBefore } from "@wekit/shared";
import { Wk } from "./core/Wk";
import { callPreload } from "./helper/injectPreloadEvent";
import { defProp } from "./utils/defProp";
import { multiBindPageHook } from "./utils/multiBindPageHook";

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

  multiBindPageHook(
    "pageEventEmitter",
    options,
    wekit.pluginManager.getNeedHook("Page")
  );

  wekit.pageEventEmitter.emit("onInitPage", options);
  Page(options);
  return options;
}
