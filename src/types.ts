export type UserRole =
  | 'MANAGEMENT'
  | 'STRATEGY_PROCESS'
  | 'OPERATIONS'
  | 'FINANCE'
  | 'MASTER_DATA_STEWARD'
  | 'ADMIN';

export type MasterQuadrant = 'KEEP' | 'REVIEW' | 'CONSOLIDATE' | 'RETIRE';

export type CostClassification = 'FORMULATED' | 'NON_FORMULATED';

export type CostKindType =
  | 'BASIC_TRUCKING'
  | 'FUEL_SOLAR'
  | 'TOLL_FEE'
  | 'FERRY_PENYEBERANGAN'
  | 'MEAL_ALLOWANCE'
  | 'LIFT_OFF_DEPO'
  | 'REEFER_PLUGIN'
  | 'LOADING_UNLOADING'
  | 'ESCORT_KAWALAN'
  | 'GATE_PASS'
  | 'WAITING_DEMURRAGE'
  | 'WORKSHOP_HSE'
  | 'ADMIN_OVERHEAD';

export type ActivityPhase = 'PRE_TRIP' | 'ON_TRIP' | 'POST_TRIP';

export type ODCStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'VALIDATED'
  | 'APPROVED'
  | 'REWORK_NEEDED'
  | 'EXECUTING'
  | 'COMPLETED';

export type RecommendationCategory =
  | 'QUICK_WIN'
  | 'STRATEGIC'
  | 'FOUNDATION'
  | 'DEFER'
  | 'DO_NOT_CHANGE';

export type KMValidationStatus = 'VALID' | 'REVIEW' | 'INVALID';

export interface VehicleCategory {
  id: string;
  name: string;
  type: string;
  payloadTons: number;
  tollGolongan: 'I' | 'II' | 'III' | 'IV' | 'V';
  fuelRatioKmL: number; // e.g. 2.8 km/L for 40ft trailer
  baseRatePerKm: number; // Rp
  hourlyStandbyRate: number; // Rp
}

export interface Depot {
  id: string;
  name: string;
  code: string;
  locationCity: string;
  fixedLiftOffCost: number; // e.g. Rp 250,000
  operator: string;
  active: boolean;
  accuracyScore: number;
}

export interface LocatorPoint {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  province: string;
  latitude: number;
  longitude: number;
  accuracyScore: number; // 0-100
  hasMismatch: boolean;
  customerId?: string;
  customerName?: string;
  lastVerifiedDate: string;
  locatorRole?: 'ORIGIN' | 'DESTINATION' | 'DEPOT' | 'PARKING' | 'LOADING' | 'UNLOADING' | 'PORT' | 'WAREHOUSE';
  moboDriveActualLat?: number;
  moboDriveActualLng?: number;
  locationSequence?: number;
}

export interface RouteMaster {
  id: string;
  code: string;
  name: string;
  originId: string;
  originName: string;
  destinationId: string;
  destinationName: string;
  standardKm: number;
  erpKm: number;
  pdcaCalculatedKm: number;
  moboDriveActualKm?: number;
  actualKmSource?: 'MOBODRIVE' | 'TO_BE_CONFIRMED';
  actualKmCapturedAt?: string;
  kmVariancePct: number;
  kmStatus: KMValidationStatus;
  tollPointsCount: number;
  standardTollCost: number;
  ferryRequired: boolean;
  ferryCost: number;
  estimatedLeadTimeHours: number;
  depotId?: string;
  depotName?: string;
  depotLiftOffCost: number;
  roadCondition: 'SMOOTH_HIGHWAY' | 'MIXED_TOLL_ARTERIAL' | 'SEVERE_CONGESTION' | 'MOUNTAINOUS';
  active: boolean;
  usageCount: number;
}

export interface RouteTripSegment {
  id: string;
  tripId: string;
  routeId: string;
  sequence: number;
  fromLocatorId: string;
  fromLocatorName: string;
  toLocatorId: string;
  toLocatorName: string;
  activityName: string;
  segmentType: 'LOADING' | 'UNLOADING' | 'PARKING' | 'STAGING' | 'DRIVING' | 'GATE_CHECK';
  actualKm: number;
  actualMinutes: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
}

