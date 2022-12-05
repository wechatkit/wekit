import { Wekit } from "./core/Wekit";

export interface Plugin {
  needAppHooks?: string[];
  needPageHooks?: string[];
  needComponentHooks?: string[];
  needBehaviorHooks?: string[];
  install(ctx: Wekit): void;
  uninstall(): void;
}
