export function getAbsoluteUrl(relativeUrl: string, baseUrl: string = window.location.origin) {
  return urlPathJoin(baseUrl, relativeUrl);
}

function removeLeadingAndTrailingSlash(s: string) {
  return s.replace(RegExp("^/"), "").replace(RegExp("/$"), "");
}

function urlPathJoin(...paths: string[]) {
  return paths
    .map(removeLeadingAndTrailingSlash)
    .filter((part) => part.length > 0)
    .join("/");
}

export function addQueryParamToUrl(url: string, queryParamObj: Record<string, any>) {
  const seperator = url.includes("?") ? "&" : "?";
  const urlSearchParams = new URLSearchParams(queryParamObj);
  if (urlSearchParams.size === 0) return url;
  return `${url}${seperator}${urlSearchParams.toString()}`;
}
