import { Log } from "@wekit/shared";

export function defProp(ctx: any, name: string, method: any) {
  if (ctx[name]) {
    Log.warn(`ctx.${name} is already defined`);
    return;
  }
  Object.defineProperty(ctx, name, {
    value: method,
    writable: false,
    enumerable: false,
    configurable: true,
  });
}
