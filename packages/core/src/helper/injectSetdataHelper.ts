import { Wekit } from "../core/Wekit";
import { setTargetValue } from "@wekit/shared";
import { Wk } from "./injectWk";
import { getWk } from "../utils/getWk";

export function injectSetDataHelper(options: any) {
  const wekit = Wekit.globalWekit;
  const wk = getWk(options);
  function _setData(data: AnyObject, cb: () => void) {
    const instance = wk.meta.instance;
    wekit.pageEventEmitter.emit("setData", instance, data);

    for (const key in data) {
      const value = data[key];
      const [cKey] = setTargetValue(instance.data, key, value);
      wk.meta.updateData[cKey] = instance.data[cKey];
    }
    cb && cb();
    triggerFlush(wk);
  }
  Object.defineProperty(options, "setData", {
    value: _setData,
    writable: true,
    enumerable: true,
    configurable: true,
  });
  return _setData;
}

function triggerFlush(wk: Wk) {
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
    wekit.pageEventEmitter.emit("flushView", wk.meta.instance, updateData);
    wk.meta.rawSetData!(updateData);
    wk.meta.lock = false;
  }
}
