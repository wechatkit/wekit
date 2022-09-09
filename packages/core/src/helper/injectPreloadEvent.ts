import { injectHookBefore } from "@wekit/shared";
import { Log } from "@wekit/shared";
import { queryParse } from "@wekit/shared";
import { Wekit } from "../core/Wekit";
import { Wk } from "../core/Wk";

export function injectPreloadEvent(type: any) {
  const wekit = Wekit.globalWekit;
  injectHookBefore(wx, type, function(_, opts) {
    let [path, query] = opts.url.split("?");
    wekit.require(path, (mod) => {
      wekit.wxSupport.requireCb = true;
      if (mod && mod.__wk__) {
        if (query) mod.options = queryParse(query);
        mod.route = path.substring(1);
        callPreload(mod);
      }
    });
  });
}

export function callPreload(ctx: any) {
  const wk = Wk.get(ctx);
  try {
    if (wk.lifecycle.get("onPreload")) {
      return false;
    }
    wk.lifecycle.set("onPreload", true);
    Log.info("load", ctx.route);
    ctx.onPreload && ctx.onPreload.call(null, ctx.options);
  } catch (error) {
    Log.error(ctx.route, "onPreload call", error);
  }
  return true;
}
