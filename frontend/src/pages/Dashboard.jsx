import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import Logo from '../components/Logo';
import Alert from '../components/Alert';
import TaskCard from '../components/TaskCard';
import StatsBar from '../components/StatsBar';
import ConfirmModal from '../components/ConfirmModal';
import LogoutIcon from '../components/icons/LogoutIcon';
import { useToast } from '../context/ToastContext';

function TaskSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-100 p-5 space-y-3">
      <div className="flex gap-4">
        <div className="w-6 h-6 rounded-full skeleton" />
        <div className="flex-1 space-y-2">
          <div className="h-4 rounded-lg skeleton w-3/4" />
          <div className="h-3 rounded-lg skeleton w-20" />
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16 px-6 glass-card rounded-2xl border border-dashed border-slate-200 animate-fade-in">
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center">
        <svg className="w-8 h-8 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </div>
      <h3 className="text-lg font-bold text-slate-800">No tasks yet</h3>
      <p className="text-slate-500 text-sm mt-1 max-w-xs mx-auto">
        Your list is empty. Add your first task above and start getting things done.
      </p>
    </div>
  );
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const displayName = user?.name || user?.email || 'User';
  const initials = displayName.charAt(0).toUpperCase();

  const fetchTasks = async () => {
    try {
      const data = await api.getTasks();
      setTasks(data.tasks);
      setError('');
    } catch (err) {
      setError(err.message);
      toastError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      const data = await api.createTask({ title });
      setTasks((prev) => [data.task, ...prev]);
      setTitle('');
      success('Task added successfully');
    } catch (err) {
      setError(err.message);
      toastError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    const previous = tasks;
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );
    try {
      const data = await api.updateTaskStatus(id, status);
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? data.task : t))
      );
      success(
        status === 'Completed' ? 'Task marked as completed' : 'Task marked as pending'
      );
    } catch (err) {
      setTasks(previous);
      setError(err.message);
      toastError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    logout();
    success('You have been logged out');
    navigate('/login');
  };

  return (
    <div className="min-h-screen dashboard-bg">
      <ConfirmModal
        open={showLogoutModal}
        title="Log out?"
        message="You will need to sign in again to access your tasks."
        confirmLabel="Log out"
        cancelLabel="Stay signed in"
        variant="danger"
        onConfirm={handleLogoutConfirm}
        onCancel={() => setShowLogoutModal(false)}
      />
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="hidden sm:flex">
              <Logo size="sm" showText variant="dark" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight">
                My Tasks
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 truncate">
                {user?.name ? (
                  <>
                    <span className="font-medium text-slate-700">{user.name}</span>
                    <span className="hidden sm:inline"> · {user.email}</span>
                  </>
                ) : (
                  user?.email
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div
              className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-md shadow-indigo-500/25"
              title={displayName}
            >
              {initials}
            </div>
            <button
              type="button"
              onClick={() => setShowLogoutModal(true)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 border border-transparent hover:border-red-100 transition-colors cursor-pointer"
            >
              <LogoutIcon className="w-4 h-4" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-fade-in">
        {!loading && tasks.length > 0 && <StatsBar tasks={tasks} />}

        <section className="glass-card rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:p-5">
          <form onSubmit={handleAddTask} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What do you need to do?"
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400
                  focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-400 focus:bg-white transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={submitting || !title.trim()}
              className="px-6 py-3.5 rounded-xl font-semibold text-sm text-white cursor-pointer
                bg-gradient-to-r from-violet-600 to-indigo-600 shadow-lg shadow-indigo-500/25
                hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
                transition-all active:scale-[0.98] shrink-0"
            >
              {submitting ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Adding...
                </span>
              ) : (
                'Add Task'
              )}
            </button>
          </form>
        </section>

        <Alert message={error} theme="light" />

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <TaskSkeleton key={i} />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider px-1">
              Your tasks ({tasks.length})
            </h2>
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onStatusChange={handleStatusChange}
                updating={updatingId === task.id}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
