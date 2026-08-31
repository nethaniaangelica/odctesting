import React, { useState } from 'react';
import {
  AlertTriangle,
  Coins,
  FileSpreadsheet,
  CheckCircle2,
  Download,
  ArrowRight,
  TrendingDown,
  Clock,
  ShieldAlert,
  Send,
} from 'lucide-react';
import { EXTRA_COSTS } from '../../data/mockData';
import { ExtraCostRecord } from '../../types';

interface CostLeakageViewProps {
  onWhyThisCost: (odc: any) => void;
}

export const CostLeakageView: React.FC<CostLeakageViewProps> = ({ onWhyThisCost }) => {
  const [extraCosts, setExtraCosts] = useState<ExtraCostRecord[]>(EXTRA_COSTS);
  const [selectedItem, setSelectedItem] = useState<ExtraCostRecord | null>(null);
  const [recoveryModalOpen, setRecoveryModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const unbilledCosts = extraCosts.filter((e) => e.chargeStatus === 'UNBILLED_LEAKAGE');
  const totalUnbilledRp = unbilledCosts.reduce((acc, curr) => acc + curr.actualAmountRp, 0);
  const totalRecoveredRp = extraCosts
    .filter((e) => e.chargeStatus === 'RECHARGED_CUSTOMER' || e.chargeStatus === 'BILLED_STANDARD')
    .reduce((acc, curr) => acc + curr.actualAmountRp, 0);

  const handleGenerateDebitNote = (costItem: ExtraCostRecord) => {
    // Update status to RECHARGED_CUSTOMER
    setExtraCosts((prev) =>
      prev.map((e) =>
        e.id === costItem.id ? { ...e, chargeStatus: 'RECHARGED_CUSTOMER' } : e
      )
    );
    setSuccessToast(`Debit Note generated for ${costItem.customerName} (Rp ${costItem.actualAmountRp.toLocaleString()})`);
    setTimeout(() => setSuccessToast(null), 4000);
    setRecoveryModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-20 right-8 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-xs border border-slate-700 animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
              REVENUE RECOVERY
            </span>
            <span className="text-xs text-slate-400">
              Actual vs Billed Leakage Audit
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Cost Leakage & Unbilled Reconciliation
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Identify operational expenses paid to field drivers/depots that were omitted from customer billing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              // Recharge all unbilled items in 1 click
              setExtraCosts((prev) =>
                prev.map((e) => ({ ...e, chargeStatus: 'RECHARGED_CUSTOMER' }))
              );
              setSuccessToast(`All unbilled items queued for customer invoicing.`);
              setTimeout(() => setSuccessToast(null), 4000);
            }}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Batch Recover All Unbilled ({unbilledCosts.length})</span>
          </button>
        </div>
      </div>

      {/* Top 4 Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 text-xs">
        <div className="bg-white p-4 rounded-2xl border border-rose-200 bg-rose-50/20 shadow-2xs">
          <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider block">
            Total Unbilled Leakage
          </span>
          <span className="text-2xl font-bold text-rose-700 mt-1 block font-mono">
            Rp {(totalUnbilledRp / 1000).toLocaleString()}k
          </span>
          <span className="text-[11px] text-rose-800 font-semibold">
            {unbilledCosts.length} Unrecovered field expenses
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-2xs">
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
            Successfully Recovered
          </span>
          <span className="text-2xl font-bold text-emerald-800 mt-1 block font-mono">
            Rp {(totalRecoveredRp / 1000).toLocaleString()}k
          </span>
          <span className="text-[11px] text-emerald-700 font-semibold">Recharged via debit notes</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Top Leakage Component
          </span>
          <span className="text-xl font-bold text-slate-900 mt-1 block">
            Reefer Plug-in
          </span>
          <span className="text-[11px] text-slate-500">Electricity rest area staging</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Recovery Turnaround
          </span>
          <span className="text-xl font-bold text-blue-900 mt-1 block font-mono">
            1.8 Days
          </span>
          <span className="text-[11px] text-slate-500">Down from 22 days legacy</span>
        </div>
      </div>

      {/* Unbilled Extra Costs Reconciliation Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
            Operational Extra Expenses & Billing Status
          </h3>
          <span className="text-[11px] text-slate-400">
            Click any unbilled row to generate recovery debit note
          </span>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-2.5 px-3.5">Expense Type</th>
                <th className="py-2.5 px-3">ODC # & Customer</th>
                <th className="py-2.5 px-3">Field Evidence & Justification</th>
                <th className="py-2.5 px-3 text-right">Actual Expense</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {extraCosts.map((item) => {
                const isUnbilled = item.chargeStatus === 'UNBILLED_LEAKAGE';
                return (
                  <tr
                    key={item.id}
                    className={`transition-colors ${
                      isUnbilled ? 'bg-rose-50/30 hover:bg-rose-50/60' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-3 px-3.5">
                      <span className="font-bold text-slate-900 block">{item.name}</span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {item.expenseCategory}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-blue-600 block">{item.odcNumber}</span>
                      <span className="text-slate-600">{item.customerName}</span>
                    </td>
                    <td className="py-3 px-3 max-w-sm">
                      <p className="text-slate-700 text-[11px] line-clamp-1">
                        {item.justification}
                      </p>
                      <span className="text-[10px] text-slate-400">
                        Evidence: {item.evidenceDocRef} • Approved by: {item.approvedBy}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                      Rp {item.actualAmountRp.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          isUnbilled
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {item.chargeStatus.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      {isUnbilled ? (
                        <button
                          onClick={() => handleGenerateDebitNote(item)}
                          className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[11px] font-semibold transition-colors shadow-2xs"
                        >
                          Generate Debit Note
                        </button>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Recharged ✓</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
