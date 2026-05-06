## Goal

Replace the AI-generated product/banner images currently used in the project with the real product photography hosted on garmin.com.uz, so the catalog visually matches the official local distributor.

## Legal note

garmin.com.uz is the official Garmin distributor in Uzbekistan and uses Garmin's official press imagery. Since this project positions itself as the same distributor's storefront, reusing those product shots is appropriate. We'll download them locally (rather than hotlinking) so the site doesn't break if the source CDN changes.

## Approach

1. **Map our catalog → real source images.** For each product in `src/data/products.json`, find the matching product page on garmin.com.uz and grab its hero image URL from `https://garmin.com.uz/uploads/products/*.{png,webp,jpeg}`. Examples already discovered from the homepage:
   - fēnix 8 47mm Solar → `IGO2OfrN3u.png`
   - Enduro 3 → `BjDij0I0Oh.png`
   - Vivoactive 6 → `3a339cpywD.jpeg`
   - Forerunner 970 → `WfA7TK7YDE.webp`
   - Forerunner 570 → `OnHqFm6SCq.webp`
   - tactix 8 Solar Elite → `ColkYiJJBw.webp`
   - fēnix E → `kxYcVvGPRT.png`
   
   For products we have but aren't on the homepage carousel (Edge 1040/540, Venu 3, Instinct, Lily, Vivosmart 5, HRM-Pro, Varia, Striker, DriveSmart, GPSMAP 67, Approach S70, Descent Mk3, Tactix 7), I'll fetch each product's page (or the category listing) and pull the hero image the same way.

2. **Download images** with `curl` into `src/assets/products/` using the existing slug-based filenames (e.g. `fenix-8.webp`, `forerunner-970.webp`). Keep original format (webp/png/jpeg) — Vite handles all three. Overwrite the AI-generated PNGs.

3. **Update `src/lib/products.ts`** import map:
   - Change extensions where needed (e.g. `forerunner-265.png` → `forerunner-265.webp`).
   - Add a few new entries if I swap product IDs to better match what's actually sold (e.g. add `fenix-e`, `enduro-3`, `vivoactive-6`, `forerunner-970`, `forerunner-570`, `tactix-8`).

4. **Refresh `src/data/products.json`** so prices and names align with garmin.com.uz reality:
   - Convert the USD prices shown on garmin.com.uz to UZS (~12 600 UZS / USD, rounded to nearest 10 000) for consistency with the existing `сум` formatting.
   - Update names to match official spelling (fēnix, vívoactive, tactix).
   - Keep the same category slugs and `featured` flags.

5. **Banner/Hero images.** Also pull the 5 slider banners (`sH7jI6PGyR.webp`, `ojGAVN8WBn.jpeg`, `m4mo215yov.webp`, `BOgiKIwsdY.webp`, `xRcMN6V2Bp.jpeg`) into `src/assets/banners/` and wire one into `Hero.tsx` as the background/feature image (replacing the current AI hero asset).

6. **Verify** by viewing the home and catalog pages — every card should show a real product render with no broken images.

## Files touched

- `src/assets/products/*` — overwrite ~16 files, add a few new ones
- `src/assets/banners/*` — new directory with 3-5 banner images
- `src/lib/products.ts` — adjust image imports & map
- `src/data/products.json` — update names/prices/IDs to match official catalog
- `src/components/site/Hero.tsx` — swap hero image to the real banner
- (possibly) `src/routes/product.$id.tsx` — no logic change, just benefits from new images

## Out of scope

- No changes to cart, checkout, Telegram order flow, or routing.
- Not adding a real CMS — JSON stays the source of truth as agreed.
