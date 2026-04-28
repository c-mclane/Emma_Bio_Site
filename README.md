# Emma_Bio_Site

A website for Emma's Biology Project.

Live site: https://c-mclane.github.io/Emma_Bio_Site/

## Edit the site

This is a static HTML/CSS/JavaScript site. The main files are:

- `index.html` - main project page
- `team.html` - team page
- `styles.css` - page styles
- `bioscape.js` - background animation

Open `index.html` directly in a browser to preview small edits, or run a local server from this directory:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Push changes

Check what changed:

```bash
git status
git diff
```

Commit and push to the remote repository:

```bash
git add index.html team.html styles.css bioscape.js README.md .editorconfig .gitignore
git commit -m "Update site content"
git push origin main
```
