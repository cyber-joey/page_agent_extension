// =============================================
// Page Agent Extension - Background Service Worker
// =============================================

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Set default config
    chrome.storage.local.set({
      pageAgentConfig: {
        apiKey: '',
        baseURL: 'https://api.ohmygpt.com/v1',
        model: 'gpt-4o',
        language: 'zh-CN',
      }
    });

    console.log('Page Agent Extension installed');
  }
});
