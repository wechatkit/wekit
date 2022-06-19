import { Wekit } from "./core/Wekit";
import { injectHookAfter, injectHookBefore } from "@wekit/shared";
import { injectSetDataHelper } from "./helper/injectSetdataHelper";
import { injectPropProxy } from "./helper/injectPropProxy";
import { injectWk, WkType } from "./helper/injectWk";
import { callPreload } from "./helper/injectPreloadEvent";
import { checkInstanceData } from "./utils/checkInstanceData";

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

  injectHookBefore(options, "onPreload", (ctx) => {
    wk.meta.instance = ctx;
    wk.initData(ctx);
  });

  injectHookBefore(options, "onLoad", (ctx) => {
    wk.meta.isLoad = true;
    wk.initData(ctx);
    wk.initWk(ctx);
  });

  injectHookBefore(options, "onShow", (ctx) => {
    wk.initData(ctx);
    wk.initWk(ctx);
  });

  injectHookBefore(options, "onReady", (ctx) => {
    wk.meta.isReady = true;
    wk.initData(ctx);
    wk.initWk(ctx);
  });

  injectHookBefore(options, "onUnload", (ctx: any) => {
    setTimeout(() => {
      // 等所有异步任务完成后执行
      if (wk.meta.isPreOptimize) {
        // wk.meta.cachePropKeys.forEach((key) => {
        //   (options as any)[key] = undefined;
        // });
        (options as any).data = null;
        ctx.data = null;
        ctx._data = null;
        wk.meta.data = null;
      }
      wk.meta.isInitWk = false;
      wk.meta.isPreload = false;
      wk.meta.isLoad = false;
      wk.meta.isReady = false;
      wk.meta.rawSetData = null;
      wk.meta.dyListener.forEach((item) => {
        wekit.pageEventEmitter.off(item.event, item.handler);
      });
      wk.meta.dyListener = [];
    });
  });

  wekit.pageEventEmitter.emit("onInit", options);

  wekit.pageEventEmitter.bindListener(options);

  Page(options);

  return options;
}
