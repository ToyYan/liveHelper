
chrome.runtime.onMessageExternal.addListener((msg) => {
  console.log("bg", msg);
})
chrome.runtime.onMessage.addListener((msg) => {
  console.log("bg1", msg);
})

export { }