# My Voting Crew

A private, nonpartisan Election Day checklist: pick up to five friends to take to the polls.

- Static page (`index.html`), no build step, no dependencies.
- Names are stored only in the visitor's browser (local storage). No server, accounts, or analytics.
- Optional Ohio race odds tracker reads `odds.json`, refreshed every 10 minutes by a GitHub Action (`fetch-odds.mjs`, Kalshi public API, no key). Visitors never contact Kalshi.
