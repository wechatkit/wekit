import { callPreload } from "../helper/injectPreloadEvent";
import { injectSetDataHelper } from "../helper/injectSetdataHelper";
import { Wekit } from "./Wekit";
import { getConstructor } from "../utils/getConstructor";
import { Emitter } from "@wekit/shared";

export const WK = "__wk__";

export class Wk {
  lifecycle = new Map<string, boolean>();

  lock: boolean = false;
  updateData: AnyObject = {};
  rawSetData: any;
  updateCallbacks: any[] = [];

  fragmentSetQueues = new Map<string, Set<Promise<undefined>>>();
  prevValueMap = new Map<string, any>();

  ctx: any;
  options: any;
  loaded = false;
  unloaded = false;
  emitter = new Emitter();

  constructor(options: any) {
    options[WK] = () => this;
    this.options = options;
  }

  wait(event: string) {
    return new Promise((resolve) => {
      if (this.lifecycle.get(event)) {
        resolve(this.ctx);
      } else {
        const handler = (ctx: any) => resolve(ctx);
        this.emitter.once(event, handler);
      }
    });
  }

  getSelf() {
    return this.wait("onLoad");
  }

  load(ctx: any) {
    this.unloaded = false;
    if (this.loaded) {
      return;
    }
    this.loaded = true;
    this.ctx = ctx;
    this.rawSetData = ctx.setData.bind(ctx);

    if (ctx.route && !Wk.defWkMap.has(ctx.route)) {
      Wk.defWkMap.set(ctx.route, this);
    }

    injectSetDataHelper(ctx);
    injectGlobalMethod(ctx);

    // if (ctx?.config?.isTab) {
    //   Wk.tabPages.set(ctx.route, ctx);
    // } else {
    //   Wk.pageStack.add(ctx.route, ctx);
    // }
  }

  unload() {
    if (this.unloaded) {
      return;
    }
    this.unloaded = true;

    this.ctx = null;
    this.loaded = false;

    this.updateCallbacks = [];
    this.updateData = {};
    this.rawSetData = null;
    this.lock = false;

    this.lifecycle.clear();
    this.fragmentSetQueues.forEach((set) => set?.clear());
    this.fragmentSetQueues.clear();
  }

  static get(ctx: any): Wk | undefined {
    if (!ctx) {
      return undefined;
    }
    if (!ctx[WK]) {
      return undefined;
    }
    return ctx[WK]();
  }

  static defWkMap = new Map<string, any>();
  static pageStack: Set<any>[] = [];
  static tabPages: Map<any, any> = new Map();
}

function injectGlobalMethod(ctx: any) {
  const wekit = Wekit.globalWekit;
  if (wekit._isPageMethodInjected) {
    return;
  }
  wekit._isPageMethodInjected = true;

  const constructor = getConstructor(ctx);

  if (constructor) {
    constructor.prototype.$push = async function $set(
      this: any,
      key: string,
      value: any
    ) {
      const wk = Wk.get(this);
      if (!wk) {
        return;
      }
      if (Array.isArray(value)) {
        const queue = wk.fragmentSetQueues.get(key) || new Set();
        if (!wk.fragmentSetQueues.has(key)) {
          wk.fragmentSetQueues.set(key, queue);
        }

        await Promise.all(queue);

        let deno: AnyFunction = () => null;
        const p = new Promise<undefined>((resolve) => {
          deno = resolve;
        });
        queue.add(p);

        if (this.data[key].length === 0) {
          await this.setData({
            [key]: value.length ? [value[0]] : [],
          });
          for (let i = 1; i < value.length; i++) {
            if (wk.unloaded) {
              deno();
              queue.delete(p);
              return;
            }
            await this.setData({ [`${key}[${i}]`]: value[i] });
          }
        } else {
          const setObj: any = {};
          const oldLen = this.data[key].length;
          for (let i = 0; i < value.length; i += 2) {
            for (let j = 0; j < 2; j++) {
              if (!value[i + j]) {
                break;
              }
              setObj[`${key}[${i + j + oldLen}]`] = value[i + j];
            }
          }
          await this.setData(setObj);
        }
        deno();
        queue.delete(p);
      } else {
        await this.setData({ [key]: value });
      }
    };
  }
}

function sleep(interval: number) {
  return new Promise((resolve) => setTimeout(resolve, interval));
}
