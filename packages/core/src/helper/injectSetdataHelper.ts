import { Wekit } from "../core/Wekit";
import { setTargetValue } from "@wekit/shared";
import { Wk } from "./injectWk";
import { getWk } from "../utils/getWk";

export function injectSetDataHelper(options: any) {
  // 暂时不适配defComponent
  const wekit = Wekit.globalWekit;
  const wk = getWk(options);
  function _setData(this: any, data: AnyObject, cb: () => void) {
    wk.meta.instance = this;
    wk.initData(this);
    wekit.pageEventEmitter.emit("setData", this, data);
    const _data = wk.meta.isPreOptimize ? (wk.meta.data as any) : this.data;
    for (const key in data) {
      const value = data[key];
      setTargetValue(_data, key, value);
      wk.meta.updateData[key] = value;
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
  const rawSetData = wk.meta.rawSetData;
  if (!rawSetData) {
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
    rawSetData!(updateData);
    wk.meta.lock = false;
  }
}
