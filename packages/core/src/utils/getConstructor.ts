import { Constructor } from "packages/shared/src";

export function getConstructor<T>(target: T): Constructor<T> {
  return (target as any).constructor;
}
