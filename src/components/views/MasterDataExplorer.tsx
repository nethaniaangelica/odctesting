import React, { useState, useMemo } from 'react';
import {
  Database,
  Search,
  Filter,
  Layers,
  Coins,
  Route,
  MapPin,
  Workflow,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Download,
  Eye,
} from 'lucide-react';
import {
  COST_ITEMS,
  SHIPMENT_ACTIVITIES,
  ROUTE_MASTERS,
  LOCATOR_POINTS,
  DEPOTS,
} from '../../data/mockData';
import { CostItem } from '../../types';

interface MasterDataExplorerProps {
  onInspectEntity: (type: string, data: any) => void;
  onNavigateToMatrix: () => void;
}

export const MasterDataExplorer: React.FC<MasterDataExplorerProps> = ({
  onInspectEntity,
  onNavigateToMatrix,
}) => {
  const [activeTab, setActiveTab] = useState<'COST_ITEMS' | 'ACTIVITIES' | 'DEPOTS' | 'ROUTES' | 'LOCATORS'>('COST_ITEMS');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRedundancy, setFilterRedundancy] = useState<string>('ALL');

  const filteredCostItems = useMemo(() => {
    return COST_ITEMS.filter((item) => {
      const matchQuery =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.kind.toLowerCase().includes(searchQuery.toLowerCase());

      const matchRedundancy =
        filterRedundancy === 'ALL' || item.redundancyTag === filterRedundancy;

      return matchQuery && matchRedundancy;
    });
  }, [searchQuery, filterRedundancy]);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
              ENTERPRISE INVENTORY
            </span>
            <span className="text-xs text-slate-400">
              3,798 Cost Items • 497 Activities • 13 Kinds
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Master Data Explorer & Governance
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit enterprise master data health, detect duplicate naming strings, identify zero-usage items, and enforce naming standards.
          </p>
        </div>

        <button
          onClick={onNavigateToMatrix}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-2 transition-all shrink-0"
        >
          <Layers className="w-4 h-4" />
          <span>Open 2x2 Rationalization Matrix</span>
        </button>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
        <div
          onClick={() => setActiveTab('COST_ITEMS')}
          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
            activeTab === 'COST_ITEMS'
              ? 'bg-blue-50 border-blue-300 shadow-2xs'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="font-bold text-[10px] uppercase">Cost Items</span>
            <Coins className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div className="text-lg font-bold font-mono text-slate-900">3,798</div>
          <div className="text-[10px] text-amber-600 font-semibold">2,840 Zero-usage</div>
        </div>

        <div
          onClick={() => setActiveTab('ACTIVITIES')}
          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
            activeTab === 'ACTIVITIES'
              ? 'bg-blue-50 border-blue-300 shadow-2xs'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="font-bold text-[10px] uppercase">Activities</span>
            <Workflow className="w-3.5 h-3.5 text-indigo-600" />
          </div>
          <div className="text-lg font-bold font-mono text-slate-900">497</div>
          <div className="text-[10px] text-slate-500">Pre/On/Post trip</div>
        </div>

        <div
          onClick={() => setActiveTab('ROUTES')}
          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
            activeTab === 'ROUTES'
              ? 'bg-blue-50 border-blue-300 shadow-2xs'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="font-bold text-[10px] uppercase">Route Masters</span>
            <Route className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="text-lg font-bold font-mono text-slate-900">1,240</div>
          <div className="text-[10px] text-slate-500">Corridors</div>
        </div>

        <div
          onClick={() => setActiveTab('DEPOTS')}
          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
            activeTab === 'DEPOTS'
              ? 'bg-blue-50 border-blue-300 shadow-2xs'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="font-bold text-[10px] uppercase">Depot Masters</span>
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-lg font-bold font-mono text-slate-900">86</div>
          <div className="text-[10px] text-emerald-700 font-semibold">Auto-Lift Off</div>
        </div>

        <div
          onClick={() => setActiveTab('LOCATORS')}
          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
            activeTab === 'LOCATORS'
              ? 'bg-blue-50 border-blue-300 shadow-2xs'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="font-bold text-[10px] uppercase">Locators</span>
            <MapPin className="w-3.5 h-3.5 text-rose-600" />
          </div>
          <div className="text-lg font-bold font-mono text-slate-900">850</div>
          <div className="text-[10px] text-slate-500">GPS verified</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center gap-3 text-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={`Search across active ${activeTab.replace('_', ' ').toLowerCase()}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:border-blue-500 transition-colors"
          />
        </div>

        {activeTab === 'COST_ITEMS' && (
          <select
            value={filterRedundancy}
            onChange={(e) => setFilterRedundancy(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-medium outline-none focus:bg-white w-full sm:w-auto"
          >
            <option value="ALL">All Redundancy Classes</option>
            <option value="HEALTHY">HEALTHY (Keep)</option>
            <option value="RULE_CONVERT_CANDIDATE">RULE CONVERT CANDIDATE</option>
            <option value="REDUNDANT_DUPLICATE">REDUNDANT DUPLICATE</option>
            <option value="ZERO_USAGE">ZERO USAGE (Retire)</option>
          </select>
        )}
      </div>

      {/* TAB 1: COST ITEMS TABLE */}
      {activeTab === 'COST_ITEMS' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-2.5 px-3.5">Code & Name</th>
                  <th className="py-2.5 px-3">Kind / Classification</th>
                  <th className="py-2.5 px-3">Operational Driver</th>
                  <th className="py-2.5 px-3">Formula Template</th>
                  <th className="py-2.5 px-3 text-center">Quality</th>
                  <th className="py-2.5 px-3 text-center">Recommendation</th>
                  <th className="py-2.5 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCostItems.map((ci) => (
                  <tr
                    key={ci.id}
                    onClick={() => onInspectEntity('COST_ITEM', ci)}
                    className="hover:bg-blue-50/40 transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-3.5">
                      <span className="font-bold text-slate-900 block">{ci.name}</span>
                      <span className="font-mono text-[10px] text-blue-600">{ci.code}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                        {ci.kind}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-700">
                      {ci.driverType}
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-500 max-w-xs truncate">
                      {ci.formulaTemplate}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`font-bold font-mono ${
                          ci.qualityScore >= 90
                            ? 'text-emerald-700'
                            : ci.qualityScore >= 60
                            ? 'text-amber-700'
                            : 'text-rose-700'
                        }`}
                      >
                        {ci.qualityScore}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          ci.recommendation === 'KEEP'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ci.recommendation === 'DERIVE_DYNAMICALLY'
                            ? 'bg-blue-100 text-blue-800'
                            : ci.recommendation === 'CONSOLIDATE'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {ci.recommendation.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onInspectEntity('COST_ITEM', ci);
                        }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-blue-600 hover:text-white rounded-lg text-[11px] font-semibold transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: SHIPMENT ACTIVITIES */}
      {activeTab === 'ACTIVITIES' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-2.5 px-3.5">Activity Code & Name</th>
                  <th className="py-2.5 px-3">Stage Category</th>
                  <th className="py-2.5 px-3">Associated Role (RACI)</th>
                  <th className="py-2.5 px-3">Linked Cost Driver</th>
                  <th className="py-2.5 px-3 text-center">Standard Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {SHIPMENT_ACTIVITIES.map((act) => (
                  <tr
                    key={act.id}
                    onClick={() => onInspectEntity('ACTIVITY', act)}
                    className="hover:bg-blue-50/40 transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-3.5">
                      <span className="font-bold text-slate-900 block">{act.name}</span>
                      <span className="font-mono text-[10px] text-blue-600">{act.code}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {act.phase}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-700">
                      {act.raciResponsible}
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">
                      {act.defaultCostItemName || act.triggerEvent}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-medium text-slate-800">
                      {act.standardDurationMins} mins
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: DEPOTS */}
      {activeTab === 'DEPOTS' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-2.5 px-3.5">Depot Master Code & Name</th>
                  <th className="py-2.5 px-3">Location & Operator</th>
                  <th className="py-2.5 px-3 text-right">Fixed Lift-Off Tariff</th>
                  <th className="py-2.5 px-3">Accuracy Score</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {DEPOTS.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3.5">
                      <span className="font-bold text-slate-900 block">{d.name}</span>
                      <span className="font-mono text-[10px] text-blue-600">{d.code}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-700">
                      <span className="font-medium block">{d.locationCity}</span>
                      <span className="text-[10.5px] text-slate-400">Op: {d.operator}</span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-emerald-800">
                      Rp {d.fixedLiftOffCost.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-mono">
                      {d.accuracyScore}%
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        ACTIVE AUTO-MAPPED
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
