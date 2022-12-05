import { Wekit } from "./core/Wekit";
import { Plugin } from "./Plugin";

export type NeedType = "App" | "Page" | "Component" | "Behavior";

export class PluginManager {
  private pluginStore = new Set<Plugin>();
  private needMetaMap = new Map<
    string,
    { map: Map<string, boolean>; keys: string[] | undefined }
  >();

  constructor(private ctx: Wekit) {}

  installPlugins(plugins: Plugin[]) {
    plugins.forEach((item) => {
      item.needAppHooks?.forEach((hook) => {
        this.setNeedHook("App", hook);
      });
      item.needPageHooks?.forEach((hook) => {
        this.setNeedHook("Page", hook);
      });
      item.needComponentHooks?.forEach((hook) => {
        this.setNeedHook("Component", hook);
      });

      item.install(this.ctx);
      this.pluginStore.add(item);
    });
  }

  isNeedHook(type: NeedType, hook: string) {
    const hookMap = this.needMetaMap.get(type);
    if (!hookMap) {
      return false;
    }
    if (!hookMap.map) {
      return false;
    }
    return hookMap.map.has(hook);
  }

  getNeedHook(type: NeedType) {
    const hookMap = this.needMetaMap.get(type);
    if (!hookMap) {
      return [];
    }

    if (!hookMap.keys) {
      hookMap.keys = Array.from(hookMap.map.keys());
    }

    return hookMap.keys;
  }

  setNeedHook(type: NeedType, hook: string) {
    let hookMap = this.needMetaMap.get(type);
    if (!hookMap) {
      hookMap = {
        map: new Map(),
        keys: undefined,
      };
      this.needMetaMap.set(type, hookMap);
    }
    hookMap.map.set(hook, true);
  }

  destroy() {
    this.pluginStore.forEach((item) => item.uninstall());
  }
}
