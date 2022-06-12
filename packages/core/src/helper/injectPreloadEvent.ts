import { injectHookBefore } from "@wekit/shared";
import { Log } from "@wekit/shared";
import { queryParse } from "@wekit/shared";
import { wxRequire } from "./injectWxRequire";

export function injectPreloadEvent(type: any) {
  injectHookBefore(wx, type, function (_, opts) {
    let [path, query] = opts.url.split("?");
    wxRequire(path, (ctx) => {
      if (ctx && ctx.__wk__) {
        ctx.options = queryParse(query);
        ctx.route = path.substring(1);
        callPreload(ctx);
      }
    });
  });
}

export function callPreload(ctx: any) {
  const wk = ctx.__wk__();
  try {
    if (wk.meta.isPreload) {
      return;
    }
    Log.info("load", ctx.route);
    wk.meta.isPreload = true;
    ctx.onPreload.call(ctx, ctx.options);
  } catch (error) {
    Log.error(ctx.route, "onPreload call", error);
  }
}
