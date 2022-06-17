import { Plugin, Wekit } from "@wekit/core";

const LOG_PREFIX = "[perf-report]";
type PerfReportPluginOptions = {
  onReport?: (pagePerfReport: AnyObject) => void; // 上报页面性能数据
};

export class PerfReportPlugin implements Plugin {
  private pagePerfReport: AnyObject = {};
  private reportHandler = () => {
    console.table(this.pagePerfReport);
    if (this.options.onReport) {
      this.options.onReport(this.pagePerfReport);
    }
  };

  constructor(private options: PerfReportPluginOptions = {}) {}

  install(ctx: Wekit) {
    const updatePagePerfReport = (page: any, isForce?: boolean | undefined) => {
      const route = page.route;
      if (!this.pagePerfReport[route]) {
        return;
      }
      const now = Date.now();
      const cost = now - this.pagePerfReport[route].start;
      const dur = now - this.pagePerfReport[route].last;
      if (isForce || dur < 100) {
        this.pagePerfReport[route].cost = cost;
        this.pagePerfReport[route].last = now;
      }
    };

    ctx.pageEventEmitter.on("onPreload", (page: { route: string | number }) => {
      const start = Date.now();
      this.pagePerfReport[page.route] = {
        start,
        last: start,
      };
    });

    ctx.pageEventEmitter.on("onReady", (page: { route: string | number }) => {
      updatePagePerfReport(page, true);
      console.log(
        LOG_PREFIX,
        `Page ${page.route} Ready time: ${
          this.pagePerfReport[page.route].cost
        }ms`
      );
    });

    ctx.pageEventEmitter.on("flushView", (page: any) => {
      updatePagePerfReport(page);
      console.log(
        LOG_PREFIX,
        `Page ${page.route} flushView time: ${
          this.pagePerfReport[page.route].cost
        }ms`
      );
    });

    wx.onAppHide(this.reportHandler);
  }

  uninstall() {
    wx.offAppHide(this.reportHandler);
  }
}
