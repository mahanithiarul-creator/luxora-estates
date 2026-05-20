# LUXORA ESTATES — Futuristic Real Estate Platform (scaffold)

This repository is a scaffold for a premium, futuristic real-estate platform built with Next.js, TypeScript, Tailwind CSS, React Three Fiber, Framer Motion, GSAP, and Lenis.

Quick start

1. Install dependencies

```bash
cd project-root
npm install
```

2. Run development server

```bash
npm run dev
```

Project highlights

- React + Next.js + TypeScript
- Tailwind CSS for the luxury dark theme
- React Three Fiber scenes in `/components/Scene`
- Seamless page motion with Framer Motion and premium route transitions
- Smooth adaptive scrolling through Lenis in `/hooks/useLenis.ts`
- SEO-ready metadata + OpenGraph via `/components/Seo.tsx`
- Dynamic sitemap generation at `/sitemap.xml`
- Robots rules in `/public/robots.txt`
- Elegant launch loader, glassmorphism, and cinematic your preview

Important files

- [package.json](package.json)
- [pages/_app.tsx](pages/_app.tsx)
- [pages/index.tsx](pages/index.tsx)
- [components/CanvasScene.tsx](components/CanvasScene.tsx)
- [styles/globals.css](styles/globals.css)

Next steps (recommended)

- Add high-fidelity 3D models (GLTF/GLB) in `public/models` and load them with `@react-three/drei`'s `GLTFLoader`.
 - Add high-fidelity 3D models (GLTF/GLB) in `public/models` and HDRIs in `public/hdr`.
	 - Place `city.hdr` in `public/hdr` and `city.glb`, `villa.glb` etc. in `public/models`.
 - If using DRACO-compressed GLTFs put decoder files in `public/draco` (see `public/draco/README.md`).
 - For GPU compressed textures (KTX2/Basis), place transcoders in `public/basis` (see `public/basis/README.md`).

Automated asset download
1. Edit `public/asset-manifest.json` to add `recommended_url` values for assets you want to fetch.
2. Install `jq` and `curl` (macOS: `brew install jq curl`).
3. Run the script:

```bash
bash scripts/download-assets.sh
```

The script will download assets into `public/models` and `public/hdr` as specified in the manifest.
- Replace placeholder images with licensed photography or generated assets.
- Integrate search API and AI recommendation backend.
- Use 3D GLTF/GLB assets with DRACO/KTX2 compression for faster loading.
- Build a polished analytics and AI concierge dashboard for premium presentation.

Deployment

This project is ready for modern hosting platforms:

- Vercel: recommended for instant preview and global edge delivery.
- Netlify: supports static export plus serverless functions for analytics.
- Cloudflare Pages: fast CDN and edge-level performance for static assets.

Vercel deployment

1. Push the repository to GitHub.
2. Create a new Vercel project and connect the repo.
3. Set the production environment variables from `.env.example` in the Vercel dashboard.
4. Optionally use the Vercel CLI to deploy from your machine:

```bash
npm install -g vercel
vercel login
vercel --prod
```

If you want a production-ready Vercel config, use `vercel.json`.

Production build

```bash
npm install
npm run build
```

Environment variables

Use the provided `.env.example` to configure production metadata, social previews, and analytics:

```bash
NEXT_PUBLIC_SITE_URL=https://luxora-estates.vercel.app
NEXT_PUBLIC_TWITTER_HANDLE=@luxora_estates
NEXT_PUBLIC_OG_IMAGE=/preview.svg
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

Recruiter-ready launch

- Use the auto demo overlay to deliver fast, polished walkthroughs.
- Share `https://luxora-estates.vercel.app` as a premium launch preview.
- Capture screen recordings from the homepage hero and property detail flows for portfolio clips.

Social assets

- OpenGraph and Twitter preview metadata are configured in `/components/Seo.tsx`.
- Use `/preview.svg` or `NEXT_PUBLIC_OG_IMAGE` for custom social thumbnails.
- Add polished hero screenshots or generated mockups to `public/` for LinkedIn/X/Instagram posts.

Architecture overview

```text
┌───────────────────────┐    ┌───────────────────────────┐
│      Next.js pages     │    │  React Three Fiber Scenes │
│  /pages/index.tsx      │<-->|  /components/Scene/*      │
│  /pages/property/[id]  │    │  /components/Property/*   │
└───────────────────────┘    └───────────────────────────┘
           │
           ▼
┌───────────────────────┐
│   SEO + Social Preview│
│  /components/Seo.tsx  │
└───────────────────────┘
           │
           ▼
┌───────────────────────┐
│   Sitemap / Robots     │
│  /pages/sitemap.xml.ts │
│  /public/robots.txt    │
└───────────────────────┘
```

Showcase goals

- Launch-ready portfolio project with clean production metadata.
- Cinematic scroll interactions and premium page transitions.
- SEO and discoverability through OpenGraph, Twitter/X, structured data, sitemap, and robots rules.
- Lightweight 3D scene hydration via dynamic imports and client-only rendering.
- Elegant mobile, tablet, and desktop presentation for recruitment and awards.

License

This scaffold is for demonstration and prototype purposes.
