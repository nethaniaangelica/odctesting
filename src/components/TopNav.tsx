import React from 'react';
import {
  Search,
  SlidersHorizontal,
  Bell,
  Sparkles,
  PlusCircle,
  Menu,
  ChevronDown,
  UserCheck,
  Upload,
} from 'lucide-react';
import { UserRole } from '../types';

interface TopNavProps {
  userRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  onOpenSearch: () => void;
  onOpenWizard: () => void;
  onOpenAssistant: () => void;
  onOpenCSVImport: () => void;
  onToggleSidebar: () => void;
  activeViewTitle: string;
}

export const TopNav: React.FC<TopNavProps> = ({
  userRole,
  onChangeRole,
  onOpenSearch,
  onOpenWizard,
  onOpenAssistant,
  onOpenCSVImport,
  onToggleSidebar,
  activeViewTitle,
}) => {
  const [roleMenuOpen, setRoleMenuOpen] = React.useState(false);

  const rolesList: { id: UserRole; label: string; desc: string }[] = [
    { id: 'MANAGEMENT', label: 'Management', desc: 'KPIs, total spend, leakage & strategic actions' },
    { id: 'STRATEGY_PROCESS', label: 'Strategy & Process Improvement', desc: 'BPMN, master rationalization & AS-IS vs TO-BE' },
    { id: 'OPERATIONS', label: 'Operations & Dispatch', desc: 'ODC Wizard, routes, KM validation & MoboDrive' },
    { id: 'FINANCE', label: 'Finance & Costing', desc: 'Cost formation, rules, unbilled recovery & HPP' },
    { id: 'MASTER_DATA_STEWARD', label: 'Master Data Steward', desc: 'Data quality, duplicates, mapping & governance' },
    { id: 'ADMIN', label: 'Admin / IT Architect', desc: 'Rule config, audit trail & user authorization' },
  ];

  return (
    <header
      id="top-navigation-bar"
      className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between gap-4 sticky top-0 z-20 shadow-2xs"
    >
      {/* Left: Hamburger & Breadcrumb with Live Status */}
      <div className="flex items-center gap-4 min-w-0">
        <button
          id="btn-toggle-sidebar"
          onClick={onToggleSidebar}
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          title="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 min-w-0">
          <h1 className="text-base sm:text-lg font-bold text-slate-800 truncate">
            {activeViewTitle}
          </h1>
          <div className="hidden sm:flex items-center gap-1.5 pl-2 border-l border-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Live Execution
            </span>
          </div>
        </div>
      </div>

      {/* Center Search Bar */}
      <div className="flex-1 max-w-md hidden md:block">
        <button
          id="btn-global-search-trigger"
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-md transition-all group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
            <span className="text-xs text-slate-500 font-medium truncate">Search assets, ODC, routes, cost rules...</span>
          </div>
          <span className="text-[10px] text-slate-400 border border-slate-200 px-1 rounded bg-white font-mono">
            ⌘K
          </span>
        </button>
      </div>

      {/* Right Controls: Role Switcher & Action Buttons */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Mobile Search Icon */}
        <button
          id="btn-mobile-search"
          onClick={onOpenSearch}
          className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Role Switcher Dropdown */}
        <div className="relative">
          <button
            id="btn-role-dropdown"
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline truncate max-w-[130px]">
              {rolesList.find((r) => r.id === userRole)?.label}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {roleMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-2 border-b border-slate-100 bg-slate-50/70">
                <p className="font-bold text-slate-700">Switch Operational Role</p>
                <p className="text-[11px] text-slate-500">
                  Adapts KPIs, alerts & permissions
                </p>
              </div>
              <div className="py-1 max-h-72 overflow-y-auto">
                {rolesList.map((r) => (
                  <button
                    key={r.id}
                    id={`btn-select-role-${r.id}`}
                    onClick={() => {
                      onChangeRole(r.id);
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 hover:bg-slate-50 flex flex-col gap-0.5 transition-colors ${
                      userRole === r.id ? 'bg-emerald-50/80 text-emerald-900 font-semibold' : 'text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-800">{r.label}</span>
                      {userRole === r.id && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 line-clamp-1">{r.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* AI Assistant Quick Pill */}
        <button
          id="btn-quick-ai-assistant"
          onClick={onOpenAssistant}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold text-emerald-800 shadow-2xs transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span className="hidden sm:inline">AI Copilot</span>
        </button>

        {/* CSV Import Button */}
        <button
          id="btn-csv-import"
          onClick={onOpenCSVImport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-xs font-semibold text-blue-800 shadow-2xs transition-all"
          title="Import master data from CSV files"
        >
          <Upload className="w-3.5 h-3.5 text-blue-600" />
          <span className="hidden sm:inline">Import CSV</span>
        </button>

        {/* New ODC Action Button */}
        <button
          id="btn-create-new-odc"
          onClick={onOpenWizard}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New ODC</span>
        </button>
      </div>
    </header>
  );
};
