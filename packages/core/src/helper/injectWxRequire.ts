import { Log } from "@wekit/shared";
import { Wekit } from "../core/Wekit";

export function calcRelativePath(currentPath = "", relativePath = "") {
  if (relativePath.startsWith("/")) {
    return relativePath;
  }

  if (!currentPath.startsWith("/")) {
    currentPath = "/" + currentPath;
  }

  let currentPathArr = currentPath.split("/");
  let relativePathArr = relativePath.split("/");
  let currentPathFile = currentPathArr.pop();
  let relativePathFile = relativePathArr.pop();
  for (let i = 0; i < relativePathArr.length; i++) {
    if (relativePathArr[i] === "..") {
      currentPathArr.pop();
    } else if (relativePathArr[i] !== "." && relativePathArr[i]) {
      currentPathArr.push(relativePathArr[i]);
    }
  }
  return currentPathArr.join("/") + "/" + relativePathFile;
}

export function getCurrentPage() {
  const pages = getCurrentPages();
  return pages[pages.length - 1];
}

export function wxRequire(path: string, callback: (module: any) => void) {
  path = calcRelativePath(getCurrentPage().is, path);
  try {
    Log.info(path, "onPreload before");
    Wekit.globalWekit.require(path, callback);
  } catch (error) {
    Log.warn(path, "onPreload before", error);
  }
}
