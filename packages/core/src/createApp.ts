import { injectHookBefore } from "@wekit/shared";
import { Wekit } from "./core/Wekit";
import { injectPropProxy } from "./helper/injectPropProxy";
import { injectSetDataHelper } from "./helper/injectSetdataHelper";
import { injectWk, WkType } from "./helper/injectWk";
import { WekitOptions } from "./WekitOptions";

export type CreateAppOptions<T> = WechatMiniprogram.App.Options<T> &
  WekitOptions;

export function createApp<T extends AnyObject>(options: CreateAppOptions<T>) {
  const wekit = Wekit.create(options);

  const wk = injectWk(options, WkType.APP);

  const _setData = injectSetDataHelper(options);

  injectHookBefore(options, "onLaunch", function (ctx: any) {
    injectPropProxy(ctx, options);
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

  wekit.appEventEmitter.emit("onStartUp", options);

  wekit.appEventEmitter.bindListener(options);

  return options;
}
