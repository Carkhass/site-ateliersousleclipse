# Astro Starter Kit: Minimal

```sh
npm create astro@latest -- --template minimal
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```Directory structure:
└── carkhass-site-ateliersousleclipse/
    ├── README.md
    ├── arborescence.txt
    ├── astro.config.mjs
    ├── keystatic.config.ts
    ├── package.json
    ├── postcss.config.cjs
    ├── public-scripts-list.txt
    ├── tailwind.config.cjs
    ├── tailwind.config.mjs
    ├── tsconfig.json
    ├── public/
    │   ├── robots.txt
    │   ├── fonts/
    │   │   └── daggersquare/
    │   │       ├── daggersquare-oblique.woff
    │   │       ├── daggersquare-oblique.woff2
    │   │       ├── daggersquare.woff
    │   │       └── daggersquare.woff2
    │   └── images/
    │       ├── hero-hamon.webp
    │       ├── ligne-trempe.webp
    │       ├── merci-ateliersousleclipse2.webp
    │       ├── nav-droite.webp
    │       ├── nav-gauche.webp
    │       ├── play-button.webp
    │       └── tampon-dispo.webp
    ├── src/
    │   ├── components/
    │   │   ├── Button.astro
    │   │   ├── Card.astro
    │   │   └── ColorPalette.astro
    │   ├── content/
    │   │   ├── config.ts
    │   │   └── couteaux/
    │   │       ├── 2025-11-18-le-dernier-bon-ap-que-j-avais-en-commande.json
    │   │       ├── 2025-11-26-petty-couteau-d-office-japonais.json
    │   │       ├── 2025-11-27-petty-tsuki.json
    │   │       ├── 2025-11-28-butter-bon-ap.json
    │   │       ├── 2025-12-02-camp.json
    │   │       ├── 2025-12-03-encore-un-butter-bon-ap.json
    │   │       ├── 2025-12-04-aujourd-hui-pas-de-couteau-termine-a-vous-presente.json
    │   │       ├── 2025-12-05-video-du-dernier-camp-en-ebene-et-80crv2-vous-le-t.json
    │   │       ├── 2025-12-06-je-continue-sur-la-lancee-des-reels-avec-une-video.json
    │   │       ├── 2025-12-08-ce-soir-une-video-du-dernier-butter-bon-ap-il-est.json
    │   │       ├── 2025-12-19-petty-tsuki.json
    │   │       ├── 2025-12-20-petty-tsuki-encore.json
    │   │       ├── 2025-12-22-un-des-deux-derniers-tsuki-petty-ebene-noir-du-gab.json
    │   │       ├── 2026-01-15-tsuki-sujihiki-une-ligne-moderne-pour-ce-trancheur.json
    │   │       ├── 2026-01-15-tsuki-sujihiki.json
    │   │       ├── 2026-02-13-hier-j-ai-vecu-un-moment-hors-du-temps-lors-d-un-a.json
    │   │       ├── 2026-02-17-salut-tout-le-monde.json
    │   │       ├── 2026-02-18-lance-a-huitres.json
    │   │       ├── 2026-02-19-bonjour-tout-le-monde.json
    │   │       ├── 2026-02-20-bonsoir.json
    │   │       ├── 2026-02-24-le-grand-bon-ap-en-video.json
    │   │       ├── 2026-02-25-le-bon-ap-qui-accompagne-le-grand-d-il-y-a-quelque.json
    │   │       ├── 2026-02-26-le-dernier-bon-ap-en-video.json
    │   │       ├── 2026-03-03-salut-tout-le-monde.json
    │   │       ├── 2026-03-04-bonsoir-tout-le-monde.json
    │   │       ├── 2026-03-05-le-nakiri-en-video-joli-ce-red-heart-hein.json
    │   │       ├── 2026-03-10-bonsoir-tout-le-monde.json
    │   │       ├── 2026-03-11-bonsoir.json
    │   │       ├── 2026-03-12-bon-ap-c125u-et-ebene-de-macassar.json
    │   │       ├── 2026-03-19-bonsoir.json
    │   │       ├── 2026-03-20-bonsoir.json
    │   │       ├── 2026-03-23-le-nakiri-tsuki-en-detail-sur-ce-reel.json
    │   │       └── 2026-03-25-grand-bon-ap-kissaki.json
    │   ├── layouts/
    │   │   └── BaseLayout.astro
    │   ├── pages/
    │   │   ├── couteaux.astro
    │   │   ├── index.astro
    │   │   ├── me-connaitre.astro
    │   │   └── test.astro
    │   ├── scripts/
    │   │   ├── animations/
    │   │   │   ├── header-hero.js
    │   │   │   └── reveal-on-scroll.js
    │   │   ├── features/
    │   │   │   ├── booking-modal.js
    │   │   │   ├── booking.js
    │   │   │   ├── carte-3d.js
    │   │   │   ├── knife-filters.js
    │   │   │   ├── popupform.js
    │   │   │   ├── show-knife.js
    │   │   │   └── sticky-section-title.js
    │   │   ├── init/
    │   │   │   ├── init-embla.js
    │   │   │   ├── init-swiper-glightbox.js
    │   │   │   └── observer-carousels.js
    │   │   └── layout/
    │   │       ├── header-sticky.js
    │   │       ├── hero-animation.js
    │   │       ├── menu-mobile.js
    │   │       ├── parallax.js
    │   │       └── theme-toggle.js
    │   └── styles/
    │       ├── global.css
    │       └── tailwind.css
    └── .github/
        └── workflows/
            └── deploy.yml
astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
