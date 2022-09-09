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

  load(ctx: any) {
    this.unloaded = false;
    if (this.loaded) {
      return;
    }
    this.loaded = true;
    this.ctx = ctx;
    this.rawSetData = ctx.setData.bind(ctx);

    injectSetDataHelper(ctx);
    injectGlobalMethod(ctx);
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
  }

  static get(ctx: any): Wk {
    return ctx[WK]();
  }
}

function injectGlobalMethod(ctx: any) {
  const constructor = getConstructor(ctx);
  const wekit = Wekit.globalWekit;

  if (constructor) {
    // constructor.prototype.$getInstance = function(this: any) {
    //   return this;
    // };
  }
}
