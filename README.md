# SAKIB Gaming Portfolio

A responsive Free Fire and Roblox gaming portfolio built with HTML, CSS, and vanilla JavaScript. It has no build step or package dependencies and uses relative asset paths for GitHub Pages project hosting.

## Preview locally

Open this folder in VS Code and run `index.html` with the **Live Server** extension. Alternatively, from this folder run:

```powershell
python -m http.server 8000
```

Then visit `http://localhost:8000/`. Stop the server with Ctrl+C. Using localhost also enables the secure-context clipboard API in modern browsers.

## Personalize

- The Free Fire UID `2249584912` is in `index.html`. The profile card's **COPY UID** button copies it and gives visible feedback.
- Replace `assets/images/freefire-profile-placeholder.svg` and `assets/images/roblox-avatar-placeholder.svg` with your own images, or update their image paths in `index.html`. Use artwork you own or have permission to use.
- Edit the Roblox username and description placeholders directly in `index.html`.
- Add your Roblox profile URL in the Roblox entry in the `socialProfiles` array at the top of `script.js`. The Roblox profile card and social card will link to it when it is a valid HTTP or HTTPS URL.
- Add your real YouTube, Discord, or GitHub profile URLs in that same array. These profiles currently have no URL supplied, so they intentionally render as non-clickable placeholders. No profile links are fabricated.
- Optional rank, level, and likes fields on the Free Fire card are placeholders and make no claims about player statistics.

Motion effects respect `prefers-reduced-motion`. The particle canvas is capped at a small number of particles and a reduced pixel ratio to limit resource use.

## Publish to the existing GitHub Pages repository

1. In the `gdsakib67-glitch/gdsakib-info` GitHub repository, upload or push the **contents** of this folder to the publishing branch root (normally `main`), including `index.html`, `style.css`, `script.js`, `README.md`, and `assets/`.
2. In the repository, go to **Settings → Pages**. Set **Deploy from a branch**, choose `main` and `/ (root)`, then save. If Pages is already configured, keep its current publishing branch and folder.
3. Wait for the Pages deployment to complete. The expected site address is <https://gdsakib67-glitch.github.io/gdsakib-info/>.

The site does not include a fake contact form, server status, or invented game statistics.
