import React, { useEffect, useRef, useState } from 'react';
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
import { SHIPMENT_ACTIVITIES, REAL_SHIPMENT_TRIPS, VEHICLE_CATEGORIES } from '../../data/mockData';
import { ShipmentActivity } from '../../types';

type GeofenceState = 'INSIDE' | 'OUTSIDE';
type GeofenceEventType = 'ENTRY' | 'EXIT';

interface WarehouseZone {
  id: string;
  name: string;
  x: number;
  y: number;
  radius: number;
  zoneType: 'DEPOT' | 'WAREHOUSE' | 'CONSIGNEE';
}

interface GeofenceEvent {
  id: string;
  zoneId: string;
  zoneName: string;
  zoneType: WarehouseZone['zoneType'];
  activityId: string;
  activityName: string;
  activityPhase: ShipmentActivity['phase'];
  eventType: GeofenceEventType;
  timestamp: string;
}

const ACTUAL_TRIP_ROUTE = REAL_SHIPMENT_TRIPS[0]?.routePoints ?? [];
const ROUTE_BOUNDS = ACTUAL_TRIP_ROUTE.reduce(
  (acc, point) => ({
    minLat: Math.min(acc.minLat, point.lat),
    maxLat: Math.max(acc.maxLat, point.lat),
    minLng: Math.min(acc.minLng, point.lng),
    maxLng: Math.max(acc.maxLng, point.lng),
  }),
  { minLat: Number.POSITIVE_INFINITY, maxLat: Number.NEGATIVE_INFINITY, minLng: Number.POSITIVE_INFINITY, maxLng: Number.NEGATIVE_INFINITY }
);

const NORMALIZED_ROUTE = ACTUAL_TRIP_ROUTE.map((point) => ({
  ...point,
  x: ((point.lng - ROUTE_BOUNDS.minLng) / (ROUTE_BOUNDS.maxLng - ROUTE_BOUNDS.minLng || 1)) * 100,
  y: ((ROUTE_BOUNDS.maxLat - point.lat) / (ROUTE_BOUNDS.maxLat - ROUTE_BOUNDS.minLat || 1)) * 100,
}));

const WAREHOUSE_ZONES: WarehouseZone[] = [
  { id: 'zone-depot-west', name: NORMALIZED_ROUTE[0]?.name ?? 'Port Gate', x: NORMALIZED_ROUTE[0]?.x ?? 18, y: NORMALIZED_ROUTE[0]?.y ?? 55, radius: 12, zoneType: 'DEPOT' },
  { id: 'zone-cikarang-xdock', name: NORMALIZED_ROUTE[1]?.name ?? 'Cikarang Crossdock', x: NORMALIZED_ROUTE[1]?.x ?? 44, y: NORMALIZED_ROUTE[1]?.y ?? 42, radius: 14, zoneType: 'WAREHOUSE' },
  { id: 'zone-bandung-hub', name: NORMALIZED_ROUTE[2]?.name ?? 'Bandung Consolidation Hub', x: NORMALIZED_ROUTE[2]?.x ?? 72, y: NORMALIZED_ROUTE[2]?.y ?? 62, radius: 16, zoneType: 'WAREHOUSE' },
  { id: 'zone-bogor-consignee', name: NORMALIZED_ROUTE[2]?.name ?? 'Bogor Consignee Yard', x: NORMALIZED_ROUTE[2]?.x ?? 84, y: NORMALIZED_ROUTE[2]?.y ?? 30, radius: 12, zoneType: 'CONSIGNEE' },
];

const ZONE_ACTIVITY_MAP: Record<string, { activityId: string; activityName: string; activityPhase: ShipmentActivity['phase'] }> = {
  'zone-depot-west': { activityId: 'act-on-depo-liftoff', activityName: 'Depot Container Lift-Off / Lift-On', activityPhase: 'ON_TRIP' },
  'zone-cikarang-xdock': { activityId: 'act-on-loading', activityName: 'Shipper Loading & Lashing / Colok Kabel Reefer', activityPhase: 'ON_TRIP' },
  'zone-bandung-hub': { activityId: 'act-on-overnight-rest', activityName: 'Mandatory Driver Rest / Overnight (>24h Nginep)', activityPhase: 'ON_TRIP' },
  'zone-bogor-consignee': { activityId: 'act-on-unloading-gate', activityName: 'Consignee Unloading & Gate Pass Clearance', activityPhase: 'ON_TRIP' },
};

