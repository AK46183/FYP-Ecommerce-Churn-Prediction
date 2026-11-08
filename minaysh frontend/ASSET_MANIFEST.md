# MINAYSH — Asset Manifest

This project ships with **illustrated stand-in assets only** for images —
the build environment has no internet access and no photo/image-generation
model available, so real product photography could not be sourced or
rendered. Every image is a hand-built SVG styled to *look* like a studio
product shot (soft backdrop, contact shadow, glass/metal shading, highlight
sweeps) rather than a flat icon or a box of placeholder text — but it is
still an illustration, not a photograph. Nothing in the customer-facing UI
shows developer text like "placeholder" or "replace."

**For a truly photographic final look, these need to be replaced with real
product photography** (or output from an AI image tool with image-generation
access) before launch. They're built to be easy to swap — see below.

Video files were **not** generated as placeholders. Instead, every `<video>`
tag in the code already points at the exact filenames you specified. Drop
your real MP4s into `public/videos/` using these exact names and they will
work immediately with no code changes.

---

## 1. Videos — you provide these (not placeholders)

| Path in project | Used on | Your source file |
|---|---|---|
| `public/videos/hero-beauty.mp4` | Homepage cinematic hero, and the login/register/forgot-password right-panel visual | `3181791-uhd_3840_2160_25fps.mp4` |
| `public/videos/eye-hover.mp4` | Tips & Trends — EYE card hover | `7291133-uhd_2160_3840_25fps.mp4` |
| `public/videos/face-hover.mp4` | Tips & Trends — FACE card hover | `6619509-hd_1080_1920_25fps.mp4` |
| `public/videos/lip-hover.mp4` | Tips & Trends — LIP card hover | `6648854-uhd_2160_4096_25fps.mp4` |
| `public/videos/looks-hover.mp4` | Tips & Trends — LOOKS & OCCASIONS card hover | `6491813-uhd_2160_4096_25fps.mp4` |

The `public/videos/` folder currently exists but is empty. Copy your five
files in using the exact names above — do not rename them.

---

## 2. Logo — already placed

| Path | Status |
|---|---|
| `public/images/minaysh-logo.png` | ✅ Your real MINAYSH logo is already in place, extracted from your uploaded reference image. No action needed unless you want to swap in a higher-resolution export. |

---

## 3. Image placeholders — replace these

All paths below are relative to `public/images/`. Every file is currently an
`.svg` placeholder. You can replace them with `.jpg`/`.png` files of the
same name (just update the extension in the corresponding data file — see
the "Where it's referenced" column) or re-export your real image as `.svg`
filename to drop in with zero code changes.

### Hero & login video posters
(Shown for a split second before the video loads, and as a fallback if video fails.)

| File | Replace with | Referenced in |
|---|---|---|
| `hero-poster.svg` | First frame / still of your hero video, 1920×1080 or wider | `src/components/home/Hero.jsx` |
| `login-poster.svg` | First frame / still of the same hero video, portrait-friendly crop | `src/pages/auth/Login.jsx`, `Register.jsx`, `ForgotPassword.jsx` |

### Tips & Trends — default poster images (4 cards)
(Shown before hover; the hover video takes over on mouseover.)

| File | Replace with | Card |
|---|---|---|
| `tips-eye-poster.svg` | Premium static image, portrait 3:4 | EYE |
| `tips-face-poster.svg` | Premium static image, portrait 3:4 | FACE |
| `tips-lip-poster.svg` | Premium static image, portrait 3:4 | LIP |
| `tips-looks-poster.svg` | Premium static image, portrait 3:4 | LOOKS & OCCASIONS |

Referenced in: `src/data/tipsTrends.js`

### Top Categories — isolated product cut-outs (5 images)

| File | Replace with | Category |
|---|---|---|
| `category-lips.svg` | Isolated/cut-out lip product PNG, transparent background preferred | LIPS |
| `category-eyes.svg` | Isolated/cut-out eye product PNG | EYES |
| `category-face.svg` | Isolated/cut-out face product PNG | FACE |
| `category-skincare.svg` | Isolated/cut-out skincare product PNG | SKIN CARE |
| `category-accessories.svg` | Isolated/cut-out accessory product PNG | ACCESSORIES |

Referenced in: `src/data/categories.js`

### Our Brand — editorial lifestyle image

| File | Replace with | Used on |
|---|---|---|
| `our-brand-lifestyle.svg` | Landscape editorial/lifestyle beauty photo, 1200×900 or larger | Homepage "Our Brand" section, `/our-brand` page |

Referenced in: `src/components/home/OurBrand.jsx`

### Product photography (Shop Skin Care carousel + catalog)

All files below live in `public/images/products/`.

| File | Product |
|---|---|
| `serum-radiance.svg`, `serum-radiance-2.svg` | Radiance Renewal Serum (main + secondary gallery image) |
| `cream-velvet.svg` | Velvet Hydration Cream |
| `mask-rose-clay.svg` | Rose Clay Purifying Mask |
| `oil-barrier.svg` | Barrier Repair Night Oil |
| `eyecream-softfocus.svg` | Soft Focus Eye Cream |
| `cleanser-gentle.svg` | Everyday Gentle Cleanser |
| `foundation-secondskin.svg` | Second Skin Foundation |
| `blush-signature-rose.svg` | Signature Rose Blush |
| `lipstick-velvet-matte.svg` | Velvet Matte Lipstick |
| `mascara-feather-lash.svg` | Feather Lash Mascara |

Referenced in: `src/data/products.js` (each product's `image` and `gallery` fields)

---

## How to replace an image

1. Export/save your real photo with the **exact same filename** shown above
   (e.g. `tips-eye-poster.svg` or `tips-eye-poster.jpg` — see note below on
   extensions).
2. Drop it into the matching folder under `public/images/`.
3. If you keep the `.svg` extension, no code changes are needed.
4. If you switch to `.jpg`/`.png`/`.webp`, open the one file listed in
   "Referenced in" above and update that single extension — e.g. in
   `src/data/products.js`, change `serum-radiance.svg` to
   `serum-radiance.jpg`.

You do not need to touch any component logic, styling, or layout to swap
images — every image is driven from the `src/data/*.js` files or a single
`src=` prop.

---

## Not placeholders — already final

- MINAYSH logo (`minaysh-logo.png`)
- All color palette, typography, spacing (`src/styles/global.css`)
- All layout, animation, and interaction code
- Product names, taglines, descriptions, and PKR pricing (sample content —
  edit directly in `src/data/products.js` whenever you're ready to finalize)
