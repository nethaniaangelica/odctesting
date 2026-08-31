import React, { useState } from 'react';
import {
  Coins,
  Sliders,
  TrendingUp,
  Percent,
  Calculator,
  PieChart as PieIcon,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Fuel,
  Clock,
  Layers,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { COST_ITEMS, COST_RULES, VEHICLE_CATEGORIES } from '../../data/mockData';

interface CostIntelligenceProps {
  onNavigateToRules: () => void;
  onNavigateToLeakage: () => void;
}

const DRIVER_DISTRIBUTION_DATA = [
  { driver: 'Distance (KM)', count: 1420, spendPct: 48, color: '#3B82F6' },
  { driver: 'Highway Toll Gates', count: 680, spendPct: 22, color: '#6366F1' },
  { driver: 'Time / Lead-Time (Hours)', count: 490, spendPct: 14, color: '#10B981' },
  { driver: 'Weight / Payload (Tons)', count: 340, spendPct: 8, color: '#F59E0B' },
  { driver: 'Depot Unit (Per Box)', count: 210, spendPct: 5, color: '#8B5CF6' },
  { driver: 'Negotiated Exception', count: 98, spendPct: 3, color: '#EF4444' },
];

export const CostIntelligence: React.FC<CostIntelligenceProps> = ({
  onNavigateToRules,
  onNavigateToLeakage,
}) => {
  // Live Cost Simulator State
  const [simKm, setSimKm] = useState(480);
  const [simVehicleId, setSimVehicleId] = useState(VEHICLE_CATEGORIES[0].id);
  const [simTollGates, setSimTollGates] = useState(14);
  const [simLeadTimeHours, setSimLeadTimeHours] = useState(14);
  const [simIncludeDepot, setSimIncludeDepot] = useState(true);

  const selectedVehicle =
    VEHICLE_CATEGORIES.find((v) => v.id === simVehicleId) || VEHICLE_CATEGORIES[0];

  // Calculations
  const calcBaseTrucking = simKm * selectedVehicle.baseRatePerKm;
  const calcToll = simTollGates * 42000;
  const calcFuel = (simKm / selectedVehicle.fuelRatioKmL) * 1.05 * 6800;
  const calcDepot = simIncludeDepot ? 250000 : 0;
  const calcMeal = Math.max(1, Math.ceil(simLeadTimeHours / 24)) * 150000;
  const totalSimCost = calcBaseTrucking + calcToll + calcFuel + calcDepot + calcMeal;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
              FINANCIAL ARCHITECTURE
            </span>
            <span className="text-xs text-slate-400">
              Cost Formation & Rule Engine Analysis
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Cost Intelligence & Formation Engine
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Understand the mathematical bridge: Raw Cost Items (ERP) → Cost Rules →
            Formulated Dynamic ODC.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onNavigateToRules}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 transition-all"
          >
            <Sliders className="w-4 h-4" />
            <span>Rule Configuration ({COST_RULES.length})</span>
          </button>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 text-xs">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Formulated Cost Ratio
          </span>
          <span className="text-2xl font-bold text-emerald-700 mt-1 block font-mono">
            87.4%
          </span>
          <span className="text-[11px] text-slate-500">Automated by rule engine</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Non-Formulated / Exceptions
          </span>
          <span className="text-2xl font-bold text-amber-600 mt-1 block font-mono">
            12.6%
          </span>
          <span className="text-[11px] text-slate-500">PV Extra manual additions</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Active Parameterized Rules
          </span>
          <span className="text-2xl font-bold text-indigo-700 mt-1 block font-mono">
            {COST_RULES.length} Rules
          </span>
          <span className="text-[11px] text-slate-500">Replaces 3,798 static items</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Average Cost Variance
          </span>
          <span className="text-2xl font-bold text-blue-800 mt-1 block font-mono">
            ±2.1%
          </span>
          <span className="text-[11px] text-emerald-600 font-semibold">High predictability</span>
        </div>
      </div>

      {/* Driver Distribution & Formation Relationship */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost Drivers Split */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              Operational Cost Driver Breakdown
            </h3>
            <p className="text-xs text-slate-400">
              Spend percentage generated by primary operational metrics
            </p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DRIVER_DISTRIBUTION_DATA} layout="vertical" margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                <XAxis type="number" unit="%" tick={{ fontSize: 11 }} />
                <YAxis dataKey="driver" type="category" tick={{ fontSize: 11, fill: '#334155' }} width={120} />
                <Tooltip formatter={(val: any) => [`${val}% of total ODC spend`, 'Spend Share']} />
                <Bar dataKey="spendPct" radius={[0, 6, 6, 0]}>
                  {DRIVER_DISTRIBUTION_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-blue-900">
            <strong>Key Insight:</strong> Distance (KM) and Tollway fees constitute 70% of all direct
            expenses. Validating Route KM and Toll Plaza counts directly secures bottom-line profit.
          </div>
        </div>

        {/* Dynamic Interactive Cost Formation Simulator */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-800">
                Interactive Cost Formation Simulator
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Real-time Formula
            </span>
          </div>

          {/* Simulator Inputs */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Fleet Category</label>
              <select
                value={simVehicleId}
                onChange={(e) => setSimVehicleId(e.target.value)}
                className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium"
              >
                {VEHICLE_CATEGORIES.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Corridor Distance (KM)</label>
              <input
                type="number"
                value={simKm}
                onChange={(e) => setSimKm(parseInt(e.target.value) || 0)}
                className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-slate-800"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Toll Gates Count</label>
              <input
                type="number"
                value={simTollGates}
                onChange={(e) => setSimTollGates(parseInt(e.target.value) || 0)}
                className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-slate-800"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Lead Time (Hours)</label>
              <input
                type="number"
                value={simLeadTimeHours}
                onChange={(e) => setSimLeadTimeHours(parseInt(e.target.value) || 0)}
                className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-slate-800"
              />
            </div>
          </div>

          {/* Simulated Cost Summary */}
          <div className="p-4 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium">SIMULATED TOTAL ODC</span>
              <span className="text-xl font-bold font-mono text-emerald-400">
                Rp {totalSimCost.toLocaleString()}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-700 text-[11px]">
              <div>
                <span className="text-slate-400 block">Base Trucking</span>
                <span className="font-mono text-slate-200">
                  Rp {Math.round(calcBaseTrucking).toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Tollway & Fuel</span>
                <span className="font-mono text-slate-200">
                  Rp {Math.round(calcToll + calcFuel).toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Depot & Meals</span>
                <span className="font-mono text-slate-200">
                  Rp {Math.round(calcDepot + calcMeal).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
