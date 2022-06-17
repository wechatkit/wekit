export function deepClone<T extends AnyObject>(data: T): T {
  if (Array.isArray(data)) {
    return (data.map((item) => deepClone(item)) as unknown) as T;
  }
  if (data instanceof Date) {
    return (new Date(data.getTime()) as unknown) as T;
  }
  if (typeof data === "object") {
    return (Object.keys(data).reduce((acc: any, key) => {
      acc[key] = deepClone(data[key]);
      return acc;
    }, {}) as unknown) as T;
  }
  return data;
}
