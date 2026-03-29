# astroDaily 🌌

A polished archive and explorer for NASA's Astronomy Picture of the Day — every image ever published, searchable, filterable, and shareable.

**[astro-daily.vercel.app](https://astro--daily.vercel.app)** · Built with Astro.js, Supabase & Vercel

> Get images from space everyday!

![banner](/public/banner.png)

---

## What is this?

NASA has been publishing an Astronomy Picture of the Day since June 1995. That's nearly 30 years of stunning space imagery, each with a description written by a professional astronomer. astroDaily is an archive and explorer built on top of that dataset — faster to search, nicer to browse, and easier to share than NASA's own interface.

---

## Features

### Archive & Discovery
- **Full archive browser** — every APOD ever published, paginated and sorted by date
- **Full-text search** — search across titles and descriptions using Postgres `websearch_to_tsquery` under the hood, so natural queries like `"black hole james webb"` just work
- **Filter panel** — filter by decade, browse APODs released on the same calendar day across all years ("on this day"), and filter by copyright/public domain status
- **Related APODs** — each image page surfaces thematically related entries based on content similarity
- **Random APOD** — a dedicated random button that drops you somewhere unexpected in the archive

### Image & Gallery
- **Gallery page** — a visual grid of the archive optimized for browsing by image
- **HD downloads** — direct access to NASA's full-resolution originals where available
- **Image proxy via wsrv.nl** — consistent, fast image delivery with format negotiation and resizing, so the archive doesn't hammer NASA's CDN

### Sharing & API
- **Social sharing** — share any APOD directly to WhatsApp, Facebook, Twitter/X etc. with pre-filled text and the image URL and dynamic OG image support.
- **Public API** — a `/api/v1/apod` endpoint that mirrors NASA's API but with extended query params: `q` for full-text search, `decade`, `on_this_day`, `copyright`, and standard `start_date`/`end_date` pagination

### UI Details
- A cool modern brand favicon.
- Deep space aesthetic — near-black background, silver accents, Geist font + Geist icons
- Canvas starfield in the footer
- Staggered entrance animations on archive cards
- URL-driven search state — search/filter state lives in the URL, so results are shareable and the back button works

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | [Astro.js](https://astro.build) |
| Runtime | [Bun](https://bun.sh) |
| Database | [Supabase](https://supabase.com) (Postgres + full-text search) |
| Hosting | [Vercel](https://vercel.com) |
| Image proxy | [wsrv.nl](https://wsrv.nl) |
| Data source | [NASA APOD API](https://api.nasa.gov) |

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) v1.0+
- A [NASA API key](https://api.nasa.gov) (free, takes 30 seconds)
- A Supabase project with the APOD table set up (schema below)

### Installation

```bash
git clone https://github.com/jaydev-1510/astroDaily.git
cd astroDaily
bun install
```

### Environment Variables

Create a `.env` file in the project root:

```env
NASA_API_KEY=your_nasa_api_key_here
NASA_API_URL=https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}&
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_key
```

### Running Locally

```bash
bun dev
```

The app will be at `http://localhost:4321`.

---

## Database Schema

The main `apod` table in Supabase:

```sql
create table apod (
  date        date primary key,
  title       text not null,
  explanation text,
  url         text,
  hdurl       text,
  media_type  text,
  copyright   text,
  service_version text,
  -- full-text search column
  fts tsvector generated always as (
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(explanation, ''))
  ) stored
);

create index apod_fts_idx on apod using gin(fts);
```

---

## API Reference

Checkout the API docs [here](/docs/api.md)
astroDaily exposes a public `/api/v1/apod` endpoint with the following query parameters and more:

| Param | Type | Description |
|---|---|---|
| `date` | `YYYY-MM-DD` | Fetch a specific date |
| `start_date` | `YYYY-MM-DD` | Range start (use with `end_date`) |
| `end_date` | `YYYY-MM-DD` | Range end |
| `q` | string | Full-text search query |
| `decade` | `1990s`, `2000s`, … | Filter by decade |
| `on_this_day` | `MM-DD` | APODs from this calendar date across all years |
| `copyright` | `true` / `false` | Filter by copyright status |
| `page` | number | Page number (default: 1) |
| `count` | number | Results per page (default: 20, max: 100) |

Example:

```
GET /api/v1/apod?q=nebula&decade=2020s&page=1
```

---

## Project Structure

```
scripts/                                  # syncDB script
src/
├── pages/
│   ├── index.astro
│   ├── archive/
│   │   └── [year]/[month]/[day].astro
│   ├── gallery.astro
│   └── api/
│       └── v1/
│           └── apod.ts                   # Public API endpoint
├── components/
│   ├── archivePreview.astro
│   └── footer.astro
│   └── ...
├── lib/
│   ├── types/
│   └── database.ts
├── data/
├── icons/
├── types/
├── styles/
└── layouts/
```

---

## Roadmap

- [ ] Email/RSS subscription for daily APOD delivery
- [ ] User collections / favorites (auth)
- [ ] Better mobile gallery layout

---

## Acknowledgements

All astronomy images and descriptions are sourced from [NASA's APOD API](https://apod.nasa.gov/apod/astropix.html). Images are property of their respective copyright holders where noted.

---

## AI declaration

Gemini and Claude were used to guide me through the project. They were strictly used for developing the search/filter system and the masonry loading of images in gallery.

---

## Contributing

Open to all kinds of contributions and suggestions!

---

## License

[MIT](/LICENSE)

> Made with 💖 by Jaydev. Please share it with your friends.