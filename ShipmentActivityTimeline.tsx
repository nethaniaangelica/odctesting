import React, { useState } from 'react';
import {
  Workflow,
  Clock,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  Play,
  FileCheck2,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { SHIPMENT_ACTIVITIES } from '../../data/mockData';
import { ShipmentActivity } from '../../types';

export const ShipmentActivityTimeline: React.FC = () => {
  const [selectedStage, setSelectedStage] = useState<'ALL' | 'PRE_TRIP' | 'ON_TRIP' | 'POST_TRIP'>('ALL');
  const [activities, setActivities] = useState<ShipmentActivity[]>(SHIPMENT_ACTIVITIES);

  const displayedActivities =
    selectedStage === 'ALL'
      ? activities
      : activities.filter((a) => a.phase === selectedStage);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
              OPERATIONAL TIMELINE & RACI
            </span>
            <span className="text-xs text-slate-400">
              Decoupled Shipment Activity Lifecycle
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Shipment Activity & MoboDrive Lead-Time Flow
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational activities decoupled from cost items. RACI responsibilities mapped across Pre-Trip, On-Trip, and Post-Trip stages.
          </p>
        </div>

        {/* Stage Filter */}
        <div className="flex p-1 bg-slate-100 rounded-xl text-xs font-semibold shrink-0">
          <button
            onClick={() => setSelectedStage('ALL')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              selectedStage === 'ALL' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600'
            }`}
          >
            All Stages ({activities.length})
          </button>
          <button
            onClick={() => setSelectedStage('PRE_TRIP')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              selectedStage === 'PRE_TRIP' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600'
            }`}
          >
            Pre-Trip
          </button>
          <button
            onClick={() => setSelectedStage('ON_TRIP')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              selectedStage === 'ON_TRIP' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600'
            }`}
          >
            On-Trip
          </button>
          <button
            onClick={() => setSelectedStage('POST_TRIP')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              selectedStage === 'POST_TRIP' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600'
            }`}
          >
            Post-Trip
          </button>
        </div>
      </div>

      {/* 3 Major Stages Architecture Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
        {/* Stage 1: Pre-Trip */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-blue-800 uppercase tracking-wider text-[10.5px]">
              Stage 1: Pre-Trip Dispatch
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              Planner / HSE
            </span>
          </div>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            Inquiry validation, P2H workshop vehicle inspection, JMP (Journey Management Plan), and driver pairing.
          </p>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Standard Duration:</span>
              <span className="font-mono font-bold">45 Mins</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Cost Impact:</span>
              <span className="text-emerald-700 font-semibold">P2H & Admin Allowance</span>
            </div>
          </div>
        </div>

        {/* Stage 2: On-Trip */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-indigo-800 uppercase tracking-wider text-[10.5px]">
              Stage 2: On-Trip (MoboDrive)
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Driver / Fleet
            </span>
          </div>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            Loading geofence timestamp, highway toll corridor passage, rest area staging, and consignee arrival.
          </p>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Lead-Time Standard:</span>
              <span className="font-mono font-bold">Corridor Dependent</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Cost Impact:</span>
              <span className="text-indigo-700 font-semibold">Fuel, Toll, Overnight Meal</span>
            </div>
          </div>
        </div>

        {/* Stage 3: Post-Trip */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-emerald-800 uppercase tracking-wider text-[10.5px]">
              Stage 3: Post-Trip Settlement
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Depot / Finance
            </span>
          </div>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            Empty container return with EIR depot stamp, signed physical POD return, and billing reconciliation.
          </p>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Standard Duration:</span>
              <span className="font-mono font-bold">1-2 Days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Cost Impact:</span>
              <span className="text-emerald-700 font-semibold">Depot Lift-Off, Unbilled Debit Notes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Activities Detail Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden text-xs">
        <div className="p-4 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
            Master Activity Directory ({displayedActivities.length})
          </h3>
          <span className="text-slate-400">RACI Role Mappings</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-2.5 px-3.5">Activity Code & Name</th>
                <th className="py-2.5 px-3">Stage Phase</th>
                <th className="py-2.5 px-3">Associated RACI Role</th>
                <th className="py-2.5 px-3">Linked Cost Driver</th>
                <th className="py-2.5 px-3 text-center">Std Duration</th>
                <th className="py-2.5 px-3 text-center">Automation</th>
                <th className="py-2.5 px-3 text-center">Trigger Event</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedActivities.map((act) => (
                <tr key={act.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3.5">
                    <span className="font-bold text-slate-900 block">{act.name}</span>
                    <span className="font-mono text-[10px] text-indigo-600">{act.code}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                      {act.phase}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-800">
                    {act.raciResponsible}
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">
                    {act.defaultCostItemName || 'Formulated Driver'}
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-medium text-slate-800">
                    {act.standardDurationMins} mins
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {act.automated !== false ? 'AUTOMATED' : 'MANUAL'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">
                      {act.triggerEvent}
                    </span>
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
