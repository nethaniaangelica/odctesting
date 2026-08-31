import React, { useState } from 'react';
import {
  Route as RouteIcon,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Coins,
  Clock,
  Compass,
  ArrowRight,
  TrendingDown,
  Building2,
  Layers,
  Sparkles,
} from 'lucide-react';
import { ROUTE_MASTERS, LOCATOR_POINTS, REAL_SHIPMENT_TRIPS } from '../../data/mockData';
import { RouteMaster, LocatorPoint, ShipmentTrip } from '../../types';

interface RouteIntelligenceProps {
  onInspectRoute: (route: RouteMaster) => void;
  onInspectLocator: (locator: LocatorPoint) => void;
  shipmentTrips?: ShipmentTrip[];
}

export const RouteIntelligence: React.FC<RouteIntelligenceProps> = ({
  onInspectRoute,
  onInspectLocator,
  shipmentTrips = [],
}) => {
  const [activeTab, setActiveTab] = useState<'ROUTES' | 'LOCATORS'>('ROUTES');
  const [filterMismatchOnly, setFilterMismatchOnly] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<RouteMaster>(ROUTE_MASTERS[0]);
  const [selectedLocator, setSelectedLocator] = useState<LocatorPoint>(LOCATOR_POINTS[0]);

  const displayedRoutes = filterMismatchOnly
    ? ROUTE_MASTERS.filter((r) => r.kmVariancePct > 10)
    : ROUTE_MASTERS;

  const displayedLocators = filterMismatchOnly
    ? LOCATOR_POINTS.filter((l) => l.hasMismatch)
    : LOCATOR_POINTS;

  const actualKm = selectedRoute.moboDriveActualKm;
  const actualVariancePct = actualKm
    ? Number((((actualKm - selectedRoute.pdcaCalculatedKm) / selectedRoute.pdcaCalculatedKm) * 100).toFixed(1))
    : undefined;

  const realTripsForRoute = shipmentTrips.length > 0 
    ? shipmentTrips.filter((trip) => trip.routeId === selectedRoute.id)
    : REAL_SHIPMENT_TRIPS.filter((trip) => trip.routeId === selectedRoute.id);

  const selectedTrip: ShipmentTrip =
    realTripsForRoute[0] ?? (REAL_SHIPMENT_TRIPS[0] || REAL_SHIPMENT_TRIPS[0]);

  const mapQuery =
    selectedLocator.moboDriveActualLat !== undefined && selectedLocator.moboDriveActualLng !== undefined
      ? `${selectedLocator.moboDriveActualLat},${selectedLocator.moboDriveActualLng}`
      : `${selectedLocator.latitude},${selectedLocator.longitude}`;
  const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=12&output=embed`;

  const tripMapQuery =
    selectedTrip.routePoints.length > 0
      ? `${selectedTrip.routePoints[selectedTrip.routePoints.length - 1].lat},${selectedTrip.routePoints[selectedTrip.routePoints.length - 1].lng}`
      : `${selectedLocator.latitude},${selectedLocator.longitude}`;
  const tripMapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(tripMapQuery)}&z=11&output=embed`;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
              GEOSPATIAL INTELLIGENCE
            </span>
            <span className="text-xs text-slate-400">
              PDCA KM Engine & Tollway Matrix
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Route Master & KM Validation Engine
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare ERP recorded distance vs PDCA calculated KM. Detect fuel overpayments, toll gate discrepancies, and inaccurate GPS locators.
          </p>
        </div>

        {/* Tab Switcher & Filter Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('ROUTES')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'ROUTES' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Corridor Routes ({ROUTE_MASTERS.length})
            </button>
            <button
              onClick={() => setActiveTab('LOCATORS')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'LOCATORS' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Locator Points ({LOCATOR_POINTS.length})
            </button>
          </div>

          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <input
              type="checkbox"
              checked={filterMismatchOnly}
              onChange={(e) => setFilterMismatchOnly(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span>Show Discrepancies Only</span>
          </label>
        </div>
      </div>

      {/* Overview Stat Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 text-xs">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Corridors Monitored
          </span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">
            {ROUTE_MASTERS.length}
          </span>
          <span className="text-[11px] text-slate-500">Trans-Jawa & Sumatra Corridors</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-rose-200 bg-rose-50/20 shadow-2xs">
          <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider block">
            KM Discrepancies Flagged
          </span>
          <span className="text-2xl font-bold text-rose-700 mt-1 block font-mono">
            {ROUTE_MASTERS.filter((r) => r.kmVariancePct > 10).length} Routes
          </span>
          <span className="text-[11px] text-rose-700 font-semibold">
            &gt;10% variance vs PDCA standard
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Toll Gates Mapped
          </span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block font-mono">
            {ROUTE_MASTERS.reduce((acc, r) => acc + r.tollPointsCount, 0)} Gates
          </span>
          <span className="text-[11px] text-slate-500">Electronic toll tariffs updated</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Locator GPS Quality
          </span>
          <span className="text-2xl font-bold text-emerald-700 mt-1 block">91.2%</span>
          <span className="text-[11px] text-slate-500">
            {LOCATOR_POINTS.filter((l) => l.hasMismatch).length} Mismatches require GIS audit
          </span>
        </div>
      </div>

      {/* MAIN CONTENT: CORRIDOR ROUTES */}
      {activeTab === 'ROUTES' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Interactive Route List */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                Active Operational Routes ({displayedRoutes.length})
              </h3>
              <span className="text-[11px] text-slate-400">
                Click a corridor to view detailed KM analysis
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-2.5 px-3">Route Corridor</th>
                    <th className="py-2.5 px-3 text-center">ERP KM</th>
                    <th className="py-2.5 px-3 text-center">PDCA KM</th>
                    <th className="py-2.5 px-3 text-center">Actual KM (MoboDrive)</th>
                    <th className="py-2.5 px-3 text-center">Variance</th>
                    <th className="py-2.5 px-3 text-right">Toll Cost</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayedRoutes.map((rt) => {
                    const isSelected = selectedRoute.id === rt.id;
                    const hasHighVariance = rt.kmVariancePct > 10;

                    return (
                      <tr
                        key={rt.id}
                        onClick={() => setSelectedRoute(rt)}
                        className={`transition-colors cursor-pointer ${
                          isSelected ? 'bg-blue-50/80 font-medium' : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="py-3 px-3">
                          <span className="font-bold text-slate-800 block">{rt.name}</span>
                          <span className="text-[10px] font-mono text-slate-400">{rt.code}</span>
                        </td>
                        <td className="py-3 px-3 text-center font-mono text-slate-500">
                          {rt.erpKm} KM
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-blue-900">
                          {rt.pdcaCalculatedKm} KM
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-emerald-800">
                          {rt.moboDriveActualKm ? `${rt.moboDriveActualKm} KM` : 'TO BE CONFIRMED'}
                        </td>
                        <td className="py-3 px-3 text-center font-mono">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10.5px] font-bold ${
                              hasHighVariance
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {rt.kmVariancePct}%
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-slate-800 font-medium">
                          Rp {rt.standardTollCost.toLocaleString()}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              rt.kmStatus === 'VALID'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {rt.kmStatus}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right: Selected Route Intelligence Deep Dive */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
                  Corridor Inspector
                </span>
                <h4 className="font-bold text-slate-900 text-sm">{selectedRoute.name}</h4>
              </div>
              <button
                onClick={() => onInspectRoute(selectedRoute)}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-[11px]"
              >
                Inspect Entity
              </button>
            </div>

            {/* KM Comparison Card */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <span className="font-bold text-slate-700 text-[11px] block">
                Distance Benchmark
              </span>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-white rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">ERP Legacy</span>
                  <span className="font-bold text-slate-700">{selectedRoute.erpKm} KM</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">Standard</span>
                  <span className="font-bold text-slate-700">{selectedRoute.standardKm} KM</span>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="text-[10px] text-blue-600 block">PDCA Valid</span>
                  <span className="font-bold text-blue-900">{selectedRoute.pdcaCalculatedKm} KM</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center mt-2">
                <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-200">
                  <span className="text-[10px] text-emerald-700 block">Actual MoboDrive</span>
                  <span className="font-bold text-emerald-900">{actualKm ? `${actualKm} KM` : 'TO BE CONFIRMED'}</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">Actual vs PDCA</span>
                  <span className="font-bold text-slate-700">{actualVariancePct !== undefined ? `${actualVariancePct}%` : 'TO BE CONFIRMED'}</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-500">Actual source: {selectedRoute.actualKmSource || 'TO_BE_CONFIRMED'}{selectedRoute.actualKmCapturedAt ? ` | ${selectedRoute.actualKmCapturedAt}` : ''}</p>

              {selectedRoute.kmVariancePct > 10 && (
                <div className="p-2 bg-rose-50 border border-rose-200 rounded-lg text-rose-900 text-[11px] mt-2">
                  <strong>Cost Leakage Impact:</strong> An inflated ERP KM causes an estimated
                  over-allocation of{' '}
                  <span className="font-bold">
                    Rp {Math.round((selectedRoute.erpKm - selectedRoute.pdcaCalculatedKm) * 2400).toLocaleString()}{' '}
                    in fuel allowance per trip!
                  </span>
                </div>
              )}
            </div>

            {/* Toll Gate Matrix */}
            <div className="p-3.5 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-2 text-xs">
              <div className="flex items-center justify-between text-indigo-900 font-bold">
                <span className="flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-indigo-600" /> Highway Toll & Gates
                </span>
                <span>{selectedRoute.tollPointsCount} Electronic Gates</span>
              </div>
              <div className="flex justify-between text-slate-700 pt-1">
                <span>Standard Corridor Toll:</span>
                <span className="font-bold font-mono text-indigo-950">
                  Rp {selectedRoute.standardTollCost.toLocaleString()}
                </span>
              </div>
              {selectedRoute.ferryRequired && (
                <div className="flex justify-between text-slate-700">
                  <span>ASDP Ferry Crossing:</span>
                  <span className="font-bold font-mono">
                    Rp {selectedRoute.ferryCost.toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200 space-y-2 text-xs">
              <div className="flex items-center justify-between text-amber-900 font-bold">
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Actual Locator & Google Maps</span>
                <span className="text-[10px]">MoboDrive GPS</span>
              </div>
              <p className="text-slate-600">Click a locator point to inspect actual coordinates, then open its verified position in Google Maps.</p>
              <div className="flex flex-wrap gap-2">
                {LOCATOR_POINTS.map((loc) => (
                  <button key={loc.id} onClick={() => { setSelectedLocator(loc); onInspectLocator(loc); }} className={`px-2 py-1 bg-white border rounded-lg text-[10px] font-semibold text-amber-900 hover:bg-amber-100 ${selectedLocator.id === loc.id ? 'border-amber-500 ring-1 ring-amber-300' : 'border-amber-200'}`}>
                    {loc.name}
                  </button>
                ))}
              </div>
              <div className="p-3 bg-white border border-amber-200 rounded-lg space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="font-bold text-slate-800 block">{selectedLocator.name}</span>
                    <span className="text-[10px] text-slate-500">{selectedLocator.locatorRole || 'DESTINATION'} • {selectedLocator.code}</span>
                  </div>
                  <a href={`https://www.google.com/maps/search/?api=1&query=${selectedLocator.moboDriveActualLat ?? selectedLocator.latitude},${selectedLocator.moboDriveActualLng ?? selectedLocator.longitude}`} target="_blank" rel="noreferrer" className="px-2 py-1 bg-blue-600 text-white rounded-md text-[10px] font-bold hover:bg-blue-700">Open Google Maps</a>
                </div>
                <div className="grid grid-cols-2 gap-2 font-mono text-[10px]">
                  <div className="p-2 bg-slate-50 rounded border border-slate-200"><span className="text-slate-400 block">Master</span>{selectedLocator.latitude.toFixed(6)}, {selectedLocator.longitude.toFixed(6)}</div>
                  <div className="p-2 bg-emerald-50 rounded border border-emerald-200 text-emerald-800"><span className="text-emerald-600 block">Actual MoboDrive</span>{selectedLocator.moboDriveActualLat !== undefined ? `${selectedLocator.moboDriveActualLat.toFixed(6)}, ${selectedLocator.moboDriveActualLng?.toFixed(6)}` : 'Belum tersedia'}</div>
                </div>
                <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                  <iframe
                    title={`Map for ${selectedLocator.name}`}
                    src={`https://www.google.com/maps?q=${encodeURIComponent(`${selectedLocator.moboDriveActualLat ?? selectedLocator.latitude},${selectedLocator.moboDriveActualLng ?? selectedLocator.longitude}`)}&z=12&output=embed`}
                    className="w-full h-52 border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
              <div className="flex items-center justify-between text-slate-900 font-bold">
                <span className="flex items-center gap-1.5"><Compass className="w-3.5 h-3.5" /> Real Shipment Trip Breakdown</span>
                <span className="text-[10px] text-slate-500">{selectedTrip.tripCode}</span>
              </div>
              <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                <iframe
                  title={`Trip map for ${selectedTrip.tripCode}`}
                  src={tripMapEmbedUrl}
                  className="w-full h-40 border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="space-y-2">
                {selectedTrip.segments.map((segment) => (
                  <div key={segment.id} className="p-2 rounded-lg border border-slate-200 bg-white">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-slate-800">{segment.activityName}</span>
                      <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold">{segment.segmentType}</span>
                    </div>
                    <div className="mt-1 text-[10px] text-slate-500">{segment.fromLocatorName} → {segment.toLocatorName}</div>
                    <div className="mt-1 flex justify-between text-[10px] text-slate-600">
                      <span>{segment.actualKm} KM</span>
                      <span>{segment.actualMinutes} min</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Depot & Staging Assignment */}
            <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-2 text-xs">
              <div className="flex items-center justify-between text-emerald-900 font-bold">
                <span>Auto-Mapped Depot</span>
                <span className="text-[10px] bg-emerald-100 px-1.5 py-0.2 rounded">
                  Solving Note 4 & 14
                </span>
              </div>
              <p className="font-semibold text-slate-800">{selectedRoute.depotName}</p>
              <div className="flex justify-between text-slate-600 text-[11px]">
                <span>Depot Lift-Off Fee:</span>
                <span className="font-bold font-mono text-emerald-900">
                  Rp {selectedRoute.depotLiftOffCost.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Lead Time */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-600">MoboDrive Estimated Lead Time:</span>
              <span className="font-bold font-mono text-slate-900">
                {selectedRoute.estimatedLeadTimeHours} Hours
              </span>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT: LOCATOR POINTS AUDITOR */}
      {activeTab === 'LOCATORS' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
              Master Shipment Locator Audit ({displayedLocators.length})
            </h3>
            <span className="text-[11px] text-slate-400">
              Validates GPS coordinate integrity vs billing addresses
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-2.5 px-3.5">Locator Code & Name</th>
                  <th className="py-2.5 px-3">City / Province</th>
                  <th className="py-2.5 px-3">Physical Address</th>
                  <th className="py-2.5 px-3">Function</th>
                  <th className="py-2.5 px-3 font-mono">GPS Coordinates</th>
                  <th className="py-2.5 px-3 font-mono">MoboDrive Actual</th>
                  <th className="py-2.5 px-3">Google Maps</th>
                  <th className="py-2.5 px-3 text-center">Quality Score</th>
                  <th className="py-2.5 px-3 text-center">Audit Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayedLocators.map((loc) => (
                  <tr
                    key={loc.id}
                    onClick={() => onInspectLocator(loc)}
                    className="hover:bg-blue-50/30 transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-3.5">
                      <span className="font-bold text-slate-800 block">{loc.name}</span>
                      <span className="font-mono text-[10px] text-slate-400">{loc.code}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-700 font-medium">
                      {loc.city}, {loc.province}
                    </td>
                    <td className="py-3 px-3 text-slate-500 text-[11px] max-w-xs truncate">
                      {loc.address}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                        {loc.locatorRole || 'DESTINATION'}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-600">
                      {loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-emerald-700">
                      {loc.moboDriveActualLat && loc.moboDriveActualLng ? `${loc.moboDriveActualLat.toFixed(4)}, ${loc.moboDriveActualLng.toFixed(4)}` : 'TO BE CONFIRMED'}
                    </td>
                    <td className="py-3 px-3">
                      <a href={`https://www.google.com/maps/search/?api=1&query=${loc.moboDriveActualLat || loc.latitude},${loc.moboDriveActualLng || loc.longitude}`} target="_blank" rel="noreferrer" className="text-blue-700 font-semibold hover:underline">Open map</a>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`font-bold font-mono ${
                          loc.accuracyScore >= 95 ? 'text-emerald-700' : 'text-amber-700'
                        }`}
                      >
                        {loc.accuracyScore}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      {loc.hasMismatch ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                          GPS Mismatch
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Verified
                        </span>
                      )}
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
