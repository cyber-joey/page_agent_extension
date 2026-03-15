// =============================================
// Page Agent Extension - Popup Script
// =============================================

const STORAGE_KEY = 'pageAgentConfig';

// DOM elements
const apiKeyInput = document.getElementById('apiKey');
const baseURLInput = document.getElementById('baseURL');
const modelInput = document.getElementById('model');
const languageSelect = document.getElementById('language');
const saveBtn = document.getElementById('saveBtn');
const launchBtn = document.getElementById('launchBtn');
const statusMsg = document.getElementById('statusMsg');
const toggleApiKey = document.getElementById('toggleApiKey');

// ---- Load saved config ----
chrome.storage.local.get(STORAGE_KEY, (data) => {
  const config = data[STORAGE_KEY] || {};
  apiKeyInput.value = config.apiKey || '';
  baseURLInput.value = config.baseURL || 'https://api.ohmygpt.com/v1';
  modelInput.value = config.model || 'gpt-4o';
  languageSelect.value = config.language || 'zh-CN';

  updateLaunchBtn();
});

// ---- Toggle API Key visibility ----
toggleApiKey.addEventListener('click', () => {
  const isPassword = apiKeyInput.type === 'password';
  apiKeyInput.type = isPassword ? 'text' : 'password';
  toggleApiKey.style.color = isPassword ? '#a1a1aa' : '#52525b';
});

// ---- Save config ----
saveBtn.addEventListener('click', () => {
  const config = {
    apiKey: apiKeyInput.value.trim(),
    baseURL: baseURLInput.value.trim(),
    model: modelInput.value.trim(),
    language: languageSelect.value,
  };

  if (!config.apiKey) {
    showStatus('请填写 API Key', 'error');
    return;
  }
  if (!config.baseURL) {
    showStatus('请填写 API Base URL', 'error');
    return;
  }
  if (!config.model) {
    showStatus('请填写模型名称', 'error');
    return;
  }

  chrome.storage.local.set({ [STORAGE_KEY]: config }, () => {
    showStatus('✅ 配置已保存', 'success');
    saveBtn.classList.add('saved');
    setTimeout(() => saveBtn.classList.remove('saved'), 600);
    updateLaunchBtn();
  });
});

// ---- Launch page-agent ----
launchBtn.addEventListener('click', async () => {
  const data = await chrome.storage.local.get(STORAGE_KEY);
  const config = data[STORAGE_KEY];

  if (!config || !config.apiKey) {
    showStatus('请先保存配置', 'error');
    return;
  }

  // Get current active tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab || !tab.id) {
    showStatus('无法获取当前标签页', 'error');
    return;
  }

  // Check if the tab URL is injectable
  if (tab.url?.startsWith('chrome://') || tab.url?.startsWith('chrome-extension://') || tab.url?.startsWith('about:')) {
    showStatus('无法在此页面注入', 'error');
    return;
  }

  launchBtn.disabled = true;
  launchBtn.querySelector('span').textContent = '注入中...';

  try {
    // First inject the page-agent IIFE script
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: injectPageAgent,
      args: [config],
      world: 'MAIN', // Must run in MAIN world to access page's window
    });

    showStatus('🚀 已启动！', 'success');
    launchBtn.querySelector('span').textContent = '✓ 已注入';

    setTimeout(() => {
      window.close(); // Close popup
    }, 800);
  } catch (err) {
    showStatus('注入失败: ' + err.message, 'error');
    launchBtn.disabled = false;
    launchBtn.querySelector('span').textContent = '启动 Page Agent';
  }
});

// ---- Function injected into page (runs in MAIN world) ----
function injectPageAgent(config) {
  // Avoid duplicate injection
  if (window.__pageAgentExtensionInjected) {
    if (window.pageAgent && window.pageAgent.panel) {
      window.pageAgent.panel.show();
    }
    console.log('🔄 Page Agent 面板已重新显示');
    return;
  }

  const SCRIPT_URL = 'https://cdn.jsdelivr.net/npm/page-agent@latest/dist/iife/page-agent.demo.js';

  const script = document.createElement('script');
  script.src = SCRIPT_URL;
  script.crossOrigin = 'true';

  script.onload = () => {
    console.log('✅ page-agent 脚本已加载');

    // Wait for the demo to auto-init and then re-configure
    setTimeout(() => {
      // Dispose demo instance
      if (window.pageAgent) {
        window.pageAgent.dispose();
      }

      // Create new instance with user config
      window.pageAgent = new window.PageAgent({
        model: config.model,
        baseURL: config.baseURL,
        apiKey: config.apiKey,
        language: config.language || 'zh-CN',
      });

      window.pageAgent.panel.show();
      window.__pageAgentExtensionInjected = true;

      console.log('🚀 Page Agent 已启动 (Chrome 扩展)', {
        model: config.model,
        baseURL: config.baseURL,
        language: config.language,
      });
    }, 500);
  };

  script.onerror = () => {
    console.error('❌ page-agent 脚本加载失败');
  };

  document.head.appendChild(script);
}

// ---- Helpers ----
function showStatus(msg, type) {
  statusMsg.textContent = msg;
  statusMsg.className = 'status-msg ' + type;

  if (type === 'success') {
    setTimeout(() => {
      statusMsg.textContent = '';
      statusMsg.className = 'status-msg';
    }, 3000);
  }
}

function updateLaunchBtn() {
  const hasConfig = apiKeyInput.value.trim() && baseURLInput.value.trim() && modelInput.value.trim();
  launchBtn.disabled = !hasConfig;
}

// Live update launch button state
[apiKeyInput, baseURLInput, modelInput].forEach(input => {
  input.addEventListener('input', updateLaunchBtn);
});
