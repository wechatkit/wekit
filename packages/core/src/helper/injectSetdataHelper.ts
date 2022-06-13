import { Wekit } from "../core/Wekit";
import { setTargetValue } from "@wekit/shared";

export function injectSetDataHelper(options: any) {
  const wk = options.__wk__();
  function _setData(data: AnyObject, cb: () => void) {
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
    wekit.pageEventEmitter.emit("flushView", wk.instance, updateData);
    wk.meta.rawSetData(updateData);
    wk.meta.lock = false;
  }
}
