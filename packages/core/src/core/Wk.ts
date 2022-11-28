import { callPreload } from "../helper/injectPreloadEvent";
import { Wekit } from "./Wekit";
import { getConstructor } from "../utils/getConstructor";
import { Emitter } from "@wekit/shared";

export const WK = "__wk__";

export class Wk {
  lifecycle = new Map<string, boolean>();

  ctx: any;
  loaded = false;
  unloaded = false;
  emitter = new Emitter();

  constructor(public options: any, public type: "Page" | "Component") {
    options[WK] = () => this;
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
    this.options.is = ctx.is;

    if (this.type === "Page") callPreload(this.options);

    if (this.ctx.is && !Wk.defWkMap.has(this.ctx.is)) {
      Wk.defWkMap.set(this.ctx.is, this);
    }

    injectGlobalMethod(ctx);
  }

  unload() {
    if (this.unloaded) {
      return;
    }

    this.unloaded = true;

    this.ctx = null;
    this.loaded = false;

    this.lifecycle.clear();
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
}

function injectGlobalMethod(ctx: any) {
  const wekit = Wekit.globalWekit;
  if (wekit._isPageMethodInjected) {
    return;
  }
  wekit._isPageMethodInjected = true;

  const constructor = getConstructor(ctx);

  if (constructor) {
    constructor.prototype.$push = function $push(this: any) {
      console.log(this);
    };
    constructor.prototype.$getWk = function $getWk(this) {
      return Wk.get(this);
    };
  }
}
