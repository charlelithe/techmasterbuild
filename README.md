# Techmaster Builders, Inc. — Website

A static, single-page marketing website for **Techmaster Builders, Inc.**, a full-service construction company specializing in housing projects, buildings, and warehouses in Visayas and Mindanao.

Built with plain **HTML5, CSS3 and vanilla JavaScript**. There's no framework, build step, or backend. Open `index.html` in a browser and it runs.

---

## Project structure

```text
techmaster-builders/
├── index.html              # All page content and markup
├── css/
│   └── style.css           # All styles (design tokens at the top)
├── js/
│   └── script.js           # Navigation, filter, modal, FAQ, form, animations
├── assets/
│   ├── images/
│   │   ├── hero.jpg        # Hero background        (16:9, 2160×1215)
│   │   ├── about.jpg       # About section image    (1200×1500, portrait 4:5)
│   │   ├── cta.jpg         # "Have a project in mind?" banner (2.18:1, 1920×880)
│   │   ├── ph-map.svg      # Stylised Philippines dot map (service area)
│   │   ├── projects/       # project-01.jpg … project-06.jpg (1.45:1, 1440×990)
│   │   └── services/       # Reserved for optional service imagery
│   └── icons/
│       └── favicon.svg     # Placeholder favicon / brand mark
└── README.md
```

## Deploying

The site is fully static, so you can upload the whole folder to any of these:

| Host | How |
|---|---|
| **Netlify** | Drag the folder onto app.netlify.com/drop, or connect the Git repo (no build command, publish directory `/`). |
| **Vercel** | `vercel` in the folder, or import the repo. Framework preset: *Other*. No build command. |
| **GitHub Pages** | Push to a repo → Settings → Pages → deploy from branch `main`, folder `/root`. |
| **Traditional hosting** | Upload the folder contents to `public_html/` via FTP/cPanel. |

After deploying, update `<link rel="canonical">` and the `og:image` URL in `index.html` to absolute URLs on the live domain.

---

## ⚠️ Content to replace before launch

The site follows a strict rule: **no invented facts.** Anything the company has not supplied is a clearly marked placeholder.

### 1. Images (most important)
The images in `assets/images/` are **licensed stock photographs, not photos of Techmaster projects.** The note above the project grid says so on the page, and every image's `alt` text repeats it. To replace one, overwrite the file and keep the same name (e.g. `assets/images/hero.jpg`). Nothing else needs to change.

- Replace them with real company/project photos as soon as these exist. Once the grid shows genuine work, delete the `<p class="placeholder-note">` paragraph above it and drop the "illustrative, not a Techmaster project" clause from each `alt`.
- While stock photos are in place, **do not** describe them as Techmaster projects anywhere in the copy.
- Compress images before uploading (e.g. squoosh.app). Aim for under 400 KB each.
- Files are sized to the aspect ratios the layout expects. The `width`/`height` attributes in `index.html` state those ratios (e.g. `1600×1100`); a replacement only has to match the ratio, not the exact pixel count.

#### Image credits

