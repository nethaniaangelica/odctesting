import React, { useMemo, useState } from 'react';
import {
  Trash2,
  Edit2,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  Download,
  RefreshCw,
} from 'lucide-react';
import { ShipmentTrip, CustomerBudgetRow, RouteMaster } from '../../types';
import {
  reconcileAllTrips,
  detectCostLeakage,
  generateBudgetRecommendations,
  getBudgetUtilization,
} from '../../utils/validationEngine';

interface DataManagementProps {
  trips: ShipmentTrip[];
  budgets: CustomerBudgetRow[];
  routes: RouteMaster[];
  onDeleteTrip: (tripId: string) => void;
  onUpdateBudget: (budget: CustomerBudgetRow) => void;
  onRefresh: () => void;
}

export const DataManagement: React.FC<DataManagementProps> = ({
  trips,
  budgets,
  routes,
  onDeleteTrip,
  onUpdateBudget,
  onRefresh,
}) => {
  const [activeTab, setActiveTab] = useState<'trips' | 'budgets' | 'leakage' | 'recommendations'>(
    'trips'
  );
  const [selectedTrip, setSelectedTrip] = useState<ShipmentTrip | null>(null);
  const [editBudget, setEditBudget] = useState<CustomerBudgetRow | null>(null);

  // Calculations
  const reconciliations = useMemo(() => reconcileAllTrips(trips, routes), [trips, routes]);
  const leakageAlerts = useMemo(() => detectCostLeakage(trips), [trips]);
  const recommendations = useMemo(
    () => generateBudgetRecommendations(trips, budgets),
    [trips, budgets]
  );
  const budgetUtilization = useMemo(() => getBudgetUtilization(trips, budgets), [trips, budgets]);

  const totalCost = trips.reduce((sum, t) => sum + t.totalCostRp, 0);
  const totalBudget = budgets.reduce((sum, b) => sum + b.budgetRp, 0);
  const totalLeakage = trips.reduce((sum, t) => sum + t.leakageRp, 0);
  const costVariance = totalCost - totalBudget;
  const variancePct = totalBudget > 0 ? (costVariance / totalBudget) * 100 : 0;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                MASTER DATA MANAGEMENT
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Imported Data Dashboard & Reconciliation</h2>
            <p className="text-sm text-slate-500 mt-1">
              Manage imported shipment trips, budgets, and validate cost performance
            </p>
          </div>
          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg flex items-center gap-2 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Summary KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Trips Imported</span>
            <span className="text-2xl font-bold text-slate-900 block mt-1">{trips.length}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Total Cost</span>
            <span className="text-lg font-bold text-slate-900 block mt-1">
              Rp {(totalCost / 1000000).toFixed(1)}M
            </span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Total Budget</span>
            <span className="text-lg font-bold text-slate-900 block mt-1">
              Rp {(totalBudget / 1000000).toFixed(1)}M
            </span>
          </div>
          <div
            className={`p-3 rounded-lg border ${
              costVariance > 0
                ? 'bg-rose-50 border-rose-200'
                : 'bg-emerald-50 border-emerald-200'
            }`}
          >
            <span
              className={`text-[10px] font-bold uppercase ${
                costVariance > 0 ? 'text-rose-600' : 'text-emerald-600'
              }`}
            >
              {costVariance > 0 ? 'Over Budget' : 'Under Budget'}
            </span>
            <span
              className={`text-lg font-bold block mt-1 ${
                costVariance > 0 ? 'text-rose-900' : 'text-emerald-900'
              }`}
            >
              {costVariance > 0 ? '+' : ''}
              {variancePct.toFixed(1)}%
            </span>
          </div>
          <div className="p-3 bg-rose-50 rounded-lg border border-rose-200">
            <span className="text-[10px] font-bold text-rose-600 uppercase">Leakage</span>
            <span className="text-lg font-bold text-rose-900 block mt-1">
              Rp {(totalLeakage / 1000).toLocaleString()}k
            </span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 bg-white rounded-lg border border-slate-200 p-3 sticky top-20 z-10">
        {[
          { id: 'trips', label: 'Imported Trips', count: trips.length },
          { id: 'budgets', label: 'Budgets', count: budgets.length },
          { id: 'leakage', label: 'Cost Leakage', count: leakageAlerts.length },
          { id: 'recommendations', label: 'Recommendations', count: recommendations.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
            <span
              className={`ml-2 font-bold ${
                activeTab === tab.id ? 'text-blue-700' : 'text-slate-400'
              }`}
            >
              ({tab.count})
            </span>
          </button>
        ))}
      </div>

      {/* TAB: TRIPS */}
      {activeTab === 'trips' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Imported Shipment Trips ({trips.length})</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-4">Trip Code</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4 text-right">KM</th>
                  <th className="py-3 px-4 text-right">Actual Cost</th>
                  <th className="py-3 px-4 text-right">Budget</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {trips.map((trip) => {
                  const recon = reconciliations.find((r) => r.tripId === trip.id);
                  const variance = trip.totalCostRp - trip.budgetRp;

                  return (
                    <tr
                      key={trip.id}
                      className="hover:bg-slate-50 transition-colors cursor-pointer"
                      onClick={() => setSelectedTrip(trip)}
                    >
                      <td className="py-3 px-4 font-semibold">{trip.tripCode}</td>
                      <td className="py-3 px-4 text-slate-700">{trip.customerName}</td>
                      <td className="py-3 px-4 text-right font-mono">{trip.actualKm} km</td>
                      <td className="py-3 px-4 text-right font-mono font-bold">
                        Rp {trip.totalCostRp.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-mono">
                        Rp {trip.budgetRp.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2 py-1 rounded text-[10px] font-bold ${
                            recon?.status === 'ON_BUDGET'
                              ? 'bg-emerald-100 text-emerald-800'
                              : recon?.status === 'MINOR_VARIANCE'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {recon?.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteTrip(trip.id);
                          }}
                          className="p-1.5 hover:bg-rose-100 text-rose-600 rounded transition-colors"
                          title="Delete trip"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {selectedTrip && (
            <div className="p-4 bg-blue-50 border-t border-slate-200 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-slate-900">{selectedTrip.tripCode}</h4>
                  <p className="text-xs text-slate-600 mt-1">{selectedTrip.customerName}</p>
                </div>
                <button
                  onClick={() => setSelectedTrip(null)}
                  className="text-slate-500 hover:text-slate-700"
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-slate-500">Departure</span>
                  <span className="block font-mono text-slate-900">{selectedTrip.actualDepartureAt}</span>
                </div>
                <div>
                  <span className="text-slate-500">Arrival</span>
                  <span className="block font-mono text-slate-900">{selectedTrip.actualArrivalAt}</span>
                </div>
                <div>
                  <span className="text-slate-500">Segments</span>
                  <span className="block font-mono text-slate-900">{selectedTrip.segments.length}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB: BUDGETS */}
      {activeTab === 'budgets' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <h3 className="font-bold text-slate-900">Customer Budgets ({budgets.length})</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Route Segment</th>
                  <th className="py-3 px-4 text-right">Budget</th>
                  <th className="py-3 px-4 text-right">Spent</th>
                  <th className="py-3 px-4 text-right">Utilization</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {budgets.map((budget) => {
                  const util = budgetUtilization.get(budget.customerId) || {
                    spent: 0,
                    budget: 0,
                    utilization: 0,
                  };
                  const spent = util.spent;
                  const utilization = util.utilization;

                  return (
                    <tr key={budget.customerId} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-semibold">{budget.customerName}</td>
                      <td className="py-3 px-4 text-slate-600">{budget.routeSegment}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold">
                        Rp {budget.budgetRp.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-mono">
                        Rp {spent.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                utilization > 100
                                  ? 'bg-rose-500'
                                  : utilization > 90
                                  ? 'bg-amber-500'
                                  : 'bg-emerald-500'
                              }`}
                              style={{ width: `${Math.min(utilization, 100)}%` }}
                            />
                          </div>
                          <span className="font-mono font-bold text-slate-900 w-10 text-right">
                            {utilization.toFixed(0)}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2 py-1 rounded text-[10px] font-bold ${
                            budget.status === 'WITHIN_BUDGET'
                              ? 'bg-emerald-100 text-emerald-800'
                              : budget.status === 'REVIEW'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {budget.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => setEditBudget(budget)}
                          className="p-1.5 hover:bg-blue-100 text-blue-600 rounded transition-colors"
                          title="Edit budget"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {editBudget && (
            <div className="p-4 bg-blue-50 border-t border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900">Edit Budget: {editBudget.customerName}</h4>
                <button
                  onClick={() => setEditBudget(null)}
                  className="text-slate-500 hover:text-slate-700"
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Budget (Rp)</label>
                  <input
                    type="number"
                    value={editBudget.budgetRp}
                    onChange={(e) =>
                      setEditBudget({
                        ...editBudget,
                        budgetRp: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
              </div>
              <button
                onClick={() => {
                  if (editBudget) {
                    onUpdateBudget(editBudget);
                    setEditBudget(null);
                  }
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB: LEAKAGE */}
      {activeTab === 'leakage' && (
        <div className="space-y-4">
          {leakageAlerts.length === 0 ? (
            <div className="p-8 bg-emerald-50 rounded-lg border border-emerald-200 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
              <p className="text-emerald-900 font-semibold">No cost leakage detected</p>
              <p className="text-emerald-700 text-sm mt-1">All trips are within acceptable variance</p>
            </div>
          ) : (
            leakageAlerts.map((alert) => (
              <div
                key={`${alert.tripId}-${alert.type}`}
                className={`p-4 rounded-lg border ${
                  alert.severity === 'CRITICAL'
                    ? 'bg-rose-50 border-rose-200'
                    : alert.severity === 'HIGH'
                    ? 'bg-orange-50 border-orange-200'
                    : 'bg-amber-50 border-amber-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle
                    className={`w-5 h-5 shrink-0 mt-0.5 ${
                      alert.severity === 'CRITICAL'
                        ? 'text-rose-600'
                        : alert.severity === 'HIGH'
                        ? 'text-orange-600'
                        : 'text-amber-600'
                    }`}
                  />
                  <div className="flex-1">
                    <h4
                      className={`font-bold ${
                        alert.severity === 'CRITICAL'
                          ? 'text-rose-900'
                          : alert.severity === 'HIGH'
                          ? 'text-orange-900'
                          : 'text-amber-900'
                      }`}
                    >
                      {alert.title}
                    </h4>
                    <p className="text-sm text-slate-700 mt-1">{alert.description}</p>
                    <p className="text-xs text-slate-600 mt-2 font-semibold">
                      💡 {alert.recommendation}
                    </p>
                    <div className="mt-2 flex items-center gap-4">
                      <span className="text-xs font-mono font-bold">
                        Amount: Rp {alert.amount.toLocaleString()}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                        {alert.tripCode}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB: RECOMMENDATIONS */}
      {activeTab === 'recommendations' && (
        <div className="space-y-4">
          {recommendations.length === 0 ? (
            <div className="p-8 bg-slate-50 rounded-lg border border-slate-200 text-center">
              <Lightbulb className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-900 font-semibold">No recommendations available</p>
              <p className="text-slate-600 text-sm mt-1">
                Import more trip data to get budget recommendations
              </p>
            </div>
          ) : (
            recommendations.map((rec) => (
              <div
                key={rec.customerId}
                className={`p-4 rounded-lg border ${
                  rec.riskLevel === 'HIGH'
                    ? 'bg-orange-50 border-orange-200'
                    : rec.riskLevel === 'MEDIUM'
                    ? 'bg-amber-50 border-amber-200'
                    : 'bg-emerald-50 border-emerald-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4
                      className={`font-bold ${
                        rec.riskLevel === 'HIGH'
                          ? 'text-orange-900'
                          : rec.riskLevel === 'MEDIUM'
                          ? 'text-amber-900'
                          : 'text-emerald-900'
                      }`}
                    >
                      {rec.customerName}
                    </h4>
                    <p className="text-sm text-slate-700 mt-1">{rec.reason}</p>
                    <div className="mt-2 grid grid-cols-3 gap-4 text-xs font-mono">
                      <div>
                        <span className="text-slate-500">Current</span>
                        <span className="block font-bold">
                          Rp {(rec.currentBudget / 1000000).toFixed(1)}M
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500">Recommended</span>
                        <span className="block font-bold">
                          Rp {(rec.recommendedBudget / 1000000).toFixed(1)}M
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500">Change</span>
                        <span className={`block font-bold ${
                          rec.recommendedBudget > rec.currentBudget
                            ? 'text-orange-600'
                            : 'text-emerald-600'
                        }`}>
                          {rec.recommendedBudget > rec.currentBudget ? '+' : ''}
                          {(((rec.recommendedBudget - rec.currentBudget) /
                            rec.currentBudget) *
                            100).toFixed(1)}
                          %
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const budget = budgets.find((b) => b.customerId === rec.customerId);
                      if (budget) {
                        onUpdateBudget({
                          ...budget,
                          budgetRp: rec.recommendedBudget,
                        });
                      }
                    }}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded transition-colors shrink-0"
                  >
                    Apply
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
