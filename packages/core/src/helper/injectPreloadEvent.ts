import { injectHookBefore } from "@wekit/shared";
import { Log } from "@wekit/shared";
import { queryParse } from "@wekit/shared";
import { Wekit } from "../core/Wekit";
import { getWk } from "../utils/getWk";

export function injectPreloadEvent(type: any) {
  const wekit = Wekit.globalWekit;
  injectHookBefore(wx, type, function(_, opts) {
    let [path, query] = opts.url.split("?");
    wekit.require(path, (ctx) => {
      if (ctx && ctx.__wk__) {
        const wk = ctx.__wk__();
        wk.meta.isPreOptimize = true;
        ctx.options = queryParse(query);
        ctx.route = path.substring(1);
        callPreload(ctx);
      }
    });
  });
}

export function callPreload(ctx: any) {
  const wk = getWk(ctx);
  try {
    if (wk.meta.isPreload) {
      return false;
    }
    Log.info("load", ctx.route);
    wk.meta.isPreload = true;
    ctx.onPreload.call(ctx, ctx.options);
  } catch (error) {
    Log.error(ctx.route, "onPreload call", error);
  }
  return true;
}
