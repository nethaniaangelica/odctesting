import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  FileCheck2,
  Route,
  Coins,
  Sliders,
  MapPin,
  Building2,
  ArrowRight,
} from 'lucide-react';
import {
  HISTORICAL_ODCS,
  COST_ITEMS,
  COST_RULES,
  ROUTE_MASTERS,
  LOCATOR_POINTS,
} from '../data/mockData';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEntity: (type: string, item: any) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectEntity,
}) => {
  const [query, setQuery] = useState('');

  const filteredResults = useMemo(() => {
    if (!query.trim()) {
      return {
        odcs: HISTORICAL_ODCS.slice(0, 2),
        costItems: COST_ITEMS.slice(0, 3),
        rules: COST_RULES.slice(0, 2),
        routes: ROUTE_MASTERS.slice(0, 2),
        locators: LOCATOR_POINTS.slice(0, 2),
      };
    }
    const q = query.toLowerCase();

    return {
      odcs: HISTORICAL_ODCS.filter(
        (o) =>
          o.odcNumber.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.originName.toLowerCase().includes(q) ||
          o.destinationName.toLowerCase().includes(q)
      ),
      costItems: COST_ITEMS.filter(
        (ci) =>
          ci.name.toLowerCase().includes(q) ||
          ci.code.toLowerCase().includes(q) ||
          ci.kind.toLowerCase().includes(q)
      ),
      rules: COST_RULES.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.ruleCode.toLowerCase().includes(q) ||
          r.costComponent.toLowerCase().includes(q)
      ),
      routes: ROUTE_MASTERS.filter(
        (rt) =>
          rt.name.toLowerCase().includes(q) ||
          rt.code.toLowerCase().includes(q) ||
          rt.originName.toLowerCase().includes(q) ||
          rt.destinationName.toLowerCase().includes(q)
      ),
      locators: LOCATOR_POINTS.filter(
        (loc) =>
          loc.name.toLowerCase().includes(q) ||
          loc.city.toLowerCase().includes(q) ||
          loc.code.toLowerCase().includes(q)
      ),
    };
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Header */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50/50">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search ODC #, Customer, Route, Cost Item, Rule, Location..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent border-none outline-none text-slate-800 text-sm placeholder:text-slate-400 font-medium"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
          {/* ODCs */}
          {filteredResults.odcs.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-2">
                <span className="flex items-center gap-1.5">
                  <FileCheck2 className="w-3.5 h-3.5 text-blue-600" /> ODC TRANSACTIONS
                </span>
                <span>{filteredResults.odcs.length} found</span>
              </div>
              <div className="space-y-1.5">
                {filteredResults.odcs.map((odc) => (
                  <div
                    key={odc.id}
                    onClick={() => {
                      onSelectEntity('ODC', odc);
                      onClose();
                    }}
                    className="p-2.5 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/40 cursor-pointer flex items-center justify-between transition-all"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">{odc.odcNumber}</span>
                        <span className="text-slate-500 font-medium">{odc.customerName}</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 font-semibold text-slate-600">
                          {odc.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {odc.originName} → {odc.destinationName} • Rp{' '}
                        {odc.totalCostRp.toLocaleString()}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cost Items */}
          {filteredResults.costItems.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-2">
                <span className="flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-emerald-600" /> COST ITEMS
                </span>
                <span>{filteredResults.costItems.length} found</span>
              </div>
              <div className="space-y-1.5">
                {filteredResults.costItems.map((ci) => (
                  <div
                    key={ci.id}
                    onClick={() => {
                      onSelectEntity('COST_ITEM', ci);
                      onClose();
                    }}
                    className="p-2.5 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/40 cursor-pointer flex items-center justify-between transition-all"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">{ci.code}</span>
                        <span className="text-slate-700 font-medium">{ci.name}</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                          {ci.classification}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Driver: {ci.driverType} • Quality: {ci.qualityScore}% • Rec:{' '}
                        {ci.recommendation}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cost Rules */}
          {filteredResults.rules.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-2">
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-indigo-600" /> PARAMETERIZED COST RULES
                </span>
                <span>{filteredResults.rules.length} found</span>
              </div>
              <div className="space-y-1.5">
                {filteredResults.rules.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => {
                      onSelectEntity('COST_RULE', r);
                      onClose();
                    }}
                    className="p-2.5 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/40 cursor-pointer flex items-center justify-between transition-all"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-indigo-900">{r.ruleCode}</span>
                        <span className="text-slate-800 font-medium">{r.name}</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-50 text-indigo-700 font-mono">
                          {r.version}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                        {r.formulaDescription}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Routes */}
          {filteredResults.routes.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-2">
                <span className="flex items-center gap-1.5">
                  <Route className="w-3.5 h-3.5 text-amber-600" /> OPERATIONAL ROUTES
                </span>
                <span>{filteredResults.routes.length} found</span>
              </div>
              <div className="space-y-1.5">
                {filteredResults.routes.map((rt) => (
                  <div
                    key={rt.id}
                    onClick={() => {
                      onSelectEntity('ROUTE', rt);
                      onClose();
                    }}
                    className="p-2.5 rounded-xl border border-slate-100 hover:border-amber-200 hover:bg-amber-50/40 cursor-pointer flex items-center justify-between transition-all"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">{rt.code}</span>
                        <span className="text-slate-700 font-medium">{rt.name}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        PDCA KM: {rt.pdcaCalculatedKm} km (ERP: {rt.erpKm} km) • Toll: Rp{' '}
                        {rt.standardTollCost.toLocaleString()}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Locators */}
          {filteredResults.locators.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-2">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-600" /> SHIPMENT LOCATORS
                </span>
                <span>{filteredResults.locators.length} found</span>
              </div>
              <div className="space-y-1.5">
                {filteredResults.locators.map((loc) => (
                  <div
                    key={loc.id}
                    onClick={() => {
                      onSelectEntity('LOCATOR', loc);
                      onClose();
                    }}
                    className="p-2.5 rounded-xl border border-slate-100 hover:border-rose-200 hover:bg-rose-50/40 cursor-pointer flex items-center justify-between transition-all"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">{loc.name}</span>
                        <span className="text-slate-500">{loc.city}</span>
                        {loc.hasMismatch && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-rose-50 text-rose-700 font-semibold border border-rose-200">
                            GPS Mismatch
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{loc.address}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span>Press ESC to exit</span>
          <span>Click any item to inspect in right detail drawer</span>
        </div>
      </div>
    </div>
  );
};
