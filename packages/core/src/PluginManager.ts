import { Wekit } from "./core/Wekit";
import { Plugin } from "./Plugin";

export class PluginManager {
  private needAppHooks = new Set<string>();
  private needPageHooks = new Set<string>();
  private needComponentHooks = new Set<string>();
  private pluginStore = new Set<Plugin>();

  constructor(private ctx: Wekit) {}

  installPlugins(plugins: Plugin[]) {
    plugins.forEach((item) => {
      if (Array.isArray(item.needAppHooks))
        item.needAppHooks.forEach((hook) => this.needAppHooks.add(hook));
      if (Array.isArray(item.needPageHooks))
        item.needPageHooks.forEach((hook) => this.needPageHooks.add(hook));
      if (Array.isArray(item.needComponentHooks))
        item.needComponentHooks.forEach((hook) =>
          this.needComponentHooks.add(hook)
        );
      item.install(this.ctx);
      this.pluginStore.add(item);
    });
  }

  getNeedPageHooks() {
    return Array.from(this.needPageHooks);
  }

  getNeedComponentHooks() {
    return Array.from(this.needComponentHooks);
  }

  getNeedAppHooks() {
    return Array.from(this.needAppHooks);
  }

  destroy() {
    this.pluginStore.forEach((item) => item.uninstall());
  }
}
