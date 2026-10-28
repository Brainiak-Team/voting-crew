# Changelog

My Voting Crew follows [Semantic Versioning](https://semver.org): MAJOR.MINOR.PATCH. While the major number is 0, the app is in alpha: features are still arriving and saved lists may be reset. Each new design or feature set is a minor version, and bug fixes are patches. Each version is tagged on its commit.

## 0.4.0 "Privacy and list controls" (2026-10-27)

- "? Privacy" button, beside "Change the odds!", opens a pop-up that explains in full how the site treats privacy: where names are kept and how to erase them, what the site does not do, how the odds reach the page without visitors contacting Kalshi, and what the web host (Vercel) sees. Closes with its button, the Escape key, or a tap outside it.
- "−" button beside "+": removes the last line when it is empty. Never goes below five lines. Greyed out when there is nothing it may remove.
- Wide screens: the odds and the curved arrow stay in place while lines are added. Only the list grows down the page.
- Phones held sideways: the page is tightened to fit a short screen without scrolling until the list is expanded.
- The arrow's label sits further from the arrowhead.
- "Going" checkboxes are back, one per name. A ticked name is struck through, and the tick is saved with the list. The box is greyed out until its line has a name.
- When "−" brings the list back to five lines, the "Popular? Expand your list!" prompt returns.
- The odds source line now reads "Kalshi market odds."

## 0.3.0 "Bring your crew" (2026-10-27)

Redesign from Mainiak's sketch, in Republican red. The plain base stays on the `base-monochrome` branch.

- Big headline: "Bring your crew. Have an impact!"
- Five name lines. "Popular? Expand your list!" swaps with a down arrow every 5 seconds; tapping it doubles the list to ten, then a "+" button adds one line per tap, up to 50.
- "Change the odds!" switches between the Ohio Senate and Governor races every 15 seconds, Republican always on top, with a "Kalshi market odds, not a poll." source line.
- Curved "Who will you bring to the polls?" arrow and red-shadowed buttons.
- "Print a copy!" prints the headline and names only.
- Fits an iPhone screen held upright without scrolling until the list is expanded. Wide screens follow the sketch layout.
- Removed, following the sketch: the "Going" checkboxes, "Erase my list", and the chart, rules, tips and privacy sections. Lists saved by 0.2.0 do not carry over.

## 0.2.0 "Monochrome base" (2026-10-27)

- Plain black, white and gray theme, set by color values at the top of the page, as a base for campaign versions.
- Odds tracker on/off switch (`SHOW_ODDS`).
- Odds now come from a Vercel server function (`api/odds.mjs`), cached for 10 minutes, in place of the GitHub Action that committed `odds.json` every 10 minutes. Visitors still never contact Kalshi.
- Candidates are shaded by rank, not by party color.
- The footer no longer calls the page nonpartisan.

## 0.1.0 "First build" (2026-10-27)

- Five-friend Election Day checklist with "Going" checkboxes, saved only in the visitor's browser. Print and erase buttons.
- Ohio Senate and Governor odds from Kalshi, with a 30-day chart, refreshed by a GitHub Action.
