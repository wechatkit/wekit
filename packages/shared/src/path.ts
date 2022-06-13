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
