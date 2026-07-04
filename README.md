# AdGen — Product Photo to Video Ad

Upload a product photo → get a ~25 second video ad with animated product shot,
on-screen script, and optional AI voiceover.

## What this does right now

- Upload a product photo through a simple web page
- Removes the background (if you add a remove.bg key — otherwise skips this step)
- Writes a short ad script/tagline (if you add an Anthropic key — otherwise uses a simple template)
- Generates a voiceover (if you add an ElevenLabs key — otherwise the video has no narration)
- Assembles everything into an MP4 with zoom/pan motion and text overlays using ffmpeg
- Lets you preview and download the finished video

**It works with zero API keys** — you'll just get a simpler video (no background removal,
templated script, no voice). Add keys as you go to upgrade quality.

## One-time setup (do this once)

You'll need two things installed on your computer:

1. **Node.js** — download from https://nodejs.org (choose the LTS version). Just click through the installer.
2. **ffmpeg** — used to assemble the video.
   - Mac: open Terminal and run `brew install ffmpeg` (install Homebrew first from https://brew.sh if you don't have it)
   - Windows: download from https://www.gyan.dev/ffmpeg/builds/ (get the "essentials" build), unzip, and add the `bin` folder to your PATH — or easier, install via `winget install ffmpeg` in PowerShell
   - Linux: `sudo apt install ffmpeg`

## Running the app

1. Unzip this project folder anywhere on your computer.
2. Open a terminal (Mac: Terminal app, Windows: PowerShell) and navigate into the folder:
   ```
   cd path/to/adgen-app
   ```
3. Install dependencies (only needed once):
   ```
   npm install
   ```
4. (Optional, for better quality) Copy `.env.example` to `.env` and paste in any API keys you've signed up for:
   ```
   cp .env.example .env
   ```
   Then open `.env` in any text editor and paste your keys after the `=` signs.
5. Start the app:
   ```
   npm start
   ```
6. Open your browser to **http://localhost:3000**

That's it — upload a photo, fill in the product name, and click "Generate ad."

## Getting API keys (all optional, all have free tiers)

| Service | What it adds | Sign up |
|---|---|---|
| remove.bg | Clean background removal | https://www.remove.bg/api |
| Anthropic (Claude) | AI-written ad script | https://console.anthropic.com |
| ElevenLabs | AI voiceover narration | https://elevenlabs.io |

Each is a simple sign-up → copy an API key → paste into `.env`. No coding involved.

## Deploying so anyone can use it online (later step)

Right now this runs on your own computer. To make it a real public website, you'd deploy
it to a host like Railway, Render, or Fly.io (all have free/cheap tiers and a
click-through setup, not coding). Ask me when you're ready for this step and I'll walk
you through it or prep the deployment config.

## Project structure

```
adgen-app/
  server/
    index.js       — web server & API routes
    pipeline.js     — the actual ad-generation pipeline (all 4 steps)
  public/
    index.html      — the web page
    style.css        — styling
    app.js           — upload + progress logic
  uploads/           — uploaded photos land here temporarily
  outputs/           — finished videos land here
  .env.example       — template for your API keys
```

## Known limitations (current version)

- Video is a templated zoom/pan on your product photo, not a fully AI-generated scene.
  True AI-generated video (via Runway/Kling/etc.) is a planned upgrade.
- One background style (dark gradient) for now — more templates can be added.
- Runs locally only until deployed.
