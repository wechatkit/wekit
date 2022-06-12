export function setTargetValue<T extends AnyObject>(
  target: T,
  path: string = "",
  value: any
) {
  const tokens = path.split(/[\.\[\]]/);
  let tTarget = null;
  let tToken = "";
  let currentTarget: any = target;
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token) {
      if (currentTarget[token] === undefined) {
        currentTarget[token] = {};
      }
      tToken = token;
      tTarget = currentTarget;
      currentTarget = currentTarget[token];
    }
  }
  tTarget[tToken] = value;

  return tokens;
}
