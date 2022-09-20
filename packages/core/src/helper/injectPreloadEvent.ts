import { injectHookBefore } from "@wekit/shared";
import { Log } from "@wekit/shared";
import { queryParse } from "@wekit/shared";
import { Wekit } from "../core/Wekit";
import { WK, Wk } from "../core/Wk";

export function injectPreloadEvent(type: any) {
  const wekit = Wekit.globalWekit;
  injectHookBefore(wx, type, function(_, opts) {
    let [path, query] = opts.url.split("?");
    const route = path.substring(1);
    const wk = Wk.defWkMap.get(route);
    if (wk) {
      const mod = wk.options;
      if (query) mod.options = queryParse(query);
      mod.route = route;
      return callPreload(mod);
    }
    wekit.require(path, (mod) => {
      wekit.wxSupport.requireCb = true;
      if (mod && Wk.get(mod)) {
        if (query) mod.options = queryParse(query);
        mod.route = route;
        callPreload(mod);
      }
    });
  });
}

export function callPreload(ctx: any) {
  const wk = Wk.get(ctx);
  if (!wk) {
    Log.warn("onPreload", ctx.route, "not found WK");
    return false;
  }
  try {
    if (wk.lifecycle.get("onPreload")) {
      return false;
    }
    wk.lifecycle.set("onPreload", true);
    Log.info("onPreload", ctx.route);
    ctx.onPreload && ctx.onPreload.call(null, ctx.options, wk);
  } catch (error) {
    Log.error(ctx.route, "onPreload call", error);
  }
  return true;
}
