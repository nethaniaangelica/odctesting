import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Sliders,
  CheckCircle2,
  Trash2,
  GitMerge,
  Filter,
} from 'lucide-react';
import { MASTER_RATIONALIZATION_ITEMS } from '../../data/mockData';
import { MasterRationalizationItem, MasterQuadrant } from '../../types';

interface MasterRationalizationViewProps {
  onInspectItem: (item: MasterRationalizationItem) => void;
  onSimulateWhatIf: (item: MasterRationalizationItem) => void;
}

export const MasterRationalizationView: React.FC<MasterRationalizationViewProps> = ({
  onInspectItem,
  onSimulateWhatIf,
}) => {
  const [selectedItem, setSelectedItem] = useState<MasterRationalizationItem>(
    MASTER_RATIONALIZATION_ITEMS[0]
  );
  const [filterQuadrant, setFilterQuadrant] = useState<string>('ALL');

  const filteredItems =
    filterQuadrant === 'ALL'
      ? MASTER_RATIONALIZATION_ITEMS
      : MASTER_RATIONALIZATION_ITEMS.filter((i) => i.quadrant === filterQuadrant);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
              STRATEGIC RESTRUCTURING
            </span>
            <span className="text-xs text-slate-400">
              Enterprise 2x2 Matrix
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Master Data 2×2 Rationalization Matrix
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluate 3,798 master items on Business Value vs Maintenance Complexity to eliminate duplicates and derive rules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterQuadrant}
            onChange={(e) => setFilterQuadrant(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold outline-none focus:bg-white"
          >
            <option value="ALL">All Quadrants (4)</option>
            <option value="KEEP">Q1: KEEP (High Value, Low Complexity)</option>
            <option value="REVIEW">Q2: REVIEW / DERIVE DYNAMICALLY (High Value, High Complexity)</option>
            <option value="CONSOLIDATE">Q3: CONSOLIDATE (Low Value, Low Complexity)</option>
            <option value="RETIRE">Q4: RETIRE (Zero Usage, High Complexity)</option>
          </select>
        </div>
      </div>

      {/* 2x2 Matrix Interactive Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 cols): Visual 2x2 Grid */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Interactive 2x2 Quadrant Map
            </h3>
            <span className="text-[11px] text-slate-400">
              Click any cluster or item card to inspect rationalization path
            </span>
          </div>

          {/* 4 Quadrants Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Q2: REVIEW / DERIVE DYNAMICALLY (High Value, High Complexity) */}
            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white">
                  Q2: REVIEW & DERIVE
                </span>
                <span className="text-[11px] font-bold text-blue-900">
                  High Value • High Complexity
                </span>
              </div>
              <p className="text-[11.5px] text-blue-900">
                Frequent operational usage with formulaic variations. Convert static items into parameterized dynamic rules.
              </p>

              <div className="space-y-2">
                {MASTER_RATIONALIZATION_ITEMS.filter(
                  (i) => i.quadrant === 'REVIEW'
                ).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`p-2.5 rounded-xl bg-white border transition-all cursor-pointer ${
                      selectedItem.id === item.id
                        ? 'border-blue-600 ring-2 ring-blue-500/20 shadow-xs'
                        : 'border-blue-200/70 hover:border-blue-400'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">{item.name}</span>
                      <span className="font-mono text-[10px] text-blue-700 font-bold">
                        {item.totalRecords} items (-{item.potentialSimplificationPct}%)
                      </span>
                    </div>
                    <p className="text-[10.5px] text-slate-500 line-clamp-1 mt-0.5">
                      {item.actionRecommendation}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Q1: KEEP (High Value, Low Complexity) */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white">
                  Q1: KEEP (STANDARD)
                </span>
                <span className="text-[11px] font-bold text-emerald-900">
                  High Value • Low Complexity
                </span>
              </div>
              <p className="text-[11.5px] text-emerald-900">
                Core foundational masters with high transaction frequency and stable formulas.
              </p>

              <div className="space-y-2">
                {MASTER_RATIONALIZATION_ITEMS.filter((i) => i.quadrant === 'KEEP').map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`p-2.5 rounded-xl bg-white border transition-all cursor-pointer ${
                      selectedItem.id === item.id
                        ? 'border-emerald-600 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'border-emerald-200/70 hover:border-emerald-400'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">{item.name}</span>
                      <span className="font-mono text-[10px] text-emerald-700 font-bold">
                        {item.activeUsageCount} active
                      </span>
                    </div>
                    <p className="text-[10.5px] text-slate-500 line-clamp-1 mt-0.5">
                      {item.actionRecommendation}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Q4: RETIRE / DECOMMISSION (Low Value, High Complexity) */}
            <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white">
                  Q4: RETIRE (ZERO USAGE)
                </span>
                <span className="text-[11px] font-bold text-rose-900">
                  Low Value • High Complexity
                </span>
              </div>
              <p className="text-[11.5px] text-rose-900">
                2,840 orphaned items created for one-off transactions. Safe for immediate archiving.
              </p>

              <div className="space-y-2">
                {MASTER_RATIONALIZATION_ITEMS.filter((i) => i.quadrant === 'RETIRE').map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`p-2.5 rounded-xl bg-white border transition-all cursor-pointer ${
                      selectedItem.id === item.id
                        ? 'border-rose-600 ring-2 ring-rose-500/20 shadow-xs'
                        : 'border-rose-200/70 hover:border-rose-400'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">{item.name}</span>
                      <span className="font-mono text-[10px] text-rose-700 font-bold">
                        {item.zeroUsageCount} zero-usage
                      </span>
                    </div>
                    <p className="text-[10.5px] text-slate-500 line-clamp-1 mt-0.5">
                      {item.actionRecommendation}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Q3: CONSOLIDATE (Low Value, Low Complexity) */}
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-600 text-white">
                  Q3: CONSOLIDATE (DUPLICATES)
                </span>
                <span className="text-[11px] font-bold text-amber-900">
                  Low Value • Low Complexity
                </span>
              </div>
              <p className="text-[11.5px] text-amber-900">
                Minor spelling differences and redundant descriptions. Consolidate into standardized single masters.
              </p>

              <div className="space-y-2">
                {MASTER_RATIONALIZATION_ITEMS.filter((i) => i.quadrant === 'CONSOLIDATE').map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`p-2.5 rounded-xl bg-white border transition-all cursor-pointer ${
                      selectedItem.id === item.id
                        ? 'border-amber-600 ring-2 ring-amber-500/20 shadow-xs'
                        : 'border-amber-200/70 hover:border-amber-400'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">{item.name}</span>
                      <span className="font-mono text-[10px] text-amber-700 font-bold">
                        {item.duplicateCount} duplicates
                      </span>
                    </div>
                    <p className="text-[10.5px] text-slate-500 line-clamp-1 mt-0.5">
                      {item.actionRecommendation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right (1 col): Selected Cluster Strategic Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 block">
                Cluster Deep Dive: {selectedItem.quadrant}
              </span>
              <h3 className="text-base font-bold text-slate-900">{selectedItem.name}</h3>
              <span className="text-xs text-slate-400">{selectedItem.masterType}</span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 block">Current Records</span>
                <span className="font-bold font-mono text-slate-900 text-sm">
                  {selectedItem.totalRecords} Items
                </span>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
                <span className="text-[10px] text-purple-700 block">Simplification</span>
                <span className="font-bold font-mono text-purple-950 text-sm">
                  -{selectedItem.potentialSimplificationPct}% Reduction
                </span>
              </div>
            </div>

            {/* Action Recommendation */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
              <span className="font-bold text-slate-700 block text-[11px]">
                Transformation Recommendation
              </span>
              <p className="text-slate-800 font-medium leading-relaxed">
                {selectedItem.actionRecommendation}
              </p>
            </div>

            {/* Operational Evidence */}
            <div className="p-3.5 bg-blue-50/50 rounded-xl border border-blue-100 space-y-1.5 text-xs">
              <span className="font-bold text-blue-900 block text-[11px]">
                Ground Truth Evidence
              </span>
              <p className="text-slate-700 text-[11.5px] italic leading-relaxed">
                "{selectedItem.evidence}"
              </p>
            </div>

            {/* Feasibility */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <span>
                Effort: <strong className="text-slate-800">{selectedItem.migrationEffort}</strong>
              </span>
              <span>
                Risk: <strong className="text-slate-800">{selectedItem.operationalRisk}</strong>
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-2">
            <button
              onClick={() => onSimulateWhatIf(selectedItem)}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Simulate What-If Impact</span>
            </button>
            <button
              onClick={() => onInspectItem(selectedItem)}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs transition-colors"
            >
              Audit Item Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
