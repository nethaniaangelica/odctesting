import React from 'react';
import {
  X,
  HelpCircle,
  Calculator,
  ArrowDown,
  Layers,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  Navigation,
  Fuel,
  Coins,
  Shield,
  ExternalLink,
} from 'lucide-react';
import { ODCRecord, ODCCostLine } from '../types';

interface WhyThisCostDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  odc: ODCRecord | null;
  selectedLine?: ODCCostLine | null;
}

export const WhyThisCostDrawer: React.FC<WhyThisCostDrawerProps> = ({
  isOpen,
  onClose,
  odc,
  selectedLine,
}) => {
  if (!isOpen || !odc) return null;

  const linesToDisplay = selectedLine ? [selectedLine] : odc.costLines;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-2xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-emerald-500/20">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900 tracking-tight uppercase">
                  WHY THIS COST?
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Full Traceability
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {odc.odcNumber} • {odc.customerName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cost Summary Header */}
        <div className="p-6 bg-[#0f172a] text-white space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total ODC Cost</span>
            <span className="text-[11px] text-emerald-400 font-semibold bg-emerald-500/20 px-2.5 py-0.5 rounded border border-emerald-500/30">
              Formulated & Validated
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
              Rp {odc.totalCostRp.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400">
              {odc.distanceKm} KM • {odc.vehicleCategoryName}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800 text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Basic Cost</span>
              <span className="font-semibold text-slate-100 font-mono">
                Rp {odc.basicCostRp.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Toll & Ferry</span>
              <span className="font-semibold text-slate-100 font-mono">
                Rp {(odc.tollCostRp + odc.ferryCostRp).toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Depot & Extra</span>
              <span className="font-semibold text-slate-100 font-mono">
                Rp {(odc.depotCostRp + odc.extraCostsRp).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Traceability Flow Lines */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {selectedLine ? 'Single Line Breakdown' : 'Cost Item Derivation Tree'}
            </h3>
            <span className="text-[11px] text-slate-400">
              {linesToDisplay.length} active cost driver(s)
            </span>
          </div>

          {linesToDisplay.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <p className="text-xs text-slate-500">
                Cost lines are generated dynamically by the ODC Rule Engine.
              </p>
            </div>
          ) : (
            linesToDisplay.map((line, idx) => (
              <div
                key={line.id || idx}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3.5 relative overflow-hidden"
              >
                {/* Top Badge & Amount */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        line.classification === 'FORMULATED'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {line.classification}
                    </span>
                    <span className="font-bold text-slate-800 text-xs">
                      {line.name}
                    </span>
                  </div>
                  <span className="font-bold font-mono text-slate-900 text-sm">
                    Rp {line.subtotalRp.toLocaleString()}
                  </span>
                </div>

                {/* Vertical Derivation Diagram */}
                <div className="space-y-2.5 text-xs">
                  {/* 1. Business Input */}
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 border border-slate-200">
                      1
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Business Requirement
                      </span>
                      <p className="font-medium text-slate-800">
                        {odc.customerName} ({odc.cargoType})
                      </p>
                    </div>
                  </div>

                  <div className="ml-2.5 border-l-2 border-slate-200 h-2" />

                  {/* 2. Operational Driver */}
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 border border-blue-200">
                      2
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
                        Operational Driver
                      </span>
                      <p className="font-semibold text-slate-900">{line.driver}</p>
                    </div>
                  </div>

                  <div className="ml-2.5 border-l-2 border-slate-200 h-2" />

                  {/* 3. Cost Rule & Formula */}
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 border border-indigo-200">
                      3
                    </div>
                    <div className="flex-1 bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-mono text-[11px] space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-500 font-sans">
                        <span>Formula Engine</span>
                        <span className="text-indigo-600 font-semibold">
                          Source: {line.source}
                        </span>
                      </div>
                      <p className="text-indigo-900 font-semibold">{line.formula}</p>
                      <p className="text-slate-600 text-[10px]">
                        Rate: Rp {line.rate.toLocaleString()} × {line.quantity} {line.unit}
                      </p>
                    </div>
                  </div>

                  <div className="ml-2.5 border-l-2 border-slate-200 h-2" />

                  {/* 4. Recoverability & Audit */}
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200">
                      4
                    </div>
                    <div className="flex items-center justify-between flex-1">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Settlement & Billing
                        </span>
                        <span className="font-medium text-slate-800">
                          Status: {line.billingStatus} •{' '}
                          {line.isRecoverable ? 'Customer Chargeable' : 'Internal Operational HPP'}
                        </span>
                      </div>
                      {line.isUnbilled && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                          Unbilled Leakage!
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <div className="text-slate-500">
            Audit ID:{' '}
            <span className="font-mono text-slate-700 font-medium">
              AUD-{odc.odcNumber}-2026
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-semibold transition-colors"
          >
            Close Explanation
          </button>
        </div>
      </div>
    </div>
  );
};
