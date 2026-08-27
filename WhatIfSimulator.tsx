import React, { useState } from 'react';
import {
  Sliders,
  TrendingDown,
  TrendingUp,
  Clock,
  Sparkles,
  Coins,
  ShieldCheck,
  CheckCircle2,
  RotateCcw,
  Download,
  ArrowRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';

export const WhatIfSimulator: React.FC = () => {
  // Scenario Levers State
  const [retireZeroUsagePct, setRetireZeroUsagePct] = useState(100);
  const [convertRulesPct, setConvertRulesPct] = useState(85);
  const [enforcePdcaKm, setEnforcePdcaKm] = useState(true);
  const [autoMapDepot, setAutoMapDepot] = useState(true);
  const [automateTolls, setAutomateTolls] = useState(true);

  // Derived Simulation Calculations
  const baseAnnualSpendRp = 58100000000; // Rp 58.1B
  const baseCycleTimeMinutes = 145; // Minutes per ODC creation
  const baseMasterCount = 3798;

  // Impact Calculations
  const retiredMastersCount = Math.round(2840 * (retireZeroUsagePct / 100));
  const convertedMastersCount = Math.round(546 * (convertRulesPct / 100));
  const newMasterCount = baseMasterCount - retiredMastersCount - convertedMastersCount + 12;

  const kmSavingsRp = enforcePdcaKm ? 840000000 : 0; // Rp 840M from eliminating inflated KM
  const tollSavingsRp = automateTolls ? 420000000 : 0; // Rp 420M from exact toll gates
  const depotReworkSavingsRp = autoMapDepot ? 650000000 : 0; // Rp 650M from eliminated PV rework
  const masterMaintenanceSavingsRp = Math.round((retiredMastersCount / 2840) * 1200000000);

  const totalAnnualSavingsRp =
    kmSavingsRp + tollSavingsRp + depotReworkSavingsRp + masterMaintenanceSavingsRp;

  const customerBudgets = [
    { customer: 'PT Unilever Indonesia Tbk', shipments: 128, budgetRp: 9200000000, leakageRp: 410000000 },
    { customer: 'PT Wings Surya', shipments: 96, budgetRp: 6800000000, leakageRp: 285000000 },
    { customer: 'PT Indofood CBP Sukses Makmur', shipments: 84, budgetRp: 5900000000, leakageRp: 225000000 },
    { customer: 'PT Kahatex Textile', shipments: 61, budgetRp: 4300000000, leakageRp: 180000000 },
    { customer: 'PT Great Giant Pineapple', shipments: 47, budgetRp: 3100000000, leakageRp: 140000000 },
  ];

  // Time reduction
  const cycleTimeSavedMinutes =
    (retireZeroUsagePct / 100) * 35 +
    (convertRulesPct / 100) * 45 +
    (enforcePdcaKm ? 20 : 0) +
    (autoMapDepot ? 33 : 0);

  const simulatedCycleTimeMinutes = Math.max(
    8,
    Math.round(baseCycleTimeMinutes - cycleTimeSavedMinutes)
  );

  const COMPARISON_DATA = [
    {
      metric: 'Master Items Count',
      asIs: baseMasterCount,
      toBe: newMasterCount,
      unit: 'items',
    },
    {
      metric: 'ODC Cycle Time (Mins)',
      asIs: baseCycleTimeMinutes,
      toBe: simulatedCycleTimeMinutes,
      unit: 'mins',
    },
    {
      metric: 'Annual Leakage (Rp M)',
      asIs: 3100,
      toBe: Math.round(3100 - totalAnnualSavingsRp / 1000000),
      unit: 'Rp M',
    },
  ];

  const handleReset = () => {
    setRetireZeroUsagePct(100);
    setConvertRulesPct(85);
    setEnforcePdcaKm(true);
    setAutoMapDepot(true);
    setAutomateTolls(true);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
              STRATEGIC SIMULATION ENGINE
            </span>
            <span className="text-xs text-slate-400">
              Interactive Scenario Modeling
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            What-If Scenario & Impact Simulator
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Model the financial and operational impact of master data retirement, rule parameterization, and automated route costing.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors self-start md:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Default Levers</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden text-xs">
        <div className="p-5 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Customer-Based Budget Control</h3>
            <p className="text-[11px] text-slate-500">Budget and leakage are separated per customer account; overall totals are not used for allocation.</p>
          </div>
          <span className="px-2 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200 font-semibold">Customer dimension required</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead><tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-2.5 px-4">Customer</th><th className="py-2.5 px-4 text-center">Shipments</th><th className="py-2.5 px-4 text-right">Budget</th><th className="py-2.5 px-4 text-right">Known Leakage</th><th className="py-2.5 px-4 text-center">Control</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-100">
              {customerBudgets.map((item) => (
                <tr key={item.customer} className="hover:bg-blue-50/30">
                  <td className="py-3 px-4 font-semibold text-slate-800">{item.customer}</td>
                  <td className="py-3 px-4 text-center font-mono">{item.shipments}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold">Rp {item.budgetRp.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right font-mono text-rose-700">Rp {item.leakageRp.toLocaleString()}</td>
                  <td className="py-3 px-4 text-center"><span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">Tracked</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Main Grid: Left Levers Control, Right Live Impact Projection */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Simulation Levers Box */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">
              Simulation Control Levers
            </span>
            <h3 className="text-sm font-bold text-slate-900">
              Adjust Transformation Levers
            </h3>
          </div>

          <div className="space-y-4 text-xs">
            {/* Lever 1: Retire Zero-Usage Masters */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold text-slate-800">
                <span>Retire Zero-Usage Masters</span>
                <span className="font-mono text-blue-600 font-bold">
                  {retireZeroUsagePct}% ({retiredMastersCount} items)
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={retireZeroUsagePct}
                onChange={(e) => setRetireZeroUsagePct(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <p className="text-[10.5px] text-slate-400">
                Decommission orphaned 2,840 cost items with zero active transactions.
              </p>
            </div>

            {/* Lever 2: Consolidate Duplicates to Rules */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold text-slate-800">
                <span>Convert to Dynamic Rules</span>
                <span className="font-mono text-indigo-600 font-bold">
                  {convertRulesPct}% ({convertedMastersCount} items)
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={convertRulesPct}
                onChange={(e) => setConvertRulesPct(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <p className="text-[10.5px] text-slate-400">
                Replace static multi-drop/meal variations with parameterized rules.
              </p>
            </div>

            {/* Toggle Levers */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100">
              <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <div>
                  <span className="font-bold text-slate-800 block">
                    Enforce PDCA Validated KM
                  </span>
                  <span className="text-[10.5px] text-slate-400">
                    Fix ERP inflated distances
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={enforcePdcaKm}
                  onChange={(e) => setEnforcePdcaKm(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <div>
                  <span className="font-bold text-slate-800 block">
                    Auto-Map Depot Lift-Off
                  </span>
                  <span className="text-[10.5px] text-slate-400">
                    Eliminate manual PV extra lift-off rework
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={autoMapDepot}
                  onChange={(e) => setAutoMapDepot(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <div>
                  <span className="font-bold text-slate-800 block">
                    Automate Electronic Toll Plazas
                  </span>
                  <span className="text-[10.5px] text-slate-400">
                    Sum verified Trans-Jawa toll gates
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={automateTolls}
                  onChange={(e) => setAutomateTolls(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Right (2 cols): Impact Results & Before vs After Comparison */}
        <div className="lg:col-span-2 space-y-6">
          {/* Top 3 High-Impact Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
            {/* Savings */}
            <div className="bg-gradient-to-br from-emerald-900 to-emerald-800 text-white p-4 rounded-2xl shadow-xs space-y-1">
              <span className="text-[10px] text-emerald-300 uppercase tracking-wider font-bold block">
                Annual Cost Leakage Saved
              </span>
              <div className="text-2xl font-bold font-mono text-white">
                Rp {(totalAnnualSavingsRp / 1000000000).toFixed(2)}B
              </div>
              <p className="text-[10.5px] text-emerald-200">
                Reduced fuel over-allocations & unbilled reefer leakage
              </p>
            </div>

            {/* Cycle Time */}
            <div className="bg-gradient-to-br from-blue-900 to-blue-800 text-white p-4 rounded-2xl shadow-xs space-y-1">
              <span className="text-[10px] text-blue-300 uppercase tracking-wider font-bold block">
                ODC Creation Cycle Time
              </span>
              <div className="text-2xl font-bold font-mono text-white">
                {simulatedCycleTimeMinutes} Mins
              </div>
              <p className="text-[10.5px] text-blue-200">
                -
                {(
                  ((baseCycleTimeMinutes - simulatedCycleTimeMinutes) /
                    baseCycleTimeMinutes) *
                  100
                ).toFixed(0)}
                % faster turnaround per shipment
              </p>
            </div>

            {/* Master Reduction */}
            <div className="bg-gradient-to-br from-purple-900 to-purple-800 text-white p-4 rounded-2xl shadow-xs space-y-1">
              <span className="text-[10px] text-purple-300 uppercase tracking-wider font-bold block">
                Master Data Reduction
              </span>
              <div className="text-2xl font-bold font-mono text-white">
                -{(((baseMasterCount - newMasterCount) / baseMasterCount) * 100).toFixed(1)}%
              </div>
              <p className="text-[10.5px] text-purple-200">
                Down to {newMasterCount} clean, maintainable masters
              </p>
            </div>
          </div>

          {/* AS-IS vs TO-BE Visual Comparison */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  AS-IS vs Simulated TO-BE Architecture
                </h3>
                <p className="text-xs text-slate-400">
                  Quantified business metrics comparison
                </p>
              </div>
              <span className="px-2.5 py-1 rounded text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                High Confidence Simulation
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-slate-700 text-[11px] block">
                  Master Data Count
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-slate-500">AS-IS:</span>
                  <span className="font-mono font-bold text-slate-700">3,798 Items</span>
                </div>
                <div className="flex items-baseline justify-between text-purple-700 font-semibold">
                  <span>TO-BE:</span>
                  <span className="font-mono font-bold text-purple-900">
                    {newMasterCount} Items
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-slate-700 text-[11px] block">
                  ODC Creation Time
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-slate-500">AS-IS:</span>
                  <span className="font-mono font-bold text-slate-700">145 Mins</span>
                </div>
                <div className="flex items-baseline justify-between text-blue-700 font-semibold">
                  <span>TO-BE:</span>
                  <span className="font-mono font-bold text-blue-900">
                    {simulatedCycleTimeMinutes} Mins
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-slate-700 text-[11px] block">
                  Manual Exception Approvals
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-slate-500">AS-IS:</span>
                  <span className="font-mono font-bold text-slate-700">100% Manual PV</span>
                </div>
                <div className="flex items-baseline justify-between text-emerald-700 font-semibold">
                  <span>TO-BE:</span>
                  <span className="font-mono font-bold text-emerald-900">
                    87.4% Auto Formulated
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
