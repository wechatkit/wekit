export function queryParse(query = "") {
  if (typeof query !== "string") {
    return {};
  }

  return query.split("&").reduce((result: any, param) => {
    const [key, value] = param.split("=");
    result[key] = decodeURIComponent(value);
    return result;
  }, {});
}
