import { PluginManager } from "../PluginManager";
import { WekitOptions } from "../WekitOptions";
import { calcRelativePath, Emitter, getCurrentPage, Log } from "@wekit/shared";
import { defPage } from "../defPage";
import { injectPreloadEvent } from "../helper/injectPreloadEvent";
import { defComponent } from "../defComponent";

export class Wekit {
  private pluginManager = new PluginManager(this);
  readonly appEventEmitter = new Emitter();
  readonly pageEventEmitter = new Emitter();
  readonly componentEventEmitter = new Emitter();
  private _require!: (path: string, cb: (mod: any) => any) => any;

  constructor(public options: WekitOptions) {
    this.pluginManager.installPlugins(options.plugins || []);
    this._require = options.config.require;
    try {
      Promise.resolve();
    } catch (_) {
      Wekit.support.Promise = false;
    }
  }

  require(path: string, cb: (mod: any) => any) {
    const curPage = getCurrentPage();
    if (curPage) {
      path = calcRelativePath(curPage.is, path);
    }
    try {
      Log.info(path, "require");
      return this._require(path, cb);
    } catch (error) {
      Log.warn(path, "require", error);
    }
  }

  destroy() {
    this.pluginManager.destroy();
  }

  static support = {
    Promise: true,
  };

  static globalWekit: Wekit;

  static create(options: WekitOptions) {
    const wekit = new Wekit(options);

    Wekit.globalWekit = wekit;

    injectPreloadEvent("switchTab");
    injectPreloadEvent("reLaunch");
    injectPreloadEvent("redirectTo");
    injectPreloadEvent("navigateTo");

    Object.defineProperty(wx, "defPage", {
      value: defPage,
      writable: false,
      configurable: false,
      enumerable: true,
    });

    Object.defineProperty(wx, "defComponent", {
      value: defComponent,
      writable: false,
      configurable: false,
      enumerable: true,
    });

    return wekit;
  }
}
