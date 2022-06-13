import { deepClone } from "@wekit/shared";

export enum WkType {
  PAGE,
  COMPONENT,
}

export interface WkMeta {
  isPreload: boolean;
  updateData: AnyObject;
  rawSetData: ((data: AnyObject, cb?: () => void) => void) | null;
  dataFactory: () => AnyObject;
  isInitData: boolean;
  cachePropKeys: string[] | null;
  lock: boolean;
  instance: AnyObject;
  type: WkType;
}
export interface Wk {
  meta: WkMeta;
}

export function injectWk(options: AnyObject, type: WkType) {
  const dataBackup =
    typeof options.data === "function" ? deepClone(options.data) : options.data;
  const dataFactory =
    typeof options.data === "function"
      ? options.data
      : () => deepClone(dataBackup);

  const wk: Wk = {
    meta: {
      isPreload: false,
      updateData: {},
      rawSetData: null,
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
    writable: false,
  });

  return wk;
}
