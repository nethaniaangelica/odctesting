import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Coins,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Sparkles,
  ArrowUpRight,
  ArrowRight,
  Sliders,
  CheckCircle2,
  FileSpreadsheet,
  Layers,
  ChevronRight,
  FileCheck2,
  Workflow,
  Compass,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  HISTORICAL_ODCS,
  EXECUTIVE_RECOMMENDATIONS,
  EXTRA_COSTS,
  MASTER_RATIONALIZATION_ITEMS,
} from '../../data/mockData';
import { UserRole, ShipmentTrip, CustomerBudgetRow } from '../../types';

interface OverviewDashboardProps {
  userRole: UserRole;
  onNavigate: (viewId: string) => void;
  onOpenODC: (odc: any) => void;
  onWhyThisCost: (odc: any) => void;
  onOpenRecommendation: (rec: any) => void;
  shipmentTrips?: ShipmentTrip[];
  customerBudgets?: CustomerBudgetRow[];
}

const COST_TREND_DATA = [
  { month: 'Apr 2026', formulated: 38.4, nonFormulated: 12.2, leakage: 3.1, total: 53.7 },
  { month: 'May 2026', formulated: 41.0, nonFormulated: 11.5, leakage: 2.8, total: 55.3 },
  { month: 'Jun 2026', formulated: 44.5, nonFormulated: 10.8, leakage: 2.4, total: 57.7 },
  { month: 'Jul 2026', formulated: 46.2, nonFormulated: 9.4, leakage: 1.9, total: 57.5 },
  { month: 'Aug 2026 (Live)', formulated: 48.6, nonFormulated: 8.1, leakage: 1.4, total: 58.1 },
];

const COST_COMPOSITION_DATA = [
  { name: 'Basic Trucking Cost', value: 46, color: '#3B82F6' },
  { name: 'Highway Tollway (Trans-Jawa)', value: 22, color: '#6366F1' },
  { name: 'Fuel Allowance (Solar)', value: 16, color: '#10B981' },
  { name: 'Depot Lift-Off', value: 7, color: '#F59E0B' },
  { name: 'Driver Meals / Overnight', value: 5, color: '#8B5CF6' },
  { name: 'Extra Exceptions (Unbilled)', value: 4, color: '#EF4444' },
];

