// Simple background script - just logs when extension loads
console.log("Dummy extension background loaded!");

// Simple counter
let clickCount = 0;

// Listen for extension icon clicks
browser.browserAction.onClicked.addListener((tab) => {
  clickCount++;
  console.log(`Extension clicked ${clickCount} times`);
  
  // Send message to content script
  browser.tabs.sendMessage(tab.id, {
    type: "CLICK",
    count: clickCount
  }).catch(() => {
    // Ignore errors
  });
});

// Listen for messages from popup or content
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_COUNT") {
    sendResponse({ count: clickCount });
  }
  return true;
});

console.log("Background script ready!");
