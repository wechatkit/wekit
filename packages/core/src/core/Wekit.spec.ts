import { Plugin } from "../Plugin";
import { Wekit } from "./Wekit";
import { jest } from "@jest/globals";

(globalThis as any).wx = {};

describe("Wekit.ts", () => {
  it("should instance wekit", () => {
    const installFn = jest.fn();
    const uninstallFn = jest.fn();
    class WekitPluginPerf implements Plugin {
      constructor() {}
      install = installFn;
      uninstall = uninstallFn;
    }
    const wekit = Wekit.create({
      name: "test",
      debug: true,
      plugins: [new WekitPluginPerf()],
    });
    wekit.destroy();
    expect(wekit).toBeInstanceOf(Wekit);
    expect(installFn).toHaveBeenCalled();
    expect(uninstallFn).toHaveBeenCalled();
  });
});
