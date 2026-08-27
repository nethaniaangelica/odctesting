import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  CheckCircle2,
  Calendar,
  Sparkles,
  TrendingUp,
  Layers,
  ArrowRight,
  Printer,
  Share2,
} from 'lucide-react';
import { EXECUTIVE_RECOMMENDATIONS } from '../../data/mockData';

export const ExecutiveReportsView: React.FC = () => {
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  const handleDownload = (format: string) => {
    setDownloadToast(`Exporting Executive Report in ${format} format...`);
    setTimeout(() => setDownloadToast(null), 3500);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {downloadToast && (
        <div className="fixed top-20 right-8 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-xs border border-slate-700 animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{downloadToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
              BOARDROOM READY
            </span>
            <span className="text-xs text-slate-400">
              Executive Transformation Deliverables
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Executive Transformation Reports & Roadmap
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Phased implementation roadmap, financial payback calculations, and exportable master governance deliverables.
          </p>
        </div>

        {/* Download Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleDownload('Excel / CSV')}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export Excel</span>
          </button>
          <button
            onClick={() => handleDownload('PDF Executive Summary')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF Pack</span>
          </button>
        </div>
      </div>

      {/* 3-Phase Transformation Roadmap */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
          Phased Master Rationalization & Automation Roadmap
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
          {/* Phase 1: Quick Wins */}
          <div className="bg-white rounded-2xl border border-emerald-200 p-5 shadow-2xs space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                PHASE 1: QUICK WINS (WEEKS 1-4)
              </span>
              <span className="font-bold text-slate-700">Days 1-30</span>
            </div>
            <h4 className="font-bold text-slate-900 text-sm">
              Zero-Usage Decommissioning & Depot Mapping
            </h4>
            <ul className="space-y-2 text-slate-600 text-[11.5px]">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Archive 2,840 orphaned zero-usage cost items</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Auto-include fixed Depot Lift-off fees (stops PV rework)</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Standardize 6 Core Vehicle Category classifications</span>
              </li>
            </ul>
            <div className="pt-2 border-t border-slate-100 text-emerald-800 font-semibold text-[11px]">
              Target: -74.8% Immediate catalog noise reduction
            </div>
          </div>

          {/* Phase 2: Core Automation */}
          <div className="bg-white rounded-2xl border border-blue-200 p-5 shadow-2xs space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                PHASE 2: CORE AUTOMATION (MONTHS 2-3)
              </span>
              <span className="font-bold text-slate-700">Days 31-90</span>
            </div>
            <h4 className="font-bold text-slate-900 text-sm">
              PDCA KM Engine & Tollway Matrix
            </h4>
            <ul className="space-y-2 text-slate-600 text-[11.5px]">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                <span>Deploy GPS PDCA validation across 1,240 route corridors</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                <span>Automate Trans-Jawa electronic toll gate summation</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                <span>Roll out 4-step Frictionless Smart ODC Wizard</span>
              </li>
            </ul>
            <div className="pt-2 border-t border-slate-100 text-blue-800 font-semibold text-[11px]">
              Target: Rp 840M annual fuel leakage prevention
            </div>
          </div>

          {/* Phase 3: Strategic Integration */}
          <div className="bg-white rounded-2xl border border-purple-200 p-5 shadow-2xs space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">
                PHASE 3: STRATEGIC INTEGRATION (MONTH 4+)
              </span>
              <span className="font-bold text-slate-700">Ongoing</span>
            </div>
            <h4 className="font-bold text-slate-900 text-sm">
              MoboDrive Lead-Time & Revenue Recovery
            </h4>
            <ul className="space-y-2 text-slate-600 text-[11.5px]">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                <span>Integrate MoboDrive geofencing timestamps directly with ODC</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                <span>Automated Debit Note generation for unbilled reefer power</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                <span>Historical ODC Similarity engine prevents duplicate rates</span>
              </li>
            </ul>
            <div className="pt-2 border-t border-slate-100 text-purple-800 font-semibold text-[11px]">
              Target: 99.5% billing dispute elimination
            </div>
          </div>
        </div>
      </div>

      {/* Strategic Executive Recommendations Full List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden text-xs">
        <div className="p-4 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
            Master Data & Cost Governance Action Portfolio
          </h3>
          <span className="text-slate-400">Grounded in ERP Operational Audit</span>
        </div>

        <div className="divide-y divide-slate-100">
          {EXECUTIVE_RECOMMENDATIONS.map((rec) => (
            <div key={rec.id} className="p-5 hover:bg-slate-50 transition-colors space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      rec.category === 'QUICK_WIN'
                        ? 'bg-emerald-100 text-emerald-800'
                        : rec.category === 'STRATEGIC'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {rec.category.replace('_', ' ')}
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm">{rec.title}</h4>
                </div>
                <div className="text-right">
                  <span className="font-bold font-mono text-emerald-700">
                    Rp {(rec.expectedImpact.costLeakageSavedRp / 1000000).toFixed(0)}M Savings
                  </span>
                </div>
              </div>

              <p className="text-slate-600 text-[11.5px] leading-relaxed">
                {rec.whyStatement}
              </p>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>
                  Implementation Effort: <strong className="text-slate-700">{rec.effort}</strong> • Risk:{' '}
                  <strong className="text-slate-700">{rec.risk}</strong>
                </span>
                <span className="text-blue-700 font-semibold">
                  Manual Rework Reduction: {rec.expectedImpact.manualReductionPct}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
