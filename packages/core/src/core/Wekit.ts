import { PluginManager } from "../PluginManager";
import { WekitOptions } from "../WekitOptions";
import { Emitter } from "@wekit/shared";
import { defPage } from "../defPage";
import { injectPreloadEvent } from "../helper/injectPreloadEvent";
import { defComponent } from "../defComponent";

export class Wekit {
  private pluginManager = new PluginManager(this);
  readonly appEventEmitter = new Emitter();
  readonly pageEventEmitter = new Emitter();
  readonly componentEventEmitter = new Emitter();
  private _require!: (path: string, cb: (mod: any) => any) => any;

  constructor(private options: WekitOptions) {
    this.pluginManager.installPlugins(options.plugins || []);
    this._require = options.config.require;
  }

  require(path: string, cb: (mod: any) => any) {
    return this._require(path, cb);
  }

  destroy() {
    this.pluginManager.destroy();
  }

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