export interface ShipmentTrip {
  id: string;
  routeId: string;
  tripCode: string;
  customerName: string;
  actualKm: number;
  totalCostRp: number;
  budgetRp: number;
  leakageRp: number;
  status: 'ON_TIME' | 'DELAY' | 'REVIEW';
  actualDepartureAt: string;
  actualArrivalAt: string;
  routePoints: Array<{
    locatorId: string;
    name: string;
    role: string;
    lat: number;
    lng: number;
    stepLabel: string;
  }>;
  segments: RouteTripSegment[];
}

export interface CustomerBudgetRow {
  customerId: string;
  customerName: string;
  routeSegment: string;
  budgetRp: number;
  spendRp: number;
  leakageRp: number;
  status: 'WITHIN_BUDGET' | 'REVIEW' | 'OVER_BUDGET';
}

export interface ShipmentActivity {
  id: string;
  code: string;
  name: string;
  phase: ActivityPhase;
  raciResponsible: 'OPS' | 'COMMS' | 'HSE' | 'WORKSHOP' | 'VM' | 'DRIVER';
  standardDurationMins: number;
  isMandatory: boolean;
  isValueAdded: boolean;
  defaultCostItemId?: string;
  defaultCostItemName?: string;
  costClassification: CostClassification;
  triggerEvent: string; // e.g. "MoboDrive Geofence Entry"
  description: string;
  automated?: boolean;
  locatorPointId?: string;
  actualStartAt?: string;
  actualEndAt?: string;
}

export interface CostItem {
  id: string;
  code: string;
  name: string;
  kind: CostKindType;
  classification: CostClassification;
  driverType: 'DISTANCE_KM' | 'TOLL_GATES' | 'TIME_HOURS' | 'DAYS_OVERNIGHT' | 'FIXED_TRIP' | 'CONTAINER_LIFT' | 'EXCEPTION_MANUAL';
  formulaTemplate: string;
  standardUnitRate: number;
  usageCount: number;
  activeCount: number;
  duplicateCount: number;
  qualityScore: number; // 0-100
  mappedActivityId?: string;
  mappedActivityName?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'RETIRED' | 'REVIEW';
  redundancyTag: 'HEALTHY' | 'REDUNDANT_DUPLICATE' | 'ZERO_USAGE' | 'MISSING_MAPPING' | 'RULE_CONVERT_CANDIDATE' | 'RETIRE_CANDIDATE';
  recommendation: 'KEEP' | 'CONSOLIDATE' | 'RETIRE' | 'CONVERT_TO_RULE' | 'DERIVE';
  costDependency: string;
  processDependency: string;
  lastUsedDate: string;
}

export interface CostRule {
  id: string;
  ruleCode: string;
  name: string;
  version: string;
  priority: number;
  status: 'ACTIVE' | 'TESTING' | 'DRAFT' | 'INACTIVE';
  effectiveDate: string;
  expiryDate: string;
  owner: string;
  approver: string;
  conditions: {
    vehicleCategories?: string[];
    minDistanceKm?: number;
    maxDistanceKm?: number;
    cargoTypes?: string[];
    serviceLevels?: string[];
    customerIds?: string[];
  };
  costComponent: CostKindType;
  formulaDescription: string;
  baseMultiplier: number;
  rateVariable: string;
  appliedCount: number;
  simulatedSavingsRp: number;
}

export interface ODCCostLine {
  id: string;
  component: CostKindType;
  name: string;
  classification: CostClassification;
  driver: string;
  formula: string;
  rate: number;
  quantity: number;
  unit: string;
  subtotalRp: number;
  source: 'COST_RULE' | 'ROUTE_ENGINE' | 'DEPOT_MASTER' | 'MOBODRIVE_EVENT' | 'MANUAL_PV_EXTRA' | 'EXCEPTION_RULE';
  sourceEntityRef: string;
  traceableRuleId?: string;
  isRecoverable: boolean;
  isUnbilled: boolean;
  billingStatus: 'BILLED' | 'UNBILLED' | 'DISPUTED' | 'RECOVERED';
  notes?: string;
}

