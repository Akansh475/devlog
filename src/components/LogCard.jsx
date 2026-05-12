import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'

export default function LogCard({ log, onDelete, showActions = false }) {
  const timeAgo = formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })

  return (
    <article className="relative border border-border bg-surface hover:border-border-bright transition-all duration-300 group overflow-hidden">
      {/* Left red accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-red-accent opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-indigo-accent opacity-20 group-hover:opacity-60 transition-opacity" />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-body font-bold text-white text-base leading-snug group-hover:text-red-accent transition-colors truncate">
              {log.title}
            </h3>
            <p className="text-zinc-600 text-xs font-mono mt-0.5 uppercase tracking-wider">
              {timeAgo}
            </p>
          </div>

          {showActions && (
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              <Link
                to={`/log/edit/${log._id}`}
                className="text-xs font-mono text-zinc-400 hover:text-indigo-accent px-2 py-1 border border-border hover:border-indigo-accent transition-all"
              >
                EDIT
              </Link>
              <button
                onClick={() => onDelete(log._id)}
                className="text-xs font-mono text-zinc-400 hover:text-red-accent px-2 py-1 border border-border hover:border-red-accent transition-all"
              >
                DEL
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <p className="text-zinc-400 text-sm mt-3 leading-relaxed line-clamp-2 font-body">
          {log.content}
        </p>

        {/* Footer */}
        <div className="flex items-center gap-3 mt-4 flex-wrap">
          {log.timeSpent && (
            <span className="text-xs font-mono text-zinc-600 border border-border px-2 py-0.5">
              {log.timeSpent}min
            </span>
          )}
          {log.tags?.map((tag) => (
            <span key={tag} className="text-xs font-mono text-indigo-accent px-2 py-0.5 border border-indigo-dim/40">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  )
}