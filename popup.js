// Get elements
const clickCountEl = document.getElementById('clickCount');
const clickBtn = document.getElementById('clickBtn');
const resetBtn = document.getElementById('resetBtn');
const statusEl = document.getElementById('status');

// Load initial count
function loadCount() {
  browser.runtime.sendMessage({ type: "GET_COUNT" })
    .then(response => {
      if (response && response.count !== undefined) {
        clickCountEl.textContent = response.count;
      }
    })
    .catch(error => {
      console.error("Error loading count:", error);
    });
}

// Send message to background
function sendMessageToBackground(type, data = {}) {
  browser.runtime.sendMessage({ type, ...data })
    .then(response => {
      if (response && response.count !== undefined) {
        clickCountEl.textContent = response.count;
        statusEl.textContent = `✅ Updated! Count: ${response.count}`;
        statusEl.style.color = '#0060df';
      }
    })
    .catch(error => {
      statusEl.textContent = '❌ Error occurred';
      statusEl.style.color = '#ff0000';
      console.error("Error:", error);
    });
}

// Click button
clickBtn.addEventListener('click', () => {
  // Send message to background to increment
  browser.runtime.sendMessage({ type: "INCREMENT" })
    .then(response => {
      if (response && response.count !== undefined) {
        clickCountEl.textContent = response.count;
        statusEl.textContent = `✅ Clicked! Total: ${response.count}`;
        statusEl.style.color = '#0060df';
      }
    })
    .catch(error => {
      console.error("Error incrementing:", error);
    });
});

// Reset button
resetBtn.addEventListener('click', () => {
  browser.runtime.sendMessage({ type: "RESET" })
    .then(response => {
      if (response && response.count !== undefined) {
        clickCountEl.textContent = response.count;
        statusEl.textContent = '🔄 Reset to 0';
        statusEl.style.color = '#666';
      }
    })
    .catch(error => {
      console.error("Error resetting:", error);
    });
});

// Also handle messages from background
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "COUNT_UPDATED") {
    clickCountEl.textContent = message.count;
    statusEl.textContent = `🔄 Updated! Count: ${message.count}`;
    sendResponse({ success: true });
  }
  return true;
});

// Load count when popup opens
loadCount();
statusEl.textContent = '✅ Ready';
