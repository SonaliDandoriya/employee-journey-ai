import { Bell, Search } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const Header = ({ searchQuery, onSearchChange }: HeaderProps) => (
  <header className="border-b border-beige-600 bg-white px-5 py-3 shadow-e1">
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      {/* Breadcrumb / page title */}
      <div>
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-600">
          <span>Manager View</span>
          <span className="text-warm-500">›</span>
          <span className="text-warm-700">Team Journey</span>
        </div>
        <h2 className="mt-0.5 text-xl font-bold text-warm-900">Team journey insights</h2>
      </div>

      <div className="flex items-center gap-2.5">
        {/* Search — mirrors CatalystOne input--sm */}
        <div className="flex min-w-[240px] items-center gap-2.5 rounded-co-md border border-warm-400 bg-beige-500 px-3 py-2 text-sm transition focus-within:border-brand-600 focus-within:ring-2 focus-within:ring-brand-100">
          <Search size={15} className="shrink-0 text-warm-700" />
          <input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search employees, roles…"
            className="w-full border-0 bg-transparent text-sm text-warm-900 outline-none placeholder:text-warm-700"
          />
        </div>

        {/* Notification bell */}
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-co-md border border-warm-400 bg-white text-warm-700 transition hover:border-brand-600 hover:text-brand-700"
        >
          <Bell size={16} />
        </button>

        {/* User chip */}
        <div className="flex items-center gap-2.5 rounded-co-md border border-warm-400 bg-white px-3 py-1.5 shadow-e1">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-co bg-brand-700 text-xs font-bold text-white">
            AM
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-semibold leading-tight text-warm-900">Alex Morgan</div>
            <div className="text-[11px] text-warm-700">Director, People Ops</div>
          </div>
        </div>
      </div>
    </div>
  </header>
);