const TOLL_CORRIDOR_GATES = [
  { id: 'gate-cikampek', name: 'Cikampek Toll Plaza', progress: 0.22, time: '08:42', amount: 415000, amountLabel: 'Rp 415.000', golongan: 'IV', golonganLabel: 'Golongan IV', rateLabel: 'Rp 415.000 / gate' },
  { id: 'gate-cikarang-barat', name: 'Cikarang Barat Toll Plaza', progress: 0.45, time: '09:08', amount: 285000, amountLabel: 'Rp 285.000', golongan: 'III', golonganLabel: 'Golongan III', rateLabel: 'Rp 285.000 / gate' },
  { id: 'gate-gempol', name: 'Gempol Toll Plaza', progress: 0.7, time: '09:22', amount: 320000, amountLabel: 'Rp 320.000', golongan: 'IV', golonganLabel: 'Golongan IV', rateLabel: 'Rp 320.000 / gate' },
  { id: 'gate-bandung', name: 'Bandung Toll Corridor', progress: 0.88, time: '09:56', amount: 610000, amountLabel: 'Rp 610.000', golongan: 'IV', golonganLabel: 'Golongan IV', rateLabel: 'Rp 610.000 / gate' },
];

const routeTotalToll = TOLL_CORRIDOR_GATES.reduce((sum, gate) => sum + gate.amount, 0);
const tollByGolongan = ['I', 'II', 'III', 'IV', 'V'].map((golongan) => {
  const matchingGates = TOLL_CORRIDOR_GATES.filter((gate) => gate.golongan === golongan);
  const total = matchingGates.reduce((sum, gate) => sum + gate.amount, 0);
  return {
    golongan,
    gates: matchingGates.length,
    total,
    average: matchingGates.length > 0 ? total / matchingGates.length : 0,
  };
});

const vehicleTollBreakdown = VEHICLE_CATEGORIES.map((vehicle) => {
  const matchingGates = TOLL_CORRIDOR_GATES.filter((gate) => gate.golongan === vehicle.tollGolongan);
  const total = matchingGates.reduce((sum, gate) => sum + gate.amount, 0);

  return {
    ...vehicle,
    gateCount: matchingGates.length,
    routeTotal: total,
    perGateAverage: matchingGates.length > 0 ? total / matchingGates.length : 0,
  };
});

const formatCurrency = (value: number) => `Rp ${value.toLocaleString('id-ID')}`;

const formatTime = (date: Date) =>
  date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

