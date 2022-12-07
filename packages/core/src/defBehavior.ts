import { injectHookBefore, injectHookAfter } from "@wekit/shared";
import { Wekit } from "./core/Wekit";
import { Wk } from "./core/Wk";
import { multiBindPageHook } from "./utils/multiBindPageHook";

export type DefBehaviorOptions<
  TData extends WechatMiniprogram.Behavior.DataOption,
  TProperty extends WechatMiniprogram.Behavior.PropertyOption,
  TMethod extends WechatMiniprogram.Behavior.MethodOption,
  TCustomInstanceProperty extends AnyObject = {},
  TIsPage extends boolean = false
> = WechatMiniprogram.Component.Options<
  TData,
  TProperty,
  TMethod,
  TCustomInstanceProperty,
  TIsPage
>;

export function defBehavior<
  TData extends WechatMiniprogram.Behavior.DataOption,
  TProperty extends WechatMiniprogram.Behavior.PropertyOption,
  TMethod extends WechatMiniprogram.Behavior.MethodOption,
  TCustomInstanceProperty extends AnyObject = {},
  TIsPage extends boolean = false
>(
  options: DefBehaviorOptions<
    TData,
    TProperty,
    TMethod,
    TCustomInstanceProperty,
    TIsPage
  >
) {
  const wekit = Wekit.globalWekit;

  options.lifetimes = options.lifetimes || {};

  const wk = new Wk(options, "Behavior");

  injectHookBefore(options.lifetimes, "created", (ctx, opts) => {
    wk.lifecycle.set("created", true);
    wk.load(ctx);
    options.created?.call(ctx)
  });

  injectHookBefore(options.lifetimes, "attached", (ctx) => {
    wk.lifecycle.set("detached", false);
    wk.lifecycle.set("attached", true);
    options.attached?.call(ctx)
  });
  injectHookBefore(options.lifetimes, "ready", (ctx) => {
    wk.lifecycle.set("ready", true);
    options.ready?.call(ctx)
  });

  injectHookAfter(options.lifetimes, "detached", (ctx: any) => {
    try { options.detached?.call(ctx) } catch (error) { console.error(error) }
    wk.lifecycle.set("detached", true);
    wk.unload();
  });

  multiBindPageHook(
    "behaviorEventEmitter",
    options.lifetimes,
    wekit.pluginManager.getNeedHook("Behavior")
  );

  wekit.behaviorEventEmitter.emit("onInitBehavior", options);
  return Wekit.Behavior(options);
}
