import { deepClone } from "@wekit/shared";

export enum WkType {
  PAGE,
  COMPONENT,
}

export function injectWk(options: any, type: WkType) {
  const dataBackup =
    typeof options.data === "function" ? deepClone(options.data) : options.data;
  const dataFactory =
    typeof options.data === "function"
      ? options.data
      : () => deepClone(dataBackup);

  const wk = {
    meta: {
      isPreload: false,
      updateData: {} as any,
      rawSetData: null as any,
      dataFactory: dataFactory,
      isInitData: true,
      cachePropKeys: null,
      lock: false,
      instance: options,
      type,
    },
  };

  Object.defineProperty(options, "__wk__", {
    value: function wkFactory() {
      return wk;
    },
    enumerable: true,
    configurable: false,
    writable: true,
  });

  return wk;
}
