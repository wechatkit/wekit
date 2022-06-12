import { injectHookBefore } from "./injectHook";
import { Log } from "./Log";
import { queryParse } from "./queryParse";
import { wxRequire } from "./wxRequire";

export function injectPreloadEvent(type: any) {
  injectHookBefore(wx, type, function (_, opts) {
    let [path, query] = opts.url.split("?");
    try {
      Log.info(path, "onPreload before");
      wxRequire(path, (ctx) => {
        if (ctx && ctx.__wk__) {
          ctx.options = queryParse(query);
          ctx.route = path.substring(1);
          callPreload(ctx);
        }
      });
    } catch (error) {
      Log.error(path, "onPreload before", error);
    }
  });
}

export function callPreload(ctx: any) {
  try {
    if (ctx.__wk__.meta.isPreload) {
      return;
    }
    ctx.__wk__.meta.isPreload = true;
    ctx.onPreload.call(ctx, ctx.options);
  } catch (error) {
    Log.error(ctx.route, "onPreload call", error);
  }
}
