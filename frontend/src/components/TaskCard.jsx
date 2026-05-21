export default function TaskCard({ task, onStatusChange, updating, index = 0 }) {
  const isCompleted = task.status === 'Completed';
  const nextStatus = isCompleted ? 'Pending' : 'Completed';

  return (
    <div
      className="group glass-card rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-violet-200/60 transition-all duration-300 animate-fade-in-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start gap-4 p-4 sm:p-5">
        <button
          type="button"
          onClick={() => onStatusChange(task.id, nextStatus)}
          disabled={updating}
          aria-label={isCompleted ? 'Mark as pending' : 'Mark as completed'}
          className={`
            mt-0.5 shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center
            transition-all duration-200 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed
            ${
              isCompleted
                ? 'bg-gradient-to-br from-emerald-500 to-teal-500 border-transparent text-white'
                : 'border-slate-300 hover:border-violet-400 hover:bg-violet-50'
            }
          `}
        >
          {updating ? (
            <span className="w-3 h-3 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
          ) : isCompleted ? (
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : null}
        </button>

        <div className="flex-1 min-w-0">
          <p
            className={`font-semibold text-slate-800 leading-snug ${
              isCompleted ? 'line-through text-slate-400' : ''
            }`}
          >
            {task.title}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span
              className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                isCompleted
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-amber-100 text-amber-700'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isCompleted ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
              {task.status}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onStatusChange(task.id, nextStatus)}
          disabled={updating}
          className="shrink-0 hidden sm:inline-flex text-xs font-semibold px-3 py-1.5 rounded-lg
            text-violet-600 bg-violet-50 hover:bg-violet-100 border border-violet-100
            transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          {updating ? '...' : isCompleted ? 'Undo' : 'Done'}
        </button>
      </div>
    </div>
  );
}
