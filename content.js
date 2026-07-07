// Simple content script
console.log("Dummy content script loaded!");

// Create a floating button on the page
function addFloatingButton() {
  // Check if button already exists
  if (document.getElementById('dummy-extension-button')) {
    return;
  }
  
  const button = document.createElement('div');
  button.id = 'dummy-extension-button';
  button.innerHTML = '🔵 Dummy';
  button.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #0060df;
    color: white;
    padding: 10px 15px;
    border-radius: 20px;
    font-family: Arial, sans-serif;
    font-size: 14px;
    cursor: pointer;
    z-index: 999999;
    box-shadow: 0 4px 6px rgba(0,0,0,0.2);
    transition: all 0.3s ease;
    user-select: none;
  `;
  
  // Hover effect
  button.addEventListener('mouseenter', () => {
    button.style.transform = 'scale(1.05)';
    button.style.boxShadow = '0 6px 12px rgba(0,0,0,0.3)';
  });
  
  button.addEventListener('mouseleave', () => {
    button.style.transform = 'scale(1)';
    button.style.boxShadow = '0 4px 6px rgba(0,0,0,0.2)';
  });
  
  // Click handler
  button.addEventListener('click', (e) => {
    e.stopPropagation();
    showNotification('🔄 Dummy extension clicked!');
    button.innerHTML = '✅ Clicked!';
    setTimeout(() => {
      button.innerHTML = '🔵 Dummy';
    }, 1000);
  });
  
  document.body.appendChild(button);
}

// Show notification on page
function showNotification(message) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #333;
    color: white;
    padding: 15px 25px;
    border-radius: 8px;
    font-family: Arial, sans-serif;
    z-index: 999999;
    box-shadow: 0 4px 6px rgba(0,0,0,0.3);
    animation: slideIn 0.3s ease;
    max-width: 300px;
  `;
  
  notification.textContent = message;
  document.body.appendChild(notification);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 300);
  }, 3000);
}

// Listen for messages from background
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Content script received:", message);
  
  if (message.type === "CLICK") {
    showNotification(`🔵 Extension clicked! Count: ${message.count}`);
    sendResponse({ success: true });
  }
  
  return true;
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(style);

// Add button when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', addFloatingButton);
} else {
  addFloatingButton();
}

console.log("Dummy content script ready!");
