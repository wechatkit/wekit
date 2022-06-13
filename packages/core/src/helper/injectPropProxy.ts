import { getWk } from "../utils/getWk";

export function injectPropProxy(target: any, proxy: any) {
  const wk = getWk(target);
  let propKeys = wk.meta.cachePropKeys;
  if (!propKeys) {
    const keys = Object.keys(proxy);
    propKeys = keys.filter(
      (key) => typeof proxy[key] !== "function" && key !== "data"
    );
    wk.meta.cachePropKeys = propKeys;
  }

  for (let i = 0; i < propKeys.length; i++) {
    const key = propKeys[i];
    Object.defineProperty(target, key, {
      get() {
        return proxy[key];
      },
      set(value) {
        proxy[key] = value;
        return true;
      },
    });
  }
}
