import { Plugin } from "./Plugin";

export interface WekitConfig {
  require: (path: string, cb: (mod: any) => any) => any;
  debug?: boolean;
  forceFlushView?: boolean;
}
export interface WekitOptions {
  plugins: Plugin[];
  config: WekitConfig;
}
