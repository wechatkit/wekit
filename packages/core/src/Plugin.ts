import { Wekit } from "./core/Wekit";

export interface Plugin {
  install(ctx: Wekit): void;
  uninstall(): void;
}
