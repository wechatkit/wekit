import { Wekit } from "../core/Wekit";
import { Wk } from "../core/Wk";
import { getConstructor } from "../utils/getConstructor";
import { Noop } from "../defPage";

export const wekitBehavior = Behavior({
  methods: {
    setData(data: any, cb?: Noop) {
      const wekit = Wekit.globalWekit;
      const ts = Date.now();
      wekit.pageEventEmitter.emit("setData", this, data);
      return getConstructor(this).prototype.setData.call(this, data, () => {
        cb && cb();
        wekit.pageEventEmitter.emit("flushViewed", this, data, Date.now() - ts);
      });
    },
  },
  lifetimes: {
    created() {
      const wk = Wk.get(this);
      if (wk) {
        // wk.unload();
        wk.load(this);
      }
    },
    detached() {
      const wk = Wk.get(this);
      if (wk) {
        wk.unload();
      }
    },
  },
});
