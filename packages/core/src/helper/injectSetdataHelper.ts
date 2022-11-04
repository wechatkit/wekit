import { Wekit } from "../core/Wekit";
import { setTargetValue } from "@wekit/shared";
import { Wk } from "../core/Wk";

export function injectSetDataHelper(ctx: any) {
  // 暂时不适配defComponent
  const wekit = Wekit.globalWekit;
  const wk: Wk = Wk.get(ctx) as Wk;
  function _setData(
    this: any,
    data: AnyObject,
    cb: () => void,
    force: boolean = Boolean(wekit.options.config.forceFlushView)
  ) {
    return new Promise<void>((resolve) => {
      wekit.pageEventEmitter.emit("setData", this, data);
      if (force && wk.rawSetData) {
        const updateTime = Date.now();
        return wk.rawSetData(data, () => {
          wekit.pageEventEmitter.emit(
            "flushViewed",
            wk.ctx,
            data,
            Date.now() - updateTime
          );
          resolve();
          cb && cb();
        });
      }
      for (const key in data) {
        const value = data[key];
        setTargetValue(this.data, key, value);
        wk.updateData[key] = value;
      }
      wk.updateCallbacks.push(resolve);
      if (cb && typeof cb === "function") wk.updateCallbacks.push(cb);
      wk.isFlushView = true;
      triggerFlush(wk);
    });
  }
  Object.defineProperty(ctx, "setData", {
    value: _setData,
    writable: true,
    enumerable: true,
    configurable: true,
  });
  return _setData;
}

export function triggerFlush(wk: Wk) {
  if (wk.isFlushView === false) {
    return;
  }
  const rawSetData = wk.rawSetData;
  if (!rawSetData) {
    return;
  }
  if (wk.lock) {
    return;
  }
  wk.lock = true;
  tinyFn(flushView);
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
      const cbs = wk.updateCallbacks;
      wk.updateCallbacks = [];
      cbs.forEach((cb) => cb());
    });
    wk.lock = false;
    wk.isFlushView = false;
  }
}

function tinyFn(cb: any) {
  Wekit.wxSupport.promise ? Promise.resolve().then(cb) : setTimeout(cb, 0);
}
