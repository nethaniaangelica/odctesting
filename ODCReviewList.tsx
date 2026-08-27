import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  FileCheck2,
  AlertTriangle,
  ArrowRight,
  Calculator,
  Eye,
  CheckCircle2,
  Clock,
  Coins,
  Route,
  Sparkles,
  Download,
} from 'lucide-react';
import { HISTORICAL_ODCS } from '../../data/mockData';
import { ODCRecord } from '../../types';

interface ODCReviewListProps {
  odcs: ODCRecord[];
  onOpenODC: (odc: ODCRecord) => void;
  onWhyThisCost: (odc: ODCRecord) => void;
  onCreateNew: () => void;
}

export const ODCReviewList: React.FC<ODCReviewListProps> = ({
  odcs,
  onOpenODC,
  onWhyThisCost,
  onCreateNew,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedCustomer, setSelectedCustomer] = useState<string>('ALL');

  const filteredOdcs = useMemo(() => {
    return odcs.filter((o) => {
      const matchQuery =
        o.odcNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.originName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.destinationName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = selectedStatus === 'ALL' || o.status === selectedStatus;
      const matchCustomer = selectedCustomer === 'ALL' || o.customerName === selectedCustomer;

      return matchQuery && matchStatus && matchCustomer;
    });
  }, [odcs, searchQuery, selectedStatus, selectedCustomer]);

  const uniqueCustomers = Array.from(new Set(odcs.map((o) => o.customerName)));

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
              OPERATIONAL INTELLIGENCE
            </span>
            <span className="text-xs text-slate-400">
              {odcs.length} Recorded Deliveries
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            ODC Review & Similarity Benchmark
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit historical operational costs, inspect formula derivations, benchmark similarity, and detect unbilled leakage.
          </p>
        </div>

        <button
          onClick={onCreateNew}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-2 transition-all shrink-0"
        >
          <FileCheck2 className="w-4 h-4" />
          <span>New ODC Entry</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center gap-3 text-xs">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ODC Number, Customer, Origin, or Destination..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Customer Filter */}
        <select
          value={selectedCustomer}
          onChange={(e) => setSelectedCustomer(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-medium outline-none focus:bg-white w-full sm:w-auto"
        >
          <option value="ALL">All Customers</option>
          {uniqueCustomers.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-medium outline-none focus:bg-white w-full sm:w-auto"
        >
          <option value="ALL">All Statuses</option>
          <option value="APPROVED">APPROVED</option>
          <option value="DRAFT">DRAFT</option>
          <option value="PENDING_REVIEW">PENDING REVIEW</option>
          <option value="REJECTED">REJECTED</option>
        </select>
      </div>

      {/* Table of ODCs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-3.5">ODC Info</th>
                <th className="py-3 px-3">Shipper & Cargo</th>
                <th className="py-3 px-3">Corridor & Distance</th>
                <th className="py-3 px-3">Vehicle / Depot</th>
                <th className="py-3 px-3 text-right">Cost Breakdown</th>
                <th className="py-3 px-3 text-center">Score & Status</th>
                <th className="py-3 px-3 text-center">Traceability Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOdcs.map((odc) => (
                <tr
                  key={odc.id}
                  className="hover:bg-blue-50/40 transition-colors group cursor-pointer"
                  onClick={() => onOpenODC(odc)}
                >
                  {/* ODC Number & Date */}
                  <td className="py-3 px-3.5">
                    <span className="font-bold font-mono text-blue-600 text-xs block">
                      {odc.odcNumber}
                    </span>
                    <span className="text-[10.5px] text-slate-400">
                      {new Date(odc.createdAt).toLocaleDateString()}
                    </span>
                  </td>

                  {/* Customer & Cargo */}
                  <td className="py-3 px-3">
                    <span className="font-bold text-slate-800 block">{odc.customerName}</span>
                    <span className="text-[11px] text-slate-500 line-clamp-1">{odc.cargoType}</span>
                    <span className="text-[10px] text-slate-400">
                      {odc.weightTons}T • {odc.volumeCbm} CBM
                    </span>
                  </td>

                  {/* Corridor & Distance */}
                  <td className="py-3 px-3">
                    <span className="font-semibold text-slate-800 block">
                      {odc.originName} → {odc.destinationName}
                    </span>
                    <span className="text-[11px] text-slate-600 font-mono">
                      {odc.distanceKm} KM ({odc.estimatedLeadTimeHours}h)
                    </span>
                    {odc.isOvernight && (
                      <span className="inline-block ml-1 px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-800">
                        Nginep &gt;24h
                      </span>
                    )}
                  </td>

                  {/* Vehicle / Depot */}
                  <td className="py-3 px-3">
                    <span className="font-medium text-slate-800 block">
                      {odc.vehicleCategoryName}
                    </span>
                    {odc.depotName ? (
                      <span className="text-[10.5px] text-emerald-700 font-medium">
                        Depot: {odc.depotName}
                      </span>
                    ) : (
                      <span className="text-[10.5px] text-slate-400">No depot mapped</span>
                    )}
                  </td>

                  {/* Cost Breakdown */}
                  <td className="py-3 px-3 text-right font-mono">
                    <span className="font-bold text-slate-900 text-sm block">
                      Rp {odc.totalCostRp.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Basic: Rp {(odc.basicCostRp / 1000).toLocaleString()}k • Toll: Rp{' '}
                      {(odc.tollCostRp / 1000).toLocaleString()}k
                    </span>
                  </td>

                  {/* Score & Status */}
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        odc.status === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {odc.status}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Score: {odc.validationScore}%
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onWhyThisCost(odc);
                        }}
                        className="px-2.5 py-1 bg-slate-900 hover:bg-blue-600 text-white rounded-lg font-semibold text-[11px] transition-colors shadow-2xs"
                      >
                        Why this cost?
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
