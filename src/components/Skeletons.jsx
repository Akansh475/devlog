/**
 * Skeleton loaders — pure Tailwind, pulse animation, no spinners.
 * Use <DashboardSkeleton /> and <ProfileSkeleton /> as drop-in loading states.
 */

function Bone({ className = "" }) {
  return (
    <div className={`animate-pulse bg-zinc-800/60 rounded ${className}`} />
  );
}

// ─── Dashboard log list skeleton ──────────────────────────────────────────────

export function DashboardSkeleton() {
  return (
    <div className="space-y-px">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-surface border border-border p-5">
          {/* date + badge row */}
          <div className="flex items-center gap-3 mb-3">
            <Bone className="h-3 w-20" />
            <Bone className="h-3 w-12" />
          </div>
          {/* title */}
          <Bone className="h-4 w-2/3 mb-3" />
          {/* content lines */}
          <Bone className="h-3 w-full mb-2" />
          <Bone className="h-3 w-4/5" />
          {/* tags */}
          <div className="flex gap-2 mt-3">
            <Bone className="h-3 w-12 rounded-full" />
            <Bone className="h-3 w-16 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Stats grid skeleton ──────────────────────────────────────────────────────

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-px bg-border mb-px">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-surface p-6">
          <Bone className="h-3 w-24 mb-4" />
          <Bone className="h-12 w-20 mb-2" />
          <Bone className="h-3 w-28" />
        </div>
      ))}
    </div>
  );
}

// ─── Public profile skeleton ──────────────────────────────────────────────────

export function ProfileSkeleton() {
  return (
    <div style={{ background: "#0b0b10", minHeight: "100vh" }}>
      {/* nav */}
      <div style={{ borderBottom: "1px solid #1a1a2e", padding: "14px 32px", display: "flex", justifyContent: "space-between" }}>
        <div className="animate-pulse bg-zinc-800/60 rounded h-5 w-20" />
        <div className="animate-pulse bg-zinc-800/60 rounded h-3 w-24" />
      </div>

      {/* header */}
      <div style={{ padding: "52px 32px 40px", borderBottom: "1px solid #1a1a2e" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", gap: 32 }}>
          {/* avatar */}
          <div className="animate-pulse bg-zinc-800/60 rounded-2xl flex-shrink-0" style={{ width: 88, height: 88 }} />
          <div style={{ flex: 1 }}>
            <div className="animate-pulse bg-zinc-800/60 rounded-full h-4 w-24 mb-3" />
            <div className="animate-pulse bg-zinc-800/60 rounded h-8 w-48 mb-3" />
            <div className="animate-pulse bg-zinc-800/60 rounded h-3 w-36 mb-5" />
            <div style={{ display: "flex", gap: 8 }}>
              {[80, 72, 64, 72].map((w, i) => (
                <div key={i} className="animate-pulse bg-zinc-800/60 rounded-lg" style={{ height: 36, width: w }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* body */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "44px 32px" }}>
        {/* heatmap skeleton */}
        <div className="animate-pulse bg-zinc-800/60 rounded-xl mb-4" style={{ height: 14, width: 160 }} />
        <div className="animate-pulse bg-zinc-900/80 rounded-xl" style={{ height: 148, marginBottom: 48 }} />

        {/* log skeletons */}
        <div className="animate-pulse bg-zinc-800/60 rounded-xl mb-4" style={{ height: 14, width: 120 }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[...Array(3)].map((_, i) => (
            <div key={i} style={{
              background: "#0f0f18",
              border: "1px solid #1a1a2e",
              borderRadius: 12,
              padding: "20px 22px",
            }}>
              <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                <div className="animate-pulse bg-zinc-800/60 rounded" style={{ height: 10, width: 80 }} />
                <div className="animate-pulse bg-zinc-800/60 rounded" style={{ height: 10, width: 40 }} />
              </div>
              <div className="animate-pulse bg-zinc-800/60 rounded" style={{ height: 14, width: "55%", marginBottom: 12 }} />
              <div className="animate-pulse bg-zinc-800/60 rounded" style={{ height: 10, width: "90%", marginBottom: 8 }} />
              <div className="animate-pulse bg-zinc-800/60 rounded" style={{ height: 10, width: "70%" }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}