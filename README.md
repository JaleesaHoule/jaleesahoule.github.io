# jaleesahoule.github.io

Personal portfolio site — served by GitHub Pages at
[jaleesahoule.github.io](https://jaleesahoule.github.io).

Plain static HTML/CSS/JS. No build step, no dependencies. `.nojekyll` is present so
GitHub Pages serves the files as-is.

## Files

| File | What it is |
| --- | --- |
| `index.html` | Main page — intro, experience, selected projects, skills |
| `publications.html` | Papers and preprints |
| `404.html` | Custom not-found page (GitHub Pages serves this automatically) |
| `build-cv.sh` | Regenerates the CV PDF from `_local/cv.html` |
| `style.css` | All styling, including the print rules that shape the PDF |
| `plume.js` | Animated particle plume behind the page headers |
| `assets/` | Images and video — see `assets/README.md` |
| `_local/` | **Not published.** |

## Preview locally

```sh
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Publishing

Push to `main`. In the repo's **Settings → Pages**, the source should be
"Deploy from a branch" → `main` / `(root)`.
