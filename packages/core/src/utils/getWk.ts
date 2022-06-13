import { Wk } from "../helper/injectWk";

export function getWk(target: any): Wk {
  return target.__wk__();
}
