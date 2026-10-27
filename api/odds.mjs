// Vercel server function: GET /api/odds
// Fetches Ohio race odds from Kalshi's public market-data API (no API key).
// Runs on Vercel's servers, so visitors' browsers never contact Kalshi.
// Vercel's cache keeps each answer for 10 minutes, so Kalshi is asked at most
// about once every 10 minutes no matter how many people visit.

const BASE = 'https://external-api.kalshi.com/trade-api/v2';
const HISTORY_DAYS = 30;
const CACHE_SECONDS = 600;

// Add a race here and it appears as a new tab. Nothing else needs to change.
const RACES = [
  {
    id: 'senate',
    label: 'U.S. Senate',
    subtitle: 'Ohio special election',
    series: 'SENATEOHS',
    // Which party each market ticker belongs to (suffix after the last dash).
    parties: { D: 'Democratic', R: 'Republican' },
  },
  {
    id: 'governor',
    label: 'Governor',
    subtitle: 'Ohio',
    series: 'GOVPARTYOH',
    parties: { D: 'Democratic', R: 'Republican' },
  },
];

async function getJson(path) {
  const res = await fetch(BASE + path, { headers: { accept: 'application/json' } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${path}`);
  return res.json();
}

const num = (s) => (s === null || s === undefined || s === '' ? null : Number(s));

// Midpoint of bid/ask is a steadier "implied chance" than last trade on thin markets.
function impliedChance(m) {
  const bid = num(m.yes_bid_dollars);
  const ask = num(m.yes_ask_dollars);
  if (bid !== null && ask !== null && ask > 0) return (bid + ask) / 2;
  return num(m.last_price_dollars);
}

async function getHistory(race, m, start, now) {
  try {
    const c = await getJson(
      `/series/${race.series}/markets/${m.ticker}/candlesticks` +
        `?start_ts=${start}&end_ts=${now}&period_interval=1440`
    );
    return (c.candlesticks || [])
      .map((k) => {
        const bid = num(k.yes_bid?.close_dollars);
        const ask = num(k.yes_ask?.close_dollars);
        const p = bid !== null && ask !== null ? (bid + ask) / 2 : num(k.price?.close_dollars);
        return p === null ? null : { t: k.end_period_ts, p: Math.round(p * 1000) / 1000 };
      })
      .filter(Boolean);
  } catch (e) {
    console.error(`history failed for ${m.ticker}: ${e.message}`);
    return [];
  }
}

async function buildRace(race) {
  const { markets } = await getJson(`/markets?series_ticker=${race.series}&limit=100`);
  const open = markets.filter((m) => m.status === 'active');
  if (open.length === 0) throw new Error(`no active markets for ${race.series}`);

  const now = Math.floor(Date.now() / 1000);
  const start = now - HISTORY_DAYS * 86400;

  const candidates = await Promise.all(
    open.map(async (m) => {
      const partyKey = m.ticker.split('-').pop();
      const chance = impliedChance(m);
      return {
        ticker: m.ticker,
        name: m.yes_sub_title,
        party: race.parties[partyKey] || partyKey,
        partyKey,
        chance: chance === null ? null : Math.round(chance * 1000) / 1000,
        bid: num(m.yes_bid_dollars),
        ask: num(m.yes_ask_dollars),
        resolves: m.rules_primary,
        history: await getHistory(race, m, start, now),
      };
    })
  );
  // Each side's midpoint can add to 99-101%. Scale to 100 so the page never
  // shows a total that looks like a mistake. Raw bid/ask stay in the data.
  const total = candidates.reduce((t, c) => t + (c.chance ?? 0), 0);
  if (total > 0 && candidates.every((c) => c.chance !== null)) {
    for (const c of candidates) c.chance = Math.round((c.chance / total) * 1000) / 1000;
  }
  candidates.sort((a, b) => (b.chance ?? 0) - (a.chance ?? 0));

  return {
    id: race.id,
    label: race.label,
    subtitle: race.subtitle,
    series: race.series,
    closes: open[0].close_time,
    candidates,
  };
}

export async function GET() {
  const results = await Promise.allSettled(RACES.map(buildRace));
  // Keep going: one failed race should not blank the others.
  const races = [];
  results.forEach((r, i) => {
    if (r.status === 'fulfilled') races.push(r.value);
    else console.error(`skipping ${RACES[i].id}: ${r.reason?.message}`);
  });
  if (races.length === 0) {
    return Response.json({ error: 'odds unavailable' }, {
      status: 502,
      headers: { 'Cache-Control': 'no-store' },
    });
  }
  return Response.json(
    { updated: new Date().toISOString(), source: 'Kalshi', races },
    {
      headers: {
        // Browsers re-ask every time; Vercel's cache answers for 10 minutes,
        // then serves the old copy while it fetches a fresh one.
        'Cache-Control': `public, max-age=0, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=3000`,
      },
    }
  );
}
