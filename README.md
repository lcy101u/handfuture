# 🔮 AI 手相算命 | AI Palm Reading

![React](https://img.shields.io/badge/React-18.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue)
![Vite](https://img.shields.io/badge/Vite-6.3.1-green)
![License](https://img.shields.io/badge/License-MIT-brightgreen)

一個融合古老智慧與現代 AI 技術的專業手相分析應用，提供準確的手相解讀和個性化運勢分析。

A professional palm reading application that combines ancient wisdom with modern AI technology, providing accurate palm analysis and personalized fortune readings.

## 📋 目錄 | Table of Contents

- [✨ 主要功能](#-主要功能--key-features)
- [🎯 使用指南](#-使用指南--usage-guide)
- [🚀 快速開始](#-快速開始--quick-start)
- [🛠️ 技術架構](#-技術架構--tech-stack)
- [📁 項目結構](#-項目結構--project-structure)
- [🤝 貢獻指南](#-貢獻指南--contributing)
- [📄 許可證](#-許可證--license)

## ✨ 主要功能 | Key Features

### 🤖 AI 智能分析 | AI Analysis

- **深度學習模型**: 基於 MediaPipe 的手部特徵識別
- **多維度解讀**: 生命線、智慧線、感情線、事業線全方位分析
- **準確度評估**: 每項分析都提供信心度評分

### 🎨 專業圖像處理 | Professional Image Processing

- **多種濾鏡預設**: 原圖、增強、經典、復古、神秘、黃金等 6 種濾鏡
- **手動調節**: 亮度、對比度、飽和度、銳化等精細控制
- **批量處理**: 支持多張圖片同時處理

### 🌍 多語言支持 | Multi-language Support

- **雙語界面**: 完整的繁體中文和英文支持
- **智能翻譯**: 所有功能和內容完全本地化
- **無縫切換**: 實時語言切換，無需重載

### 📱 現代化體驗 | Modern Experience

- **響應式設計**: 完美支持桌面端和移動端
- **暗黑模式**: 支持淺色/深色主題切換
- **漸進式 Web 應用**: PWA 支持，可安裝到設備

### 📊 數據分析 | Analytics

- **使用統計**: 詳細的用戶行為分析
- **結果追蹤**: 分析歷史記錄和趨勢
- **隱私保護**: 所有數據本地存儲

### 🔗 社交分享 | Social Sharing

- **多平台分享**: Facebook、Twitter、Line、WhatsApp
- **結果導出**: 生成精美的分析結果圖片
- **原生分享**: 支持系統原生分享功能

## 🎯 使用指南 | Usage Guide

### 基本流程 | Basic Workflow

1. **上傳圖片**: 拖拽或選擇手掌圖片 (支援 JPEG、PNG 格式)
2. **圖像處理**: 選擇合適的濾鏡和調整參數 (可選 6 種預設濾鏡)
3. **AI 分析**: 系統自動進行手相特徵分析 (通常需要 3-5 秒)
4. **查看結果**: 獲得詳細的個性化解讀 (包含置信度評分)
5. **分享導出**: 分享到社交媒體或導出結果圖片

### 最佳實踐 | Best Practices

#### 📸 拍攝技巧 | Photo Tips

- **手掌位置**: 手心朝上，五指自然張開
- **光線條件**: 使用充足的自然光，避免強烈陰影
- **構圖建議**: 手掌應佔據畫面的 2/3 以上區域
- **背景選擇**: 使用純色背景，避免複雜圖案

#### 🔧 技術要求 | Technical Requirements

- **檔案大小**: 推薦 1MB-10MB (系統上限 10MB)
- **圖片格式**: JPEG, PNG, WebP 格式
- **解析度**: 建議最低 800x600 像素
- **處理技巧**: 使用"增強"濾鏡可提高分析準確度

## 🛠️ 技術架構 | Tech Stack

### 核心框架 | Core Framework

- **React 18.2.0**: 現代 React Hooks + Concurrent Features
- **TypeScript 5.7.2**: 嚴格類型檢查和 IntelliSense 支持
- **Vite 6.3.1**: 極速開發構建工具

### UI/UX 設計 | UI/UX Design

- **Tailwind CSS 3.4.1**: 原子化 CSS 設計系統
- **shadcn/ui**: 高質量 React 組件庫
- **Radix UI**: 無障礙訪問組件基礎
- **Lucide React**: 一致的圖標系統

### 狀態管理 | State Management

- **Zustand**: 輕量級狀態管理
- **LocalStorage 持久化**: 用戶偏好設置保存
- **React Hooks**: 組件狀態和副作用管理

### 核心功能庫 | Core Libraries

- **MediaPipe**: 手部特徵檢測和分析
- **Canvas API**: 圖像處理和濾鏡應用
- **React Dropzone**: 拖拽上傳功能
- **React Router 7.5.1**: 客戶端路由

### 開發工具 | Development Tools

- **ESLint**: 代碼規範檢查
- **PostCSS**: CSS 後處理器
- **Hot Module Replacement**: 開發時熱更新

## 🚀 快速開始 | Quick Start

### 環境要求 | Prerequisites

- **Node.js**: 18.0+ 或 **Bun**: 1.0+
- **瀏覽器支持**: Chrome 88+, Firefox 78+, Safari 14+, Edge 88+
- **作業系統**: Windows 10+, macOS 10.15+, Linux (Ubuntu 18.04+)

### 環境配置 | Environment Setup

1. **複製環境變數模板** (如需要):

```bash
# 如果項目根目錄有 .env.example 文件
cp .env.example .env
# 根據需要修改 .env 文件中的配置
```

2. **安裝依賴**:

```bash
# 推薦使用 Bun (更快的包管理器)
bun install

# 或使用 npm
npm install

# 或使用 yarn
yarn install
```

### 開發服務器 | Development Server

```bash
# 啟動開發服務器
bun dev
# 或
npm run dev

# 訪問 http://localhost:5173
```

### 生產構建 | Production Build

```bash
# 構建生產版本
bun run build
# 或
npm run build

# 預覽構建結果
bun run preview
# 或
npm run preview
```

### 代碼檢查 | Code Quality

```bash
# ESLint 檢查
npm run lint

# TypeScript 類型檢查
npm run type-check
```

## 📁 項目結構 | Project Structure

```
src/
├── components/          # React 組件
│   ├── ui/             # 基礎 UI 組件 (shadcn/ui)
│   ├── palm/           # 手相分析相關組件
│   ├── social/         # 社交分享組件
│   ├── feedback/       # 用戶反饋組件
│   └── onboarding/     # 用戶引導組件
├── pages/              # 頁面組件
├── store/              # Zustand 狀態管理
├── hooks/              # 自定義 React Hooks
├── lib/                # 工具函數和配置
└── types/              # TypeScript 類型定義
```

### 部署 | Deployment

#### 靜態部署 | Static Deployment

```bash
# 構建生產版本
npm run build

# 預覽構建結果 (可選)
npm run preview
```

#### 快速部署到熱門平台 | Quick Deploy to Popular Platforms

<details>
<summary>📦 Vercel 部署</summary>

```bash
# 安裝 Vercel CLI
npm i -g vercel

# 部署到 Vercel
vercel --prod
```

</details>

<details>
<summary>🚀 Netlify 部署</summary>

```bash
# 安裝 Netlify CLI
npm install -g netlify-cli

# 部署到 Netlify
netlify deploy --prod --dir=dist
```

</details>

<details>
<summary>📄 GitHub Pages 部署</summary>

```bash
# 需要在 vite.config.ts 中設置 base: '/your-repo-name/'
npm run build

# 將 dist 資料夾內容推送到 gh-pages 分支
```

</details>

## 🤔 架構決策 | Architecture Decisions

### 核心技術選型 | Core Technology Choices

#### 🎯 狀態管理: Zustand

- **選擇原因**: 輕量級 (2.9KB gzipped)，API 簡潔，TypeScript 友好
- **vs Redux**: 減少 50%模板代碼，更適合中小型應用
- **持久化**: 內建 localStorage 支持，用戶設置自動保存

#### 🎨 UI 組件庫: shadcn/ui + Radix UI

- **選擇原因**: 可完全客製化，無運行時依賴，可複製組件代碼
- **vs Material-UI**: 更小的 bundle size，更好的定制性
- **設計系統**: 基於 Tailwind，保證設計一致性

#### ⚡ 構建工具: Vite

- **選擇原因**: HMR 速度快 3-5 倍，原生 ESM 支持，插件生態豐富
- **vs Create React App**: 開發啟動速度提升 80%，構建速度提升 60%

## 🤝 貢獻指南 | Contributing

### 開發規範 | Development Standards

- **代碼風格**: 遵循 ESLint 和 Prettier 配置
- **TypeScript**: 啟用嚴格模式，完整類型標註
- **組件設計**: 遵循 shadcn/ui 設計系統
- **國際化**: 新功能必須同時支持中英文

### 提交規範 | Commit Standards

- feat: 新功能開發
- fix: 問題修復
- docs: 文檔更新
- style: 代碼格式調整
- refactor: 代碼重構
- test: 測試相關
- chore: 構建工具、依賴更新

## 📄 許可證 | License

本項目採用 MIT 許可證 - 詳見 [LICENSE](LICENSE) 文件

## 🔗 相關鏈接 | Related Links

- [Live Demo](https://palm-reading-ai.com)
- [技術文檔](./docs/)
- [API 參考](./docs/api.md)
- [更新日誌](./CHANGELOG.md)
