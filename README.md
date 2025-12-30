# Welcome to your project

## Project info

## How can I edit this code?

There are several ways of editing your application. Use your preferred IDE or GitHub to make changes locally and push them to this repository.

If you want to work locally using your own IDE, you can clone this repo and push changes.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
  
Machine learning
----------------

This project runs ML models for image classification and face detection. You have two options:

1. Browser-side inference (default) — Models are downloaded in the browser via `@huggingface/transformers` and executed client-side. No token required but large downloads may occur.

2. Proxy to Hugging Face Inference API (recommended for low-power devices) — Start the local proxy server which forwards requests to the HF Inference API. You'll need an HF token.

Quick start (proxy mode):

1. Copy `.env.example` to `.env` and set `HF_API_TOKEN` and `VITE_USE_HF_PROXY=true`.
2. Install dependencies: `npm install`.
3. Start both servers: `npm run dev:all` (runs the proxy server and the Vite dev server).

Notes:
- The proxy server listens on `http://localhost:3001` and Vite proxies `/api` to it.
- Do NOT commit your `.env` with a token; use environment variables in CI instead.

- Tailwind CSS

## How can I deploy this project?

Build the project and deploy using your preferred static hosting platform (Netlify, Vercel, etc.) or follow your organization's deployment process.
