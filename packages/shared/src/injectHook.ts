type FunctionKeyFilter<T> = keyof {
  [k in keyof T]: T[k] extends Function ? T[k] : never;
};

interface MethodCb<T> {
  (ctx: T, ...args: any[]): void;
}

export function injectHookBefore<T>(
  instance: T,
  name: FunctionKeyFilter<T>,
  methodCb: MethodCb<T>,
  errorCb?: (err: any) => void
) {
  const _method = instance[name] as any;
  const desc = Object.getOwnPropertyDescriptor(instance, name) || {
    enumerable: true,
    writable: true,
    configurable: true,
  };

  function proxyMethod(this: any, ...args: any[]) {
    let res = null;
    let err = null;

    try {
      methodCb(this, ...args);
    } catch (error) {
      if(error instanceof AboutCall) {
        if(error.type === AboutType.RETURN){
          return error.returnValue;
        }else{
          throw error;
        }
      }
      console.error(error);
    }

    try {
      res = _method && _method.apply(this, args);
    } catch (error) {
      err = error;
    }

    if (err) {
      if (errorCb) {
        errorCb(err);
      } else {
        throw err;
      }
    }

    return res;
  }

  Object.defineProperty(proxyMethod, "name", {
    value: String(name) + "__before",
    writable: false,
  });
  Object.defineProperty(instance, name, {
    value: proxyMethod,
    enumerable: desc.enumerable,
    writable: desc.writable,
    configurable: desc.configurable,
  });

  return ()=>{
    Object.defineProperty(instance, name, {
      value: _method,
      enumerable: desc.enumerable,
      writable: desc.writable,
      configurable: desc.configurable,
    });
  }
}

export function injectHookAfter<T>(
  instance: T,
  name: FunctionKeyFilter<T>,
  methodCb: MethodCb<T>,
  errorCb?: (err: any) => void
) {
  const _method = instance[name] as any;
  const desc = Object.getOwnPropertyDescriptor(instance, name) || {
    enumerable: true,
    writable: true,
    configurable: true,
  };

  function proxyMethod(this: any, ...args: any[]) {
    let res = null;
    let err = null;

    try {
      res = _method && _method.apply(this, args);
    } catch (error) {
      err = error;
    }

    try {
      methodCb(this, ...args);
    } catch (error) {
      console.error(error);
    }

    if (err) {
      if (errorCb) {
        errorCb(err);
      } else {
        throw err;
      }
    }

    return res;
  }
  Object.defineProperty(proxyMethod, "name", {
    value: String(name) + "__after",
    writable: false,
  });
  Object.defineProperty(instance, name, {
    value: proxyMethod,
    enumerable: desc.enumerable,
    writable: desc.writable,
    configurable: desc.configurable,
  });

  return ()=>{
    Object.defineProperty(instance, name, {
      value: _method,
      enumerable: desc.enumerable,
      writable: desc.writable,
      configurable: desc.configurable,
    });
  }
}

export enum AboutType {
  RETURN, // return
  THROW, // throw
}

export class AboutCall extends Error {
  constructor(public type:AboutType = AboutType.THROW, public returnValue?: any){
    super("Wekit about call");  
  }
}
