import React, { useState } from 'react';
import { Upload, AlertTriangle, CheckCircle2, FileSpreadsheet, Trash2, X } from 'lucide-react';
import {
  parseShipmentTripsCSV,
  parseCustomerBudgetsCSV,
  parseRouteTripSegmentsCSV,
  validateShipmentTrips,
  validateCustomerBudgets,
} from '../utils/csvParser';
import { ShipmentTrip, CustomerBudgetRow, RouteTripSegment } from '../types';

interface CSVImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportTrips: (trips: ShipmentTrip[]) => void;
  onImportBudgets: (budgets: CustomerBudgetRow[]) => void;
  onImportSegments: (segments: RouteTripSegment[]) => void;
}

export const CSVImportModal: React.FC<CSVImportModalProps> = ({
  isOpen,
  onClose,
  onImportTrips,
  onImportBudgets,
  onImportSegments,
}) => {
  const [activeTab, setActiveTab] = useState<'trips' | 'budgets' | 'segments'>('trips');
  const [parsedTrips, setParsedTrips] = useState<ShipmentTrip[]>([]);
  const [parsedBudgets, setParsedBudgets] = useState<CustomerBudgetRow[]>([]);
  const [parsedSegments, setParsedSegments] = useState<RouteTripSegment[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTripsFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setErrors([]);
    setSuccess('');

    try {
      const content = await file.text();
      const trips = parseShipmentTripsCSV(content);
      const validation = validateShipmentTrips(trips);

      if (!validation.valid) {
        setErrors(validation.errors);
      } else {
        setParsedTrips(trips);
        setSuccess(`✓ Successfully parsed ${trips.length} shipment trips from ${file.name}`);
      }
    } catch (err: any) {
      setErrors([`Error parsing file: ${err.message}`]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBudgetsFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setErrors([]);
    setSuccess('');

    try {
      const content = await file.text();
      const budgets = parseCustomerBudgetsCSV(content);
      const validation = validateCustomerBudgets(budgets);

      if (!validation.valid) {
        setErrors(validation.errors);
      } else {
        setParsedBudgets(budgets);
        setSuccess(`✓ Successfully parsed ${budgets.length} customer budgets from ${file.name}`);
      }
    } catch (err: any) {
      setErrors([`Error parsing file: ${err.message}`]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSegmentsFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setErrors([]);
    setSuccess('');

    try {
      const content = await file.text();
      const segments = parseRouteTripSegmentsCSV(content);
      if (segments.length === 0) {
        setErrors(['No valid segment records found in file']);
      } else {
        setParsedSegments(segments);
        setSuccess(`✓ Successfully parsed ${segments.length} route trip segments from ${file.name}`);
      }
    } catch (err: any) {
      setErrors([`Error parsing file: ${err.message}`]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportAll = () => {
    if (parsedTrips.length > 0) onImportTrips(parsedTrips);
    if (parsedBudgets.length > 0) onImportBudgets(parsedBudgets);
    if (parsedSegments.length > 0) onImportSegments(parsedSegments);

    setParsedTrips([]);
    setParsedBudgets([]);
    setParsedSegments([]);
    setSuccess('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-2xl max-h-[80vh] shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-900">Import Master Data from CSV</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Upload CSV files to import shipment trips, customer budgets, and route segments
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-3 bg-slate-50 border-b border-slate-200 gap-2">
          <button
            onClick={() => setActiveTab('trips')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'trips'
                ? 'bg-white text-blue-700 border border-blue-200 shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Shipment Trips ({parsedTrips.length})
          </button>
          <button
            onClick={() => setActiveTab('budgets')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'budgets'
                ? 'bg-white text-blue-700 border border-blue-200 shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Customer Budgets ({parsedBudgets.length})
          </button>
          <button
            onClick={() => setActiveTab('segments')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'segments'
                ? 'bg-white text-blue-700 border border-blue-200 shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Route Segments ({parsedSegments.length})
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Error Messages */}
          {errors.length > 0 && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-rose-900 font-semibold text-sm">
                <AlertTriangle className="w-4 h-4" />
                Parsing Errors
              </div>
              <div className="space-y-1">
                {errors.map((err, idx) => (
                  <div key={idx} className="text-xs text-rose-700 font-mono">
                    • {err}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span className="text-xs text-emerald-700 font-semibold">{success}</span>
            </div>
          )}

          {/* Trips Tab */}
          {activeTab === 'trips' && (
            <div className="space-y-3">
              <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-lg space-y-3">
                <div className="flex items-center gap-2 text-blue-900 font-semibold text-sm">
                  <FileSpreadsheet className="w-4 h-4" />
                  Upload Shipment Trips CSV
                </div>
                <p className="text-xs text-blue-700">
                  Required columns: tripId, routeId, tripCode, customerName, actualKm, totalCostRp, budgetRp, leakageRp, status, actualDepartureAt, actualArrivalAt
                </p>
                <label className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                  <Upload className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-semibold text-blue-700">Click to select file or drag & drop</span>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleTripsFileUpload}
                    disabled={isLoading}
                    className="hidden"
                  />
                </label>
              </div>

              {parsedTrips.length > 0 && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-semibold text-emerald-900">
                      {parsedTrips.length} trips ready to import
                    </span>
                    <button
                      onClick={() => setParsedTrips([])}
                      className="px-2 py-1 text-xs text-emerald-700 hover:bg-emerald-100 rounded transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Clear
                    </button>
                  </div>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {parsedTrips.slice(0, 3).map((trip) => (
                      <div key={trip.id} className="text-xs text-emerald-700 p-2 bg-white rounded border border-emerald-100">
                        {trip.tripCode} • {trip.customerName} • {trip.actualKm} KM
                      </div>
                    ))}
                    {parsedTrips.length > 3 && (
                      <div className="text-xs text-emerald-600 font-semibold">
                        +{parsedTrips.length - 3} more trips...
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Budgets Tab */}
          {activeTab === 'budgets' && (
            <div className="space-y-3">
              <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-lg space-y-3">
                <div className="flex items-center gap-2 text-blue-900 font-semibold text-sm">
                  <FileSpreadsheet className="w-4 h-4" />
                  Upload Customer Budgets CSV
                </div>
                <p className="text-xs text-blue-700">
                  Required columns: customerId, customerName, routeSegment, budgetRp, spendRp, leakageRp, status
                </p>
                <label className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                  <Upload className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-semibold text-blue-700">Click to select file or drag & drop</span>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleBudgetsFileUpload}
                    disabled={isLoading}
                    className="hidden"
                  />
                </label>
              </div>

              {parsedBudgets.length > 0 && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-semibold text-emerald-900">
                      {parsedBudgets.length} budgets ready to import
                    </span>
                    <button
                      onClick={() => setParsedBudgets([])}
                      className="px-2 py-1 text-xs text-emerald-700 hover:bg-emerald-100 rounded transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Clear
                    </button>
                  </div>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {parsedBudgets.slice(0, 3).map((budget) => (
                      <div key={budget.customerId} className="text-xs text-emerald-700 p-2 bg-white rounded border border-emerald-100">
                        {budget.customerName} • {budget.routeSegment} • Rp {budget.budgetRp.toLocaleString()}
                      </div>
                    ))}
                    {parsedBudgets.length > 3 && (
                      <div className="text-xs text-emerald-600 font-semibold">
                        +{parsedBudgets.length - 3} more budgets...
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Segments Tab */}
          {activeTab === 'segments' && (
            <div className="space-y-3">
              <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-lg space-y-3">
                <div className="flex items-center gap-2 text-blue-900 font-semibold text-sm">
                  <FileSpreadsheet className="w-4 h-4" />
                  Upload Route Trip Segments CSV
                </div>
                <p className="text-xs text-blue-700">
                  Required columns: segmentId, tripId, routeId, sequence, fromLocatorId, fromLocatorName, toLocatorId, toLocatorName, activityName, segmentType, actualKm, actualMinutes, startLat, startLng, endLat, endLng
                </p>
                <label className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                  <Upload className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-semibold text-blue-700">Click to select file or drag & drop</span>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleSegmentsFileUpload}
                    disabled={isLoading}
                    className="hidden"
                  />
                </label>
              </div>

              {parsedSegments.length > 0 && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-semibold text-emerald-900">
                      {parsedSegments.length} segments ready to import
                    </span>
                    <button
                      onClick={() => setParsedSegments([])}
                      className="px-2 py-1 text-xs text-emerald-700 hover:bg-emerald-100 rounded transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Clear
                    </button>
                  </div>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {parsedSegments.slice(0, 3).map((seg) => (
                      <div key={seg.id} className="text-xs text-emerald-700 p-2 bg-white rounded border border-emerald-100">
                        {seg.activityName} • {seg.segmentType} • {seg.actualKm} KM
                      </div>
                    ))}
                    {parsedSegments.length > 3 && (
                      <div className="text-xs text-emerald-600 font-semibold">
                        +{parsedSegments.length - 3} more segments...
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 p-4 flex items-center justify-between bg-slate-50 rounded-b-2xl">
          <p className="text-xs text-slate-500">
            Total ready: {parsedTrips.length + parsedBudgets.length + parsedSegments.length} records
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleImportAll}
              disabled={parsedTrips.length + parsedBudgets.length + parsedSegments.length === 0 || isLoading}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                parsedTrips.length + parsedBudgets.length + parsedSegments.length === 0 || isLoading
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isLoading ? 'Loading...' : `Import ${parsedTrips.length + parsedBudgets.length + parsedSegments.length} Records`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
