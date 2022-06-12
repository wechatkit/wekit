export type Constructor<T> = new (...args: any[]) => T;

export type FunctionArgs<F> = F extends (...args: infer A) => any ? A : never;
