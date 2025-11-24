<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1FcKeP4yhOEYulYjm3JnfOkvkQqHBjAqP

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Copy [.env.example](.env.example) to `.env.local` and set the `GEMINI_API_KEY` to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy to AI Studio

1. In your AI Studio app's **Settings → Environment** page, add a secret named `GEMINI_API_KEY` with your Gemini API key.
2. Deploy the app. The `/api/embed` production handler reads the key from the environment (`process.env.GEMINI_API_KEY`) and logs whether it is configured as `GEMINI_API_KEY configured for /api/embed: true`.
3. For static builds or preview servers, ensure the same `GEMINI_API_KEY` environment variable is available at build time so the Vite embed proxy can reach Gemini.
