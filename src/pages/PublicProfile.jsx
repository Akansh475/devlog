import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { ProfileSkeleton } from "../components/Skeletons";
import { ProfileEmptyLogs } from "../components/EmptyState";
import { useErrorBanner } from "../components/ErrorBanner";
import api from "../api/axios";

function formatMemberSince(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return `Member since ${d.toLocaleString("default", { month: "long", year: "numeric" })}`;
}
function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("default", { month: "short", day: "numeric", year: "numeric" });
}
function formatMinutes(mins) {
  if (!mins) return null;
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60), m = mins % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

// ─── Heatmap ─────────────────────────────────────────────────────────────────

function buildHeatmapData(logs) {
  const map = {};
  logs.forEach((log) => {
    if (!log.date && !log.createdAt) return;
    const day = (log.date || log.createdAt).slice(0, 10);
    if (!map[day]) map[day] = { total: 0, logs: [] };
    const spent = typeof log.timeSpent === "number" ? log.timeSpent : null;
    map[day].total += spent ?? 0;
    map[day].logs.push(log);
    if (spent === null) map[day].hasNullLog = true;
  });
  return map;
}

function getColor(d) {
  if (!d) return "#1e1e2e";
  const { total, hasNullLog } = d;
  if (total === 0 && hasNullLog) return "#3730a3";
  if (total === 0) return "#1e1e2e";
  if (total < 30)  return "#3730a3";
  if (total < 60)  return "#4f46e5";
  if (total < 120) return "#6366f1";
  if (total < 180) return "#818cf8";
  return "#a5b4fc";
}

const DAY_LABELS = ["", "M", "", "W", "", "F", ""];
const CELL = 12, GAP = 3, LEFT_PAD = 20, TOP_PAD = 24;

