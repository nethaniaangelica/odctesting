import { ShipmentTrip, RouteTripSegment, CustomerBudgetRow } from '../types';

/**
 * Parse CSV for Shipment Trips
 * Expected columns: tripId, routeId, tripCode, customerName, actualKm, totalCostRp, budgetRp, leakageRp, status, actualDepartureAt, actualArrivalAt
 */
export function parseShipmentTripsCSV(csvContent: string): ShipmentTrip[] {
  const lines = csvContent.trim().split('\n');
  if (lines.length < 2) throw new Error('CSV file is empty or has no data rows');

  const headers = parseCSVLine(lines[0]);
  const trips: ShipmentTrip[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === 0) continue;

    const trip: ShipmentTrip = {
      id: values[getColumnIndex(headers, 'tripId')] || `trip-${i}`,
      routeId: values[getColumnIndex(headers, 'routeId')],
      tripCode: values[getColumnIndex(headers, 'tripCode')],
      customerName: values[getColumnIndex(headers, 'customerName')],
      actualKm: parseFloat(values[getColumnIndex(headers, 'actualKm')]) || 0,
      totalCostRp: parseInt(values[getColumnIndex(headers, 'totalCostRp')]) || 0,
      budgetRp: parseInt(values[getColumnIndex(headers, 'budgetRp')]) || 0,
      leakageRp: parseInt(values[getColumnIndex(headers, 'leakageRp')]) || 0,
      status: (values[getColumnIndex(headers, 'status')] as any) || 'ON_TIME',
      actualDepartureAt: values[getColumnIndex(headers, 'actualDepartureAt')],
      actualArrivalAt: values[getColumnIndex(headers, 'actualArrivalAt')],
      routePoints: [],
      segments: [],
    };

    trips.push(trip);
  }

  return trips;
}

/**
 * Parse CSV for Customer Budgets
 * Expected columns: customerId, customerName, routeSegment, budgetRp, spendRp, leakageRp, status
 */
export function parseCustomerBudgetsCSV(csvContent: string): CustomerBudgetRow[] {
  const lines = csvContent.trim().split('\n');
  if (lines.length < 2) throw new Error('CSV file is empty or has no data rows');

  const headers = parseCSVLine(lines[0]);
  const budgets: CustomerBudgetRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === 0) continue;

    const budget: CustomerBudgetRow = {
      customerId: values[getColumnIndex(headers, 'customerId')],
      customerName: values[getColumnIndex(headers, 'customerName')],
      routeSegment: values[getColumnIndex(headers, 'routeSegment')],
      budgetRp: parseInt(values[getColumnIndex(headers, 'budgetRp')]) || 0,
      spendRp: parseInt(values[getColumnIndex(headers, 'spendRp')]) || 0,
      leakageRp: parseInt(values[getColumnIndex(headers, 'leakageRp')]) || 0,
      status: (values[getColumnIndex(headers, 'status')] as any) || 'WITHIN_BUDGET',
    };

    budgets.push(budget);
  }

  return budgets;
}

/**
 * Parse CSV for Route Trip Segments
 * Expected columns: segmentId, tripId, routeId, sequence, fromLocatorId, fromLocatorName, toLocatorId, toLocatorName, activityName, segmentType, actualKm, actualMinutes, startLat, startLng, endLat, endLng
 */
export function parseRouteTripSegmentsCSV(csvContent: string): RouteTripSegment[] {
  const lines = csvContent.trim().split('\n');
  if (lines.length < 2) throw new Error('CSV file is empty or has no data rows');

  const headers = parseCSVLine(lines[0]);
  const segments: RouteTripSegment[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === 0) continue;

    const segment: RouteTripSegment = {
      id: values[getColumnIndex(headers, 'segmentId')] || `seg-${i}`,
      tripId: values[getColumnIndex(headers, 'tripId')],
      routeId: values[getColumnIndex(headers, 'routeId')],
      sequence: parseInt(values[getColumnIndex(headers, 'sequence')]) || 0,
      fromLocatorId: values[getColumnIndex(headers, 'fromLocatorId')],
      fromLocatorName: values[getColumnIndex(headers, 'fromLocatorName')],
      toLocatorId: values[getColumnIndex(headers, 'toLocatorId')],
      toLocatorName: values[getColumnIndex(headers, 'toLocatorName')],
      activityName: values[getColumnIndex(headers, 'activityName')],
      segmentType: (values[getColumnIndex(headers, 'segmentType')] as any) || 'DRIVING',
      actualKm: parseFloat(values[getColumnIndex(headers, 'actualKm')]) || 0,
      actualMinutes: parseInt(values[getColumnIndex(headers, 'actualMinutes')]) || 0,
      startLat: parseFloat(values[getColumnIndex(headers, 'startLat')]) || 0,
      startLng: parseFloat(values[getColumnIndex(headers, 'startLng')]) || 0,
      endLat: parseFloat(values[getColumnIndex(headers, 'endLat')]) || 0,
      endLng: parseFloat(values[getColumnIndex(headers, 'endLng')]) || 0,
    };

    segments.push(segment);
  }

  return segments;
}

/**
 * Utility: Parse a single CSV line, handling quoted values
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++; // Skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

/**
 * Utility: Find column index by header name (case-insensitive)
 */
function getColumnIndex(headers: string[], columnName: string): number {
  const index = headers.findIndex((h) =>
    h.toLowerCase().replace(/[_\s]/g, '') === columnName.toLowerCase().replace(/[_\s]/g, '')
  );
  return index >= 0 ? index : -1;
}

/**
 * Validate parsed data
 */
export function validateShipmentTrips(trips: ShipmentTrip[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!trips || trips.length === 0) {
    errors.push('No valid trip records found');
    return { valid: false, errors };
  }

  trips.forEach((trip, idx) => {
    if (!trip.tripCode) errors.push(`Row ${idx + 1}: Missing tripCode`);
    if (!trip.routeId) errors.push(`Row ${idx + 1}: Missing routeId`);
    if (!trip.customerName) errors.push(`Row ${idx + 1}: Missing customerName`);
  });

  return { valid: errors.length === 0, errors };
}

export function validateCustomerBudgets(budgets: CustomerBudgetRow[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!budgets || budgets.length === 0) {
    errors.push('No valid budget records found');
    return { valid: false, errors };
  }

  budgets.forEach((budget, idx) => {
    if (!budget.customerId) errors.push(`Row ${idx + 1}: Missing customerId`);
    if (!budget.customerName) errors.push(`Row ${idx + 1}: Missing customerName`);
    if (budget.budgetRp <= 0) errors.push(`Row ${idx + 1}: Invalid budgetRp`);
  });

  return { valid: errors.length === 0, errors };
}
