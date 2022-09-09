import { Wekit } from "./core/Wekit";
import { WekitOptions } from "./WekitOptions";

export type CreateAppOptions<
  T extends AnyObject
> = WechatMiniprogram.App.Options<T> & WekitOptions;

export function createApp<T extends AnyObject>(options: CreateAppOptions<T>) {
  const wekit = Wekit.create(options);

  wekit.appEventEmitter.emit("onStartUp", options);

  wekit.appEventEmitter.bindListener(options);

  App(options);

  return options;
}
