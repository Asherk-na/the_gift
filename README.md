# Belated Anniversary — Ganuse Family Site

A small personal site created as a belated wedding anniversary gift for Desmond & Rosa Ganuse.

## Run locally
1. Open `index.html` in a browser. For full local testing, serve with a simple static server (recommended):

```bash
# Python 3 (from project root)
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploy (GitHub Pages)
1. Create a new repository on GitHub and push the project.
2. In repository Settings > Pages, set source to `main` (or `gh-pages`) branch and root folder `/`.
3. Wait a few minutes and your site will be live.

## Notes
- Replace `your_best_photo.jpg` with a real photo in the project root.
- If you want the secret page to open after unlocking (instead of revealing inline), that's possible — I can wire it up.
 
IMAGE ASSETS
- Place the following images inside the `Images/` folder (use these exact filenames or update the HTML accordingly):
	- `couple_large.jpg` (hero / large couple photo)
	- `husband.jpg`
	- `wife.jpg`
	- `family.jpg`
	- `couple1.jpg`, `couple2.jpg`, `couple3.jpg`, `couple4.jpg`, `couple5.jpg` (five couple photos)
	- `mother_children.jpg`
	- `father_children.jpg`

QUIZ
- Open `quiz.html` and click "Quiz: For Him" or "Quiz: For Her" to begin. The quiz is client-side only and shows a summary of selected answers for sharing.

- If you'd like, I can:
- Add animation to the hero and gallery.
- Localize the quiz questions to mention names or change answers.
- Generate placeholder images to help preview the layout.
 - Update any names or the letter signature to your preferred display name.