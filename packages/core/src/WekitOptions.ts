import { Plugin } from "./Plugin";

export interface WekitConfig {
  debug: boolean;
  require: (path: string, cb: (mod: any) => any) => any;
}
export interface WekitOptions {
  plugins: Plugin[];
  config: WekitConfig;
}
