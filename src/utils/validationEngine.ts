import { ShipmentTrip, CustomerBudgetRow, RouteMaster } from '../types';

export interface CostLeakageAlert {
  tripId: string;
  tripCode: string;
  type: 'COST_OVERRUN' | 'BUDGET_EXCEEDED' | 'UNUSUAL_VARIANCE' | 'UNPLANNED_ACTIVITY';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  description: string;
  amount: number;
  recommendation: string;
}

export interface ReconciliationResult {
  tripId: string;
  tripCode: string;
  actualCost: number;
  budgetedCost: number;
  variance: number;
  variancePct: number;
  status: 'ON_BUDGET' | 'MINOR_VARIANCE' | 'MAJOR_VARIANCE' | 'CRITICAL';
  leakageItems: CostLeakageAlert[];
}

export interface BudgetRecommendation {
  customerId: string;
  customerName: string;
  currentBudget: number;
  recommendedBudget: number;
  reason: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

/**
 * Validate trip against budget and flag cost leakage issues
 */
export function validateTripCost(trip: ShipmentTrip, route: RouteMaster | null): ReconciliationResult {
  const alerts: CostLeakageAlert[] = [];
  const variance = trip.totalCostRp - trip.budgetRp;
  const variancePct = trip.budgetRp > 0 ? (variance / trip.budgetRp) * 100 : 0;

  // Check for cost overruns
  if (variance > 0) {
    alerts.push({
      tripId: trip.id,
      tripCode: trip.tripCode,
      type: 'COST_OVERRUN',
      severity: variancePct > 20 ? 'CRITICAL' : variancePct > 10 ? 'HIGH' : 'MEDIUM',
      title: `Cost overrun detected on ${trip.tripCode}`,
      description: `Actual cost Rp ${trip.totalCostRp.toLocaleString()} exceeds budget Rp ${trip.budgetRp.toLocaleString()} by Rp ${variance.toLocaleString()}`,
      amount: variance,
      recommendation: `Review operational efficiency or adjust budget allocation for ${trip.customerName}`,
    });
  }

  // Check for unusual KM variance if route exists
  if (route && route.moboDriveActualKm) {
    const kmVariance = trip.actualKm - route.moboDriveActualKm;
    const kmVariancePct = (kmVariance / route.moboDriveActualKm) * 100;

    if (Math.abs(kmVariancePct) > 15) {
      alerts.push({
        tripId: trip.id,
        tripCode: trip.tripCode,
        type: 'UNUSUAL_VARIANCE',
        severity: Math.abs(kmVariancePct) > 30 ? 'HIGH' : 'MEDIUM',
        title: `KM variance detected`,
        description: `Trip KM ${trip.actualKm} differs from route standard ${route.moboDriveActualKm} by ${kmVariancePct.toFixed(1)}%`,
        amount: Math.abs(kmVariance) * 2400, // Approx fuel cost impact
        recommendation: `Verify GPS tracking and route adherence. Check for unauthorized detours.`,
      });
    }
  }

  // Check leakage
  if (trip.leakageRp > 0) {
    alerts.push({
      tripId: trip.id,
      tripCode: trip.tripCode,
      type: 'COST_OVERRUN',
      severity: trip.leakageRp > trip.budgetRp * 0.15 ? 'HIGH' : 'MEDIUM',
      title: `Unbilled leakage detected`,
      description: `Rp ${trip.leakageRp.toLocaleString()} in extra costs not recovered from customer`,
      amount: trip.leakageRp,
      recommendation: `Review exception handling and recovery procedures. Consider billing adjustments.`,
    });
  }

  // Determine overall status
  let status: 'ON_BUDGET' | 'MINOR_VARIANCE' | 'MAJOR_VARIANCE' | 'CRITICAL' = 'ON_BUDGET';
  if (variancePct > 25) status = 'CRITICAL';
  else if (variancePct > 15) status = 'MAJOR_VARIANCE';
  else if (variancePct > 5) status = 'MINOR_VARIANCE';

  return {
    tripId: trip.id,
    tripCode: trip.tripCode,
    actualCost: trip.totalCostRp,
    budgetedCost: trip.budgetRp,
    variance,
    variancePct,
    status,
    leakageItems: alerts,
  };
}

/**
 * Validate all trips and return reconciliation results
 */
export function reconcileAllTrips(trips: ShipmentTrip[], routes: RouteMaster[]): ReconciliationResult[] {
  return trips.map((trip) => {
    const route = routes.find((r) => r.id === trip.routeId) || null;
    return validateTripCost(trip, route);
  });
}

/**
 * Detect cost leakage patterns across multiple trips
 */
export function detectCostLeakage(trips: ShipmentTrip[]): CostLeakageAlert[] {
  const alerts: CostLeakageAlert[] = [];

  // Group trips by customer
  const tripsByCustomer = trips.reduce(
    (acc, trip) => {
      if (!acc[trip.customerName]) acc[trip.customerName] = [];
      acc[trip.customerName].push(trip);
      return acc;
    },
    {} as Record<string, ShipmentTrip[]>
  );

  // Analyze each customer
  Object.entries(tripsByCustomer).forEach(([customerName, customerTrips]) => {
    const totalCost = customerTrips.reduce((sum, t) => sum + t.totalCostRp, 0);
    const totalBudget = customerTrips.reduce((sum, t) => sum + t.budgetRp, 0);
    const totalLeakage = customerTrips.reduce((sum, t) => sum + t.leakageRp, 0);

    const overrunPct = totalBudget > 0 ? ((totalCost - totalBudget) / totalBudget) * 100 : 0;
    const leakagePct = totalCost > 0 ? (totalLeakage / totalCost) * 100 : 0;

    if (overrunPct > 10) {
      alerts.push({
        tripId: `${customerName}-group`,
        tripCode: `GROUP-${customerName.substring(0, 10)}`,
        type: 'COST_OVERRUN',
        severity: overrunPct > 25 ? 'CRITICAL' : 'HIGH',
        title: `High cost overrun for ${customerName}`,
        description: `Customer's trip portfolio is ${overrunPct.toFixed(1)}% over budget across ${customerTrips.length} trips`,
        amount: totalCost - totalBudget,
        recommendation: `Negotiate rate adjustment or implement efficiency improvement program for this customer.`,
      });
    }

    if (leakagePct > 5) {
      alerts.push({
        tripId: `${customerName}-leakage`,
        tripCode: `LEAK-${customerName.substring(0, 10)}`,
        type: 'COST_OVERRUN',
        severity: leakagePct > 15 ? 'HIGH' : 'MEDIUM',
        title: `Significant unbilled leakage`,
        description: `${leakagePct.toFixed(1)}% of costs (Rp ${totalLeakage.toLocaleString()}) are unbilled for ${customerName}`,
        amount: totalLeakage,
        recommendation: `Review cost recovery procedures. Adjust surcharge structures or billing policies.`,
      });
    }
  });

  return alerts;
}

/**
 * Generate budget recommendations based on historical performance
 */
export function generateBudgetRecommendations(
  trips: ShipmentTrip[],
  currentBudgets: CustomerBudgetRow[]
): BudgetRecommendation[] {
  const recommendations: BudgetRecommendation[] = [];

  // Group trips by customer
  const tripsByCustomer = trips.reduce(
    (acc, trip) => {
      if (!acc[trip.customerName]) acc[trip.customerName] = [];
      acc[trip.customerName].push(trip);
      return acc;
    },
    {} as Record<string, ShipmentTrip[]>
  );

  Object.entries(tripsByCustomer).forEach(([customerName, customerTrips]) => {
    const currentBudget = currentBudgets.find((b) => b.customerName === customerName);
    if (!currentBudget) return;

    const avgActualCost =
      customerTrips.reduce((sum, t) => sum + t.totalCostRp, 0) / customerTrips.length;
    const avgBudgetPerTrip = currentBudget.budgetRp / customerTrips.length;
    const P95Cost = calculatePercentile(customerTrips.map((t) => t.totalCostRp), 0.95);

    // Recommend budget based on P95 + 10% buffer
    const recommendedBudget = Math.ceil(P95Cost * 1.1);
    const budgetChange = recommendedBudget - currentBudget.budgetRp;
    const budgetChangePct = (budgetChange / currentBudget.budgetRp) * 100;

    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    if (budgetChangePct > 20) riskLevel = 'HIGH';
    else if (budgetChangePct > 10) riskLevel = 'MEDIUM';

    recommendations.push({
      customerId: currentBudget.customerId,
      customerName: currentBudget.customerName,
      currentBudget: currentBudget.budgetRp,
      recommendedBudget,
      reason:
        budgetChange > 0
          ? `Historical P95 cost (Rp ${P95Cost.toLocaleString()}) suggests budget increase needed`
          : `Average actual costs (Rp ${Math.round(avgActualCost).toLocaleString()}) indicate budget can be optimized`,
      riskLevel,
    });
  });

  return recommendations;
}

/**
 * Calculate percentile value in array
 */
function calculatePercentile(values: number[], percentile: number): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.ceil((percentile / 100) * sorted.length) - 1;
  return sorted[Math.max(0, index)];
}

/**
 * Get budget utilization by trip
 */
export function getBudgetUtilization(
  trips: ShipmentTrip[],
  budgets: CustomerBudgetRow[]
): Map<string, { spent: number; budget: number; utilization: number }> {
  const utilization = new Map<
    string,
    { spent: number; budget: number; utilization: number }
  >();

  budgets.forEach((budget) => {
    const customerTrips = trips.filter((t) => t.customerName === budget.customerName);
    const spent = customerTrips.reduce((sum, t) => sum + t.totalCostRp, 0);

    utilization.set(budget.customerId, {
      spent,
      budget: budget.budgetRp,
      utilization: budget.budgetRp > 0 ? (spent / budget.budgetRp) * 100 : 0,
    });
  });

  return utilization;
}
