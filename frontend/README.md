# MINAYSH — Premium Cosmetics E-Commerce Frontend

A React + Vite storefront for MINAYSH, a premium beauty brand. Built with
React Router, Framer Motion, and Lucide icons, following an editorial,
rose-gold-accented visual identity.

---

## Prerequisites

- **Node.js** 18 or newer (20 LTS recommended)
- **npm** 9 or newer (ships with Node)

Check your versions:

```bash
node -v
npm -v
```

---

## Getting Started

### 1. Install dependencies

From the project root:

```bash
npm install
```

This installs React, React Router, Framer Motion, Lucide React, and Vite as
defined in `package.json`.

### 2. Add your media files (see below) — hero video, hover videos, images

### 3. Run the dev server

```bash
npm run dev
```

Vite will print a local URL (typically `http://localhost:5173`). Open it in
your browser.

### Other scripts

```bash
npm run build     # production build → dist/
npm run preview   # preview the production build locally
```

---

## Where to place your media

### MINAYSH logo

Already placed at:

```
public/images/minaysh-logo.png
```

extracted from your uploaded reference. Replace this file directly (same
filename) if you want a higher-resolution export later — it's used in the
header, mobile menu, footer, login page, and admin sidebar.

### The five required video files

Copy your MP4 files into `public/videos/` using **exactly** these names —
the code already references them and needs no changes:

```
public/videos/hero-beauty.mp4     ← homepage hero + login page visual
public/videos/eye-hover.mp4       ← Tips & Trends "EYE" card hover
public/videos/face-hover.mp4      ← Tips & Trends "FACE" card hover
public/videos/lip-hover.mp4       ← Tips & Trends "LIP" card hover
public/videos/looks-hover.mp4     ← Tips & Trends "LOOKS & OCCASIONS" card hover
```

### Placeholder images

All product photography, category cut-outs, and poster images are
currently lightweight SVG placeholders (no network access was available to
source real photography during this build). See **`ASSET_MANIFEST.md`** in
the project root for the complete list of every placeholder file, exactly
what to replace it with, and which data file references it.

In short: replace a file in `public/images/` with your real image using
the same filename, and it appears everywhere automatically — no component
code changes required for same-name replacements.

---

## Demo credentials

There is no real backend — authentication is a frontend-only simulation
for demonstrating role-based routing. **Any email/password combination
works.** What matters is which tab you select on the login page:

| Role | How to sign in | Where it lands |
|---|---|---|
| **Customer** | Login page → CUSTOMER tab → any email + password → Sign In | Storefront homepage (or wherever you were headed, e.g. checkout) |
| **Admin** | Login page → ADMIN tab → any email + password → Admin Sign In | `/admin` dashboard |

Example you can use for both:
- Email: `demo@minaysh.com`
- Password: `demo1234`

The Admin portal is never linked from customer navigation, the header, the
footer, or the mobile menu — it's only reachable via direct URL (`/admin`)
and even then it's gated: a customer account (or a signed-out visitor) is
redirected to `/login` if they try to open it. Signing in as Customer never
grants access to `/admin`.

---

## Project Structure

```
src/
  assets/               (reserved for imported build-time assets)
  components/
    common/              Button, PageHeader — shared UI primitives
    header/              TopHeader, CategoryNav, MegaMenuPanel, MobileMenu
    home/                Hero, TipsTrends, TopCategories, ShopSkinCare,
                          OurBrand, TrustStrip, and their composition
    layout/              StorefrontLayout, Footer
    products/            ProductCard (used in carousel, listing, wishlist)
  context/               AuthContext, CartContext, WishlistContext
  data/                  navigation.js, tipsTrends.js, categories.js,
                          products.js — all editable content/config
  pages/
    auth/                Login, Register, ForgotPassword
    home/                Home (assembles homepage sections in fixed order)
    categories/           CategoryPage, ContentPage, OurBrandPage,
                          HelpCenter, ContactUs, SimplePage
    products/            ProductListing, ProductDetails
    tips/                TipsDetail (shared template for all 4 tips pages)
    cart/                Cart
    checkout/            Checkout
    account/             AccountLayout, Profile, Orders, OrderDetails,
                          Wishlist, Addresses
    admin/               AdminLayout, AdminDashboard, and one file per
                          admin section (Products, Categories, Inventory,
                          Orders, Customers, Promotions, Bundles,
                          Tips & Trends Content, Homepage Content,
                          Reports, Settings)
  routes/                guards.jsx — RequireAuth, RequireAdmin
  services/               format.js — PKR currency formatting
  styles/                 global.css — design tokens (color, type, spacing)
  App.jsx                 all route definitions
  main.jsx                app entry point, provider setup

public/
  images/                 logo + all placeholder images (see ASSET_MANIFEST.md)
  videos/                 empty — add your 5 MP4 files here
```

---

## Design system quick reference

Defined as CSS custom properties in `src/styles/global.css`:

| Token | Value | Use |
|---|---|---|
| `--color-ivory` | `#FBF7F4` | Page background |
| `--color-blush` | `#F7E8E4` | Category nav, section backgrounds |
| `--color-powder` | `#EBD4CC` | Accent shapes |
| `--color-rosegold` | `#C9A08C` | Accents, admin highlights |
| `--color-rosegold-deep` | `#B08468` | Hover states, links |
| `--color-charcoal` | `#2B2523` | Primary text, buttons |
| `--font-display` | Cormorant Garamond | Headlines |
| `--font-body` | Inter | UI text, body copy |

---

## Notes on what's fully built vs. first-draft

Per the original brief, these are locked and should not be redesigned:
- Homepage section order and content (Header → Category Nav → Mega Menu →
  Hero → Tips & Trends → Top Categories → Shop Skin Care → Our Brand →
  Trust Strip → Newsletter/Footer)
- Split-screen Customer/Admin login page

Everything else (product listing filters, product details layout, cart,
checkout, account pages, admin portal, individual category/tips pages) was
built with creative latitude per your instructions and is a polished first
version — customize freely.

No Virtual Try-On functionality is included, per your explicit instruction.
