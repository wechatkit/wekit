export function wrap<T, E>(p: Promise<T>): Promise<[E, T]> {
  return p.then<[null, T]>((res) => [null, res]).catch((err) => [err, null]);
}
