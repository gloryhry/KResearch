# KResearch

[View English version](README.md) | [查看中文版本](README_CN.md)

> An advanced AI-powered deep research application that synthesizes information from numerous sources to generate comprehensive, well-documented reports on complex topics.

*Read this document in [English](README.md) or [中文](README_CN.md). You can switch between language versions using the links above.*

<!-- Badges -->
![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=flat-square&logo=tailwind-css)

## Table of Contents

- [KResearch](#kresearch)
  - [Table of Contents](#table-of-contents)
  - [About The Project](#about-the-project)
    - [Built With](#built-with)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Usage](#usage)
  - [Docker](#docker)
    - [Option 1: Using Docker Hub](#option-1-using-docker-hub)
    - [Option 2: Using GitHub Container Registry (GHCR)](#option-2-using-github-container-registry-ghcr)
    - [Using docker-compose](#using-docker-compose)
  - [Recent Enhancements](#recent-enhancements)
    - [GitHub Actions Workflow](#github-actions-workflow)
    - [Configurable API Base URL](#configurable-api-base-url)
  - [Configuration](#configuration)
    - [Option 1: In-app Settings (Recommended for Docker)](#option-1-in-app-settings-recommended-for-docker)
    - [Option 2: Environment File (For Local Development)](#option-2-environment-file-for-local-development)
  - [Contributing](#contributing)
  - [License](#license)
  - [Contact](#contact)
  - [Acknowledgements](#acknowledgements)

## About The Project

KResearch is a sophisticated research assistant designed to tackle complex topics by leveraging a multi-agent AI system. It automates the process of in-depth research by planning, executing, and synthesizing information from the web. The final output is a comprehensive, well-structured report complete with source citations and a visual knowledge graph, making it an invaluable tool for students, analysts, and anyone needing to quickly develop a deep understanding of a subject.

This project's key features include:
*   **Conversational AI Agents**: Utilizes 'Alpha' (Strategist) and 'Beta' (Tactician) agents who collaborate to create an optimal research plan.
*   **Iterative Research Cycles**: Performs multiple cycles of planning, searching, and reading to gather comprehensive insights.
*   **Real-time Progress Tracking**: Visualizes the AI's entire thought process in a detailed, step-by-step timeline.
*   **Configurable Research Modes**: Offers 'Balanced', 'Deep Dive', 'Fast', and 'Ultra Fast' modes to tailor the research process to your needs.
*   **Comprehensive Final Report**: Generates a well-structured final report in Markdown, synthesizing all findings.
*   **Knowledge Graph Visualization**: Automatically creates a Mermaid.js graph to visualize key entities and their relationships.
*   **Sourced Citations**: Grounds all research using Google Search and provides a complete list of sources.
*   **Modern & Responsive UI**: A sleek, glassmorphism design built with React and Tailwind CSS, featuring light and dark modes.

### Built With

*   [React](https://react.dev/)
*   [TypeScript](https://www.typescriptlang.org/)
*   [Tailwind CSS](https://tailwindcss.com/)
*   [Google Gemini API (`@google/genai`)](https://github.com/google/generative-ai-js)
*   [Mermaid.js](https://mermaid.js.org/)

## Getting Started

This section will guide you through setting up and running the KResearch application locally.

### Prerequisites

You must have a Google Gemini API key to use this application.
*   **Google Gemini API Key**: Obtain from [Google AI Studio](https://aistudio.google.com/app/apikey).
*   **Node.js**: It's recommended to use a recent LTS version.
*   A package manager like **npm** or **yarn**.

### Installation

1.  Clone the repo
    ```sh
    git clone https://github.com/KuekHaoYang/KResearch.git
    cd KResearch
    ```
2.  Install NPM packages
    ```sh
    npm install
    ```
3.  Set up your environment variables as described in the [Configuration](#configuration) section.

## Usage

Start the development server:
```sh
npm run dev
```
Then navigate to the local address provided in your terminal (e.g., `http://localhost:5173`) in your browser.

1.  **Configure API Key**: If you haven't set up a `.env` file, enter your Google Gemini API key in the **Settings** modal.
2.  **Select a Research Mode**: Choose from 'Balanced', 'Deep Dive', 'Fast', or 'Ultra Fast'.
3.  **Enter Your Query**: Type your research topic or question into the main text area.
4.  **Start Research**: Click the "Start Research" button or press `Enter`.
5.  **Monitor Progress**: Observe the research log as the AI agents work. You can stop the process at any time.
6.  **Review Results**: Once complete, the final report, knowledge graph, and citations will be displayed.

## Docker

The quickest way to run KResearch is by using the pre-built Docker image. We provide images through both Docker Hub and GitHub Container Registry (GHCR).

### Option 1: Using Docker Hub 

1.  **Pull and run the container:**
    Execute this command in your terminal to download and start the application.

    ```sh
    docker run -p 8080:80 --name kresearch kuekhaoyang/kresearch:latest
    ```
    *   `-p 8080:80` maps your local port `8080` to the container's port `80`.
    *   `--name kresearch` assigns the name `kresearch` to your container for easy management.

2.  **Access the application:**
    Open your web browser and navigate to `http://localhost:8080`.

3.  **Configure API Key:**
    Once the application loads, click on the **Settings** icon and enter your Google Gemini API key. The key will be saved in your browser's local storage for future sessions.

### Option 2: Using GitHub Container Registry (GHCR)

Our GitHub Actions workflow automatically builds and pushes images to GHCR. You can use these images for the most up-to-date builds.

1.  **Pull and run the container:**
    Execute this command in your terminal to download and start the application.

    ```sh
    docker run -p 8080:80 --name kresearch ghcr.io/gloryhry/kresearch:latest
    ```

2.  **Access the application:**
    Open your web browser and navigate to `http://localhost:8080`.

### Using docker-compose

We also provide a `docker-compose.yml` file for easier management. The file is configured to use the GHCR image by default.

1.  **Run with docker-compose:**
    Execute this command in your terminal to start the application.

    ```sh
    docker-compose up
    ```

2.  **Access the application:**
    Open your web browser and navigate to `http://localhost:8080`.

3.  **Configure API Key:**
    Once the application loads, click on the **Settings** icon and enter your Google Gemini API key.

## Recent Enhancements

### GitHub Actions Workflow

We've added a GitHub Actions workflow for automatically building and pushing Docker images to GitHub Container Registry (GHCR). This ensures that the latest version of the application is always available as a Docker image.

The workflow is triggered on:
- Pushes to the main branch
- Creation of new releases

This provides a reliable and automated way to deploy the latest version of the application.

### Configurable API Base URL

We've added support for configuring the API base URL through the `API_BASE_URL` environment variable. This allows you to:

- Use a custom API endpoint for the Google Gemini service
- Route requests through a proxy server
- Configure different environments (development, staging, production) with different API endpoints

To use this feature:

1. Set the `API_BASE_URL` environment variable in your `.env` file:
   ```dotenv
   API_BASE_URL="https://your-custom-api-endpoint.com"
   ```

2. The application will automatically use this base URL for all API requests.

3. In the settings UI, you'll see an indication when the base URL is configured by the host environment.

This enhancement provides greater flexibility for deployment in different environments and supports advanced configurations such as API proxies or custom endpoints.

## Configuration

The application requires a Google Gemini API key to function. You have two options for providing it:

### Option 1: In-app Settings (Recommended for Docker)
Enter the API key directly in the application's **Settings** modal. The key is stored securely in your browser's local storage, so you only need to enter it once per browser. This is the required method when using the `docker run` command above.

### Option 2: Environment File (For Local Development)
For local development (`npm run dev`) or `docker-compose`, you can create a `.env` file in the root of the project. The application will automatically load the key from this file.

1.  Create a file named `.env` in the project root.
2.  Add your API key to the file:
    ```dotenv
    # .env
    API_KEY="YOUR_GEMINI_API_KEY"
    API_BASE_URL="https://your-custom-api-endpoint.com"
    ```

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**. Please refer to the project's issue tracker for ways to contribute. If you have suggestions, please open an issue to discuss it first.

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Kuek Hao Yang - [@KuekHaoYang](https://github.com/KuekHaoYang)

Project Link: [https://github.com/KuekHaoYang/KResearch](https://github.com/KuekHaoYang/KResearch)

For issues, questions, or feature requests, please use the [GitHub Issues](https://github.com/KuekHaoYang/KResearch/issues) page.

## Acknowledgements

*   Powered by the Google Gemini API.
*   UI inspired by modern glassmorphism design trends.