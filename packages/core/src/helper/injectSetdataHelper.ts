import { Wekit } from "../core/Wekit";
import { setTargetValue } from "@wekit/shared";
import { WkType } from "./injectWk";

export function injectSetDataHelper(options: any) {
  const wekit = Wekit.globalWekit;
  const wk = options.__wk__();
  const eventMap = {
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

function triggerFlush(wk: any) {
  if (!wk.meta.rawSetData) {
    return;
  }
  if (wk.meta.lock) {
    return;
  }
  wk.meta.lock = true;
  wx.nextTick(flushView);
  function flushView() {
    const wekit = Wekit.globalWekit;
    const updateData = wk.meta.updateData;
    wk.meta.updateData = {};
    wekit.pageEventEmitter.emit("flushView", { data: updateData, wk: wk });
    wk.meta.rawSetData(updateData);
    wk.meta.lock = false;
  }
}
