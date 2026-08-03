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
| `serve.py` | Local preview server — see below for why not `python -m http.server` |
| `style.css` | All styling, including the print rules that shape the PDF |
| `plume.js` | Animated particle plume behind the page headers |
| `assets/` | Images and video — see `assets/README.md` |
| `_local/` | **Not published.** |

## Preview locally

```sh
./serve.py
# then visit http://localhost:8000
```

**Use `serve.py`, not `python3 -m http.server`.** The stdlib server ignores HTTP
`Range` headers and returns the whole file with a 200. Safari refuses to play a
`<video>` from a server that doesn't support ranges, so the videos silently fail to
autoplay locally while working fine once deployed — GitHub Pages answers 206 Partial
Content. Chrome tolerates the stdlib behaviour, which makes the problem look like a
Safari bug when it's really a server limitation. `serve.py` adds range support (and
sends `Cache-Control: no-store`, so swapped images and videos appear on a normal
reload instead of needing ⌘⇧R).

## Publishing

Push to `main`. In the repo's **Settings → Pages**, the source should be
"Deploy from a branch" → `main` / `(root)`.
