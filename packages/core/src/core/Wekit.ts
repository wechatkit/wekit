import { PluginManager } from "../PluginManager";
import { WekitOptions } from "../WekitOptions";
import {
  getGlobalScope,
  Constructor,
  Emitter,
  injectPreloadEvent,
} from "@wekit/shared";
import { defPage } from "../defPage";

export class Wekit {
  private pluginManager = new PluginManager(this);
  readonly appEventEmitter = new Emitter();
  readonly pageEventEmitter = new Emitter();
  readonly componentEventEmitter = new Emitter();

  constructor(private options: WekitOptions) {
    this.pluginManager.installPlugins(options.plugins);
  }

  destroy() {
    this.pluginManager.destroy();
  }

  static globalWekit: Wekit;

  static create(options: WekitOptions) {
    const wekit = new Wekit(options);

    Wekit.globalWekit = wekit;

    // if (!getGlobalScope().Wekit) {
    //   Object.defineProperty(getGlobalScope(), "Wekit", {
    //     value: Wekit,
    //     writable: false,
    //     configurable: false,
    //     enumerable: true,
    //   });
    // }

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

    return wekit;
  }
}
