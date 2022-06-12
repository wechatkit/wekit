type FunctionKeyFilter<T> = keyof {
  [k in keyof T]: T[k] extends Function ? T[k] : never;
};

interface MethodFn<T> {
  (ctx: T, ...args: any[]): void;
}

export function injectHookBefore<T>(
  instance: T,
  name: FunctionKeyFilter<T>,
  methodFn: MethodFn<T>
) {
  const _method = instance[name] as any;
  const desc = Object.getOwnPropertyDescriptor(instance, name) || {
    enumerable: true,
    writable: true,
    configurable: true,
  };
  Object.defineProperty(instance, name, {
    value: function () {
      methodFn(this, ...arguments);
      return _method && _method.apply(this, arguments);
    },
    enumerable: desc.enumerable,
    writable: desc.writable,
    configurable: desc.configurable,
  });
}
