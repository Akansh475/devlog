import { Link } from "react-router-dom";

/**
 * EmptyState — shown on Dashboard when user has no logs yet.
 * Inline SVG illustration, no external deps.
 */
export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      {/* Inline SVG illustration */}
      <svg
        width="120"
        height="100"
        viewBox="0 0 120 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mb-8 opacity-60"
      >
        {/* notebook */}
        <rect x="20" y="10" width="80" height="72" rx="6" fill="#1a1a2e" stroke="#2d2d55" strokeWidth="1.5" />
        <rect x="20" y="10" width="12" height="72" rx="3" fill="#2d2d55" />
        {/* lines */}
        <rect x="42" y="26" width="44" height="2.5" rx="1.25" fill="#3730a3" opacity=".7" />
        <rect x="42" y="36" width="36" height="2.5" rx="1.25" fill="#3730a3" opacity=".5" />
        <rect x="42" y="46" width="40" height="2.5" rx="1.25" fill="#3730a3" opacity=".4" />
        <rect x="42" y="56" width="28" height="2.5" rx="1.25" fill="#3730a3" opacity=".3" />
        {/* pencil */}
        <g transform="translate(74, 52) rotate(-35)">
          <rect x="0" y="0" width="8" height="30" rx="2" fill="#6366f1" />
          <polygon points="0,30 8,30 4,40" fill="#a5b4fc" />
          <rect x="0" y="0" width="8" height="6" rx="2" fill="#818cf8" />
          {/* eraser */}
          <rect x="0" y="-4" width="8" height="5" rx="1.5" fill="#f472b6" />
        </g>
        {/* sparkles */}
        <circle cx="100" cy="18" r="2" fill="#6366f1" opacity=".8" />
        <circle cx="14" cy="60" r="1.5" fill="#818cf8" opacity=".6" />
        <circle cx="108" cy="72" r="1.5" fill="#a5b4fc" opacity=".5" />
      </svg>

      <h2 className="font-display text-2xl text-white tracking-wide mb-2">
        No logs yet
      </h2>
      <p className="font-mono text-xs text-zinc-600 uppercase tracking-widest mb-8 max-w-xs">
        Start writing daily. Track what you learn. Build your streak.
      </p>

      <Link
        to="/log/new"
        className="font-mono text-xs uppercase tracking-widest bg-indigo-accent hover:bg-indigo-500 text-white px-8 py-3 transition-all"
        style={{ borderRadius: 2 }}
      >
        ✦ Start your first log
      </Link>
    </div>
  );
}

/**
 * ProfileEmptyLogs — shown on public profile when user has no logs.
 */
export function ProfileEmptyLogs({ username }) {
  return (
    <div style={{
      textAlign: "center",
      padding: "56px 24px",
      border: "1px dashed #1a1a2e",
      borderRadius: 12,
      fontFamily: "'JetBrains Mono', monospace",
    }}>
      <div style={{ fontSize: 32, marginBottom: 16, opacity: .4 }}>📭</div>
      <p style={{ color: "#4b5563", fontSize: 13, letterSpacing: ".04em" }}>
        <span style={{ color: "#6366f1" }}>@{username}</span> hasn't logged anything yet.
      </p>
    </div>
  );
}