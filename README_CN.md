# KResearch

[View English version](README.md) | [查看中文版本](README_CN.md)

> 一个先进的AI驱动深度研究应用程序，能够综合来自众多来源的信息，生成关于复杂主题的全面、文档完备的报告。

*在[English](README.md)或[中文](README_CN.md)中阅读此文档。您可以使用上面的链接在语言版本之间切换。*

<!-- 徽章 -->
![许可证](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=flat-square&logo=tailwind-css)

## 目录

- [关于项目](#关于项目)
  - [技术栈](#技术栈)
- [开始使用](#开始使用)
  - [先决条件](#先决条件)
  - [安装](#安装)
- [使用方法](#使用方法)
- [Docker](#docker)
- [配置](#配置)
- [贡献](#贡献)
- [许可证](#许可证)
- [联系方式](#联系方式)
- [致谢](#致谢)

## 关于项目

KResearch是一个复杂主题研究助手，通过利用多代理AI系统来解决复杂主题。它通过规划、执行和综合网络信息来自动化深度研究过程。最终输出是一个全面、结构良好的报告，包含来源引用和可视化知识图谱，是学生、分析师和任何需要快速深入了解主题的人的宝贵工具。

本项目的主要功能包括：
*   **对话式AI代理**：利用'Alpha'（战略家）和'Beta'（战术家）代理协作创建最佳研究计划。
*   **迭代研究周期**：执行多个规划、搜索和阅读周期以收集全面见解。
*   **实时进度跟踪**：在详细的逐步时间线中可视化AI的整个思维过程。
*   **可配置研究模式**：提供'平衡'、'深度潜水'、'快速'和'超快速'模式，以根据您的需求定制研究过程。
*   **全面最终报告**：生成结构良好的最终报告，综合所有发现。
*   **知识图谱可视化**：自动创建Mermaid.js图来可视化关键实体及其关系。
*   **来源引用**：使用Google搜索进行研究并提供完整的来源列表。
*   **现代响应式UI**：采用React和Tailwind CSS构建的时尚玻璃态设计，具有浅色和深色模式。

### 技术栈

*   [React](https://react.dev/)
*   [TypeScript](https://www.typescriptlang.org/)
*   [Tailwind CSS](https://tailwindcss.com/)
*   [Google Gemini API (`@google/genai`)](https://github.com/google/generative-ai-js)
*   [Mermaid.js](https://mermaid.js.org/)

## 开始使用

本节将指导您在本地设置和运行KResearch应用程序。

### 先决条件

您必须拥有Google Gemini API密钥才能使用此应用程序。
*   **Google Gemini API密钥**：从[Google AI Studio](https://aistudio.google.com/app/apikey)获取。
*   **Node.js**：建议使用最新的LTS版本。
*   包管理器如**npm**或**yarn**。

### 安装

1.  克隆仓库
    ```sh
    git clone https://github.com/KuekHaoYang/KResearch.git
    cd KResearch
    ```
2.  安装NPM包
    ```sh
    npm install
    ```
3.  按照[配置](#配置)部分的说明设置环境变量。

## 使用方法

启动开发服务器：
```sh
npm run dev
```
然后在浏览器中导航到终端中提供的本地地址（例如`http://localhost:5173`）。

1.  **配置API密钥**：如果尚未设置`.env`文件，请在**设置**模态框中输入您的Google Gemini API密钥。
2.  **选择研究模式**：从'平衡'、'深度潜水'、'快速'或'超快速'中选择。
3.  **输入您的查询**：在主文本区域中输入您的研究主题或问题。
4.  **开始研究**：点击"开始研究"按钮或按`Enter`。
5.  **监控进度**：观察AI代理工作时的研究日志。您可以随时停止该过程。
6.  **查看结果**：完成后，将显示最终报告、知识图谱和引用。

## Docker

运行KResearch的最快方法是使用预构建的Docker镜像。我们通过Docker Hub和GitHub Container Registry（GHCR）提供镜像。

### 选项1：使用Docker Hub

1.  **拉取并运行容器**：
    在终端中执行此命令以下载并启动应用程序。

    ```sh
    docker run -p 8080:80 --name kresearch kuekhaoyang/kresearch:latest
    ```
    *   `-p 8080:80`将您的本地端口`8080`映射到容器的端口`80`。
    *   `--name kresearch`为您的容器分配名称`kresearch`以便于管理。

2.  **访问应用程序**：
    打开您的Web浏览器并导航到`http://localhost:8080`。

3.  **配置API密钥**：
    应用程序加载后，点击**设置**图标并输入您的Google Gemini API密钥。该密钥将保存在您的浏览器本地存储中以供将来会话使用。

### 选项2：使用GitHub Container Registry（GHCR）

我们的GitHub Actions工作流会自动构建镜像并推送到GHCR。您可以使用这些镜像获取最新的构建。

1.  **拉取并运行容器**：
    在终端中执行此命令以下载并启动应用程序。

    ```sh
    docker run -p 8080:80 --name kresearch ghcr.io/gloryhry/kresearch:latest
    ```

2.  **访问应用程序**：
    打开您的Web浏览器并导航到`http://localhost:8080`。

### 使用docker-compose

我们还提供了一个`docker-compose.yml`文件以便于管理。该文件配置为默认使用GHCR镜像。

1.  **使用docker-compose运行**：
    在终端中执行此命令以启动应用程序。

    ```sh
    docker-compose up
    ```

2.  **访问应用程序**：
    打开您的Web浏览器并导航到`http://localhost:8080`。

3.  **配置API密钥**：
    应用程序加载后，点击**设置**图标并输入您的Google Gemini API密钥。

## 最近增强功能

### GitHub Actions工作流

我们添加了一个GitHub Actions工作流，用于自动构建和推送Docker镜像到GitHub Container Registry（GHCR）。这确保了应用程序的最新版本始终可以作为Docker镜像使用。

工作流在以下情况下触发：
- 推送到主分支
- 创建新版本

这提供了一种可靠且自动化的部署应用程序最新版本的方式。

### 可配置的API基础URL

我们增加了通过`API_BASE_URL`环境变量配置API基础URL的支持。这允许您：

- 为Google Gemini服务使用自定义API端点
- 通过代理服务器路由请求
- 为不同环境（开发、预生产、生产）配置不同的API端点

使用此功能：

1. 在您的`.env`文件中设置`API_BASE_URL`环境变量：
   ```dotenv
   API_BASE_URL="https://your-custom-api-endpoint.com"
   ```

2. 应用程序将自动使用此基础URL进行所有API请求。

3. 在设置UI中，您会看到主机环境配置基础URL时的指示。

此增强功能为在不同环境中部署提供了更大的灵活性，并支持API代理或自定义端点等高级配置。

## 配置

应用程序需要Google Gemini API密钥才能运行。您可以通过两种方式提供：

### 选项1：应用内设置（推荐用于Docker）

直接在应用程序的**设置**模态框中输入API密钥。密钥安全地存储在您的浏览器本地存储中，因此您只需在每个浏览器中输入一次。使用上述`docker run`命令时这是必需的方法。

### 选项2：环境文件（用于本地开发）

对于本地开发（`npm run dev`）或`docker-compose`，您可以在项目根目录中创建一个`.env`文件。应用程序将自动从该文件加载密钥。

1.  在项目根目录中创建一个名为`.env`的文件。
2.  将您的API密钥添加到文件中：
    ```dotenv
    # .env
    API_KEY="YOUR_GEMINI_API_KEY"
    API_BASE_URL="https://your-custom-api-endpoint.com"
    ```

## 贡献

贡献使开源社区成为一个令人惊叹的学习、启发和创造的地方。我们非常感谢您所做的任何贡献。请参考项目的问题跟踪器了解贡献方式。如果您有建议，请先开一个问题进行讨论。

## 许可证

根据MIT许可证分发。有关更多信息，请参见`LICENSE`。

## 联系方式

Kuek Hao Yang - [@KuekHaoYang](https://github.com/KuekHaoYang)

项目链接：[https://github.com/KuekHaoYang/KResearch](https://github.com/KuekHaoYang/KResearch)

对于问题、疑问或功能请求，请使用[GitHub Issues](https://github.com/KuekHaoYang/KResearch/issues)页面。

## 致谢

*   由Google Gemini API提供支持。
*   UI灵感来自现代玻璃态设计趋势。