document.addEventListener("DOMContentLoaded", () => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const code = urlSearchParams.get("code");
  window.parent.postMessage(code, "*");
});