Every photo below comes from [Unsplash](https://unsplash.com) under the [Unsplash License](https://unsplash.com/license), which permits commercial use free of charge and does not require attribution. No Unsplash+ (paid-licence) photos are used. Credits are recorded here as good practice and so the sources can be traced later.

| File | Delivered size | Photographer | Source |
| --- | --- | --- | --- |
| `hero.jpg` | 2160×1215 | Luan Fonseca | https://unsplash.com/photos/nhFkTSG1RdE |
| `about.jpg` | 1200×1500 | Rick Hyne | https://unsplash.com/photos/I5B6GAkeXRM |
| `cta.jpg` | 1920×880 | Lucas Kepner | https://unsplash.com/photos/Yn8D5B8C-eY |
| `projects/project-01.jpg` | 1440×990 | Alef Morais | https://unsplash.com/photos/d2hYqpR0YS0 |
| `projects/project-02.jpg` | 1440×990 | Zulfugar Karimov | https://unsplash.com/photos/tU_ldJDgOCE |
| `projects/project-03.jpg` | 1440×990 | Sam | https://unsplash.com/photos/6W8REUqted4 |
| `projects/project-04.jpg` | 1440×990 | Milo Bunnik | https://unsplash.com/photos/5pjp_dwPx1w |
| `projects/project-05.jpg` | 1440×990 | Divaris Shirichena | https://unsplash.com/photos/zdt4aawbJ28 |
| `projects/project-06.jpg` | 1440×990 | Shanjir H | https://unsplash.com/photos/sRgFzCdUZJI |

### 2. Projects
In `index.html`, find the `PROJECTS` section. Each project is one `<article class="project">` block:

```html
<article class="project project--wide"
  data-category="residential"            <!-- residential | commercial | warehouse | building -->
  data-title="Project Name"              <!-- shown in the modal -->
  data-location="Location"
  data-description="Longer description shown in the modal."
  data-image="assets/images/projects/project-01.jpg">
  ...visible image, category, title, location, short description...
</article>
```

- Duplicate a block to add a project, or delete one to remove it.
- `project--wide` (spans 2 columns) and `project--tall` (spans 2 rows) are optional layout modifiers.
- Once real projects are in, remove the `<p class="placeholder-note">` paragraph above the grid.

### 3. Logo
The "T" square mark in the header and footer is a **typographic placeholder**. Replace the `<span class="brand__mark">` SVG with the official logo (e.g. `<img src="assets/icons/logo.svg" alt="">`) and update `assets/icons/favicon.svg`.

### 4. Social media
No social links are included because no official accounts were provided. There's a commented example in the footer `Location` column in `index.html`.

### 5. Other facts
Only add years in business, project counts, certifications, awards, client names or testimonials if they are **verified**. The trust bar under the hero (`.trust`) is the natural place for verified credentials.

---

## Connecting the inquiry form

The form validates on the client side and shows a success state. By default it runs in **demo mode**: nothing is sent until you connect a service by setting `data-endpoint` on the `<form id="quote-form">` element.

### Web3Forms (free, simplest)
1. Get an access key at web3forms.com (it's linked to `techmasterbuilders@gmail.com`).
2. In `index.html`:
   ```html
   <form ... data-endpoint="https://api.web3forms.com/submit">
     <input type="hidden" name="access_key" value="YOUR_ACCESS_KEY">
   ```
   (Uncomment the `access_key` line that's already there.)

### Formspree
1. Create a form at formspree.io and copy its endpoint.
2. Set `data-endpoint="https://formspree.io/f/XXXXXXX"`.

### Custom PHP backend
Set `data-endpoint="/send-inquiry.php"`. The script receives a standard `multipart/form-data` POST with these fields: `full_name, company, email, phone, project_type, project_location, budget, message, subject`. Return HTTP 200 on success. Always validate on the server as well, and reject any submission where `company_website` (the honeypot) is not empty.

### EmailJS
Include the EmailJS SDK, then in `js/script.js` replace the `fetch(...)` call inside the submit handler with:
```js
await emailjs.sendForm('SERVICE_ID', 'TEMPLATE_ID', form, { publicKey: 'PUBLIC_KEY' });
```
and give `data-endpoint` any non-empty value (e.g. `"emailjs"`) so that branch runs.

---

## Using a live Google Map (optional)

The contact section uses a decorative map-style card that opens Google Maps. To embed a live map instead, replace the `<a class="mapcard">…</a>` element with:

```html
<iframe class="mapcard" title="Techmaster Builders headquarters map"
  src="https://maps.google.com/maps?q=4B%20Baseline%20Center%2C%20Juana%20Osme%C3%B1a%20St.%2C%20Cebu%20City&z=16&output=embed"
  loading="lazy" referrerpolicy="no-referrer-when-downgrade" style="border:0;width:100%"></iframe>
```

---

## Customising the design

All brand values are CSS variables at the top of `css/style.css`:

```css
:root {
  --primary-red: #E90000;   /* CTAs, accents */
  --primary-blue: #0021AA;  /* corporate colour, nav, service area */
  --black: #0A0A0A;
  --white: #FFFFFF;
  --light-gray: #F5F5F5;
  --text-dark: #111111;
  ...
}
```

Fonts are **Manrope** (display) and **Inter** (body), loaded from Google Fonts. Both fall back to system fonts if they're offline.

## Features

- Sticky header that turns solid on scroll, an active-section indicator, and an animated underline
- Full-screen animated hamburger menu below 1080px, with focus trap and Escape to close
- Smooth scrolling (turned off under `prefers-reduced-motion`)
- Project category filter with fade transitions, plus an accessible project modal
- FAQ accordion with animated height and one panel open at a time
- Form validation (required fields, email and phone formats), inline errors, honeypot, and success state
- Clicking a service card pre-selects that project type in the form
- Scroll-reveal animations using IntersectionObserver, all turned off for reduced motion
- Fixed **Call | Request a Quote** bar on screens under 768px
- Semantic HTML, a single H1, labelled form fields, visible focus states, skip link, and alt text
- SEO: title, meta description, Open Graph, and `GeneralContractor` JSON-LD with verified company details only

Tested at 1440, 1200, 992, 768, 480 and 375px with no horizontal scrolling and no console errors.
