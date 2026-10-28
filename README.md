# My Voting Crew

An Election Day checklist: list the friends you will take to the polls (five lines, expandable to 40).

## Features

- One page (`index.html`), no build step, no dependencies.
- Names are stored only in the visitor's browser (local storage). No accounts, no analytics, nothing sent anywhere. The "Privacy" pop-up explains this to visitors; update its text in `index.html` if anything about data handling changes.
- Current design: "Bring your crew" redesign (Republican red). The plain monochrome base lives on the `base-monochrome` branch. To restyle, edit the color values at the top of the `<style>` block in `index.html`.
- A "More" screen sits to the right of the main page (swipe, or tap "More!"): a side-by-side issue comparison for the Governor (Ramaswamy R vs. Acton D) and U.S. Senate (Husted R vs. Brown D) races, drawn from the Republican candidates' campaign sites and each candidate's own site, with source links.
- Optional Ohio race polling tracker. Turn it off by setting `SHOW_ODDS = false` in the settings block at the top of the `<script>` in `index.html`. The tracker hides itself, rather than show stale numbers, if the request fails.
- Polling comes from `api/odds.mjs`, a Vercel server function that reads VoteHub's public polls API (no key), filtered to Fox News's Ohio polls (run by Beacon Research/Shaw & Co. Research), and is cached for an hour. Visitors' browsers never contact VoteHub. Add or remove races in its `RACES` list.
- "Print your list!" opens a pop-up with four options: print the visitor's own list (a sheet made for paper, with tick boxes and room for more names), print blank copies for friends (two to a page), print the `/flyer` page, or share the site's address (`navigator.share`, or clipboard copy where that isn't available). Sharing never sends names.
- `/flyer`: a printable US Letter flyer for a notice board or to hand out, with a locally generated QR code (no third-party QR service) to the site's own address. Prints full page or two to a page.
- A no-JavaScript fallback (`<noscript>`) explains the list needs JavaScript, instead of showing a broken page. A styled `404.html` covers pages that don't exist.
- iPhone: a swipe starting within 24px of the left or right screen edge is left alone, so Safari's own back/forward gesture still works there.
- Link previews (Open Graph and Twitter Card tags, `og.png`), a favicon and an apple-touch-icon.

## Hosting

Hosted on Vercel, on Mainiak's own account: https://voting-crew-eight.vercel.app. The project is **not Git-linked** — pushing to the repo does not deploy anything. Deploys are run from the command line via the Vercel REST API, from a tagged commit. The older address, https://voting-crew.vercel.app, still serves an earlier build from the Kangaroof team and has not yet been cleaned up.
