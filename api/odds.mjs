// Vercel server function: GET /api/odds
// Fetches Ohio race polling from VoteHub's public polls API (no API key),
// filtered down to the Fox News-commissioned polls (run by the bipartisan
// pair Beacon Research/Shaw & Co. Research, tagged with sponsor "Fox News").
// Runs on Vercel's servers, so visitors' browsers never contact VoteHub.
// Vercel's cache keeps each answer for an hour, so VoteHub is asked at most
// about once an hour no matter how many people visit.

const BASE = 'https://api.votehub.com/polls';
const CACHE_SECONDS = 3600;
const SUBJECT = '2026 Ohio';
const SPONSOR = 'Fox News';

// Add a race here and it appears as a new tab. Nothing else needs to change.
const RACES = [
  {
    id: 'senate',
    label: 'U.S. Senate',
    subtitle: 'Ohio special election',
    pollType: 'us-senator',
    parties: { 'Jon Husted': { party: 'Republican', partyKey: 'R' }, 'Sherrod Brown': { party: 'Democratic', partyKey: 'D' } },
  },
  {
    id: 'governor',
    label: 'Governor',
    subtitle: 'Ohio',
    pollType: 'governor',
    parties: { 'Vivek Ramaswamy': { party: 'Republican', partyKey: 'R' }, 'Amy Acton': { party: 'Democratic', partyKey: 'D' } },
  },
];

const MONTH = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const POPULATION = { rv: 'registered voters', lv: 'likely voters', a: 'adults', v: 'voters' };

// "2026-10-15".."2026-10-19" -> "Oct 15-19, 2026". Different months/years
// spell out both ends: "Oct 30 - Nov 2, 2026".
function fieldworkRange(startStr, endStr) {
  const start = new Date(startStr + 'T00:00:00Z');
  const end = new Date(endStr + 'T00:00:00Z');
  const sameMonth = start.getUTCFullYear() === end.getUTCFullYear() && start.getUTCMonth() === end.getUTCMonth();
  const startPart = `${MONTH[start.getUTCMonth()]} ${start.getUTCDate()}`;
  const endPart = sameMonth ? `${end.getUTCDate()}` : `${MONTH[end.getUTCMonth()]} ${end.getUTCDate()}`;
  return `${startPart}–${endPart}, ${end.getUTCFullYear()}`;
}

function sampleLine(poll) {
  if (!poll.sample_size) return null;
  const who = POPULATION[poll.population] || 'respondents';
  return `${poll.sample_size.toLocaleString('en-US')} ${who}`;
}

function buildRace(race, polls) {
  const matches = polls.filter(
    (p) => p.subject === SUBJECT && p.poll_type === race.pollType && Array.isArray(p.sponsors) && p.sponsors.includes(SPONSOR)
  );
  if (matches.length === 0) throw new Error(`no Fox News poll found for ${race.id}`);
  // Most recent fieldwork wins.
  matches.sort((a, b) => (a.end_date < b.end_date ? 1 : a.end_date > b.end_date ? -1 : 0));
  const poll = matches[0];

  const candidates = Object.keys(race.parties)
    .map((name) => {
      const answer = (poll.answers || []).find((a) => a.choice === name);
      if (!answer) return null;
      return { name, ...race.parties[name], pct: answer.pct };
    })
    .filter(Boolean);
  if (candidates.length === 0) throw new Error(`no matching candidates for ${race.id}`);

  return {
    id: race.id,
    label: race.label,
    subtitle: race.subtitle,
    pollster: poll.pollster,
    fieldwork: fieldworkRange(poll.start_date, poll.end_date),
    sample: sampleLine(poll),
    url: poll.url,
    candidates,
  };
}

export async function GET() {
  let polls;
  try {
    const res = await fetch(BASE, { headers: { accept: 'application/json' } });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    polls = await res.json();
    if (!Array.isArray(polls)) throw new Error('unexpected response shape');
  } catch (e) {
    console.error(`votehub fetch failed: ${e.message}`);
    return Response.json({ error: 'poll data unavailable' }, {
      status: 502,
      headers: { 'Cache-Control': 'no-store' },
    });
  }

  // Keep going: one race missing a Fox News poll should not blank the others.
  const races = [];
  for (const race of RACES) {
    try {
      races.push(buildRace(race, polls));
    } catch (e) {
      console.error(`skipping ${race.id}: ${e.message}`);
    }
  }
  if (races.length === 0) {
    return Response.json({ error: 'poll data unavailable' }, {
      status: 502,
      headers: { 'Cache-Control': 'no-store' },
    });
  }
  return Response.json(
    {
      updated: new Date().toISOString(),
      source: 'VoteHub',
      credit: 'Fox News poll (Beacon Research/Shaw & Co.), via VoteHub (CC BY 4.0)',
      races,
    },
    {
      headers: {
        // Browsers re-ask every time; Vercel's cache answers for an hour,
        // then serves the old copy while it fetches a fresh one. Polls move
        // slowly, so an hour-old number is never materially wrong.
        'Cache-Control': `public, max-age=0, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=21600`,
      },
    }
  );
}
