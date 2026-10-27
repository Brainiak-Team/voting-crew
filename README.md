# My Voting Crew

An Election Day checklist: pick up to five friends to take to the polls.

- One page (`index.html`), no build step, no dependencies.
- Names are stored only in the visitor's browser (local storage). No accounts, no analytics, nothing sent anywhere.
- Plain monochrome base theme. To make a styled version, copy the repo and edit the color values at the top of the `<style>` block in `index.html`.
- Optional Ohio race odds tracker. Turn it off by setting `SHOW_ODDS = false` near the top of the second `<script>` in `index.html`.
- Odds come from `api/odds.mjs`, a Vercel server function that reads Kalshi's public API (no key) and is cached for 10 minutes. Visitors' browsers never contact Kalshi. Add or remove races in its `RACES` list.

Hosted on Vercel.
