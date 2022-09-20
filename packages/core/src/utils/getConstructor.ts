import { Constructor } from "@wekit/shared";

export function getConstructor<T>(target: T): Constructor<T> {
  return (target as any).constructor;
}
