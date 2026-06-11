import { BarChart3, BookOpenCheck, LayoutDashboard, Network, Users } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/' },
  { label: 'My Team', icon: Users, to: '/' },
  { label: 'Learning Overview', icon: BookOpenCheck },
  { label: 'Workflows', icon: Network },
  { label: 'Analytics', icon: BarChart3 }
];

export const Sidebar = () => (
  <aside className="hidden w-72 flex-col bg-brand-900 px-6 py-8 text-white lg:flex">
    <div>
      <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-slate-200">CatalystOne AI</div>
      <h1 className="mt-6 text-2xl font-bold">Employee Journey Dashboard</h1>
      <p className="mt-2 text-sm text-slate-300">Manager visibility across onboarding, learning, workflows, and performance.</p>
    </div>

    <div className="mt-10">
      <div className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Menu</div>
      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          if (item.to) {
            return (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    isActive ? 'bg-white text-brand-900 shadow-soft' : 'text-slate-200 hover:bg-white/10'
                  }`
                }
              >
                <span className="flex items-center gap-3">
                  <Icon size={18} />
                  {item.label}
                </span>
                {item.label === 'Dashboard' && <span className="rounded-full bg-brand-900 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">Live</span>}
              </NavLink>
            );
          }

          return (
            <button
              key={item.label}
              type="button"
              className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10"
            >
              <span className="flex items-center gap-3">
                <Icon size={18} />
                {item.label}
              </span>
              <span className="rounded-full border border-white/20 px-2 py-0.5 text-[10px] uppercase tracking-wide">Preview</span>
            </button>
          );
        })}
      </nav>
    </div>

    <div className="mt-auto rounded-3xl bg-white/10 p-5">
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">Dashboard modes</div>
      <div className="mt-4 flex flex-wrap gap-2">
        {['Self', 'Team', 'Report', 'Admin'].map((mode) => (
          <span key={mode} className={`rounded-full px-3 py-1 text-xs font-semibold ${mode === 'Team' ? 'bg-white text-brand-900' : 'bg-white/10 text-slate-200'}`}>
            {mode}
          </span>
        ))}
      </div>
    </div>
  </aside>
);
