# Happy 21st Birthday Vanshika 🌸 | Static Animated Website

A pure HTML5 / CSS3 / Vanilla JavaScript animated birthday web app built for Vanshika's 21st Birthday (July 30).

No backend, no database, no bundlers, no node_modules — pure static code ready for zero-step GitHub Pages deployment.

---

## 📁 Project Structure

```text
D:\Birthday-baby\
├── index.html              # Main HTML markup with all sections
├── css/
│   └── style.css           # Custom design system, animations & responsive styling
├── js/
│   └── main.js             # Typewriter, canvas background, galleries, countdown & interactions
├── Assets/                 # Photos & media (Read-only)
│   ├── Couple/             # Couple photos
│   ├── Food/               # Favorite food photos
│   ├── her-pics/           # Solo photos & video
│   └── others/             # Memory collages & textures
├── audio/                  # Background music folder (drop song.mp3 / music.mp3 here)
│   └── .gitkeep
├── .nojekyll               # Disables Jekyll processing on GitHub Pages
├── PROGRESS.md             # Development & asset audit log
└── README.md               # Local preview & GitHub Pages deployment guide
```

---

## 💻 How to Preview Locally

### Option 1: Direct File Opening
Double-click `index.html` or open it directly in any browser (Chrome, Edge, Safari, Firefox).

### Option 2: Local HTTP Server (Recommended)
Using VS Code Live Server or Python CLI inside `D:\Birthday-baby`:

```bash
# Python 3
python -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

---

## 🚀 How to Deploy to GitHub Pages (Zero Build Step)

Follow these exact steps to launch the website live:

### 1. Initialize Git in the project root
Open terminal inside `D:\Birthday-baby` and run:

```bash
git init
git add .
git commit -m "Initial commit for Vanshika's 21st Birthday website 🌸"
git branch -M main
```

### 2. Create a new GitHub Repository
1. Go to [GitHub.com](https://github.com) and click **New Repository**.
2. Name it (e.g. `birthday-baby` or `vanshika-21st`).
3. Set visibility to **Public** (required for free GitHub Pages).
4. **Do NOT** check "Add README", ".gitignore", or license (since files already exist).
5. Click **Create repository**.

### 3. Connect local repo and push
Copy the commands shown by GitHub:

```bash
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
git push -u origin main
```

### 4. Enable GitHub Pages
1. On GitHub, navigate to your repository **Settings** tab.
2. Under the left sidebar, click **Pages**.
3. Under **Build and deployment**:
   - **Source**: Select `Deploy from a branch`.
   - **Branch**: Select `main` branch and `/ (root)` folder.
4. Click **Save**.

Within 1-2 minutes, your website will be live at:
`https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/`

---

## 🎵 Adding Background Music

To add a song to the floating music player:
1. Copy your `.mp3` file into `audio/` folder inside `D:\Birthday-baby\audio\`.
2. Name it `song.mp3` (or `music.mp3` / `bgm.mp3`).
3. Re-push to GitHub Pages.

---

## 💛 Personalizing the Love Letter

To add your final closing message in the Love Letter card:
1. Open `index.html`.
2. Scroll to Section 9 (`#love-letter`).
3. Replace `[[ADD YOUR CLOSING MESSAGE HERE]]` with your personal words.
4. Save and commit.
