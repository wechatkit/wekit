import { wrap } from "./promise";

describe("promise.ts", () => {
  it("should when throw error return [err, null]", () => {
    const p = Promise.reject(new Error("error"));
    return expect(wrap(p)).resolves.toEqual([new Error("error"), undefined]);
  });

  it("should when success result [null, Result]", () => {
    const p = Promise.resolve("result");
    return expect(wrap(p)).resolves.toEqual([undefined, "result"]);
  });
});
