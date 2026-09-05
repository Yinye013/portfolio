import type { Metadata } from 'next'
import { flagEmoji } from '@/lib/geo'
import { getRedis, isoDay, KEYS, RETENTION_DAYS, type VisitRecord } from '@/lib/redis'

export const metadata: Metadata = {
  title: 'Visitor dashboard',
  robots: { index: false, follow: false },
}

/** Counters change on every visit, so a cached render would always be stale. */
export const dynamic = 'force-dynamic'

const DAYS_CHARTED = 7
const ROWS_SHOWN = 50

/**
 * Upstash deserializes automatically, so a stored JSON string usually comes
 * back already parsed — but not on every client version. Accept both rather
 * than depending on which behaviour is active.
 */
function parseVisit(entry: unknown): VisitRecord | null {
  try {
    if (typeof entry === 'string') return JSON.parse(entry) as VisitRecord
    if (entry && typeof entry === 'object') return entry as VisitRecord
  } catch {
    // A record written by an older shape — skip it rather than blank the page.
  }
  return null
}

function toCount(value: unknown): number {
  const n = typeof value === 'string' ? Number(value) : value
  return typeof n === 'number' && Number.isFinite(n) ? n : 0
}

/** The last DAYS_CHARTED days, oldest first. */
function recentDays(): string[] {
  const today = Date.now()
  return Array.from({ length: DAYS_CHARTED }, (_, i) =>
    isoDay(new Date(today - (DAYS_CHARTED - 1 - i) * 86_400_000)),
  )
}

async function loadStats() {
  const redis = getRedis()
  if (!redis) return null

  const days = recentDays()
  const [total, dailyRaw, countriesRaw, visitsRaw] = await Promise.all([
    redis.get(KEYS.total),
    redis.mget(...days.map(KEYS.day)),
    redis.hgetall<Record<string, string>>(KEYS.countries),
    redis.lrange(KEYS.visits, 0, ROWS_SHOWN - 1),
  ])

  const daily = days.map((day, i) => ({ day, count: toCount((dailyRaw ?? [])[i]) }))

  const countries = Object.entries(countriesRaw ?? {})
    .map(([code, count]) => ({ code, count: toCount(count) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)

  const visits = (visitsRaw ?? []).map(parseVisit).filter((v): v is VisitRecord => v !== null)

  return { total: toCount(total), daily, countries, visits }
}

export default async function DashboardPage() {
  const stats = await loadStats()

  if (!stats) {
    return (
      <main className="min-h-screen grid place-items-center px-5">
        <p className="font-mono text-[11px] tracking-[0.12em] uppercase text-text-muted text-center">
          Redis is not configured — set UPSTASH_REDIS_REST_URL and _TOKEN.
        </p>
      </main>
    )
  }

  const today = stats.daily[stats.daily.length - 1]?.count ?? 0
  const week = stats.daily.reduce((sum, d) => sum + d.count, 0)
  const peak = Math.max(1, ...stats.daily.map((d) => d.count))

  return (
    <main className="min-h-screen py-9 px-5 sm:px-7">
      <header className="mb-7">
        <div className="flex items-center gap-2 mb-[6px]">
          <div className="w-[14px] h-px bg-text-muted" />
          <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-text-muted">
            Who came by
          </span>
        </div>
        <h1 className="font-display text-[28px] sm:text-[36px] tracking-[0.04em] leading-none">
          <span className="text-text-primary">Visitor </span>
          <span className="text-accent">dashboard.</span>
        </h1>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-7">
        <Stat label="All time" value={stats.total} />
        <Stat label="Today" value={today} />
        <Stat label="Last 7 days" value={week} />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-7">
        <Panel title="Daily">
          <div className="flex items-end gap-2 h-[110px]">
            {stats.daily.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-[6px] h-full justify-end">
                <span className="font-mono text-[10px] text-text-faint">{d.count}</span>
                <div
                  className="w-full bg-accent"
                  // Height is data-driven, so it cannot be a utility class.
                  style={{ height: `${Math.max(2, (d.count / peak) * 70)}px`, opacity: d.count ? 1 : 0.25 }}
                />
                <span className="font-mono text-[9px] tracking-[0.1em] uppercase text-text-faint">
                  {new Date(`${d.day}T00:00:00Z`).toLocaleDateString('en-GB', {
                    weekday: 'short',
                    timeZone: 'UTC',
                  })}
                </span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Top countries">
          {stats.countries.length === 0 ? (
            <Empty />
          ) : (
            <ul className="flex flex-col gap-2">
              {stats.countries.map((c) => (
                <li key={c.code} className="flex items-center justify-between gap-3">
                  <span className="text-[11px] text-text-muted">
                    {flagEmoji(c.code === 'XX' ? null : c.code)}{' '}
                    <span className="font-mono tracking-[0.1em]">{c.code}</span>
                  </span>
                  <span className="font-mono text-[11px] text-text-primary">{c.count}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </section>

      <Panel title={`Recent visits (last ${ROWS_SHOWN})`}>
        {stats.visits.length === 0 ? (
          <Empty />
        ) : (
          // Wide content scrolls inside its own container rather than widening
          // the page — see the overflow note in globals.css.
          <div className="overflow-x-auto">
            <table className="w-full text-[11px] text-text-muted border-collapse">
              <thead>
                <tr className="text-left font-mono text-[10px] tracking-[0.14em] uppercase text-text-faint">
                  <Th>When</Th>
                  <Th>Where</Th>
                  <Th>Network</Th>
                  <Th>Device</Th>
                  <Th>From</Th>
                  <Th>Page</Th>
                </tr>
              </thead>
              <tbody>
                {stats.visits.map((v) => (
                  <tr key={`${v.at}-${v.ip}`} style={{ borderTop: '0.5px solid var(--c-line)' }}>
                    <Td>
                      <span suppressHydrationWarning>
                        {new Date(v.at).toLocaleString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </Td>
                    <Td>
                      {flagEmoji(v.countryCode)}{' '}
                      {[v.city, v.country].filter(Boolean).join(', ') || 'Unknown'}
                    </Td>
                    <Td>
                      <span className="font-mono text-[10px]">{v.ip}</span>
                      {v.isp ? <span className="block text-text-faint">{v.isp}</span> : null}
                    </Td>
                    <Td>{v.client}</Td>
                    <Td className="max-w-[180px] truncate">{v.referrer}</Td>
                    <Td>{v.path}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      <p className="font-mono text-[10px] tracking-[0.12em] uppercase text-text-faint mt-5">
        IPs stored truncated · daily counts kept {RETENTION_DAYS} days · DNT honoured
      </p>
    </main>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-surface p-[18px]" style={{ border: '0.5px solid var(--c-line)' }}>
      <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-text-faint mb-2">{label}</p>
      <p className="font-display text-[32px] leading-none text-text-primary">{value}</p>
    </div>
  )
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-surface p-[18px] mb-3" style={{ border: '0.5px solid var(--c-line)' }}>
      <h2 className="font-mono text-[10px] tracking-[0.14em] uppercase text-text-faint mb-4">{title}</h2>
      {children}
    </section>
  )
}

function Empty() {
  return <p className="text-[11px] text-text-faint">Nothing recorded yet.</p>
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="font-normal pb-2 pr-4 whitespace-nowrap">{children}</th>
}

function Td({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <td className={`py-2 pr-4 align-top ${className}`}>{children}</td>
}
