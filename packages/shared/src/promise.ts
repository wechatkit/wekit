export function wrap<T, E>(p: Promise<T>): Promise<[E, T]> {
  return p
    .then<[undefined, T]>((res) => [undefined, res])
    .catch((err) => [err, undefined]) as unknown as Promise<[E, T]>;
}