export const ShipmentActivityTimeline: React.FC = () => {
  const [selectedStage, setSelectedStage] = useState<'ALL' | 'PRE_TRIP' | 'ON_TRIP' | 'POST_TRIP'>('ALL');
  const [activities] = useState<ShipmentActivity[]>(SHIPMENT_ACTIVITIES);
  const [isSimulationRunning, setIsSimulationRunning] = useState(true);
  const [timeTick, setTimeTick] = useState(0);
  const [vehiclePosition, setVehiclePosition] = useState({ x: NORMALIZED_ROUTE[0]?.x ?? 20, y: NORMALIZED_ROUTE[0]?.y ?? 58 });
  const [zoneStatuses, setZoneStatuses] = useState<Record<string, GeofenceState>>({
    'zone-depot-west': 'OUTSIDE',
    'zone-cikarang-xdock': 'OUTSIDE',
    'zone-bandung-hub': 'OUTSIDE',
    'zone-bogor-consignee': 'OUTSIDE',
  });
  const [events, setEvents] = useState<GeofenceEvent[]>([
    {
      id: 'seed-1',
      zoneId: 'zone-depot-west',
      zoneName: 'Jakarta DC West',
      zoneType: 'DEPOT',
      activityId: 'act-on-depo-liftoff',
      activityName: 'Depot Container Lift-Off / Lift-On',
      activityPhase: 'ON_TRIP',
      eventType: 'ENTRY',
      timestamp: formatTime(new Date()),
    },
  ]);

  const previousStatusRef = useRef<Record<string, GeofenceState>>(zoneStatuses);

  const resetSimulation = () => {
    const freshStatuses = {
      'zone-depot-west': 'OUTSIDE',
      'zone-cikarang-xdock': 'OUTSIDE',
      'zone-bandung-hub': 'OUTSIDE',
      'zone-bogor-consignee': 'OUTSIDE',
    };

    previousStatusRef.current = freshStatuses;
    setZoneStatuses(freshStatuses);
    setVehiclePosition({ x: NORMALIZED_ROUTE[0]?.x ?? 20, y: NORMALIZED_ROUTE[0]?.y ?? 58 });
    setTimeTick(0);
    setEvents([
      {
        id: 'seed-1',
        zoneId: 'zone-depot-west',
        zoneName: 'Jakarta DC West',
        zoneType: 'DEPOT',
        activityId: 'act-on-depo-liftoff',
        activityName: 'Depot Container Lift-Off / Lift-On',
        activityPhase: 'ON_TRIP',
        eventType: 'ENTRY',
        timestamp: formatTime(new Date()),
      },
    ]);
  };

  const clearLog = () => {
    setEvents([]);
  };

  useEffect(() => {
    if (!isSimulationRunning) return;

    const interval = window.setInterval(() => {
      setTimeTick((current) => current + 1);
    }, 1500);

    return () => window.clearInterval(interval);
  }, [isSimulationRunning]);

  useEffect(() => {
    if (!isSimulationRunning) return;

    if (NORMALIZED_ROUTE.length < 2) {
      setVehiclePosition({ x: NORMALIZED_ROUTE[0]?.x ?? 20, y: NORMALIZED_ROUTE[0]?.y ?? 58 });
      return;
    }

    const cycleProgress = (timeTick % 100) / 100;
    const segmentIndex = Math.min(NORMALIZED_ROUTE.length - 2, Math.floor(cycleProgress * (NORMALIZED_ROUTE.length - 1)));
    const segmentProgress = (cycleProgress * (NORMALIZED_ROUTE.length - 1)) % 1;
    const startPoint = NORMALIZED_ROUTE[segmentIndex];
    const endPoint = NORMALIZED_ROUTE[Math.min(NORMALIZED_ROUTE.length - 1, segmentIndex + 1)];
    const nextVehicle = {
      x: startPoint.x + (endPoint.x - startPoint.x) * segmentProgress,
      y: startPoint.y + (endPoint.y - startPoint.y) * segmentProgress,
    };

    setVehiclePosition(nextVehicle);

    const nextStatuses: Record<string, GeofenceState> = {} as Record<string, GeofenceState>;
    const newEvents: GeofenceEvent[] = [];

    WAREHOUSE_ZONES.forEach((zone) => {
      const distance = Math.hypot(nextVehicle.x - zone.x, nextVehicle.y - zone.y);
      const nextState: GeofenceState = distance <= zone.radius ? 'INSIDE' : 'OUTSIDE';
      nextStatuses[zone.id] = nextState;

      const previousState = previousStatusRef.current[zone.id] ?? 'OUTSIDE';
      if (previousState !== nextState) {
        const mappedActivity = ZONE_ACTIVITY_MAP[zone.id];
        newEvents.push({
          id: `${zone.id}-${Date.now()}`,
          zoneId: zone.id,
          zoneName: zone.name,
          zoneType: zone.zoneType,
          activityId: mappedActivity.activityId,
          activityName: mappedActivity.activityName,
          activityPhase: mappedActivity.activityPhase,
          eventType: nextState === 'INSIDE' ? 'ENTRY' : 'EXIT',
          timestamp: formatTime(new Date()),
        });
      }
    });

    previousStatusRef.current = nextStatuses;
    setZoneStatuses(nextStatuses);

    if (newEvents.length > 0) {
      setEvents((current) => [...newEvents, ...current].slice(0, 8));
    }
  }, [isSimulationRunning, timeTick]);

  const displayedActivities =
    selectedStage === 'ALL'
      ? activities
      : activities.filter((a) => a.phase === selectedStage);

  const routeProgress = isSimulationRunning ? (timeTick % 100) / 100 : 0;
  const tollGateStatus = TOLL_CORRIDOR_GATES.map((gate) => {
    if (routeProgress >= gate.progress) return { ...gate, status: 'PASSED' };
    if (routeProgress + 0.12 >= gate.progress) return { ...gate, status: 'NEXT' };
    return { ...gate, status: 'PENDING' };
  });

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

      {/* Geofence Activity Overlay */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_0.7fr] gap-5">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Geofence Activity</p>
              <h3 className="text-base font-bold text-slate-800">Live Warehouse Zone Overlay</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsSimulationRunning((current) => !current)}
                className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] transition-all ${
                  isSimulationRunning
                    ? 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100'
                    : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                {isSimulationRunning ? 'Pause' : 'Start'}
              </button>
              <button
                type="button"
                onClick={resetSimulation}
                className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600 transition-all hover:bg-slate-100"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={clearLog}
                className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600 transition-all hover:bg-slate-50"
              >
                Clear Log
              </button>
              <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold ${
                isSimulationRunning
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-slate-100 border-slate-200 text-slate-600'
              }`}>
                <span className={`h-2 w-2 rounded-full ${isSimulationRunning ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                {isSimulationRunning ? 'LIVE' : 'PAUSED'}
              </span>
            </div>
          </div>

          <div className="relative h-44 rounded-2xl border border-slate-200 bg-[radial-gradient(circle_at_top,_#f8fafc,_#eef2ff_45%,_#e2e8f0_100%)] overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.14)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.14)_1px,transparent_1px)] bg-[size:24px_24px]" />

            {WAREHOUSE_ZONES.map((zone) => {
              const isInside = zoneStatuses[zone.id] === 'INSIDE';
              return (
                <div key={zone.id}>
                  <div
                    className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 ${
                      isInside ? 'border-emerald-500 bg-emerald-100/70' : 'border-amber-400 bg-amber-100/60'
                    }`}
                    style={{
                      left: `${zone.x}%`,
                      top: `${zone.y}%`,
                      width: `${zone.radius * 2}%`,
                      height: `${zone.radius * 2}%`,
                    }}
                  />
                  <div
                    className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-900 px-2 py-1 text-[9px] font-semibold text-white shadow-sm"
                    style={{ left: `${zone.x}%`, top: `${zone.y - zone.radius / 1.8}%` }}
                  >
                    {zone.name}
                  </div>
                </div>
              );
            })}

            <div
              className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-indigo-600 shadow-lg shadow-indigo-200"
              style={{ left: `${vehiclePosition.x}%`, top: `${vehiclePosition.y}%` }}
            />
            <div className="absolute right-3 top-3 rounded-full bg-white/90 border border-slate-200 px-2 py-1 text-[10px] font-semibold text-slate-600 shadow-sm">
              Vehicle: Unit JKT-405
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">Toll Corridor</h3>
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-indigo-500">Section</span>
            </div>

            <div className="mb-3 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.14em] text-indigo-600">
                <span>Total Tarif Rute</span>
                <span className="font-bold text-indigo-800">{formatCurrency(routeTotalToll)}</span>
              </div>
            </div>

            <div className="space-y-2.5">
              {tollGateStatus.map((gate) => (
                <div key={gate.id} className="rounded-xl border border-slate-200 bg-indigo-50/40 p-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold text-slate-700">{gate.name}</span>
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                        gate.status === 'PASSED'
                          ? 'bg-emerald-100 text-emerald-700'
                          : gate.status === 'NEXT'
                            ? 'bg-indigo-100 text-indigo-700'
                            : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {gate.status}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
                    <span>{gate.time}</span>
                    <span className="font-semibold text-slate-700">{gate.amountLabel}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[9px] text-slate-500">
                    <span>{gate.golonganLabel}</span>
                    <span className="font-medium text-indigo-700">{gate.rateLabel}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
              <div className="bg-slate-50 px-2.5 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">
                Tarif per Golongan
              </div>
              <table className="w-full text-left text-[10px]">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-2.5 py-2">Golongan</th>
                    <th className="px-2.5 py-2">Gate</th>
                    <th className="px-2.5 py-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {tollByGolongan.map((item) => (
                    <tr key={item.golongan} className="border-t border-slate-200">
                      <td className="px-2.5 py-2 font-semibold text-slate-700">{item.golongan}</td>
                      <td className="px-2.5 py-2 text-slate-600">{item.gates}</td>
                      <td className="px-2.5 py-2 font-semibold text-indigo-700">{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
              <div className="bg-slate-50 px-2.5 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">
                Detail Jenis Kendaraan
              </div>
              <div className="max-h-52 overflow-y-auto">
                {vehicleTollBreakdown.map((vehicle) => (
                  <div key={vehicle.id} className="flex items-center justify-between gap-3 border-t border-slate-200 px-2.5 py-2 text-[10px]">
                    <div>
                      <div className="font-semibold text-slate-700">{vehicle.name}</div>
                      <div className="text-slate-500">{vehicle.type} • Golongan {vehicle.tollGolongan}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-indigo-700">{vehicle.gateCount} gate</div>
                      <div className="text-slate-500">{formatCurrency(vehicle.routeTotal)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">Event Log</h3>
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Auto Logged</span>
            </div>

            <div className="space-y-2">
              {events.map((event) => (
                <div key={event.id} className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                        event.eventType === 'ENTRY' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {event.eventType}
                    </span>
                    <span className="text-[10px] text-slate-400">{event.timestamp}</span>
                  </div>
                  <p className="mt-1 text-[11px] font-semibold text-slate-700">{event.zoneName}</p>
                  <p className="mt-0.5 text-[10px] text-indigo-700">{event.activityName}</p>
                  <p className="text-[9px] uppercase tracking-[0.12em] text-slate-500">{event.activityPhase} • {event.zoneType}</p>
                </div>
              ))}
            </div>
          </div>
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