function ContributionHeatmap({ logs }) {
  const [tooltip, setTooltip] = useState(null);
  const wrapperRef = useRef(null);
  const dayMap = buildHeatmapData(logs);

  const today = new Date(); today.setHours(0,0,0,0);
  const start = new Date(today); start.setDate(today.getDate() - 364);
  start.setDate(start.getDate() - start.getDay());

  const weeks = [];
  let cur = new Date(start);
  while (cur <= today) {
    const week = [];
    for (let d = 0; d < 7; d++) { week.push(new Date(cur)); cur.setDate(cur.getDate()+1); }
    weeks.push(week);
  }

  const monthLabels = [];
  let lastMonth = -1;
  weeks.forEach((week, wi) => {
    const m = week[0].getMonth();
    if (m !== lastMonth) { monthLabels.push({ wi, label: week[0].toLocaleString("default", { month: "short" }) }); lastMonth = m; }
  });

  const svgW = LEFT_PAD + weeks.length * (CELL + GAP);
  const svgH = TOP_PAD + 7 * (CELL + GAP);

  const onEnter = (e, day, data) => {
    if (!wrapperRef.current || !data) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    setTooltip({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      date: day.toLocaleDateString("default", { weekday:"short", month:"short", day:"numeric", year:"numeric" }),
      titles: data.logs.map(l => l.title).join(", "),
      time: data.total ? formatMinutes(data.total) : null,
    });
  };

  return (
    <div ref={wrapperRef} className="heatmap-wrapper">
      <div style={{ overflowX: "auto", paddingBottom: 4 }}>
        <svg width={svgW} height={svgH} style={{ display: "block", overflow: "visible" }}>
          {monthLabels.map(({ wi, label }) => (
            <text key={wi} x={LEFT_PAD + wi*(CELL+GAP)} y={TOP_PAD-8} fill="#6b7280" fontSize="10" fontFamily="'JetBrains Mono',monospace">{label}</text>
          ))}
          {DAY_LABELS.map((label, di) => label ? (
            <text key={di} x={LEFT_PAD-5} y={TOP_PAD+di*(CELL+GAP)+CELL-1} fill="#6b7280" fontSize="9" fontFamily="'JetBrains Mono',monospace" textAnchor="end">{label}</text>
          ) : null)}
          {weeks.map((week, wi) => week.map((day, di) => {
            if (day > today) return null;
            const key = day.toISOString().slice(0,10);
            const data = dayMap[key];
            return (
              <rect key={key}
                x={LEFT_PAD+wi*(CELL+GAP)} y={TOP_PAD+di*(CELL+GAP)}
                width={CELL} height={CELL} rx={2} fill={getColor(data)}
                style={{ cursor: data ? "pointer" : "default" }}
                onMouseEnter={(e) => onEnter(e, day, data)}
                onMouseLeave={() => setTooltip(null)}
              />
            );
          }))}
        </svg>
      </div>

      {tooltip && (
        <div className="heatmap-tooltip" style={{
          left: Math.min(tooltip.x+14, (wrapperRef.current?.offsetWidth??600)-220),
          top: tooltip.y - 60,
        }}>
          <div className="tt-date">{tooltip.date}</div>
          <div className="tt-title">{tooltip.titles}</div>
          {tooltip.time && <div className="tt-time">⏱ {tooltip.time}</div>}
        </div>
      )}

      <div className="heatmap-legend">
        <span>Less</span>
        {["#1e1e2e","#3730a3","#4f46e5","#6366f1","#818cf8","#a5b4fc"].map(c => (
          <div key={c} style={{ width:11, height:11, borderRadius:2, background:c }} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}

// ─── Log Card ─────────────────────────────────────────────────────────────────

function LogCard({ log }) {
  const [expanded, setExpanded] = useState(false);
  const preview = log.content?.slice(0, 150);
  const hasMore = log.content?.length > 150;
  return (
    <div className={`lc ${expanded ? "lc-expanded" : ""}`} onClick={() => setExpanded(!expanded)}>
      <div className="lc-header">
        <div className="lc-meta">
          <span className="lc-date">{formatDate(log.date || log.createdAt)}</span>
          {log.timeSpent && <span className="lc-badge">⏱ {formatMinutes(log.timeSpent)}</span>}
        </div>
        <span className="lc-arrow">{expanded ? "↑" : "↓"}</span>
      </div>
      <h3 className="lc-title">{log.title}</h3>
      {log.tags?.length > 0 && (
        <div className="lc-tags">{log.tags.map(tag => <span key={tag} className="lc-tag">#{tag}</span>)}</div>
      )}
      <p className="lc-content">{expanded ? log.content : preview + (hasMore ? "…" : "")}</p>
      {!expanded && hasMore && <span className="lc-more">Read more</span>}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function PublicProfile() {
  const { username } = useParams();
  const [profile, setProfile]         = useState(null);
  const [logs, setLogs]               = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  const { ErrorBanner, showError }    = useErrorBanner();

  useEffect(() => {
    if (!username) return;
    document.title = `${username}'s DevLog | DevLog`;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement("meta"); meta.name = "description"; document.head.appendChild(meta); }
    meta.content = `${username}'s public learning journal on DevLog.`;
    return () => { document.title = "DevLog"; };
  }, [username]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [pRes, lRes] = await Promise.all([
          api.get(`/api/users/${username}`),
          api.get(`/api/logs/user/${username}`),
        ]);
        if (!pRes.ok) {
          const data = await pRes.json().catch(() => ({}));
          throw new Error(data.message || data.error || "User not found");
        }
        const [pData, lData] = await Promise.all([pRes.data, lRes.data]);
setProfile(pData);
setLogs(Array.isArray(lData) ? lData : lData.logs || []);

      } catch (err) {
        setError(err.message);
        showError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [username]);

  const allTags = [...new Set(logs.flatMap(l => l.tags || []))].sort();
  const sortedLogs = [...(selectedTag ? logs.filter(l => l.tags?.includes(selectedTag)) : logs)]
    .sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));

  if (loading) return <ProfileSkeleton />;

  if (error) return (
    <div className="pp-center">
      <ErrorBanner />
      <span style={{ fontSize: "2rem" }}>⚠</span>
      <p style={{ color: "#6b7280", fontFamily: "JetBrains Mono,monospace", fontSize: 13 }}>{error}</p>
      <Link to="/" style={{ color: "#6366f1", fontFamily: "JetBrains Mono,monospace", fontSize: 12 }}>← Back to DevLog</Link>
    </div>
  );

  return (
    <>
      <ErrorBanner />
      <style>{STYLES}</style>
      <div className="pp">
        <div className="pp-nav">
          <Link to="/" className="pp-logo"><span className="pp-logo-dev">DEV</span><span className="pp-logo-log">LOG</span></Link>
          <span className="pp-nav-label">Public Profile</span>
        </div>

        <header className="pp-header">
          <div className="pp-header-inner">
            <div className="pp-avatar">{username?.[0]?.toUpperCase()}</div>
            <div className="pp-info">
              <div className="pp-public-tag">✦ Public profile</div>
              <h1 className="pp-username">{username}</h1>
              <p className="pp-since">{formatMemberSince(profile?.memberSince)}</p>
              <div className="pp-stats">
                {[
                  { icon:"🔥", value: profile?.currentStreak??0, label:"Streak" },
                  { icon:"🏆", value: profile?.longestStreak??0, label:"Best" },
                  { icon:"⚡", value: profile?.xpPoints??0,      label:"XP" },
                  { icon:"📝", value: logs.length,               label:"Logs" },
                ].map(({ icon, value, label }) => (
                  <div key={label} className="pp-stat">
                    <span className="pp-stat-icon">{icon}</span>
                    <span className="pp-stat-val">{value}</span>
                    <span className="pp-stat-lbl">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </header>

        <div className="pp-body">
          <section className="pp-section">
            <div className="pp-section-header">
              <div className="pp-section-dot" />
              <h2 className="pp-section-title">Contribution Activity</h2>
            </div>
            <div className="pp-card"><ContributionHeatmap logs={logs} /></div>
          </section>

          <section className="pp-section">
            <div className="pp-section-header">
              <div className="pp-section-dot" />
              <h2 className="pp-section-title">Learning Logs</h2>
              <span className="pp-log-count">{sortedLogs.length} entries</span>
            </div>

            {allTags.length > 0 && (
              <div className="pp-tag-row">
                {allTags.map(tag => (
                  <button key={tag}
                    className={`pp-tag-chip ${selectedTag === tag ? "active" : ""}`}
                    onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}>
                    #{tag}
                  </button>
                ))}
              </div>
            )}

            {sortedLogs.length === 0
              ? <ProfileEmptyLogs username={username} />
              : <div className="pp-feed">{sortedLogs.map(log => <LogCard key={log._id||log.id} log={log} />)}</div>
            }
          </section>
        </div>
      </div>
    </>
  );
}

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Syne:wght@400;600;800&display=swap');
  .pp { min-height:100vh; background:#0b0b10; color:#e2e8f0; font-family:'Syne',sans-serif; isolation:isolate; }
  .pp-nav { display:flex; align-items:center; justify-content:space-between; padding:14px 32px; border-bottom:1px solid #1a1a2e; background:#0b0b10; }
  .pp-logo { font-family:'Syne',sans-serif; font-weight:800; font-size:1.1rem; letter-spacing:.04em; text-decoration:none; }
  .pp-logo-dev { color:#f1f5f9; } .pp-logo-log { color:#6366f1; }
  .pp-nav-label { font-family:'JetBrains Mono',monospace; font-size:10px; color:#374151; letter-spacing:.15em; text-transform:uppercase; }
  .pp-header { background:linear-gradient(160deg,#0f0f1c 0%,#111120 50%,#16101e 100%); border-bottom:1px solid #1a1a2e; padding:52px 32px 40px; }
  .pp-header-inner { max-width:900px; margin:0 auto; display:flex; gap:32px; align-items:flex-start; }
  .pp-avatar { width:88px; height:88px; border-radius:20px; background:linear-gradient(135deg,#6366f1 0%,#4338ca 100%); display:flex; align-items:center; justify-content:center; font-family:'Syne',sans-serif; font-size:2.4rem; font-weight:800; color:#fff; flex-shrink:0; box-shadow:0 0 0 1px rgba(99,102,241,.3),0 0 32px rgba(99,102,241,.2),0 8px 24px rgba(0,0,0,.4); }
  .pp-info { flex:1; min-width:0; }
  .pp-public-tag { display:inline-flex; align-items:center; gap:5px; font-family:'JetBrains Mono',monospace; font-size:10px; color:#6366f1; background:rgba(99,102,241,.08); border:1px solid rgba(99,102,241,.2); border-radius:999px; padding:3px 10px; letter-spacing:.1em; text-transform:uppercase; margin-bottom:10px; }
  .pp-username { font-family:'Syne',sans-serif; font-size:2.6rem; font-weight:800; color:#f8fafc; margin:0 0 6px; letter-spacing:-.03em; line-height:1; }
  .pp-since { font-family:'JetBrains Mono',monospace; font-size:11px; color:#4b5563; margin:0 0 22px; }
  .pp-stats { display:flex; flex-wrap:wrap; gap:8px; }
  .pp-stat { display:flex; align-items:center; gap:7px; background:rgba(255,255,255,.03); border:1px solid #1f2035; border-radius:10px; padding:8px 16px; font-family:'JetBrains Mono',monospace; transition:border-color .15s; }
  .pp-stat:hover { border-color:rgba(99,102,241,.3); }
  .pp-stat-icon { font-size:15px; } .pp-stat-val { font-size:16px; font-weight:700; color:#f1f5f9; } .pp-stat-lbl { font-size:10px; color:#4b5563; text-transform:uppercase; letter-spacing:.08em; }
  .pp-body { max-width:900px; margin:0 auto; padding:44px 32px 100px; display:flex; flex-direction:column; gap:52px; }
  .pp-section-header { display:flex; align-items:center; gap:10px; margin-bottom:16px; }
  .pp-section-dot { width:6px; height:6px; border-radius:50%; background:#6366f1; flex-shrink:0; }
  .pp-section-title { font-family:'JetBrains Mono',monospace; font-size:11px; font-weight:700; letter-spacing:.18em; text-transform:uppercase; color:#6b7280; margin:0; flex:1; }
  .pp-log-count { font-family:'JetBrains Mono',monospace; font-size:10px; color:#374151; letter-spacing:.08em; }
  .pp-card { background:#0f0f18; border:1px solid #1a1a2e; border-radius:14px; padding:28px 28px 20px; }
  .heatmap-wrapper { position:relative; }
  .heatmap-tooltip { position:absolute; z-index:20; pointer-events:none; background:#13131f; border:1px solid #2a2a45; border-radius:8px; padding:9px 13px; font-family:'JetBrains Mono',monospace; font-size:11px; box-shadow:0 8px 32px rgba(0,0,0,.6); min-width:160px; max-width:220px; }
  .tt-date { color:#818cf8; font-weight:600; margin-bottom:3px; } .tt-title { color:#c4c7d1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; } .tt-time { color:#4b5563; margin-top:3px; }
  .heatmap-legend { display:flex; align-items:center; gap:5px; margin-top:14px; font-family:'JetBrains Mono',monospace; font-size:10px; color:#4b5563; }
  .heatmap-legend span { margin:0 2px; }
  .pp-tag-row { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:18px; }
  .pp-tag-chip { background:transparent; border:1px solid #1f2035; color:#6366f1; border-radius:999px; padding:4px 13px; font-family:'JetBrains Mono',monospace; font-size:11px; cursor:pointer; transition:all .15s; }
  .pp-tag-chip:hover { background:rgba(99,102,241,.1); border-color:#6366f1; } .pp-tag-chip.active { background:#6366f1; border-color:#6366f1; color:#fff; }
  .pp-feed { display:flex; flex-direction:column; gap:10px; }
  .lc { background:#0f0f18; border:1px solid #1a1a2e; border-radius:12px; padding:20px 22px; cursor:pointer; transition:border-color .15s,box-shadow .15s,transform .1s; }
  .lc:hover { border-color:rgba(99,102,241,.35); transform:translateY(-1px); box-shadow:0 4px 20px rgba(0,0,0,.3); }
  .lc-expanded { border-color:rgba(99,102,241,.4); }
  .lc-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; }
  .lc-meta { display:flex; align-items:center; gap:10px; }
  .lc-date { font-family:'JetBrains Mono',monospace; font-size:11px; color:#374151; }
  .lc-badge { font-family:'JetBrains Mono',monospace; font-size:11px; background:rgba(99,102,241,.12); color:#818cf8; border-radius:6px; padding:2px 8px; border:1px solid rgba(99,102,241,.15); }
  .lc-arrow { color:#374151; font-size:13px; }
  .lc-title { font-size:1rem; font-weight:700; color:#f1f5f9; margin:0 0 10px; letter-spacing:-.01em; }
  .lc-tags { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:10px; }
  .lc-tag { font-family:'JetBrains Mono',monospace; font-size:10px; color:#6366f1; background:rgba(99,102,241,.08); border:1px solid rgba(99,102,241,.15); border-radius:4px; padding:1px 7px; }
  .lc-content { font-size:14px; color:#9ca3af; line-height:1.7; margin:0; white-space:pre-wrap; }
  .lc-more { display:inline-block; margin-top:8px; font-family:'JetBrains Mono',monospace; font-size:11px; color:#6366f1; }
  .pp-center { min-height:70vh; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:16px; background:#0b0b10; }
  @media(max-width:640px){
    .pp-nav{padding:12px 20px;} .pp-header{padding:36px 20px 28px;} .pp-header-inner{flex-direction:column;gap:20px;}
    .pp-username{font-size:2rem;} .pp-body{padding:28px 20px 80px;gap:36px;} .pp-card{padding:18px 16px 14px;}
  }
`;