export interface ODCRecord {
  id: string;
  odcNumber: string;
  customerId: string;
  customerName: string;
  serviceRequirement: string;
  originId: string;
  originName: string;
  destinationId: string;
  destinationName: string;
  vehicleCategoryId: string;
  vehicleCategoryName: string;
  cargoType: string;
  weightTons: number;
  volumeCbm: number;
  depotId?: string;
  depotName?: string;
  routeId: string;
  distanceKm: number;
  estimatedLeadTimeHours: number;
  actualLeadTimeHours?: number;
  isOvernight: boolean; // >24 hours
  totalCostRp: number;
  basicCostRp: number;
  tollCostRp: number;
  ferryCostRp: number;
  activityCostRp: number;
  depotCostRp: number;
  extraCostRp: number;
  unbilledLeakageRp: number;
  status: ODCStatus;
  validationScore: number; // 0-100
  similarityWithHistorical: {
    matchFound: boolean;
    similarOdcNumber?: string;
    similarityPct: number;
    historicalCostRp?: number;
    costVariancePct?: number;
  };
  costLines: ODCCostLine[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  approvedBy?: string;
  validationChecks: {
    customerValid: boolean;
    locationValid: boolean;
    routeValid: boolean;
    distanceValidated: boolean;
    vehicleMapped: boolean;
    shipmentActivityMapped: boolean;
    costRuleAvailable: boolean;
    leadTimeValidated: boolean;
    depotMapped: boolean;
    extraCostReviewed: boolean;
  };
}

export interface ExtraCostRecord {
  id: string;
  odcNumber: string;
  customerName: string;
  routeSummary: string;
  type: string;
  reason: string;
  source: 'SHIPMENT_ACTIVITY' | 'DRIVER_PV' | 'TERMINAL_EXCEPTION' | 'DEPOT_HANDLING' | 'SECURITY';
  estimatedAmountRp: number;
  actualAmountRp: number;
  varianceRp: number;
  isRecoverable: boolean;
  isCustomerChargeable: boolean;
  chargeStatus: 'BILLED' | 'UNBILLED_LEAKAGE' | 'PENDING_APPROVAL' | 'RECOVERED_DEBIT_NOTE';
  approvalStatus: 'APPROVED' | 'PENDING' | 'REJECTED';
  dateReported: string;
}

export interface MasterRationalizationItem {
  id: string;
  masterType: 'COST_ITEM' | 'COST_ACTIVITY' | 'ACTIVITY_OBJECT' | 'OPERATIONAL_ROUTE' | 'COMMERCIAL_ROUTE' | 'DEPOT_MAPPING' | 'LOCATOR_POINT' | 'TOLL_GATE';
  name: string;
  businessValueScore: number; // 0-100 (X)
  maintenanceComplexityScore: number; // 0-100 (Y)
  quadrant: MasterQuadrant;
  totalRecords: number;
  activeUsageCount: number;
  zeroUsageCount: number;
  duplicateCount: number;
  affectedProcessesCount: number;
  affectedCostRulesCount: number;
  migrationEffort: 'LOW' | 'MEDIUM' | 'HIGH';
  operationalRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  potentialSimplificationPct: number;
  actionRecommendation: string;
  evidence: string;
}

export interface BPMNActivityItem {
  id: string;
  name: string;
  phase: string;
  lane: string;
  classification: 'MANUAL' | 'SEMI_AUTOMATED' | 'AUTOMATED' | 'CANDIDATE_FOR_REMOVAL';
  asIsTimeMinutes: number;
  toBeTimeMinutes: number;
  linkedErpMaster: string;
  errorReworkRisk: 'HIGH' | 'MEDIUM' | 'LOW';
  toBelnnovation: string;
  notes: string;
}

export interface ExecutiveRecommendation {
  id: string;
  title: string;
  category: RecommendationCategory;
  whyStatement: string;
  expectedImpact: {
    manualReductionPct: number;
    costLeakageSavedRp: number;
    masterCountReductionPct: number;
    leadTimeVarianceReductionPct: number;
  };
  evidenceSource: string;
  effort: 'LOW' | 'MEDIUM' | 'HIGH';
  risk: 'LOW' | 'MEDIUM' | 'HIGH';
  actionButtonLabel: string;
}

export interface DataQualityAudit {
  masterName: string;
  totalRecords: number;
  completeness: number; // %
  uniqueness: number; // %
  validity: number; // %
  consistency: number; // %
  referentialIntegrity: number; // %
  overallScore: number; // %
  criticalIssuesCount: number;
  actionableIssueText: string;
}

export interface WhatIfScenario {
  id: string;
  question: string;
  targetMaster: string;
  affectedRecords: number;
  affectedProcesses: string[];
  affectedCostRules: string[];
  affectedOdcCount: number;
  operationalRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  costRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  migrationEffort: 'LOW' | 'MEDIUM' | 'HIGH';
  annualSavingsRp: number;
  reworkReductionPct: number;
  recommendationText: string;
  evidenceText: string;
  status: 'PROPOSED' | 'CONFIRMED' | 'TO_BE_CONFIRMED';
}
