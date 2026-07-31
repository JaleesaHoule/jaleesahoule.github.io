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
| `_local/` | **Not published.** The CV page and PDF live here — see below |

## The CV is currently held back

`_local/` is gitignored *and* sits outside the served folder, so the CV is absent from
both the live site and the local preview. Every "CV" link therefore lands on `404.html`
in both places — what you see at `localhost:8000` is exactly what visitors get.

Read the CV locally by opening `_local/cv.html` directly (or
`http://localhost:8000/_local/cv.html`).

**To publish it:**

```sh
cp _local/Jaleesa_Houle_CV.pdf assets/
```

Every "CV" link already points at `assets/Jaleesa_Houle_CV.pdf`, so that one copy is all
it takes — no HTML changes. To take it down again, delete the file from `assets/`.

## Updating the CV

Edit `_local/cv.html`, then:

```sh
./build-cv.sh
```

That renders it through headless Chrome and overwrites `_local/Jaleesa_Houle_CV.pdf`
(then copy it into `assets/` if the CV is published). Page size, margins, and typography
for the PDF live in the `@media print` block at the bottom of `style.css` — `cv.html` is
the only page that block is tuned for.

## Preview locally

```sh
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Publishing

Push to `main`. In the repo's **Settings → Pages**, the source should be
"Deploy from a branch" → `main` / `(root)`.
