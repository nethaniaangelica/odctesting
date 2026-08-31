import React from 'react';
import {
  X,
  Database,
  Sliders,
  Route,
  MapPin,
  Workflow,
  Coins,
  Layers,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  FileText,
} from 'lucide-react';

interface DetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  entityType: string | null;
  data: any;
  onTriggerWhatIf?: (item: any) => void;
  onWhyThisCost?: (odc: any) => void;
}

export const DetailDrawer: React.FC<DetailDrawerProps> = ({
  isOpen,
  onClose,
  entityType,
  data,
  onTriggerWhatIf,
  onWhyThisCost,
}) => {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-2xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold text-sm">
              {entityType === 'COST_ITEM' && <Coins className="w-4 h-4 text-emerald-400" />}
              {entityType === 'COST_RULE' && <Sliders className="w-4 h-4 text-indigo-400" />}
              {entityType === 'ROUTE' && <Route className="w-4 h-4 text-blue-400" />}
              {entityType === 'LOCATOR' && <MapPin className="w-4 h-4 text-rose-400" />}
              {entityType === 'ACTIVITY' && <Workflow className="w-4 h-4 text-purple-400" />}
              {entityType === 'RATIONALIZATION' && <Layers className="w-4 h-4 text-amber-400" />}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {entityType?.replace('_', ' ')} DETAILS
              </span>
              <h2 className="text-base font-bold text-slate-800 line-clamp-1">
                {data.name || data.code || data.odcNumber || 'Entity Detail'}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
          {/* Key Metrics Strip */}
          <div className="grid grid-cols-2 gap-3">
            {data.code && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Identifier
                </span>
                <span className="font-bold text-slate-800 font-mono text-xs">{data.code}</span>
              </div>
            )}
            {data.status && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Status
                </span>
                <span className="font-bold text-slate-800">{data.status}</span>
              </div>
            )}
            {data.qualityScore !== undefined && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Quality Score
                </span>
                <span className="font-bold text-emerald-700 text-xs">
                  {data.qualityScore}% Healthy
                </span>
              </div>
            )}
            {data.usageCount !== undefined && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Usage Count
                </span>
                <span className="font-bold text-slate-800">{data.usageCount.toLocaleString()} times</span>
              </div>
            )}
          </div>

          {/* Cost Item Specific View */}
          {entityType === 'COST_ITEM' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">
                  Cost Formation Relationship
                </span>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 flex-wrap">
                  <span className="bg-white px-2 py-0.5 rounded border border-blue-200">
                    Cost Item ({data.code})
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-blue-500" />
                  <span className="bg-white px-2 py-0.5 rounded border border-blue-200">
                    Driver: {data.driverType}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-blue-500" />
                  <span className="bg-white px-2 py-0.5 rounded border border-blue-200">
                    Cost Rule
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Formula Template
                </span>
                <div className="p-3 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-xl">
                  {data.formulaTemplate}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Strategic Recommendation
                </span>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 font-medium">
                  Recommendation: <strong className="font-bold uppercase">{data.recommendation}</strong>
                  <p className="text-[11px] text-amber-800 mt-1 font-normal">
                    {data.redundancyTag === 'REDUNDANT_DUPLICATE' &&
                      'Duplicate naming strings detected. Consolidate into standardized dynamic rule.'}
                    {data.redundancyTag === 'ZERO_USAGE' &&
                      'Zero active transactions linked. Safe candidate for master-data retirement.'}
                    {data.redundancyTag === 'RULE_CONVERT_CANDIDATE' &&
                      'Frequent usage with stable multiplier. High-value candidate for automated rule conversion.'}
                    {data.redundancyTag === 'HEALTHY' &&
                      'Healthy master data with active transaction linkage.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Cost Rule Specific View */}
          {entityType === 'COST_RULE' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-xl space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 block">
                  Rule Logic
                </span>
                <p className="font-mono text-indigo-900 font-bold">{data.formulaDescription}</p>
                <p className="text-[11px] text-indigo-700">
                  Version: {data.version} • Priority: {data.priority} • Rate: {data.rateVariable}
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Governance & Ownership
                </span>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Owner:</span>
                    <span className="font-semibold">{data.owner}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Approver:</span>
                    <span className="font-semibold">{data.approver}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Effective Period:</span>
                    <span>
                      {data.effectiveDate} to {data.expiryDate}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Route Specific View */}
          {entityType === 'ROUTE' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  KM Validation Summary
                </span>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">ERP KM</span>
                    <span className="font-bold text-slate-800">{data.erpKm} KM</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">Standard KM</span>
                    <span className="font-bold text-slate-800">{data.standardKm} KM</span>
                  </div>
                  <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
                    <span className="text-[10px] text-blue-600 block">PDCA KM</span>
                    <span className="font-bold text-blue-900">{data.pdcaCalculatedKm} KM</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-500">Variance:</span>
                  <span
                    className={`font-bold ${
                      data.kmVariancePct > 10 ? 'text-rose-600' : 'text-emerald-600'
                    }`}
                  >
                    {data.kmVariancePct}% ({data.kmStatus})
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Operational Parameters
                </span>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tollway Cost:</span>
                  <span className="font-bold text-slate-800">
                    Rp {data.standardTollCost?.toLocaleString()} ({data.tollPointsCount} gates)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Estimated Lead Time:</span>
                  <span className="font-bold text-slate-800">{data.estimatedLeadTimeHours} Hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Depot Lift-Off:</span>
                  <span className="font-bold text-slate-800">
                    Rp {data.depotLiftOffCost?.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {entityType === 'LOCATOR' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block">Shipment Locator Master</span>
                <div className="flex justify-between"><span className="text-slate-500">Function:</span><span className="font-bold text-slate-800">{data.locatorRole || 'DESTINATION'}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Customer:</span><span className="font-semibold text-slate-800">{data.customerName || 'Shared ODC Master'}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Address:</span><span className="font-semibold text-slate-800 text-right max-w-[65%]">{data.address}</span></div>
              </div>
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Coordinate Validation</span>
                <div className="grid grid-cols-1 gap-2 font-mono text-[11px]">
                  <div className="p-2 bg-white rounded-lg border border-slate-200"><span className="text-slate-400 block font-sans">Master coordinate</span>{data.latitude?.toFixed(6)}, {data.longitude?.toFixed(6)}</div>
                  <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-800"><span className="text-emerald-600 block font-sans">Actual MoboDrive coordinate</span>{data.moboDriveActualLat !== undefined ? `${data.moboDriveActualLat.toFixed(6)}, ${data.moboDriveActualLng?.toFixed(6)}` : 'Belum tersedia'}</div>
                </div>
                <a href={`https://www.google.com/maps/search/?api=1&query=${data.moboDriveActualLat ?? data.latitude},${data.moboDriveActualLng ?? data.longitude}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">Open actual point in Google Maps <ArrowRight className="w-3.5 h-3.5" /></a>
              </div>
            </div>
          )}

          {/* Rationalization Matrix Item View */}
          {entityType === 'RATIONALIZATION' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-purple-50 border border-purple-200 rounded-xl space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 block">
                  Matrix Classification: {data.quadrant}
                </span>
                <p className="text-purple-900 font-semibold">{data.actionRecommendation}</p>
                <p className="text-[11px] text-purple-800">
                  Potential Simplification: <strong>{data.potentialSimplificationPct}%</strong>
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Operational Evidence
                </span>
                <p className="text-slate-700 italic leading-relaxed text-[11px]">
                  "{data.evidence}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">Migration Effort</span>
                  <span className="font-bold text-slate-800">{data.migrationEffort}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">Operational Risk</span>
                  <span className="font-bold text-slate-800">{data.operationalRisk}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          {onTriggerWhatIf ? (
            <button
              onClick={() => {
                onTriggerWhatIf(data);
                onClose();
              }}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors flex items-center gap-1.5"
            >
              <Sliders className="w-3.5 h-3.5" />
              Simulate What-If Impact
            </button>
          ) : (
            <span className="text-slate-400 text-[11px]">Read-only audit inspection</span>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
