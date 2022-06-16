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

  options.data = wk.meta.dataFactory.call(options) as any;

  const _setData = injectSetDataHelper(options);

  injectHookBefore(options, "onPreload", (ctx: any) => {
    wk.meta.instance = ctx;
    if (!wk.meta.isInitData)
      options.data = wk.meta.dataFactory.call(ctx) as any;
  });

  injectHookBefore(options, "onLoad", (ctx: any) => {
    wk.meta.isLoad = true;
    wk.meta.instance = ctx;
    wk.meta.rawSetData = ctx.constructor.prototype.setData.bind(ctx);
    if (wk.meta.isPreOptimize) {
      ctx.__data__ = options.data;
      const updateData = wk.meta.updateData;
      wk.meta.updateData = {};
      injectPropProxy(ctx, options);
      checkInstanceData(ctx, options);
      wk.meta.rawSetData!(updateData);
    } else {
      (options as any).route = ctx.route; // 解决低版本问题
      options.options = ctx.options; // 解决低版本问题
      callPreload(ctx);
    }
  });

  injectHookBefore(options, "onReady", () => {
    wk.meta.isReady = true;
  });

  injectHookAfter(options, "onUnload", (ctx: any) => {
    if (wk.meta.isPreOptimize) {
      wk.meta.cachePropKeys.forEach((key) => {
        (options as any)[key] = undefined;
      });
      wk.meta.isInitData = false;
      (options as any).data = null;
      ctx.__data__ = null;
    }
    wk.meta.dyListener.forEach((item) => {
      wekit.pageEventEmitter.off(item.event, item.handler);
    });
    wk.meta.dyListener = [];
    wk.meta.isPreload = false;
    wk.meta.isLoad = false;
    wk.meta.isReady = false;
    wk.meta.rawSetData = null;
  });

  wekit.pageEventEmitter.emit("onInit", options);

  wekit.pageEventEmitter.bindListener(options);

  Page(options);

  return options;
}