const MASTER_HEALTH_DATA = [
  { name: 'Healthy Masters (Keep)', count: 37, pct: 15, color: '#10B981' },
  { name: 'Candidate for Rule (Derive)', count: 184, pct: 35, color: '#3B82F6' },
  { name: 'Consolidate (Duplicate)', count: 546, pct: 28, color: '#F59E0B' },
  { name: 'Zero-Usage (Retire)', count: 2840, pct: 22, color: '#EF4444' },
];

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  userRole,
  onNavigate,
  onOpenODC,
  onWhyThisCost,
  onOpenRecommendation,
  shipmentTrips = [],
  customerBudgets = [],
}) => {
  const [selectedKpi, setSelectedKpi] = useState<string | null>(null);

  // Dynamic calculations - use imported data if available, otherwise use mock
  const tripsToUse = shipmentTrips.length > 0 ? shipmentTrips : [];
  const budgetsToUse = customerBudgets.length > 0 ? customerBudgets : [];

  const totalSpendRp = tripsToUse.length > 0 
    ? tripsToUse.reduce((acc, curr) => acc + curr.totalCostRp, 0)
    : HISTORICAL_ODCS.reduce((acc, curr) => acc + curr.totalCostRp, 0);

  const totalBudgetRp = budgetsToUse.length > 0
    ? budgetsToUse.reduce((acc, curr) => acc + curr.budgetRp, 0)
    : 0;

  const totalLeakageRp = tripsToUse.length > 0
    ? tripsToUse.reduce((acc, curr) => acc + curr.leakageRp, 0)
    : EXTRA_COSTS.filter((e) => e.chargeStatus === 'UNBILLED_LEAKAGE').reduce(
        (acc, curr) => acc + curr.actualAmountRp,
        0
      );

  const costVariance = totalSpendRp - totalBudgetRp;
  const variancePct = totalBudgetRp > 0 ? (costVariance / totalBudgetRp) * 100 : 0;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Header Banner with Executive Summary */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-white">
              ODC INTELLIGENCE
            </span>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 pl-2 border-l border-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Real-Time Execution
              </span>
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2 tracking-tight">
            ODC Cost & Master Data Intelligence
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mt-1">
            Enterprise System of Intelligence: Spend derivation, automated cost formulas, leakage mitigation, and master rationalization.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('what-if')}
            className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-2 transition-colors border border-slate-200/80"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-500" />
            <span>Simulate What-If</span>
          </button>
          <button
            onClick={() => onNavigate('odc-wizard')}
            className="px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>New Smart ODC</span>
          </button>
        </div>
      </div>

      {/* 8 Core Top KPIs Grid - Professional Polish Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* KPI 1: Total ODC Cost */}
        <div
          onClick={() => onNavigate('cost-intelligence')}
          className="stat-card cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Total ODC Spend
            </p>
            <Coins className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono tracking-tight">
            Rp {(totalSpendRp / 1000000).toFixed(1)}M
          </p>
          <p className="text-xs font-semibold text-emerald-600 mt-2 flex items-center gap-1">
            <TrendingDown className="w-3 h-3" />
            <span>-4.2% unit cost vs prior period</span>
          </p>
        </div>

        {/* KPI 2: Average Cost per Shipment */}
        <div
          onClick={() => onNavigate('odc-review')}
          className="stat-card cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Avg Cost / Shipment
            </p>
            <FileCheck2 className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono tracking-tight">
            Rp {((totalSpendRp / (HISTORICAL_ODCS.length || 1)) / 1000000).toFixed(2)}M
          </p>
          <p className="text-xs font-semibold text-slate-500 mt-2">
            6 vehicle classes standardized
          </p>
        </div>

        {/* KPI 3: Master Data Health Score */}
        <div
          onClick={() => onNavigate('data-quality')}
          className="stat-card cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Master Data Health
            </p>
            <ShieldCheck className="w-4 h-4 text-amber-500 group-hover:scale-105 transition-transform" />
          </div>
          <p className="text-2xl font-bold text-amber-600 font-mono tracking-tight">
            55.1%
          </p>
          <p className="text-xs font-semibold text-amber-700 mt-2 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            <span>2,840 zero-usage items</span>
          </p>
        </div>

        {/* KPI 4: Potential Cost Leakage */}
        <div
          onClick={() => onNavigate('cost-leakage')}
          className="stat-card cursor-pointer group bg-rose-50/20 border-rose-200/80"
        >
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] font-bold text-rose-600 uppercase tracking-widest">
              Unbilled Leakage
            </p>
            <AlertTriangle className="w-4 h-4 text-rose-600 group-hover:scale-105 transition-transform" />
          </div>
          <p className="text-2xl font-bold text-rose-700 font-mono tracking-tight">
            Rp {(totalLeakageRp / 1000).toLocaleString()}k
          </p>
          <p className="text-xs font-semibold text-rose-600 mt-2">
            Reefer plug-in & waiting time
          </p>
        </div>

        {/* KPI 5: Active ODC Volume */}
        <div
          onClick={() => onNavigate('odc-review')}
          className="stat-card cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Active Trips
            </p>
            <Workflow className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono tracking-tight">
            {HISTORICAL_ODCS.length} <span className="text-xs font-normal text-slate-400 font-sans">ODCs</span>
          </p>
          <p className="text-xs font-semibold text-emerald-600 mt-2 flex items-center gap-1">
            <span>96% Similarity match verified</span>
          </p>
        </div>

        {/* KPI 6: Formulated Cost Coverage */}
        <div
          onClick={() => onNavigate('cost-rules')}
          className="stat-card cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Formulated Ratio
            </p>
            <Sliders className="w-4 h-4 text-emerald-500 group-hover:scale-105 transition-transform" />
          </div>
          <p className="text-2xl font-bold text-emerald-600 font-mono tracking-tight">
            87.4%
          </p>
          <p className="text-xs font-semibold text-slate-500 mt-2">
            Fuel, Toll, Ferry, Meal calculated
          </p>
        </div>

        {/* KPI 7: Process Complexity Reduction */}
        <div
          onClick={() => onNavigate('process-complexity')}
          className="stat-card cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Simplification
            </p>
            <Compass className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono tracking-tight">
            -84.0%
          </p>
          <p className="text-xs font-semibold text-emerald-600 mt-2">
            145m → 12m cycle time
          </p>
        </div>

        {/* KPI 8: Automation Opportunity */}
        <div
          onClick={() => onNavigate('master-rationalization')}
          className="stat-card cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Rationalize Target
            </p>
            <Layers className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono tracking-tight">
            3,386 <span className="text-xs font-normal text-slate-400 font-sans">Masters</span>
          </p>
          <p className="text-xs font-semibold text-slate-600 mt-2">
            Convert to 12 dynamic rules
          </p>
        </div>
      </div>

      {/* Main Visualizations Row: Cost Trend & Cost Composition */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 cols): Formulated vs Non-Formulated Cost Trend */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Monthly ODC Cost Formation Trend (Rp Billions)
              </h3>
              <p className="text-xs text-slate-400">
                Tracking transition from manual exceptions (PV extra) to formulated rule derivation
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-3 h-3 rounded bg-blue-600" /> Formulated
              </span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-3 h-3 rounded bg-amber-500" /> Non-Formulated
              </span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-3 h-3 rounded bg-rose-500" /> Unbilled Leakage
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={COST_TREND_DATA} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorFormulated" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorNonFormulated" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} />
                <Tooltip
                  formatter={(value: any) => [`Rp ${value} M`, '']}
                  contentStyle={{ backgroundColor: '#0F172A', color: '#FFF', borderRadius: '12px', border: 'none', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="formulated" stackId="1" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#colorFormulated)" />
                <Area type="monotone" dataKey="nonFormulated" stackId="1" stroke="#D97706" strokeWidth={2} fillOpacity={1} fill="url(#colorNonFormulated)" />
                <Area type="monotone" dataKey="leakage" stackId="1" stroke="#DC2626" strokeWidth={2} fill="#FCA5A5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right (1 col): Cost Driver Composition */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              ODC Cost Composition
            </h3>
            <p className="text-xs text-slate-400">
              Relative driver split across active transportation network
            </p>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={COST_COMPOSITION_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {COST_COMPOSITION_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`${val}% of total ODC`, '']}
                  contentStyle={{ backgroundColor: '#0F172A', color: '#FFF', borderRadius: '12px', border: 'none', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px]">
            {COST_COMPOSITION_DATA.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 truncate">{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Attention Required Feed & Recommended Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ATTENTION REQUIRED - Sleek Dark Executive Alert Feed */}
        <div className="bg-[#0f172a] p-6 rounded-xl border border-slate-800 shadow-sm space-y-4 text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Critical Alerts & Intelligence Feed
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">4 Issues Flagged</span>
            </div>

            <div className="space-y-3 mt-4 text-xs">
              {/* Alert 1: Abnormal Lead Time */}
              <div
                onClick={() => onNavigate('lead-time')}
                className="p-3.5 rounded-lg bg-slate-800/70 border-l-2 border-amber-500 hover:bg-slate-800 cursor-pointer transition-all flex items-start justify-between gap-3 group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-100 text-xs">ODC-2026-0892: Overnight Nginep (&gt;24h)</span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                      28.5 Hours
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] mt-1 leading-relaxed">
                    MoboDrive actual lead time exceeded 24h. 2-day driver meal allowance applied. Check direct margin (HPP).
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white shrink-0 self-center transition-colors" />
              </div>

              {/* Alert 2: KM Variance */}
              <div
                onClick={() => onNavigate('route-intelligence')}
                className="p-3.5 rounded-lg bg-slate-800/70 border-l-2 border-rose-500 hover:bg-slate-800 cursor-pointer transition-all flex items-start justify-between gap-3 group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-100 text-xs">Tanjung Priok → Cikarang: 22.4% KM Discrepancy</span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                      Invalid ERP KM
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] mt-1 leading-relaxed">
                    ERP Route recorded 72 KM vs PDCA validated 58.9 KM. Fuel allowance overpaid by Rp 31,500/trip.
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white shrink-0 self-center transition-colors" />
              </div>

              {/* Alert 3: Unbilled Reefer Plug-in */}
              <div
                onClick={() => onNavigate('cost-leakage')}
                className="p-3.5 rounded-lg bg-slate-800/70 border-l-2 border-emerald-500 hover:bg-slate-800 cursor-pointer transition-all flex items-start justify-between gap-3 group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-100 text-xs">PT Wings Surya: Unbilled Colok Kabel Reefer</span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                      Rp 390,000
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] mt-1 leading-relaxed">
                    Reefer staging expense logged at Rest Area KM 379 but not added to customer invoice.
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white shrink-0 self-center transition-colors" />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Audit engine checks 12 validation rules per trip</span>
            <span className="text-emerald-400 font-mono text-[11px]">System Active</span>
          </div>
        </div>

        {/* RECOMMENDED ACTIONS (EXECUTIVE ENGINE) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-800">
                  Recommended Executive Actions
                </h3>
              </div>
              <button
                onClick={() => onNavigate('executive-reports')}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold"
              >
                View Roadmap →
              </button>
            </div>

            <div className="space-y-3 mt-4 text-xs">
              {EXECUTIVE_RECOMMENDATIONS.slice(0, 3).map((rec) => (
                <div
                  key={rec.id}
                  className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-300 transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        rec.category === 'QUICK_WIN'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {rec.category.replace('_', ' ')}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Effort: <strong className="text-slate-700">{rec.effort}</strong> • Risk: <strong className="text-slate-700">{rec.risk}</strong>
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-xs">{rec.title}</h4>
                  <p className="text-slate-600 text-[11px] line-clamp-2 leading-relaxed">
                    {rec.whyStatement}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/80">
                    <span className="text-[11px] text-emerald-700 font-semibold font-mono">
                      Impact: Save Rp {(rec.expectedImpact.costLeakageSavedRp / 1000000).toFixed(0)}M •{' '}
                      {rec.expectedImpact.manualReductionPct}% less rework
                    </span>
                    <button
                      onClick={() => onOpenRecommendation(rec)}
                      className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-md text-[11px] transition-colors flex items-center gap-1"
                    >
                      <span>Execute</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs text-slate-700 mt-2">
            <span>Need deeper strategic analysis on master consolidation?</span>
            <button
              onClick={() => onNavigate('master-rationalization')}
              className="font-bold text-emerald-700 underline hover:text-emerald-800"
            >
              Open 2x2 Matrix
            </button>
          </div>
        </div>
      </div>

      {/* Customer Budget by Route Segment */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Customer Budget by Route Segment</h3>
            <p className="text-xs text-slate-400">Budget, spend, and leakage tracked per customer and actual trip corridor instead of a single overall total.</p>
          </div>
          <span className="px-2 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold uppercase tracking-wider">Per customer control</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200">
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Route Segment</th>
                <th className="py-3 px-4 text-right">Budget</th>
                <th className="py-3 px-4 text-right">Spend</th>
                <th className="py-3 px-4 text-right">Leakage</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {budgetsToUse.map((row) => (
                <tr key={row.customerId} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4 font-semibold text-slate-800">{row.customerName}</td>
                  <td className="py-3 px-4 text-slate-600">{row.routeSegment}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">Rp {row.budgetRp.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right font-mono text-slate-700">Rp {row.spendRp.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right font-mono text-rose-700">Rp {row.leakageRp.toLocaleString()}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      row.status === 'WITHIN_BUDGET'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : row.status === 'REVIEW'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent ODCs & Traceability Quick Launcher - Professional Polish Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Active ODC Operations & Traceability
            </h3>
            <p className="text-xs text-slate-400">
              Every calculated cost is 100% explainable to master drivers, rates, and formulas
            </p>
          </div>
          <button
            onClick={() => onNavigate('odc-review')}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            <span>View All Historical ODCs ({HISTORICAL_ODCS.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200">
                <th className="py-3.5 px-4">ODC Number</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Route Corridor</th>
                <th className="py-3.5 px-4">Vehicle Class</th>
                <th className="py-3.5 px-4">Distance / Lead Time</th>
                <th className="py-3.5 px-4 text-right">Total ODC Cost</th>
                <th className="py-3.5 px-4 text-center">Validation</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {HISTORICAL_ODCS.map((odc) => (
                <tr
                  key={odc.id}
                  className="asset-row cursor-pointer group"
                >
                  <td className="py-3.5 px-4 font-bold font-mono text-slate-900">
                    {odc.odcNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-800 block">{odc.customerName}</span>
                    <span className="text-[10.5px] text-slate-400">{odc.serviceRequirement}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-slate-800 font-medium block">
                      {odc.originName} → {odc.destinationName}
                    </span>
                    {odc.depotName && (
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                        Depot: {odc.depotName} (Auto-Lift Off)
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium">
                    {odc.vehicleCategoryName}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    <div className="font-mono font-medium">{odc.distanceKm} KM</div>
                    <div className="text-[10.5px] text-slate-400">
                      Est: {odc.estimatedLeadTimeHours}h | Act: {odc.actualLeadTimeHours || odc.estimatedLeadTimeHours}h
                      {odc.isOvernight && (
                        <span className="ml-1 text-amber-600 font-bold">(Nginep)</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                    Rp {odc.totalCostRp.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                        odc.validationScore >= 90
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {odc.validationScore}% Valid
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onWhyThisCost(odc);
                        }}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md font-semibold text-[11px] transition-colors shadow-2xs"
                      >
                        Why this cost?
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenODC(odc);
                        }}
                        className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                        title="View Details"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
