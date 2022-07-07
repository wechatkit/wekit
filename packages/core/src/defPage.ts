import { Wekit } from "./core/Wekit";
import { injectHookAfter, injectHookBefore } from "@wekit/shared";
import { injectSetDataHelper } from "./helper/injectSetdataHelper";
import { injectWk, WkType } from "./helper/injectWk";

export type DefPageOptions<TData, TCustom> = WechatMiniprogram.Page.Options<
  TData,
  TCustom
> & {
  data: () => TData;
  onPreload?: (
    options: Record<string, string | undefined>
  ) => void | Promise<void>;
};

export function defPage<TData extends AnyObject, TCustom extends AnyObject>(
  options: DefPageOptions<TData, TCustom>
) {
  const wekit = Wekit.globalWekit;

  const wk = injectWk(options, WkType.PAGE);

  options.data = wk.meta.data as any;

  const _setData = injectSetDataHelper(options);

  injectHookBefore(options, "onPreload", (ctx, opts) => {
    wk.meta.instance = ctx;
    wk.initData(ctx);
  });

  injectHookBefore(options, "onLoad", (ctx, opts) => {
    wk.lifecycle.onLoad = true;
    wk.initData(ctx);
    wk.initWk(ctx);
  });

  injectHookBefore(options, "onShow", (ctx) => {
    wk.initData(ctx);
    wk.initWk(ctx);
  });

  injectHookBefore(options, "onReady", (ctx) => {
    wk.lifecycle.onReady = true;
    wk.initData(ctx);
    wk.initWk(ctx);
  });

  injectHookAfter(options, "onUnload", (ctx: any) => {
    wk.destroy();
    wekit.pageEventEmitter.emit("onUnload", ctx);
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

  wekit.pageEventEmitter.emit("onInit", options);

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
