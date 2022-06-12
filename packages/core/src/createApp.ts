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

  wekit.appEventEmitter.emit("onStartUp", options);

  wekit.appEventEmitter.bindListener(options);

  App(options);

  return options;
}
