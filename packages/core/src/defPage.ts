import { Wekit } from "./core/Wekit";
import { injectHookAfter, injectHookBefore } from "@wekit/shared";
import { injectSetDataHelper } from "./helper/injectSetdataHelper";
import { injectPropProxy } from "./helper/injectPropProxy";
import { injectWk, WkType } from "./helper/injectWk";
import { callPreload } from "./helper/injectPreloadEvent";

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

  wekit.pageEventEmitter.emit("onInit", options);

  injectHookBefore(options, "onPreload", function() {
    if (!wk.meta.isInitData)
      options.data = wk.meta.dataFactory.call(options) as any;
  });

  injectHookBefore(options, "onLoad", function(ctx: any) {
    (options as any).route = ctx.route; // 解决低版本问题
    (options as any).options = ctx.options; // 解决低版本问题
    injectPropProxy(ctx, options);
    callPreload(options);
    ctx.data = options.data;
    ctx.__data__ = options.data;
    const updateData = wk.meta.updateData;
    wk.meta.updateData = {};
    ctx.setData(updateData);
    wk.meta.rawSetData = ctx.setData.bind(ctx);
    Object.defineProperty(ctx, "setData", {
      value: _setData,
      writable: true,
      enumerable: true,
      configurable: true,
    });
  });

  injectHookAfter(options, "onUnload", function(ctx: any) {
    wk.meta.isPreload = false;
    wk.meta.updateData = {};
    wk.meta.rawSetData = null;
    wk.meta.isInitData = false;
    options.data = null as any;
    ctx.data = null;
  });

  wekit.pageEventEmitter.bindListener(options);

  Page(options);

  return options;
}
