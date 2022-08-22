import { deepClone, Log } from "@wekit/shared";
import { Wekit } from "../core/Wekit";
import { callPreload } from "./injectPreloadEvent";
import { injectPropProxy } from "./injectPropProxy";

export enum WkType {
  PAGE,
  COMPONENT,
}

export interface WkMeta {
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
  isPreOptimize: boolean;
  isInitWk: boolean;
}
export interface Wk {
  meta: WkMeta;
  lifecycle: {
    onPreload: boolean;
    onLoad: boolean;
    onReady: boolean;
    onUnload: boolean;
  };
  wait(event: string, callback?: AnyFunction): Promise<any>;
  initData(ctx: AnyObject): void;
  initWk(ctx: AnyObject): void;
  destroy(): void;
}

export function injectWk(options: AnyObject, type: WkType) {
  const wekit = Wekit.globalWekit;
  const _data = options.data;
  const dataFactory =
    typeof _data === "function" ? _data : () => deepClone(_data);
  options.data = dataFactory();

  const wk: Wk = {
    meta: {
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
      isInitWk: false,
    },
    lifecycle: {
      onPreload: false,
      onLoad: false,
      onReady: false,
      onUnload: true,
    },
    wait(event: string, callback?: AnyFunction) {
      return new Promise((resolve) => {
        if (wk.lifecycle[event as keyof typeof wk.lifecycle]) {
          callback && callback(wk.meta.instance);
          resolve(wk.meta.instance);
          return;
        }
        const handler = (ctx: any) => {
          callback && callback(ctx);
          resolve(ctx);
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
        ctx._data = wk.meta.data;
        ctx.data = wk.meta.data;
      }
    },
    initWk(ctx) {
      if (wk.meta.isInitWk) {
        return;
      }
      wk.meta.isInitWk = true;
      wk.meta.instance = ctx;
      wk.meta.rawSetData = ctx.constructor.prototype.setData.bind(ctx);
      if (wk.meta.isPreOptimize) {
        const updateData = wk.meta.updateData;
        wk.meta.updateData = {};
        injectPropProxy(ctx, options);
        ctx.setData!(updateData);
      } else {
        (options as any).route = ctx.route; // 解决低版本问题
        options.options = ctx.options; // 解决低版本问题
        callPreload(ctx);
      }
    },

    destroy() {
      const ctx = wk.meta.instance;
      if (wk.meta.isPreOptimize) {
        // wk.meta.cachePropKeys.forEach((key) => {
        //   (options as any)[key] = undefined;
        // });
        (options as any).data = null;
        ctx.data = null;
        ctx._data = null;
        wk.meta.data = null;
        wk.meta.rawSetData = null;
        wk.meta.dyListener.forEach((item) => {
          wekit.pageEventEmitter.off(item.event, item.handler);
        });
        wk.meta.dyListener = [];
      }
      wk.meta.isInitWk = false;
      wk.lifecycle.onPreload = false;
      wk.lifecycle.onLoad = false;
      wk.lifecycle.onReady = false;
      wk.lifecycle.onUnload = true;
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
