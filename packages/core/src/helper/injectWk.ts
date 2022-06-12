import { deepClone } from "@wekit/shared";

export enum WkType {
  APP,
  PAGE,
  COMPONENT,
}

export function injectWk(options: any, type: WkType) {
  const dataFactory =
    typeof options.data === "function"
      ? options.data
      : () => deepClone(options.data);

  const wk = {
    meta: {
      isPreload: false,
      updateData: {} as any,
      rawSetData: null as any,
      dataFactory: dataFactory,
      isInitData: true,
      cachePropKeys: null,
      lock: false,
      options: options,
      type,
    },
  };

  Object.defineProperty(options, "__wk__", {
    value: wk,
    enumerable: true,
    configurable: false,
    writable: true,
  });

  return wk;
}
