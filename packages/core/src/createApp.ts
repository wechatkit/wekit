import { Wekit } from "./core/Wekit";
import { multiBindPageHook } from "./utils/multiBindPageHook";
import { WekitOptions } from "./WekitOptions";

export type CreateAppOptions<
  T extends AnyObject
> = WechatMiniprogram.App.Options<T> & WekitOptions;

export function createApp<T extends AnyObject>(options: CreateAppOptions<T>) {
  const wekit = Wekit.create(options);

  multiBindPageHook(
    "appEventEmitter",
    options,
    wekit.pluginManager.getNeedHook("App")
  );

  wekit.appEventEmitter.emit("onInitApp", options);

  App(options);

  return options;
}
