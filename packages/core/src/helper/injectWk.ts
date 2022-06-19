import { deepClone } from "@wekit/shared";
import { Wekit } from "../core/Wekit";

export enum WkType {
  PAGE,
  COMPONENT,
}

export interface WkMeta {
  isPreload: boolean;
  isLoad: boolean;
  isReady: boolean;
  updateData: AnyObject;
  rawSetData: ((data: AnyObject, cb?: () => void) => void) | null;
  dataFactory: () => AnyObject;
  data: AnyObject | null;
  cachePropKeys: string[];
  lock: boolean;
  options: AnyObject;
  instance: AnyObject;
  type: WkType;
  dyListener: { event: string; handler: AnyFunction }[];
  isPreOptimize: false;
}
export interface Wk {
  meta: WkMeta;
  wait(event: string, callback?: AnyFunction): Promise<void>;
  initData(ctx: AnyObject): void;
}

export function injectWk(options: AnyObject, type: WkType) {
  const wekit = Wekit.globalWekit;
  const _data = options.data;
  const dataFactory =
    typeof _data === "function" ? _data : () => deepClone(_data);
  options.data = dataFactory();

  const wk: Wk = {
    meta: {
      isPreload: false,
      isLoad: false,
      isReady: false,
      updateData: {},
      rawSetData: null,
      dataFactory,
      data: options.data,
      cachePropKeys: [],
      lock: false,
      options,
      instance: options,
      type,
      dyListener: [],
      isPreOptimize: false,
    },
    wait(event: string, callback?: AnyFunction) {
      return new Promise((resolve) => {
        if (wk.meta.isReady) {
          callback && callback();
          resolve();
          return;
        }
        const handler = () => {
          callback && callback();
          resolve();
        };
        wk.meta.dyListener.push({ event, handler });
        wekit.pageEventEmitter.on(event, handler);
      });
    },
    initData(ctx) {
      if (!wk.meta.isPreOptimize) {
        return;
      }

      if (!wk.meta.data) {
        wk.meta.data = wk.meta.dataFactory.call(ctx) as any;
      }
      if (!ctx.data || ctx.data !== wk.meta.data) {
        ctx.data = wk.meta.data;
      }
    },
  };

  Object.defineProperty(options, "__wk__", {
    value: function wkFactory() {
      return wk;
    },
    enumerable: true,
    configurable: false,
    writable: false,
  });

  return wk;
}
