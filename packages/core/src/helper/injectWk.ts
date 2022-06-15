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
  isInitData: boolean;
  cachePropKeys: string[];
  lock: boolean;
  instance: AnyObject;
  type: WkType;
  dyListener: { event: string; handler: AnyFunction }[];
}
export interface Wk {
  meta: WkMeta;
  wait(event: string, callback?: AnyFunction): Promise<void>;
}

export function injectWk(options: AnyObject, type: WkType) {
  const wekit = Wekit.globalWekit;
  const _data =
    typeof options.data === "function" ? deepClone(options.data) : options.data;
  const dataFactory =
    typeof options.data === "function" ? options.data : () => deepClone(_data);

  const wk: Wk = {
    meta: {
      isPreload: false,
      isLoad: false,
      isReady: false,
      updateData: {},
      rawSetData: null,
      dataFactory: dataFactory,
      isInitData: true,
      cachePropKeys: [],
      lock: false,
      instance: options,
      type,
      dyListener: [],
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
