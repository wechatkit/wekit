import { injectHookBefore } from "@wekit/shared";
import { Wekit } from "./core/Wekit";
import { injectPropProxy } from "./helper/injectPropProxy";
import { injectSetDataHelper } from "./helper/injectSetdataHelper";
import { injectWk, WkType } from "./helper/injectWk";

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

  const wk = injectWk(options, WkType.COMPONENT);

  options.data = wk.meta.dataFactory.call(options) as any;

  const _setData = injectSetDataHelper(options);

  injectHookBefore<any>(options.lifetimes, "attached", function (ctx: any) {
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

  injectHookBefore<any>(options.lifetimes, "detached", function (ctx: any) {
    wk.meta.updateData = {};
    wk.meta.rawSetData = null;
    wk.meta.isInitData = false;
    options.data = null as any;
    ctx.data = null;
  });

  wekit.pageEventEmitter.bindListener(options);
  return options;
}
