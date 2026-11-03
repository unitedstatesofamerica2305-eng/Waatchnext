# CineMood - Smart Movie, Series & Anime Recommender

A personal web application that recommends movies, series, and anime tailored specifically to your mood, featuring natural language prompt parsing, persistent watched tracking, and strict Hindi dub filtering.

---

## 🌟 Core Features

1. **Rich Database (24 Popular Titles)**:
   - Spans Heist Thrillers, Psychological Thrillers, Strategic Mind-Game Dramas, Sci-Fi, and Noir across Movies, Series, and Anime (e.g. *Money Heist*, *Death Note*, *Inception*, *Breaking Bad*, *Monster*, *Dark*, *Code Geass*, *Attack on Titan*, *Peaky Blinders*, *Parasite*, *Severance*, *Shutter Island*).
   - Each item includes `id`, `title`, `type` (`'movie' | 'series' | 'anime'`), `genres`, `rating`, `coverImage`, and `hindiDubbed` (boolean).

2. **Persistent Watched Tracking**:
   - Every card has a quick **"Mark as Watched"** toggle.
   - Watched status is saved in `localStorage`, so your progress persists across page refreshes.
   - **"Hide Watched Items"** toggle (enabled by default) ensures titles you've already seen never clutter your recommendations.
   - Dedicated **Watched History** viewer with category breakdowns and unmark capabilities.

3. **Smart Mood & Semantic Filter Search**:
   - Conversational search box (e.g., *"I want a heist movie with action and mind games"* or *"psychological anime with hindi dub"*).
   - Intelligently extracts requested media types, tropes, genres, and **strictly enforces `hindiDubbed: true`** whenever Hindi audio is requested.
   - Live badge breakdown shows what the parser extracted.

4. **Modern Dark-Mode UI / UX**:
   - Cinema-grade dark aesthetic (`#080B12`) with high-contrast readable typography.
   - Clear visual badges for type (`Movie`, `Series`, `Anime`), IMDb ratings (with star icon), and official **Hindi Dub Available** badges.
   - Quick filter pills for genres and types.
   - "Surprise Me" roulette picker to break decision fatigue.

---

## 🚀 How to Run in Browser-Based Editors

### Option 1: Vercel (1-Click Deployment)
The project includes a ready-to-use `vercel.json` configured for Vite SPA routing:
1. Push your repository to GitHub / GitLab.
2. In the Vercel dashboard, click **Add New Project** and select your repository.
3. Vercel will automatically read `vercel.json` (`outputDirectory: "dist"`, `buildCommand: "npm run build"`).
4. Click **Deploy**.

### Option 2: StackBlitz (Instant In-Browser)
1. Go to [stackblitz.com](https://stackblitz.com) and click **"New Project"** > **Vite + React + TypeScript**.
2. Install dependency:
   ```bash
   npm i lucide-react
   ```
3. Copy the `/src` files into the project.
4. StackBlitz runs the dev server immediately with live hot reload and working `localStorage`.

### Option 3: CodeSandbox
1. Open [codesandbox.io/s/vite-react-ts](https://codesandbox.io/s/vite-react-ts).
2. Add `lucide-react` under Dependencies.
3. Paste the `/src` code into the workspace.

---

## 💻 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start the Vite development server
npm run dev

# 3. Open http://localhost:3000 in your browser
```
