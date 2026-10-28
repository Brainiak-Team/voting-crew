# Changelog

My Voting Crew follows [Semantic Versioning](https://semver.org): MAJOR.MINOR.PATCH. Versions before 1.0.0 were the alpha: features were still arriving and saved lists could be reset. From 1.0.0 on, a saved list is kept across updates, and a change that would break it would be a new major version. Each new design or feature set is a minor version, and bug fixes are patches. Each version is tagged on its commit.

## 1.0.0 (2026-10-28)

- First stable release. The app is complete and usable: the private list, printing, the flyer, sharing, the issue comparison and the poll tracker, at https://bringyourcrew.com. Same features as 0.13.0; only the version number changes.

## 0.13.0 "Domain" (2026-10-28)

- The site has its own address: https://bringyourcrew.com (Mainiak's domain, bought on Namecheap). It forwards to https://www.bringyourcrew.com. The old address, https://voting-crew-eight.vercel.app, keeps working, so flyers already printed still scan.
- The flyer's QR code now encodes https://www.bringyourcrew.com/ (same settings: error correction level H, four-module quiet zone), and the flyer prints the short address "bringyourcrew.com".
- The list sheet and blank copies print "bringyourcrew.com" at the bottom. The Share button shares https://www.bringyourcrew.com.
- Link previews point to the new address, and the preview picture, og.png, is redrawn to show bringyourcrew.com.
- votingcrew.com, also Mainiak's, loads the same site but is not printed or shared anywhere.

## 0.12.2 (2026-10-28)

- On desktop, the "More!" hint now lines up with the middle of the page box instead of the middle of the window, so it no longer floats below the box on tall windows.

## 0.12.1 (2026-10-28)

- On desktop, the "More!" hint now sits just to the right of the page box instead of at the far edge of the window, where it was easy to miss.
- Fixed a stray horizontal scrollbar on desktop, caused by the issue tables' hidden captions escaping the screen clip.

## 0.12.0 "Issues" (2026-10-28)

- The "More" screen's placeholder is replaced with a side-by-side issue comparison for Governor (Vivek Ramaswamy R vs. Amy Acton D) and U.S. Senate (Jon Husted R vs. Sherrod Brown D). Issues are taken from each race's Republican campaign site; each candidate's own position, including the Democrat's, comes from that candidate's own site. Where a site doesn't address an issue, the cell says so. A table on wider screens, stacked "Issue / R / D" blocks on a phone. Neutral styling throughout, with source links for each race.
- The race tracker now shows polling instead of a prediction market: `api/odds.mjs` reads Fox News's Ohio polls (run by Beacon Research/Shaw & Co. Research) from VoteHub's free public polls API, replacing Kalshi. The tracker shows "Latest Fox News poll," the fieldwork dates and sample size, and credits "Fox News poll (Beacon Research/Shaw & Co.), via VoteHub (CC BY 4.0)." Cached for an hour, since polls don't move minute to minute. The tracker still hides itself if the fetch fails; poll age no longer counts as staleness, since a poll is expected to be weeks old.

## 0.11.0 "Release candidate" (2026-10-28)

- README.md brought up to date: full feature list, the /flyer page, and hosting details (Mainiak's own Vercel account, deployed from the command line via the REST API, not Git-linked).
- A 1.0 readiness checklist, listing what's built, what still needs Mainiak's decision (More screen content, the poll-source question, swipe-direction confirmation, real-phone testing, old-address cleanup), and a hand-test list for a real phone.

## 0.10.0 "Polish" (2026-10-28)

- The "? Privacy" button no longer competes with "Change the odds!" for attention. It's now a small text link with a round "?" mark, tucked beside the heading at every screen size, including when the odds tracker is hidden.
- A wording and consistency pass across the main page, the More placeholder, both dialogs, the print sheet, the flyer and the 404 page: capitalisation, punctuation and button phrasing were checked against each other. Everything already matched; no wording changes were needed beyond the Privacy button above.

## 0.9.0 "Sturdy" (2026-10-28)

- On iPhone, a swipe that starts within 24px of the left or right screen edge is left alone, so Safari's own back/forward gesture works there instead of sliding to "More".
- With JavaScript off, a plain message explains that the list (and even the blank sheet to print) needs it, instead of a broken page.
- A 404 page in the site's own style, with a link back to the list.
- The odds tracker now also stays hidden if the data it received is more than an hour old, the same as when the request fails outright.
- Accessibility pass: checked keyboard focus, input and dialog labelling, and text contrast across the site. All were already in order; no changes were needed beyond what's listed above.

## 0.8.0 "Share" (2026-10-28)

- Link previews: when the address is pasted into a chat or social post, it now shows a title, description and a preview image (Open Graph and Twitter card tags). The preview image, og.png, is a static 1200x630 picture in the site's own style.
- A small favicon (favicon.svg, a red-shadowed checkmark) and an apple-touch-icon for home screens.
- A "Share" button in the print pop-up. Where the device offers its own share sheet, it opens that with the site's title and address; otherwise it copies the address to the clipboard and shows "Link copied!" briefly. It never sends the visitor's names.

## 0.7.0 "Flyer" (2026-10-28)

- A new page, /flyer: a printable US Letter flyer for a notice board or to hand out. Headline "Bring your crew. Have an impact!", a line inviting people to make their own list of friends to take to the polls, "Election Day: Tuesday, November 3, 2026", "Ohio polls are open 6:30 a.m. to 7:30 p.m.", a QR code to the site, the address in text, and "Names stay on your phone. No sign-up." A "Print this flyer" button on screen, hidden in print, with a link back to the list.
- The flyer prints full page or two to a page, with a dashed "CUT HERE" line between, matching the blank copies on the list sheet.
- The QR code is generated locally (the "qrcode" npm package) as inline SVG, error correction level H, with a four-module quiet zone, encoding exactly https://voting-crew-eight.vercel.app/.
- The print pop-up gets a third choice, "Print a flyer with a QR code", linking to /flyer.
- The list sheet and blank copies now also print "Ohio polls are open 6:30 a.m. to 7:30 p.m." under the Election Day line, on both the one-page and half-page layouts.

## 0.6.0 "Print" (2026-10-28)

- "Print a copy!" is now "Print your list!". It opens a small pop-up with two choices: "Print my list" and "Print blank copies for your friends!". The pop-up closes with its Close button, the Escape key, or a tap outside it, and works from the keyboard alone.
- "Print my list" prints a sheet made for paper, not a copy of the screen: the headline, "Who will you bring to the polls?", "Election Day: Tuesday, November 3, 2026", then your names, numbered, each with a box to tick, and blank lines after them up to sixteen. Names marked "Going" print with the box already ticked. Empty lines between names are closed up. The site's address sits small at the bottom.
- A list longer than sixteen names prints on two pages, with lines to 44 and no line cut in half.
- "Print blank copies for your friends!" prints two empty lists to a page, ten lines each, with a dashed "CUT HERE" line between them.
- The sheet is black and white apart from the red shadow, which prints only when the printer is set to print backgrounds. Odds, buttons, pop-ups and the "More" screen never print.
- Printing from the browser's own menu (Ctrl+P, File > Print) prints "my list", from either screen.
- The privacy pop-up now names the button "Print your list!".

## 0.5.0 "More screen" (2026-10-28)

- A second screen, "More", sits to the right of the page. On a phone, swipe the page from right to left to bring it in, and swipe back the other way to return. Only a clearly sideways swipe counts, so scrolling the list up and down, typing names and selecting text work as before.
- A small upright "More!" at the right edge of the page fades in, stays about one and a half seconds, then is gone for three and a half, every five seconds. Tapping or clicking it opens "More". On "More", a "Back" button returns to the page, as do the Escape and left arrow keys.
- "More" holds a placeholder ("Coming soon.") until its design is ready.
- Visitors who ask their device for reduced motion get no sliding: the screens switch at once, and "More!" stays in view without blinking.
- "Print a copy!" still prints the headline and names only, from either screen.
- The "+" button now stops at 40 lines (was 50). A saved list longer than 40 is shortened to 40.
- Hosting moved to Mainiak's own Vercel account. The site now lives at https://voting-crew-eight.vercel.app and is deployed from the command line, not from GitHub. The old address, voting-crew.vercel.app, stays on the Kangaroof account until that project is deleted.

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
