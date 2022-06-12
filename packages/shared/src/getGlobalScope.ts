export const globalScope = {};

export function getGlobalScope(): AnyObject {
  return wx ?? globalScope;
}
