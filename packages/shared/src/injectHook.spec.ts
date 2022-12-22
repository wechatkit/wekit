import { jest } from "@jest/globals";
import { injectHookAfter, injectHookBefore } from "./injectHook";

describe("injectHook.ts", () => {
  it("should before callback", () => {
    const seq: string[] = [];
    const mockFN = jest.fn(() => {
      seq.push("mock");
    });
    const obj = {
      hello() {
        seq.push("hello");
        return "hello";
      },
    };
    injectHookBefore(obj, "hello", mockFN);
    expect(obj.hello()).toBe("hello");
    expect(mockFN).toBeCalledTimes(1);
    expect(mockFN).toBeCalledWith(obj);
    expect(seq).toEqual(["mock", "hello"]);
  });

  it("should after callback", () => {
    const seq: string[] = [];
    const mockFN = jest.fn(() => {
      seq.push("mock");
    });
    const obj = {
      hello() {
        seq.push("hello");
        return "hello";
      },
    };
    injectHookAfter(obj, "hello", mockFN);
    expect(obj.hello()).toBe("hello");
    expect(mockFN).toBeCalledTimes(1);
    expect(mockFN).toBeCalledWith(obj);
    expect(seq).toEqual(["hello", "mock"]);
  });

  it("should before callback with args", () => {
    const seq: string[] = [];
    const mockFN = jest.fn(() => {
      seq.push("mock");
    });
    const obj = {
      hello(a: string, b: string) {
        seq.push("hello");
        return "hello";
      },
    };
    injectHookBefore(obj, "hello", mockFN);
    expect(obj.hello("a", "b")).toBe("hello");
    expect(mockFN).toBeCalledTimes(1);
    expect(mockFN).toBeCalledWith(obj, "a", "b");
    expect(seq).toEqual(["mock", "hello"]);
  });

  it("should after callback with args", () => {
    const seq: string[] = [];
    const mockFN = jest.fn(() => {
      seq.push("mock");
    });
    const obj = {
      hello(a: string, b: string) {
        seq.push("hello");
        return "hello";
      },
    };
    injectHookAfter(obj, "hello", mockFN);
    expect(obj.hello("a", "b")).toBe("hello");
    expect(mockFN).toBeCalledTimes(1);
    expect(mockFN).toBeCalledWith(obj, "a", "b");
    expect(seq).toEqual(["hello", "mock"]);
  });

  it("should method not exist", () => {
    const mockFN = jest.fn(() => {});
    const errFN = jest.fn(() => {});
    const obj: any = {};
    injectHookAfter(obj, "hello2", mockFN);
    expect(() => obj.hello2()).not.toThrowError();
    expect(mockFN).toBeCalledTimes(1);
    expect(mockFN).toBeCalledWith(obj);
  });

  it("should catch method throw error", () => {
    const mockFN = jest.fn(() => {});
    const errFN = jest.fn(() => {});
    const obj: any = {
      hello2() {
        throw new Error("hello2");
      },
    };
    injectHookAfter(obj, "hello2", mockFN, errFN);
    expect(() => obj.hello2()).not.toThrowError();
    expect(mockFN).toBeCalledTimes(1);
    expect(mockFN).toBeCalledWith(obj);
    expect(errFN).toBeCalledTimes(1);
  });

  it("should method not exist", () => {
    const mockFN = jest.fn(() => {});
    const errFN = jest.fn(() => {});
    const obj: any = {};
    injectHookBefore(obj, "hello2", mockFN);
    expect(() => obj.hello2()).not.toThrowError();
    expect(mockFN).toBeCalledTimes(1);
    expect(mockFN).toBeCalledWith(obj);
  });

  it("should catch method throw error", () => {
    const mockFN = jest.fn(() => {});
    const errFN = jest.fn(() => {});
    const obj: any = {
      hello2() {
        throw new Error("hello2");
      },
    };
    injectHookBefore(obj, "hello2", mockFN, errFN);
    expect(() => obj.hello2()).not.toThrowError();
    expect(mockFN).toBeCalledTimes(1);
    expect(mockFN).toBeCalledWith(obj);
    expect(errFN).toBeCalledTimes(1);
  });

  it("should recovery before function", () => {
    const mockFN = jest.fn(() => {});
    const obj: any = {
      hello2() {
      },
    };
    const hello2 = obj.hello2;
    const recovery = injectHookBefore(obj, "hello2", mockFN);
    obj.hello2();
    expect(mockFN).toBeCalledTimes(1);
    expect(mockFN).toBeCalledWith(obj);
    expect(obj.hello2).not.toBe(hello2);
    recovery();
    obj.hello2();
    expect(mockFN).toBeCalledTimes(1);
    expect(mockFN).toBeCalledWith(obj);
    expect(obj.hello2).toBe(hello2);
  });
  
  it("should recovery after function", () => {
    const mockFN = jest.fn(() => {});
    const obj: any = {
      hello2() {
      },
    };
    const hello2 = obj.hello2;
    const recovery = injectHookAfter(obj, "hello2", mockFN);
    obj.hello2();
    expect(mockFN).toBeCalledTimes(1);
    expect(mockFN).toBeCalledWith(obj);
    expect(obj.hello2).not.toBe(hello2);
    recovery();
    obj.hello2();
    expect(mockFN).toBeCalledTimes(1);
    expect(mockFN).toBeCalledWith(obj);
    expect(obj.hello2).toBe(hello2);
  });
});
