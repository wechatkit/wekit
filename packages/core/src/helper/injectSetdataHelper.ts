import { Wekit } from "../core/Wekit";
import { setTargetValue } from "@wekit/shared";
import { Wk } from "../core/Wk";

export function injectSetDataHelper(ctx: any) {
  // 暂时不适配defComponent
  const wekit = Wekit.globalWekit;
  const wk: Wk = Wk.get(ctx) as Wk;
  function _setData(this: any, data: AnyObject, cb: () => void) {
    wekit.pageEventEmitter.emit("setData", this, data);
    for (const key in data) {
      const value = data[key];
      setTargetValue(this.data, key, value);
      wk.updateData[key] = value;
    }
    if (cb && typeof cb === "function") wk.updateCallbacks.push(cb);
    triggerFlush(wk);
  }
  Object.defineProperty(ctx, "setData", {
    value: _setData,
    writable: true,
    enumerable: true,
    configurable: true,
  });
  return _setData;
}

function triggerFlush(wk: Wk) {
  const rawSetData = wk.rawSetData;
  if (!rawSetData) {
    return;
  }
  if (wk.lock) {
    return;
  }
  wk.lock = true;
  wx.nextTick(flushView);
  function flushView() {
    const updateTime = Date.now();
    const wekit = Wekit.globalWekit;
    const updateData = wk.updateData;
    wk.updateData = {};

    wekit.pageEventEmitter.emit("flushView", wk.ctx, updateData);
    rawSetData!(updateData, () => {
      wekit.pageEventEmitter.emit(
        "flushViewed",
        wk.ctx,
        updateData,
        Date.now() - updateTime
      );
      wk.updateCallbacks.forEach((cb) => cb());
      wk.updateCallbacks = [];
    });
    wk.lock = false;
  }
}
