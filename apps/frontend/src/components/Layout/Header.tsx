import { Bell, Search } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const Header = ({ searchQuery, onSearchChange }: HeaderProps) => (
  <header className="border-b border-slate-200 bg-white px-4 py-4 md:px-8">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <div className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-500">Manager View</div>
        <h2 className="mt-1 text-2xl font-bold text-slate-900">Team journey insights</h2>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex min-w-[260px] items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <Search size={18} className="text-slate-400" />
          <input
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search employees, roles, departments..."
            className="w-full border-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
        </div>
        <button type="button" className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition hover:border-brand-500 hover:text-brand-500">
          <Bell size={18} />
        </button>
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-900 text-sm font-bold text-white">AM</div>
          <div>
            <div className="text-sm font-semibold text-slate-900">Alex Morgan</div>
            <div className="text-xs text-slate-500">Director, People Ops</div>
          </div>
        </div>
      </div>
    </div>
  </header>
);
