# 🤖 Page Agent - AI 页面助手

一款 Chrome 扩展，基于阿里巴巴开源的 [page-agent](https://github.com/alibaba/page-agent) —— 一个 JavaScript 网页端 GUI 智能体（In-page GUI Agent），让你用**自然语言**操控任意网页。

无需浏览器扩展权限、无需 Python、无需 Headless Browser，一切都在页面内完成。支持所有 OpenAI 兼容 API。

---

## ✨ 功能

- 🎯 **自然语言操控** — 用一句话完成复杂的页面操作
- 🔧 **灵活配置** — 自由切换 API 地址、Key 和模型
- 💾 **配置持久化** — 保存在浏览器本地，关闭后不丢失
- 🎨 **内置 UI 面板** — 页面右下角弹出对话面板，开箱即用
- 🔒 **隐私安全** — 所有数据仅存储在本地，不上传任何服务器

---

## 📦 安装

1. 下载或克隆此项目
2. 打开 Chrome，地址栏输入 `chrome://extensions/`
3. 右上角打开 **开发者模式**
4. 点击 **「加载已解压的扩展程序」**
5. 选择项目文件夹
6. 扩展图标出现在工具栏 ✅

---

## 🚀 使用方法

### 1️⃣ 配置 API

点击工具栏的扩展图标，填写以下信息：

| 字段 | 说明 | 示例 |
|------|------|------|
| **API Key** | 你的 API 密钥 | `sk-xxx...` |
| **API Base URL** | OpenAI 兼容的 API 地址 | `https://api.openai.com/v1` |
| **模型名称** | 使用的 LLM 模型 | `gpt-4o` |
| **界面语言** | 面板显示语言 | `中文` / `English` |

填写完成后点击 **「保存配置」**。

### 2️⃣ 启动 Agent

1. 导航到你想操控的网页
2. 点击扩展图标 → 点击 **「启动 Page Agent」**
3. 页面右下角会出现 AI 助手面板
4. 在面板中输入自然语言指令，例如：
   - `点击登录按钮`
   - `在搜索框中输入 hello world`
   - `把表格数据导出为 CSV`

---

## 📁 项目结构

```
page_agent_extension/
├── manifest.json      # 扩展清单 (Manifest V3)
├── background.js      # Service Worker
├── popup.html         # 配置弹窗页面
├── popup.css          # 弹窗样式
├── popup.js           # 弹窗逻辑
├── icons/             # 扩展图标
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md
```

---

## ⚠️ 注意事项

- 无法在 `chrome://` 系统页面和 Chrome 应用商店页面注入
- API Key 以明文保存在 `chrome.storage.local` 中（仅本地）
- 首次启动需要加载远程脚本，确保网络畅通
- 推荐使用支持 **function calling** 的模型（如 `gpt-4o`）以获得最佳效果

---

## 📄 License

本扩展基于 [page-agent](https://github.com/alibaba/page-agent)（MIT License）构建。
