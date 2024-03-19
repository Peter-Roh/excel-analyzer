# Excel Analyzer

<img src="https://github.com/Peter-Roh/excel-analyzer/assets/36218264/b17a5de5-849f-4e60-8ea8-020f9ae6ea3d" width="50%" />

## Tech Stack

- [Create-T3-App](https://create.t3.gg/) - boilerplate

- [Next.js](https://nextjs.org) - Full-stack react framework

- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework

- [tRPC](https://trpc.io) - End-to-end type safe APIs

- [FastAPI](https://fastapi.tiangolo.com/) - Python web framework for building APIs

- [LangChain](https://www.langchain.com/) - Framework for developing applications powered by language models

## Description

Drag and drop your excel file and ask ai about the data. AI data analyst will answer your question.

This project is a proof of concept that building back office powered by LLM will be cool.

## Features

- Load excel file easily by drag and drop

- View data of excel file in a table view

- Ask LLM a question about the data and get answer

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Peter-Roh/excel-analyzer.git
```

### 2. Install dependencies

```bash
bun install
```

### 3. Download model

Go to [Ollama](https://ollama.com/) website and download model `mistral:latest`. (You can easily change model and add secret key by changing code if necessary. I am just using free model here.)

### 4. Python virtual environment

```bash
python3 -m venv ./api/env
source ./api/env/bin/activate
```

### 5. Run the application

```bash
bun run dev
```
