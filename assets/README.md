# assets

| File | Status | Where it appears |
| --- | --- | --- |
| `headshot.jpg` | ✅ in place | Circular portrait in the `index.html` header |
| `banner-butterflies.mp4` | ✅ in place | Full-width banner below the hero. Converted from a 65 MB GIF — see below |
| `banner-butterflies.jpg` | ✅ in place | ↳ its poster frame |
| `photo-original.png` | local only (gitignored) | Full-frame source for the crop above |
| `Jaleesa_Houle_CV.pdf` | ✅ generated | Every "CV" / "Download CV" link. Rebuild with `../build-cv.sh` |

## Project card media

Cards are one per row: media on the left, text on the right, stacking to media-over-text
below 44rem. Media is shown with `object-fit: contain`, so **any aspect ratio works** and
nothing gets cropped. If a media file is missing, the whole well removes itself and the
card still looks intentional.

| File | Card | Source |
| --- | --- | --- |
| `proj-latentexplorer.mp4` | Latent Space Explorer | Demo recording from the repo README, cropped to drop the console pane and re-encoded for web |
| `proj-latentexplorer.jpg` | ↳ its poster frame | Frame at 12s of the same recording |
| `proj-gustresponse.mp4` | Gust response in free flight | `overlay.mov` — trajectory over the simulated flow field. Transcoded from HEVC to H.264 and stripped of audio |
| `proj-gustresponse.jpg` | ↳ its poster frame | Final frame, so the paused state shows the complete trajectory |
| `proj-yellowjacket.jpg` | Outdoor odor-tracking study | `figure1.jpg` — instrumented trap plus the three deployment sites, downscaled to 1500 px |
| `proj-vaepipeline.jpg` | unused spare | `VAEpipeline.png` from the LatentSpaceExplorer repo |

Raw `.mov` sources are gitignored — only the compressed versions here get published.

### Swapping in different media

Just overwrite the file — no HTML changes needed. To use a **video** on a card that
currently has an image, replace the `<img>` with:

```html
<video src="assets/your-clip.mp4" poster="assets/your-poster.jpg"
       autoplay muted loop playsinline preload="auto"
       onerror="this.closest('.card-media').remove()"></video>
<span class="media-badge">demo</span>
```

Videos autoplay muted, pause when scrolled off screen, and are click-to-toggle. Visitors
with "reduce motion" enabled get a paused video with controls instead. The `autoplay`
attribute matters — without it playback waits on JavaScript and starts visibly late.

To convert a QuickTime screen recording for the web (HEVC `.mov` won't play in Firefox or
older Chrome, so H.264 is required, not optional):

```sh
ffmpeg -i raw.mov -c:v libx264 -crf 23 -preset slow \
       -pix_fmt yuv420p -movflags +faststart -an out.mp4
ffmpeg -sseof -0.2 -i raw.mov -frames:v 1 poster.png    # poster from the final frame
```

Add `-vf "crop=W:H:X:Y,scale=1280:-2"` to trim dead space and downscale. Aim for well
under 1 MB per clip.

### Never put a GIF on the page

GIF is a catastrophically inefficient video format. The butterfly banner started as a
65 MB GIF and became a **651 KB MP4** that looks the same — a 100× reduction. Converting
one, with a crop to a wide banner strip:

```sh
ffmpeg -i in.gif -vf "crop=1920:760:0:0,scale=1440:-2" \
       -c:v libx264 -crf 29 -preset veryslow \
       -pix_fmt yuv420p -movflags +faststart -an banner-x.mp4
ffmpeg -ss 1.5 -i in.gif -frames:v 1 -vf "crop=1920:760:0:0,scale=1440:-2" poster.png
```

An `<video autoplay muted loop playsinline>` element behaves exactly like a GIF —
silent, looping, no controls — at a fraction of the weight.

### Replacing the banner

Overwrite `banner-butterflies.mp4` and `.jpg`. The banner markup lives just after
`</header>` in `index.html`; its caption text is in the `.banner-caption` paragraph, and
the crop shape is set by `aspect-ratio` on `.banner video` in `style.css`.

### Better media worth adding

- A **photo of a deployed trap** would beat the figure on the odor-tracking card — hardware
  photos are the most convincing evidence of embedded/field work.
- A **CFD animation** of the moving mesh would be a strong second video.

## Recropping the headshot

```sh
sips -c 560 560 --cropOffset 280 395 photo-original.png --out _tmp.png
sips -Z 800 -s format jpeg -s formatOptions 82 _tmp.png --out headshot.jpg && rm _tmp.png
```

`--cropOffset` is `top left` in pixels of the original.
