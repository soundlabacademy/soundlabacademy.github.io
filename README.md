# SoundLab Academy

Static GitHub Pages version of the live site at `https://soundlabacademy.lovable.app`.

## Update gallery images

Replace these files and keep the same names:

- `assets/gallery/studio-1.jpg`
- `assets/gallery/studio-2.jpg`
- `assets/gallery/studio-3.jpg`

If you want different captions too, edit the three `<figcaption>` lines in `index.html`.

## Local preview

Open `index.html` directly in a browser, or serve the folder with any static server.

## Contact form email

GitHub Pages can only host static files, so it cannot send email by itself. The contact form uses FormSubmit:

- Form endpoint: `https://formsubmit.co/soundlabacademy.tech@gmail.com`
- First submission will send an activation email to `soundlabacademy.tech@gmail.com`.
- Open that activation email and confirm it once. After that, website inquiries are forwarded to the inbox.

The WhatsApp button stays client-side and opens a prefilled WhatsApp message.

## Publish to GitHub Pages

1. Create a GitHub repository.
2. Push this folder to the `main` branch.
3. In GitHub, open `Settings -> Pages`.
4. Under `Build and deployment`, choose `Deploy from a branch`.
5. Select `main` and `/ (root)`.
6. Save.

GitHub Pages will publish the site after a short deploy.
