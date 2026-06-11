import { BarChart3, BookOpenCheck, LayoutDashboard, Network, Users } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navGroups = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, to: '/' },
      { label: 'My Team', icon: Users, to: '/' },
    ],
  },
  {
    label: 'Modules',
    items: [
      { label: 'Learning Overview', icon: BookOpenCheck, to: null },
      { label: 'Workflows', icon: Network, to: null },
      { label: 'Analytics', icon: BarChart3, to: null },
    ],
  },
];

export const Sidebar = () => (
  <aside className="hidden w-64 shrink-0 flex-col bg-brand-800 lg:flex">
    {/* Logo / product header */}
    <div className="px-5 pb-4 pt-6">
      <div className="flex items-center gap-2.5">
        {/* CatalystOne "C1" logomark */}
        <div className="flex h-8 w-8 items-center justify-center rounded-co bg-brand-600 text-xs font-black tracking-tight text-white">
          C1
        </div>
        <span className="text-sm font-bold tracking-wide text-white">CatalystOne</span>
      </div>
      <div className="mt-4 border-b border-white/10 pb-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-300">
          Journey Dashboard
        </p>
        <p className="mt-1 text-xs leading-relaxed text-brand-400">
          AI-powered manager visibility
        </p>
      </div>
    </div>

    {/* Navigation */}
    <nav className="flex-1 overflow-y-auto px-3 scrollbar-thin">
      {navGroups.map((group) => (
        <div key={group.label} className="mb-5">
          <div className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-400">
            {group.label}
          </div>
          {group.items.map((item) => {
            const Icon = item.icon;
            if (item.to) {
              return (
                <NavLink
                  key={item.label}
                  to={item.to}
                  className={({ isActive }) =>
                    `group flex items-center justify-between rounded-co-md px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-brand-600 text-white'
                        : 'text-brand-300 hover:bg-brand-700 hover:text-white'
                    }`
                  }
                >
                  <span className="flex items-center gap-3">
                    <Icon size={16} className="shrink-0" />
                    {item.label}
                  </span>
                  {item.label === 'Dashboard' && (
                    <span className="rounded-full bg-white/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white/90">
                      Live
                    </span>
                  )}
                </NavLink>
              );
            }
            return (
              <button
                key={item.label}
                type="button"
                className="flex w-full items-center justify-between rounded-co-md px-3 py-2.5 text-sm font-medium text-brand-400 transition-colors hover:bg-brand-700 hover:text-white"
              >
                <span className="flex items-center gap-3">
                  <Icon size={16} className="shrink-0" />
                  {item.label}
                </span>
                <span className="rounded-full border border-brand-600 px-1.5 py-0.5 text-[9px] uppercase tracking-widest text-brand-400">
                  Soon
                </span>
              </button>
            );
          })}
        </div>
      ))}
    </nav>

    {/* Dashboard mode switcher — mirrors CatalystOne LMS modes */}
    <div className="border-t border-white/10 px-4 py-4">
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-400">View Mode</p>
      <div className="flex gap-1.5 flex-wrap">
        {['Self', 'Team', 'Report', 'Admin'].map((mode) => (
          <span
            key={mode}
            className={`cursor-default rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${
              mode === 'Team'
                ? 'bg-brand-600 text-white'
                : 'bg-white/8 text-brand-400 hover:bg-brand-700 hover:text-white'
            }`}
          >
            {mode}
          </span>
        ))}
      </div>
    </div>

    {/* Manager profile pill */}
    <div className="border-t border-white/10 px-4 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-co bg-brand-600 text-xs font-bold text-white">
          AM
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-white">Alex Morgan</div>
          <div className="truncate text-xs text-brand-400">Director, People Ops</div>
        </div>
      </div>
    </div>
  </aside>
);
