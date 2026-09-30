# SoundLab Academy

A plain HTML, CSS, and JavaScript website for SoundLab Academy, published at https://soundlabacademy.github.io/.

## Files

| File or folder | Purpose |
| --- | --- |
| `index.html` | Page content, teacher biographies, gallery markup, and contact form |
| `styles.css` | Layout, typography, colors, responsive styles, and animations |
| `script.js` | Navigation, profile and photo viewers, gallery behavior, and form submission |
| `assets/` | Logo and photographs |
| `assets/icons/` | Standalone SVG icons, including all seven program icons |
| `robots.txt` and `sitemap.xml` | Search engine discovery |
| `google9bccea01f5e54ff8.html` | Google site verification |

There is no dependency installation or build step. Serve these files directly.

The previous React source is retained in the ignored `.local-backup/react-version/` folder. Its generated dependencies and build output have been removed. The backup is not part of the active site or deployment.

## Preview locally

With Apache running in XAMPP, open **http://localhost/soundlab-academy/**.

Alternatively, from this project folder, run:

```sh
python -m http.server 8000
```

Then open **http://localhost:8000/**. Stop the preview server with `Ctrl+C`.

## GitHub Pages

The existing GitHub Pages configuration publishes the **main** branch from **/(root)**. The site's `index.html`, `styles.css`, `script.js`, and `assets/` belong directly in that root folder. No custom deployment workflow or Pages settings change is needed for this static version.

Asset paths are relative, so the site also works under a repository path such as `/soundlab-academy/`. Navigation uses in-page anchors and requires no server routing rules. If the public domain changes, update its references in `index.html`, `robots.txt`, and `sitemap.xml`.

## Contact form

The form posts directly to `https://formsubmit.co/ajax/17c0eee2e86f158fb37a87fddf750092`, preserving the endpoint from the original GitHub site. It uses AJAX and displays the thank-you popup without navigating away. Required-field validation, the honeypot field, error messages, and the WhatsApp option remain in place.

CAPTCHA is disabled through FormSubmit's `_captcha=false` setting. No Cloudflare widget, server API, secret keys, or environment variables are needed. Delivery still depends on that FormSubmit endpoint being activated for the intended mailbox. Mock submissions during automated checks to avoid sending test inquiries.

The contact address shown to visitors is `soundlabacademyhk@gmail.com`. It can wrap inside its card on narrow screens.

## Edit content

- **Teachers:** Edit each teacher's profile content in `index.html`. All four profiles include their supplied photographs and biographies. Rommel uses `assets/teacher-rommel-updated.jpg`, with the full photo visible in his bio popup and his original biography retained. Jenice's Voice profile includes her approved biography and quote.
- **Programs:** Edit the seven program cards in `index.html`. Their SVG files are saved in `assets/icons/`.
- **Gallery:** Edit the photo entries and captions in `index.html`. The four studio photos in `assets/gallery/` and four event photos in `assets/events/` use numbered filenames to preserve their supplied 01-04 order. Studio photos move right to left; event photos move left to right. Clicking a photo opens the larger viewer. Keyboard browsing and reduced motion preferences use static, scrollable strips.
- **Instagram:** The footer links to [@soundlabacademyhk](https://www.instagram.com/soundlabacademyhk/). Edit the social link in `index.html`; its SVG icon is saved in `assets/icons/instagram.svg`.

Content still to confirm: the descriptions for Music Theory, Flute, and Saxophone, and an approved social sharing image.
