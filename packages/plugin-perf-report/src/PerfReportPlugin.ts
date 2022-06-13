import { Plugin, Wekit } from "@wekit/core";
import { injectHookBefore } from "@wekit/shared";

export class PerfReportPlugin implements Plugin {
  install(ctx: Wekit) {
    console.log(ctx);
  }
  uninstall() {
    throw new Error("Method not implemented.");
  }
}
