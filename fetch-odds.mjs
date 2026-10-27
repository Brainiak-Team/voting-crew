#!/usr/bin/env node
// Builds odds.json from Kalshi's public market-data API (no API key needed).
// Run on a schedule (every few minutes). Visitors only ever read odds.json
// from this site, so their browsers never contact Kalshi.
//
//   node fetch-odds.mjs            -> writes ./odds.json
//   node fetch-odds.mjs out.json   -> writes a different path

import { writeFile } from 'node:fs/promises';

const BASE = 'https://external-api.kalshi.com/trade-api/v2';
const HISTORY_DAYS = 30;

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

async function buildRace(race) {
  const { markets } = await getJson(`/markets?series_ticker=${race.series}&limit=100`);
  const open = markets.filter((m) => m.status === 'active');
  if (open.length === 0) throw new Error(`no active markets for ${race.series}`);

  const now = Math.floor(Date.now() / 1000);
  const start = now - HISTORY_DAYS * 86400;

  const candidates = [];
  for (const m of open) {
    const partyKey = m.ticker.split('-').pop();
    let history = [];
    try {
      const c = await getJson(
        `/series/${race.series}/markets/${m.ticker}/candlesticks` +
          `?start_ts=${start}&end_ts=${now}&period_interval=1440`
      );
      history = (c.candlesticks || [])
        .map((k) => {
          const bid = num(k.yes_bid?.close_dollars);
          const ask = num(k.yes_ask?.close_dollars);
          const p = bid !== null && ask !== null ? (bid + ask) / 2 : num(k.price?.close_dollars);
          return p === null ? null : { t: k.end_period_ts, p: Math.round(p * 1000) / 1000 };
        })
        .filter(Boolean);
    } catch (e) {
      console.error(`history failed for ${m.ticker}: ${e.message}`);
    }
    const chance = impliedChance(m);
    candidates.push({
      ticker: m.ticker,
      name: m.yes_sub_title,
      party: race.parties[partyKey] || partyKey,
      partyKey,
      chance: chance === null ? null : Math.round(chance * 1000) / 1000,
      bid: num(m.yes_bid_dollars),
      ask: num(m.yes_ask_dollars),
      volume24h: num(m.volume_24h_fp),
      resolves: m.rules_primary,
      history,
    });
  }
  // Each side's midpoint can add to 99-101%. Scale to 100 so the page never
  // shows a total that looks like a mistake. Raw bid/ask stay in the file.
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
    kalshiUrl: `https://kalshi.com/markets/${race.series.toLowerCase()}`,
    candidates,
  };
}

const out = process.argv[2] || 'odds.json';
const races = [];
for (const race of RACES) {
  try {
    races.push(await buildRace(race));
  } catch (e) {
    // Keep going: one failed race should not blank the others.
    console.error(`skipping ${race.id}: ${e.message}`);
  }
}
if (races.length === 0) {
  console.error('no races fetched; leaving existing file untouched');
  process.exit(1);
}

await writeFile(
  out,
  JSON.stringify({ updated: new Date().toISOString(), source: 'Kalshi', races }, null, 1) + '\n'
);
console.log(`wrote ${out}: ${races.map((r) => `${r.id}(${r.candidates.length})`).join(', ')}`);
