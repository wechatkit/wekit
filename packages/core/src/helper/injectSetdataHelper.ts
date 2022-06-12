import { Wekit } from "../core/Wekit";
import { setTargetValue } from "@wekit/shared";
import { WkType } from "./injectWk";

export function injectSetDataHelper(options: any) {
  const wekit = Wekit.globalWekit;
  const wk = options.__wk__;
  const eventMap = {
    [WkType.APP]: (params: any) =>
      wekit.pageEventEmitter.emit("setData", params),
    [WkType.PAGE]: (params: any) =>
      wekit.pageEventEmitter.emit("setData", params),
    [WkType.COMPONENT]: (params: any) =>
      wekit.pageEventEmitter.emit("setData", params),
  };
  function _setData(data: AnyObject, cb: () => void) {
    eventMap[wk.meta.type as WkType]([options, { data, wk: wk }]);
    for (const key in data) {
      const value = data[key];
      const [cKey] = setTargetValue(options.data, key, value);
      wk.meta.updateData[cKey] = options.data[cKey];
    }
    cb && cb();
    triggerFlush(wk);
  }
  Object.defineProperty(options, "setData", {
    value: _setData,
    writable: true,
    enumerable: false,
    configurable: true,
  });
  return _setData;
}

function triggerFlush(__wk__: any) {
  if (!__wk__.meta.rawSetData) {
    return;
  }
  if (__wk__.meta.lock) {
    return;
  }
  __wk__.meta.lock = true;
  wx.nextTick(flushView);
}

function flushView(__wk__: any) {
  const wekit = Wekit.globalWekit;
  const updateData = __wk__.meta.updateData;
  __wk__.meta.updateData = {};
  wekit.pageEventEmitter.emit("flushView", { data: updateData, wk: __wk__ });
  __wk__.meta.rawSetData(updateData);
  __wk__.meta.lock = false;
}
