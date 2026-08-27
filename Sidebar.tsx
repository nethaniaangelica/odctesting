import React from 'react';
import {
  LayoutDashboard,
  Compass,
  FileSpreadsheet,
  Layers,
  GitMerge,
  FileText,
  ShieldCheck,
  Sparkles,
  MapPin,
  Clock,
  Coins,
  AlertTriangle,
  FileCheck2,
  Database,
  Sliders,
  Cpu,
  Route,
  ChevronRight,
  TrendingDown,
  Workflow,
} from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  currentView: string;
  onSelectView: (viewId: string) => void;
  userRole: UserRole;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
  badgeColor?: string;
  roles?: UserRole[];
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  userRole,
  collapsed,
}) => {
  const sections: NavSection[] = [
    {
      title: 'ODC INTELLIGENCE',
      items: [
        { id: 'overview', label: 'Overview Dashboard', icon: LayoutDashboard, badge: 'Live' },
        { id: 'ai-assistant', label: 'ODC AI Assistant', icon: Sparkles, badge: 'Grounded', badgeColor: 'bg-indigo-100 text-indigo-700' },
      ],
    },
    {
      title: 'OPERATIONS',
      items: [
        { id: 'odc-wizard', label: 'ODC Smart Wizard', icon: FileSpreadsheet, badge: '4-Step' },
        { id: 'odc-review', label: 'ODC Review & Similarity', icon: FileCheck2, badge: '4 New' },
        { id: 'route-intelligence', label: 'Route & KM Validation', icon: Route },
        { id: 'shipment-activity', label: 'Shipment Activity & RACI', icon: Workflow },
        { id: 'lead-time', label: 'Lead Time & MoboDrive', icon: Clock },
      ],
    },
    {
      title: 'COST INTELLIGENCE',
      items: [
        { id: 'cost-intelligence', label: 'Cost Breakdown & Driver', icon: Coins },
        { id: 'cost-rules', label: 'Cost Rule Builder', icon: Sliders },
        { id: 'extra-cost', label: 'Extra Cost & PV Manager', icon: AlertTriangle, badge: '2 PV' },
        { id: 'cost-leakage', label: 'Cost Leakage & Recovery', icon: TrendingDown, badge: 'Rp 480M', badgeColor: 'bg-rose-100 text-rose-700' },
      ],
    },
    {
      title: 'MASTER DATA',
      items: [
        { id: 'master-explorer', label: 'Master Data Explorer', icon: Database, badge: '3,798 CI' },
        { id: 'master-rationalization', label: '2x2 Rationalization Matrix', icon: Layers },
        { id: 'data-quality', label: 'Data Quality & Audit', icon: ShieldCheck, badge: '55% Avg', badgeColor: 'bg-amber-100 text-amber-800' },
        { id: 'what-if', label: 'What-If Strategic Analysis', icon: Cpu },
      ],
    },
    {
      title: 'PROCESS INTELLIGENCE',
      items: [
        { id: 'bpmn-analyzer', label: 'BPMN Process Analyzer', icon: GitMerge, badge: '-84%' },
        { id: 'process-complexity', label: 'AS-IS vs TO-BE Benchmark', icon: Compass },
      ],
    },
    {
      title: 'REPORTING & GOVERNANCE',
      items: [
        { id: 'executive-reports', label: 'Executive Reports & Export', icon: FileText },
        { id: 'governance-audit', label: 'Audit Trail & Governance', icon: ShieldCheck },
      ],
    },
  ];

  return (
    <aside
      id="sidebar-navigation"
      className={`bg-[#0f172a] text-slate-300 border-r border-slate-800 flex flex-col transition-all duration-300 select-none z-30 shrink-0 ${
        collapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        {!collapsed ? (
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
              <div className="w-3.5 h-3.5 border-2 border-white rounded-full"></div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-white text-base tracking-tight truncate">
                  ODC CONTROL
                </span>
                <span className="text-[9px] uppercase font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded">
                  v2.6
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">
                System of Intelligence
              </p>
            </div>
          </div>
        ) : (
          <div className="mx-auto w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <div className="w-3.5 h-3.5 border-2 border-white rounded-full"></div>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 scrollbar-thin scrollbar-thumb-slate-800">
        {sections.map((sec, secIdx) => (
          <div key={secIdx} className="space-y-1">
            {!collapsed && (
              <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">
                {sec.title}
              </p>
            )}
            {sec.items.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => onSelectView(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all group relative ${
                    isActive
                      ? 'bg-slate-800 text-white font-semibold'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  {isActive ? (
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full shrink-0" />
                  ) : (
                    <Icon
                      className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-slate-200 transition-colors"
                    />
                  )}
                  {!collapsed && (
                    <span className="truncate flex-1 text-left">{item.label}</span>
                  )}
                  {!collapsed && item.badge && (
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                        item.badgeColor ||
                        (isActive
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700')
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Executive User Profile Footer */}
      {!collapsed ? (
        <div className="mt-auto px-4 py-4 border-t border-slate-800 bg-[#0c1322]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-white text-xs font-bold border border-slate-600 shrink-0">
              {userRole.slice(0, 2)}
            </div>
            <div className="overflow-hidden min-w-0">
              <p className="text-white text-xs font-semibold truncate">
                {userRole === 'MANAGEMENT'
                  ? 'Elias Thorne'
                  : userRole === 'OPERATIONS'
                  ? 'Capt. Aris Munandar'
                  : userRole === 'FINANCE'
                  ? 'Sarah Widjaja'
                  : 'System Steward'}
              </p>
              <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider truncate">
                {userRole.replace('_', ' ')}
              </p>
            </div>
            <div className="ml-auto w-2 h-2 rounded-full bg-emerald-500"></div>
          </div>
        </div>
      ) : (
        <div className="mt-auto p-3 border-t border-slate-800 flex justify-center">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white text-xs font-bold">
            {userRole.slice(0, 2)}
          </div>
        </div>
      )}
    </aside>
  );
};
