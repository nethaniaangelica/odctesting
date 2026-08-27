import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Layers,
  Database,
  ArrowRight,
} from 'lucide-react';
import { DATA_QUALITY_AUDITS } from '../../data/mockData';

export interface DataQualityDimensionItem {
  dimension: string;
  score: number;
  description: string;
  issueCount: number;
  status: 'CRITICAL' | 'WARNING' | 'HEALTHY' | 'EXCELLENT';
  actionFix: string;
}

const INITIAL_DIMENSIONS: DataQualityDimensionItem[] = [
  {
    dimension: 'Uniqueness (Duplicates)',
    score: 38,
    description: '546 duplicate naming variations across ERP branches for identical operational items.',
    issueCount: 546,
    status: 'CRITICAL',
    actionFix: 'Merge naming variants into unified standard Cost Item taxonomy and Parameterized Rules.',
  },
  {
    dimension: 'Validity (Usage & Freshness)',
    score: 42,
    description: '2,840 orphaned cost items and 614 activity objects with zero transactions in past 18 months.',
    issueCount: 2840,
    status: 'CRITICAL',
    actionFix: 'Batch archive all zero-usage cost items into decommissioned status.',
  },
  {
    dimension: 'Completeness',
    score: 72,
    description: 'Missing vehicle payload consumption ratios and unassigned default depot lift-off mappings.',
    issueCount: 142,
    status: 'WARNING',
    actionFix: 'Enforce mandatory field validators and auto-populate from Vehicle Masters.',
  },
  {
    dimension: 'Consistency (KM & Tolls)',
    score: 64,
    description: '215 routes showing >15% discrepancy between ERP static distance and PDCA GPS ground truth.',
    issueCount: 215,
    status: 'WARNING',
    actionFix: 'Synchronize Route Masters with Google Maps Highway PDCA standard.',
  },
  {
    dimension: 'Referential Integrity',
    score: 82,
    description: '382 activity items unmapped to active cost rules or standard stage categories.',
    issueCount: 88,
    status: 'HEALTHY',
    actionFix: 'Enforce relational foreign keys between Activity, Role, and Rule Engine.',
  },
];

export const DataQualityView: React.FC = () => {
  const [dimensions, setDimensions] = useState<DataQualityDimensionItem[]>(INITIAL_DIMENSIONS);
  const [fixingDimension, setFixingDimension] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const overallScore = Math.round(
    dimensions.reduce((acc, d) => acc + d.score, 0) / dimensions.length
  );

  const handleApplyFix = (dimName: string) => {
    setFixingDimension(dimName);
    setTimeout(() => {
      setDimensions((prev) =>
        prev.map((d) =>
          d.dimension === dimName
            ? { ...d, score: 98, issueCount: 0, status: 'EXCELLENT' }
            : d
        )
      );
      setFixingDimension(null);
      setToastMessage(`Automated cleansing script successfully executed for "${dimName}".`);
      setTimeout(() => setToastMessage(null), 4000);
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-xs border border-slate-700 animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
              DATA GOVERNANCE AUDIT
            </span>
            <span className="text-xs text-slate-400">
              5-Dimension Master Quality Engine
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Master Data Quality & Hygiene Auditor
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit 3,798 cost items, routes, and activities across Completeness, Uniqueness, Validity, Consistency, and Integrity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">
              Overall Health Score
            </span>
            <span
              className={`text-2xl font-bold font-mono ${
                overallScore >= 80 ? 'text-emerald-600' : 'text-amber-600'
              }`}
            >
              {overallScore}%
            </span>
          </div>
        </div>
      </div>

      {/* 5 Dimensions Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
        {dimensions.map((dim) => {
          const isHealthy = dim.score >= 80;
          return (
            <div
              key={dim.dimension}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{dim.dimension}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                      dim.score >= 85
                        ? 'bg-emerald-100 text-emerald-800'
                        : dim.score >= 50
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {dim.score}%
                  </span>
                </div>

                <p className="text-slate-600 text-[11px] leading-relaxed">{dim.description}</p>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Flagged Issues:</span>
                    <span className="font-bold font-mono text-rose-600">
                      {dim.issueCount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Audit Status:</span>
                    <span className="font-semibold text-slate-800">{dim.status}</span>
                  </div>
                </div>

                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-[11px] text-blue-900">
                  <strong>Cleansing Action:</strong> {dim.actionFix}
                </div>
              </div>

              <button
                disabled={dim.issueCount === 0 || fixingDimension === dim.dimension}
                onClick={() => handleApplyFix(dim.dimension)}
                className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs ${
                  dim.issueCount === 0
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {fixingDimension === dim.dimension ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Executing Cleansing Script...</span>
                  </>
                ) : dim.issueCount === 0 ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Cleansed & Verified (98%)</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Apply Automated Cleansing Script</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Entity Table Quality Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden text-xs">
        <div className="p-4 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
            Master Table Hygiene Audit Breakdown
          </h3>
          <span className="text-slate-400">Total Entities: 6,432</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-2.5 px-3.5">Master Entity Table</th>
                <th className="py-2.5 px-3 text-center">Total Records</th>
                <th className="py-2.5 px-3 text-center">Uniqueness</th>
                <th className="py-2.5 px-3 text-center">Completeness</th>
                <th className="py-2.5 px-3 text-center">Consistency</th>
                <th className="py-2.5 px-3 text-center">Overall Score</th>
                <th className="py-2.5 px-3">Critical Action Issue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {DATA_QUALITY_AUDITS.map((aud, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3.5 font-bold text-slate-900">
                    {aud.masterName}
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-slate-700">
                    {aud.totalRecords.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-medium text-slate-800">
                    {aud.uniqueness}%
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-medium text-slate-800">
                    {aud.completeness}%
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-medium text-slate-800">
                    {aud.consistency}%
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-bold">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] ${
                        aud.overallScore >= 80
                          ? 'bg-emerald-100 text-emerald-800'
                          : aud.overallScore >= 60
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {aud.overallScore}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 text-[11px]">
                    {aud.actionableIssueText}
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
