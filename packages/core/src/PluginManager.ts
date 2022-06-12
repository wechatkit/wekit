import { Emitter } from "@wekit/shared";
import { Wekit } from "./core/Wekit";
import { Plugin } from "./Plugin";

export class PluginManager {
  private pluginStore = new Set<Plugin>();

  constructor(private ctx: Wekit) {}

  installPlugins(plugins: Plugin[]) {
    plugins.forEach((item) => {
      item.install(this.ctx);
      this.pluginStore.add(item);
    });
  }

  trigger() {}

  destroy() {
    this.pluginStore.forEach((item) => item.uninstall());
  }
}
