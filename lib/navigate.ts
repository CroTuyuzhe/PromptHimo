const isFileProtocol = typeof window !== "undefined" && window.location.protocol === "file:";

export function navigateTo(path: string) {
  if (!isFileProtocol) {
    window.location.href = path;
    return;
  }
  // file:// protocol: convert /builder?type=x → builder.html?type=x
  let [pathname, query] = path.split("?");
  if (pathname === "/") {
    pathname = "index";
  } else {
    pathname = pathname.replace(/^\//, "");
  }
  const url = pathname + ".html" + (query ? "?" + query : "");
  window.location.href = url;
}
