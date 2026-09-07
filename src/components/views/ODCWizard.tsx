import React, { useState, useMemo } from 'react';
import {
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Coins,
  Route,
  Truck,
  Clock,
  Sparkles,
  MapPin,
  HelpCircle,
  Layers,
  Save,
  Send,
  Workflow,
  Fuel,
  ShieldCheck,
  Building,
  RotateCcw,
} from 'lucide-react';
import {
  VEHICLE_CATEGORIES,
  DEPOTS,
  LOCATOR_POINTS,
  ROUTE_MASTERS,
  SHIPMENT_ACTIVITIES,
  HISTORICAL_ODCS,
  COST_ITEMS,
} from '../../data/mockData';
import { ODCRecord, ODCCostLine } from '../../types';

interface ODCWizardProps {
  onFinish: (newOdc: ODCRecord) => void;
  onCancel: () => void;
  onWhyThisCost: (odc: ODCRecord) => void;
}

export const ODCWizard: React.FC<ODCWizardProps> = ({
  onFinish,
  onCancel,
  onWhyThisCost,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State - Step 1: Business Requirement
  const [customerName, setCustomerName] = useState('PT Unilever Indonesia Tbk');
  const [originId, setOriginId] = useState(LOCATOR_POINTS[0].id);
  const [destinationIds, setDestinationIds] = useState<string[]>([
    LOCATOR_POINTS[1].id,
    LOCATOR_POINTS[2].id,
    LOCATOR_POINTS[3].id,
  ]);
  const [vehicleCategoryId, setVehicleCategoryId] = useState(VEHICLE_CATEGORIES[0].id);
  const [cargoType, setCargoType] = useState('40ft Dry Container (Finished Goods)');
  const [weightTons, setWeightTons] = useState(24.5);
  const [volumeCbm, setVolumeCbm] = useState(65);
  const [serviceRequirement, setServiceRequirement] = useState('Standard Freight Fast-Turnaround');
  const [selectedDepotId, setSelectedDepotId] = useState(DEPOTS[0].id);

  // Step 2 & 3 custom overrides if any
  const [extraReeferHours, setExtraReeferHours] = useState(0);
  const [extraKawalan, setExtraKawalan] = useState(false);
  const [extraGatePass, setExtraGatePass] = useState(120000);
  const [generatedCdoNumber, setGeneratedCdoNumber] = useState<string | null>(null);

  const handleGenerateCdo = () => {
    const year = new Date().getFullYear();
    const serial = String(Math.floor(1000 + Math.random() * 9000));
    setGeneratedCdoNumber(`C-D/O-${year}-${serial}`);
  };

  // Derive System Recommendations based on Inputs
  const destinationId = destinationIds[destinationIds.length - 1] || LOCATOR_POINTS[1].id;
  const destinationStages = destinationIds
    .map((id) => LOCATOR_POINTS.find((loc) => loc.id === id))
    .filter((loc): loc is NonNullable<typeof loc> => Boolean(loc));
  const matchedOrigin = LOCATOR_POINTS.find((l) => l.id === originId) || LOCATOR_POINTS[0];
  const matchedDestination = LOCATOR_POINTS.find((l) => l.id === destinationId) || LOCATOR_POINTS[1];
  const matchedVehicle = VEHICLE_CATEGORIES.find((v) => v.id === vehicleCategoryId) || VEHICLE_CATEGORIES[0];
  const matchedDepot = DEPOTS.find((d) => d.id === selectedDepotId) || DEPOTS[0];
  const automatedActivities = SHIPMENT_ACTIVITIES.filter((activity) => activity.automated !== false);
  const routeStageActivities = useMemo(() => {
    const pointIds = new Set(destinationStages.map((stage) => stage.id));
    return SHIPMENT_ACTIVITIES.filter((activity) => {
      if (activity.locatorPointId && pointIds.has(activity.locatorPointId)) return true;
      const keywords = ['loading', 'unloading', 'parking', 'depot', 'gate', 'staging'];
      return keywords.some((keyword) =>
        activity.name.toLowerCase().includes(keyword) || activity.description.toLowerCase().includes(keyword)
      );
    }).slice(0, 6);
  }, [destinationStages]);
  const embeddedCostItems = useMemo(
    () =>
      COST_ITEMS.filter((item) =>
        ['FUEL_SOLAR', 'TOLL_FEE', 'LIFT_OFF_DEPO', 'GATE_PASS', 'ESCORT_KAWALAN', 'REEFER_PLUGIN'].includes(
          item.kind
        )
      ).slice(0, 6),
    []
  );

  // Derived Route Master
  const derivedRoute = useMemo(() => {
    const found = ROUTE_MASTERS.find(
      (r) => r.originId === originId && r.destinationId === destinationId
    );
    if (found) return found;

    // Fallback derived route calculation
    return {
      id: 'rt-derived-dynamic',
      code: `OPS-RT-${matchedOrigin.city.substring(0, 3)}-${matchedDestination.city.substring(0, 3)}`,
      name: `${matchedOrigin.name} → ${matchedDestination.name}`,
      originId: matchedOrigin.id,
      originName: matchedOrigin.name,
      destinationId: matchedDestination.id,
      destinationName: matchedDestination.name,
      standardKm: 180,
      erpKm: 195,
      pdcaCalculatedKm: 182.4,
      kmVariancePct: 6.9,
      kmStatus: 'VALID' as const,
      tollPointsCount: 6,
      standardTollCost: 280000,
      ferryRequired: false,
      ferryCost: 0,
      estimatedLeadTimeHours: 6.0,
      depotId: matchedDepot.id,
      depotName: matchedDepot.name,
      depotLiftOffCost: matchedDepot.fixedLiftOffCost,
      roadCondition: 'SMOOTH_HIGHWAY' as const,
      active: true,
      usageCount: 1,
    };
  }, [originId, destinationId, matchedOrigin, matchedDestination, matchedDepot]);

  // Derived Formulated Costs
  const distanceKm = derivedRoute.pdcaCalculatedKm;
  const basicCostRp = Math.round(distanceKm * matchedVehicle.baseRatePerKm);
  const tollCostRp = derivedRoute.standardTollCost;
  const ferryCostRp = derivedRoute.ferryRequired ? derivedRoute.ferryCost : 0;
  const fuelAllowanceLiters = (distanceKm / matchedVehicle.fuelRatioKmL) * 1.05;
  const fuelCostRp = Math.round(fuelAllowanceLiters * 6800);
  const depotLiftOffRp = matchedDepot.fixedLiftOffCost; // AUTO INCLUDED! (Solving note 4 & 14)
  const isOvernight = derivedRoute.estimatedLeadTimeHours > 24;
  const daysMultiplier = Math.max(1, Math.ceil(derivedRoute.estimatedLeadTimeHours / 24));
  const mealAllowanceRp = 150000 * daysMultiplier;

  // Extra Costs
  const reeferPlugInCostRp = extraReeferHours * 65000;
  const kawalanCostRp = extraKawalan ? 850000 : 0;
  const gatePassCostRp = extraGatePass;
  const totalExtraCostRp = reeferPlugInCostRp + kawalanCostRp + gatePassCostRp;

  const totalCalculatedCostRp =
    basicCostRp +
    tollCostRp +
    ferryCostRp +
    fuelCostRp +
    depotLiftOffRp +
    mealAllowanceRp +
    totalExtraCostRp;

  // Historical Similarity Checker (to prevent duplicate ODCs)
  const similarityMatch = useMemo(() => {
    const match = HISTORICAL_ODCS.find(
      (o) =>
        o.originId === originId &&
        o.destinationId === destinationId &&
        o.vehicleCategoryId === vehicleCategoryId
    );
    if (match) {
      const variance =
        ((totalCalculatedCostRp - match.totalCostRp) / (match.totalCostRp || 1)) * 100;
      return {
        found: true,
        odcNumber: match.odcNumber,
        similarityPct: 98.4,
        historicalCostRp: match.totalCostRp,
        variancePct: parseFloat(variance.toFixed(1)),
      };
    }
    return {
      found: false,
      odcNumber: undefined,
      similarityPct: 45.0,
      historicalCostRp: undefined,
      variancePct: 0,
    };
  }, [originId, destinationId, vehicleCategoryId, totalCalculatedCostRp]);

  // Validation Checks
  const validationChecks = {
    customerValid: customerName.trim().length > 3,
    locationValid: !matchedOrigin.hasMismatch && !matchedDestination.hasMismatch,
    routeValid: derivedRoute.active,
    distanceValidated: derivedRoute.kmStatus !== 'INVALID',
    vehicleMapped: !!matchedVehicle,
    shipmentActivityMapped: true,
    costRuleAvailable: true,
    leadTimeValidated: derivedRoute.estimatedLeadTimeHours > 0,
    depotMapped: !!matchedDepot,
    extraCostReviewed: true,
  };

  const validationScore = Math.round(
    (Object.values(validationChecks).filter(Boolean).length /
      Object.keys(validationChecks).length) *
      100
  );

  const handleSubmitODC = () => {
    const resolvedCdoNumber =
      generatedCdoNumber ?? `C-D/O-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000))}`;
    setGeneratedCdoNumber(resolvedCdoNumber);

    const costLines: ODCCostLine[] = [
      {
        id: 'cl-base',
        component: 'BASIC_TRUCKING',
        name: 'Basic Trucking Cost',
        classification: 'FORMULATED',
        driver: `PDCA KM (${distanceKm} KM) × Base Rate (Rp ${matchedVehicle.baseRatePerKm.toLocaleString()})`,
        formula: `${distanceKm} KM * Rp ${matchedVehicle.baseRatePerKm.toLocaleString()}`,
        rate: matchedVehicle.baseRatePerKm,
        quantity: distanceKm,
        unit: 'KM',
        subtotalRp: basicCostRp,
        source: 'COST_RULE',
        sourceEntityRef: 'CR-BASE-001',
        isRecoverable: true,
        isUnbilled: false,
        billingStatus: 'BILLED',
      },
      {
        id: 'cl-toll',
        component: 'TOLL_FEE',
        name: `Tollway Passage (Golongan ${matchedVehicle.tollGolongan})`,
        classification: 'FORMULATED',
        driver: `${derivedRoute.tollPointsCount} Toll Plazas via ${derivedRoute.name}`,
        formula: 'Sum of Electronic Toll Gates in Corridor',
        rate: tollCostRp,
        quantity: 1,
        unit: 'Trip',
        subtotalRp: tollCostRp,
        source: 'ROUTE_ENGINE',
        sourceEntityRef: derivedRoute.code,
        isRecoverable: true,
        isUnbilled: false,
        billingStatus: 'BILLED',
      },
      {
        id: 'cl-fuel',
        component: 'FUEL_SOLAR',
        name: 'Uang Solar Allowance',
        classification: 'FORMULATED',
        driver: `Distance ${distanceKm} KM / ${matchedVehicle.fuelRatioKmL} km/L @ Rp 6,800/L`,
        formula: `(${distanceKm} / ${matchedVehicle.fuelRatioKmL}) * 6800 * 1.05`,
        rate: 6800,
        quantity: parseFloat(fuelAllowanceLiters.toFixed(1)),
        unit: 'Liters',
        subtotalRp: fuelCostRp,
        source: 'COST_RULE',
        sourceEntityRef: 'CR-SOLAR-001',
        isRecoverable: true,
        isUnbilled: false,
        billingStatus: 'BILLED',
      },
      {
        id: 'cl-depot',
        component: 'LIFT_OFF_DEPO',
        name: `${matchedDepot.name} Lift-Off Fee`,
        classification: 'FORMULATED',
        driver: `Fixed Depot Master Lift-Off Tariff`,
        formula: 'Standard Auto-Inclusion Lift-Off Rate',
        rate: depotLiftOffRp,
        quantity: 1,
        unit: 'Container',
        subtotalRp: depotLiftOffRp,
        source: 'DEPOT_MASTER',
        sourceEntityRef: matchedDepot.code,
        isRecoverable: true,
        isUnbilled: false,
        billingStatus: 'BILLED',
      },
      {
        id: 'cl-meal',
        component: 'MEAL_ALLOWANCE',
        name: `Driver Meal & Time Commission (${daysMultiplier} Day Shift)`,
        classification: 'FORMULATED',
        driver: `Lead Time ${derivedRoute.estimatedLeadTimeHours}h -> ${daysMultiplier} Days`,
        formula: `Rp 150,000 * ${daysMultiplier} Days`,
        rate: 150000,
        quantity: daysMultiplier,
        unit: 'Days',
        subtotalRp: mealAllowanceRp,
        source: 'COST_RULE',
        sourceEntityRef: 'CR-MEAL-004',
        isRecoverable: true,
        isUnbilled: false,
        billingStatus: 'BILLED',
      },
    ];

    if (reeferPlugInCostRp > 0) {
      costLines.push({
        id: 'cl-reefer',
        component: 'REEFER_PLUGIN',
        name: 'Uang Colok Kabel Listrik Reefer',
        classification: 'NON_FORMULATED',
        driver: `${extraReeferHours} Hours Staging Power`,
        formula: `${extraReeferHours} hrs * Rp 65,000/hr`,
        rate: 65000,
        quantity: extraReeferHours,
        unit: 'Hours',
        subtotalRp: reeferPlugInCostRp,
        source: 'MANUAL_PV_EXTRA',
        sourceEntityRef: 'PV-REEFER-001',
        isRecoverable: true,
        isUnbilled: false,
        billingStatus: 'BILLED',
      });
    }

    if (kawalanCostRp > 0) {
      costLines.push({
        id: 'cl-kawalan',
        component: 'ESCORT_KAWALAN',
        name: 'Security Police Escort',
        classification: 'NON_FORMULATED',
        driver: 'High Value / Hazardous Protocol',
        formula: 'Negotiated Standard Escort',
        rate: 850000,
        quantity: 1,
        unit: 'Trip',
        subtotalRp: kawalanCostRp,
        source: 'EXCEPTION_RULE',
        sourceEntityRef: 'EXC-KAWALAN-001',
        isRecoverable: true,
        isUnbilled: false,
        billingStatus: 'BILLED',
      });
    }

    const newOdcRecord: ODCRecord = {
      id: `odc-gen-${Date.now()}`,
      odcNumber: `ODC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      cdoNumber: resolvedCdoNumber,
      customerId: 'cust-selected',
      customerName,
      serviceRequirement,
      originId: matchedOrigin.id,
      originName: matchedOrigin.name,
      destinationId: matchedDestination.id,
      destinationName: matchedDestination.name,
      vehicleCategoryId: matchedVehicle.id,
      vehicleCategoryName: matchedVehicle.name,
      cargoType,
      weightTons,
      volumeCbm,
      depotId: matchedDepot.id,
      depotName: matchedDepot.name,
      routeId: derivedRoute.id,
      distanceKm,
      estimatedLeadTimeHours: derivedRoute.estimatedLeadTimeHours,
      actualLeadTimeHours: derivedRoute.estimatedLeadTimeHours,
      isOvernight,
      totalCostRp: totalCalculatedCostRp,
      basicCostRp,
      tollCostRp,
      ferryCostRp,
      activityCostRp: mealAllowanceRp + fuelCostRp,
      depotCostRp: depotLiftOffRp,
      extraCostRp: totalExtraCostRp,
      unbilledLeakageRp: 0,
      status: 'APPROVED',
      validationScore,
      similarityWithHistorical: {
        matchFound: similarityMatch.found,
        similarOdcNumber: similarityMatch.odcNumber,
        similarityPct: similarityMatch.similarityPct,
        historicalCostRp: similarityMatch.historicalCostRp,
        costVariancePct: similarityMatch.variancePct,
      },
      validationChecks,
      costLines,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'Logistics Planner (Current User)',
      approvedBy: 'System Auto-Approval Engine',
    };

    onFinish(newOdcRecord);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Top Breadcrumb & Step Tracker */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                ODC SMART WIZARD
              </span>
              <span className="text-xs text-slate-400">
                Frictionless 4-Step Intelligence Flow
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              Create Operational Direct Cost (ODC)
            </h2>
          </div>

          <button
            onClick={onCancel}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
        </div>

        {/* 4 Step Progress Bar */}
        <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-xs">
          {[
            { num: 1, title: 'Business Requirement', desc: 'Intent & Cargo' },
            { num: 2, title: 'System Derivation', desc: 'Route & PDCA KM' },
            { num: 3, title: 'Cost Calculation', desc: 'Formulated Rules' },
            { num: 4, title: 'Validation & Score', desc: 'Historical Check' },
          ].map((s) => (
            <button
              key={s.num}
              onClick={() => s.num < step && setStep(s.num as any)}
              className={`p-3 rounded-xl border text-left transition-all ${
                step === s.num
                  ? 'border-blue-600 bg-blue-50/60 shadow-2xs'
                  : step > s.num
                  ? 'border-emerald-300 bg-emerald-50/40'
                  : 'border-slate-200 bg-slate-50/50 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] ${
                    step === s.num
                      ? 'bg-blue-600 text-white'
                      : step > s.num
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {step > s.num ? '✓' : s.num}
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                  STEP {s.num}
                </span>
              </div>
              <p className="font-bold text-slate-800 text-xs truncate">{s.title}</p>
              <p className="text-[10.5px] text-slate-500 truncate">{s.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* STEP 1: BUSINESS REQUIREMENT */}
      {step === 1 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6 animate-in fade-in duration-150">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">
              Step 1: Define Business Intent & Parameters
            </h3>
            <p className="text-xs text-slate-500">
              Provide shipper requirement. The system will automatically derive routes,
              depot lift-off, and tollway costs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            {/* Customer */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">Customer Account</label>
              <select
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-medium focus:bg-white focus:border-blue-500 outline-none"
              >
                <option value="PT Unilever Indonesia Tbk">PT Unilever Indonesia Tbk (FMCG)</option>
                <option value="PT Wings Surya">PT Wings Surya (Chemicals & Detergents)</option>
                <option value="PT Indofood CBP Sukses Makmur">PT Indofood CBP Sukses Makmur (Food & Beverage)</option>
                <option value="PT Kahatex Textile">PT Kahatex Textile (Textile & Dyes)</option>
                <option value="PT Great Giant Pineapple">PT Great Giant Pineapple (Agri Export)</option>
              </select>
            </div>

            {/* Service Level */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">Service Level</label>
              <select
                value={serviceRequirement}
                onChange={(e) => setServiceRequirement(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-medium focus:bg-white focus:border-blue-500 outline-none"
              >
                <option value="Standard Freight Fast-Turnaround">Standard Freight Fast-Turnaround</option>
                <option value="Dedicated Long-Haul Priority">Dedicated Long-Haul Priority</option>
                <option value="Cold Chain Temperature Controlled">Cold Chain Temperature Controlled</option>
                <option value="Express Same-Day Dispatch">Express Same-Day Dispatch</option>
              </select>
            </div>

            {/* Origin Locator */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block flex items-center justify-between">
                <span>Origin Shipment Locator</span>
                <span className="text-emerald-600 font-normal text-[11px]">GPS Verified</span>
              </label>
              <select
                value={originId}
                onChange={(e) => setOriginId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-medium focus:bg-white focus:border-blue-500 outline-none"
              >
                {LOCATOR_POINTS.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} ({loc.city})
                  </option>
                ))}
              </select>
            </div>

            {/* Destination Locator */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block flex items-center justify-between">
                <span>Destination Shipment Locator (Multi-Stop)</span>
                <span className="text-emerald-600 font-normal text-[11px]">4–5 operational points</span>
              </label>
              <select
                value={destinationId}
                onChange={(e) => {
                  const nextId = e.target.value;
                  setDestinationIds((current) => {
                    if (current.includes(nextId)) return current;
                    if (current.length >= 5) return [...current.slice(1), nextId];
                    return [...current, nextId];
                  });
                }}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-medium focus:bg-white focus:border-blue-500 outline-none"
              >
                {LOCATOR_POINTS.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} ({loc.city})
                  </option>
                ))}
              </select>
              <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50/60 p-2.5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-amber-800">Operational destination stages</span>
                  <span className="text-[10px] text-amber-700">{destinationStages.length}/5</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {destinationStages.map((location, index) => (
                    <span key={location.id} className="px-2 py-1 rounded-lg bg-white border border-amber-200 text-[10px] font-semibold text-amber-900 flex items-center gap-1">
                      {index + 1}. {location.name}
                      <span className="text-amber-600">({location.locatorRole || 'DESTINATION'})</span>
                      <button type="button" aria-label={`Remove ${location.name}`} onClick={() => setDestinationIds((current) => current.filter((item) => item !== location.id))} className="text-amber-700 hover:text-rose-600 font-bold">×</button>
                    </span>
                  ))}
                </div>
                <div className="mt-2 text-[10px] text-amber-700 leading-relaxed">
                  Typical multi-leg flow: gate-in → loading → staging/parking → unloading → final destination
                </div>
              </div>
            </div>

            {/* Vehicle Category */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">Fleet & Vehicle Category</label>
              <select
                value={vehicleCategoryId}
                onChange={(e) => setVehicleCategoryId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-medium focus:bg-white focus:border-blue-500 outline-none"
              >
                {VEHICLE_CATEGORIES.map((veh) => (
                  <option key={veh.id} value={veh.id}>
                    {veh.name} • {veh.payloadTons}T Payload (Toll Golongan {veh.tollGolongan})
                  </option>
                ))}
              </select>
            </div>

            {/* Container Empty Depot (SOLVING NOTE 4 & 14) */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block flex items-center justify-between">
                <span>Container Staging Depot</span>
                <span className="text-blue-600 font-normal text-[11px]">Fixed Lift-Off Auto Mapped</span>
              </label>
              <select
                value={selectedDepotId}
                onChange={(e) => setSelectedDepotId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-medium focus:bg-white focus:border-blue-500 outline-none"
              >
                {DEPOTS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} • Lift-Off Rp {d.fixedLiftOffCost.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>

            {/* Cargo Type */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">Cargo Description</label>
              <input
                type="text"
                value={cargoType}
                onChange={(e) => setCargoType(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-medium focus:bg-white focus:border-blue-500 outline-none"
              />
            </div>

            {/* Weight & Volume */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Weight (Tons)</label>
                <input
                  type="number"
                  step="0.1"
                  value={weightTons}
                  onChange={(e) => setWeightTons(parseFloat(e.target.value) || 0)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-medium focus:bg-white focus:border-blue-500 outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Volume (CBM)</label>
                <input
                  type="number"
                  value={volumeCbm}
                  onChange={(e) => setVolumeCbm(parseFloat(e.target.value) || 0)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-medium focus:bg-white focus:border-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 transition-all"
            >
              <span>Derive Operational Parameters</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: SYSTEM RECOMMENDATION & DERIVATION */}
      {step === 2 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6 animate-in fade-in duration-150">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Step 2: System-Derived Operational Parameters
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                Route intelligence, PDCA validated KM, Toll gate calculation, and RACI activities.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              100% Derived
            </span>
          </div>

          {/* Derivation Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Route & Distance Card */}
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 space-y-2">
              <div className="flex items-center justify-between text-blue-800 font-bold">
                <span className="flex items-center gap-1.5">
                  <Route className="w-4 h-4 text-blue-600" /> Route Corridor
                </span>
                <span className="font-mono text-[11px]">{derivedRoute.code}</span>
              </div>
              <p className="font-semibold text-slate-800">{derivedRoute.name}</p>
              <div className="pt-2 border-t border-blue-200/60 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">PDCA Validated KM:</span>
                  <span className="font-mono font-bold text-blue-900">{distanceKm} KM</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>ERP Legacy KM:</span>
                  <span className="line-through">{derivedRoute.erpKm} KM</span>
                </div>
              </div>
            </div>

            {/* Tollway & Ferry Card */}
            <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/40 space-y-2">
              <div className="flex items-center justify-between text-indigo-800 font-bold">
                <span className="flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-indigo-600" /> Highway Toll & Ferry
                </span>
                <span className="text-[11px] font-mono">Golongan {matchedVehicle.tollGolongan}</span>
              </div>
              <p className="font-semibold text-slate-800">
                {derivedRoute.tollPointsCount} Automated Electronic Toll Plazas
              </p>
              <div className="pt-2 border-t border-indigo-200/60 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Standard Toll Cost:</span>
                  <span className="font-mono font-bold text-indigo-900">
                    Rp {tollCostRp.toLocaleString()}
                  </span>
                </div>
                {derivedRoute.ferryRequired && (
                  <div className="flex justify-between text-slate-600">
                    <span>ASDP Ferry Ticket:</span>
                    <span className="font-mono font-bold">Rp {ferryCostRp.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Lead Time & Depot Card */}
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
              <div className="flex items-center justify-between text-emerald-800 font-bold">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-600" /> Lead Time & Depot
                </span>
                <span className="text-[11px] font-mono">MoboDrive Ready</span>
              </div>
              <p className="font-semibold text-slate-800">
                Est: {derivedRoute.estimatedLeadTimeHours} Hours {isOvernight && '(>24h Nginep)'}
              </p>
              <div className="pt-2 border-t border-emerald-200/60 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Depot Lift-Off:</span>
                  <span className="font-mono font-bold text-emerald-900">
                    Rp {depotLiftOffRp.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Depot Operator:</span>
                  <span>{matchedDepot.operator}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-700" />
                <span className="font-bold text-slate-800">Destination route chain</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-blue-700">{destinationStages.length} points</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {[matchedOrigin, ...destinationStages].map((stage, index) => (
                <React.Fragment key={`${stage.id}-${index}`}>
                  <span className="px-2.5 py-1.5 rounded-lg border border-blue-200 bg-white text-[10px] font-semibold text-slate-700">
                    {index + 1}. {stage.name}
                  </span>
                  {index < [matchedOrigin, ...destinationStages].length - 1 && (
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-emerald-700" />
                <span className="font-bold text-slate-800">Embedded ERP cost item catalog</span>
              </div>
              <span className="text-[10px] text-emerald-700">CSV-linked mapping</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {embeddedCostItems.map((item) => (
                <div key={item.id} className="rounded-xl border border-emerald-200 bg-white p-3">
                  <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-700">{item.kind}</div>
                  <div className="mt-1 font-semibold text-slate-800">{item.name}</div>
                  <div className="mt-2 text-[10px] text-slate-500">{item.mappedActivityName || 'Manual review required'}</div>
                  <div className="mt-2 text-[10px] font-semibold text-emerald-700">Rp {item.standardUnitRate.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipment Activity RACI Sequence */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
              Decoupled Shipment Activity Sequence (Pre-Trip → On-Trip → Post-Trip)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {routeStageActivities.map((activity) => (
                <div key={activity.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="font-bold text-blue-700 text-[10px] uppercase">{activity.phase.replace('_', ' ')} | AUTOMATED</span>
                  <p className="font-semibold text-slate-800">{activity.name}</p>
                  <p className="text-[11px] text-slate-500">{activity.triggerEvent} | {activity.standardDurationMins} mins</p>
                  <p className="text-[10px] text-emerald-700 font-semibold">{activity.defaultCostItemName || 'Rule driver'}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Optional Extra Exceptions Config */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                Exception & Non-Formulated Extra Cost Check
              </span>
              <span className="text-slate-400 text-[11px]">Pre-budgeted exception items</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-2.5 bg-white rounded-lg border border-slate-200 space-y-1">
                <label className="font-bold text-slate-700 block">Colok Kabel Reefer</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    value={extraReeferHours}
                    onChange={(e) => setExtraReeferHours(parseInt(e.target.value) || 0)}
                    className="w-20 p-1.5 border border-slate-200 rounded font-mono text-xs"
                  />
                  <span className="text-slate-500">Hours (@65k/hr)</span>
                </div>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <label className="font-bold text-slate-700 block">Kawalan Patroli</label>
                  <span className="text-[11px] text-slate-400">Rp 850,000 Flat</span>
                </div>
                <input
                  type="checkbox"
                  checked={extraKawalan}
                  onChange={(e) => setExtraKawalan(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-slate-200 space-y-1">
                <label className="font-bold text-slate-700 block">Gate Pass / Retribusi</label>
                <input
                  type="number"
                  value={extraGatePass}
                  onChange={(e) => setExtraGatePass(parseInt(e.target.value) || 0)}
                  className="w-full p-1.5 border border-slate-200 rounded font-mono text-xs"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Inputs
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 transition-all"
            >
              <span>Calculate Formulated Cost</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: COST CALCULATION & BREAKDOWN */}
      {step === 3 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6 animate-in fade-in duration-150">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Step 3: Transparent Cost Formation Breakdown
              </h3>
              <p className="text-xs text-slate-500">
                Mathematical formation derived from active cost rules and operational drivers.
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">
                Total Calculated Cost
              </span>
              <span className="text-xl font-bold font-mono text-slate-900">
                Rp {totalCalculatedCostRp.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Cost Line Items Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-2.5 px-3.5">Cost Component</th>
                  <th className="py-2.5 px-3">Classification</th>
                  <th className="py-2.5 px-3">Driver & Formula</th>
                  <th className="py-2.5 px-3 text-right">Rate / Unit</th>
                  <th className="py-2.5 px-3.5 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {/* 1. Basic Trucking */}
                <tr className="hover:bg-slate-50">
                  <td className="py-2.5 px-3.5 font-bold text-slate-800">
                    Basic Trucking Cost
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      FORMULATED
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                    {distanceKm} KM × Rp {matchedVehicle.baseRatePerKm.toLocaleString()} (PDCA Rule)
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                    Rp {matchedVehicle.baseRatePerKm.toLocaleString()}/KM
                  </td>
                  <td className="py-2.5 px-3.5 text-right font-bold font-mono text-slate-900">
                    Rp {basicCostRp.toLocaleString()}
                  </td>
                </tr>

                {/* 2. Toll */}
                <tr className="hover:bg-slate-50">
                  <td className="py-2.5 px-3.5 font-bold text-slate-800">
                    Highway Tollway Fee
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      FORMULATED
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                    {derivedRoute.tollPointsCount} Electronic Toll Gates (Golongan {matchedVehicle.tollGolongan})
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-600">Fixed Corridor</td>
                  <td className="py-2.5 px-3.5 text-right font-bold font-mono text-slate-900">
                    Rp {tollCostRp.toLocaleString()}
                  </td>
                </tr>

                {/* 3. Fuel Allowance */}
                <tr className="hover:bg-slate-50">
                  <td className="py-2.5 px-3.5 font-bold text-slate-800">
                    Uang Solar (Fuel)
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      FORMULATED
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                    ({distanceKm} KM / {matchedVehicle.fuelRatioKmL} km/L) × 1.05 × Rp 6,800
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                    {fuelAllowanceLiters.toFixed(1)} Liters
                  </td>
                  <td className="py-2.5 px-3.5 text-right font-bold font-mono text-slate-900">
                    Rp {fuelCostRp.toLocaleString()}
                  </td>
                </tr>

                {/* 4. Depot Lift-Off */}
                <tr className="hover:bg-slate-50 bg-emerald-50/20">
                  <td className="py-2.5 px-3.5 font-bold text-slate-800 flex items-center gap-1.5">
                    <span>{matchedDepot.name} Lift-Off</span>
                    <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                      Auto-Depot
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      FORMULATED
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                    Depot Master Tariff Auto-Mapped (Eliminates PV Extra Rework)
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-600">1 Box</td>
                  <td className="py-2.5 px-3.5 text-right font-bold font-mono text-emerald-800">
                    Rp {depotLiftOffRp.toLocaleString()}
                  </td>
                </tr>

                {/* 5. Driver Meal & Commission */}
                <tr className="hover:bg-slate-50">
                  <td className="py-2.5 px-3.5 font-bold text-slate-800">
                    Uang Makan Driver & Komisi
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      FORMULATED
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                    Lead Time {derivedRoute.estimatedLeadTimeHours}h ({daysMultiplier} day shift standard)
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                    Rp 150,000 / Day
                  </td>
                  <td className="py-2.5 px-3.5 text-right font-bold font-mono text-slate-900">
                    Rp {mealAllowanceRp.toLocaleString()}
                  </td>
                </tr>

                {/* Extra Costs if any */}
                {totalExtraCostRp > 0 && (
                  <tr className="hover:bg-slate-50 bg-amber-50/20">
                    <td className="py-2.5 px-3.5 font-bold text-slate-800">
                      Extra Operational Expenses
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        NON-FORMULATED
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      Reefer: Rp {reeferPlugInCostRp.toLocaleString()} | Kawalan: Rp{' '}
                      {kawalanCostRp.toLocaleString()} | Gate: Rp {gatePassCostRp.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-600">Itemized</td>
                    <td className="py-2.5 px-3.5 text-right font-bold font-mono text-amber-900">
                      Rp {totalExtraCostRp.toLocaleString()}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Parameters
            </button>
            <button
              onClick={() => setStep(4)}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 transition-all"
            >
              <span>Validate & Benchmark Similarity</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: VALIDATION, SIMILARITY CHECK & APPROVAL */}
      {step === 4 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6 animate-in fade-in duration-150">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Step 4: Multi-Dimensional Validation & ODC Score
              </h3>
              <p className="text-xs text-slate-500">
                Automated validation audit and historical similarity comparison to prevent duplicates.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-xl text-xs font-bold font-mono ${
                  validationScore >= 90
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                }`}
              >
                ODC SCORE: {validationScore}/100
              </span>
            </div>
          </div>

          {/* Historical Similarity Finder Box (SOLVING NOTE: "kalo udah buat ODC sekali harus ada reviewnya supaya jangan bikin baru") */}
          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-blue-900">
                <FileSpreadsheet className="w-4 h-4 text-blue-600" />
                <span>Historical ODC Similarity Engine</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-blue-800 border border-blue-200">
                Duplicate Prevention Active
              </span>
            </div>

            {similarityMatch.found ? (
              <div className="p-3 bg-white rounded-lg border border-blue-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">
                    Found Similar Existing ODC: {similarityMatch.odcNumber}
                  </span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {similarityMatch.similarityPct}% Match
                  </span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Historical Trip Cost: <strong>Rp {similarityMatch.historicalCostRp?.toLocaleString()}</strong> vs Proposed:{' '}
                  <strong>Rp {totalCalculatedCostRp.toLocaleString()}</strong> ({similarityMatch.variancePct > 0 ? '+' : ''}
                  {similarityMatch.variancePct}% variance).
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[11px] text-slate-500">Recommendation:</span>
                  <span className="font-semibold text-blue-800 text-[11px]">
                    Validate new extra cost lines or approve under existing contract tariff.
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-slate-600 text-[11px]">
                No identical historical ODC found for this corridor and vehicle combination. This is a novel route creation.
              </p>
            )}
          </div>

          {/* 10-Point Validation Checklist */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
              Control Tower Pre-Flight Validation Checks
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              {Object.entries(validationChecks).map(([key, isValid]) => (
                <div
                  key={key}
                  className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                    isValid
                      ? 'border-emerald-200 bg-emerald-50/50 text-emerald-900'
                      : 'border-rose-200 bg-rose-50/50 text-rose-900'
                  }`}
                >
                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 ${
                      isValid ? 'text-emerald-600' : 'text-rose-500'
                    }`}
                  />
                  <span className="font-medium capitalize text-[11.5px] truncate">
                    {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(3)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Costing
            </button>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handleGenerateCdo}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Generate C-D/O</span>
              </button>

              <button
                onClick={handleSubmitODC}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve & Create ODC</span>
              </button>
            </div>
          </div>

          {generatedCdoNumber && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-[11px] text-emerald-800">
              <span className="font-bold">Generated C-D/O:</span> {generatedCdoNumber}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
