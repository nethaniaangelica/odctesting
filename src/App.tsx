import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { WhyThisCostDrawer } from './components/WhyThisCostDrawer';
import { DetailDrawer } from './components/DetailDrawer';
import { CSVImportModal } from './components/CSVImportModal';

// Views
import { OverviewDashboard } from './components/views/OverviewDashboard';
import { ODCWizard } from './components/views/ODCWizard';
import { ODCReviewList } from './components/views/ODCReviewList';
import { RouteIntelligence } from './components/views/RouteIntelligence';
import { CostIntelligence } from './components/views/CostIntelligence';
import { CostRulesBuilder } from './components/views/CostRulesBuilder';
import { CostLeakageView } from './components/views/CostLeakageView';
import { MasterDataExplorer } from './components/views/MasterDataExplorer';
import { MasterRationalizationView } from './components/views/MasterRationalizationView';
import { WhatIfSimulator } from './components/views/WhatIfSimulator';
import { DataQualityView } from './components/views/DataQualityView';
import { BPMNAnalyzerView } from './components/views/BPMNAnalyzerView';
import { ShipmentActivityTimeline } from './components/views/ShipmentActivityTimeline';
import { ExecutiveReportsView } from './components/views/ExecutiveReportsView';
import { AIAssistantView } from './components/views/AIAssistantView';
import { DataManagement } from './components/views/DataManagement';

import { HISTORICAL_ODCS, EXECUTIVE_RECOMMENDATIONS, REAL_SHIPMENT_TRIPS, CUSTOMER_BUDGETS, ROUTE_MASTERS } from './data/mockData';
import { UserRole, ODCRecord, ODCCostLine, ShipmentTrip, CustomerBudgetRow, RouteTripSegment } from './types';

export default function App() {
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [userRole, setUserRole] = useState<UserRole>('MANAGEMENT');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // App-level Live State for ODCs
  const [odcsList, setOdcsList] = useState<ODCRecord[]>(HISTORICAL_ODCS);
  const [shipmentTrips, setShipmentTrips] = useState<ShipmentTrip[]>(REAL_SHIPMENT_TRIPS);
  const [customerBudgets, setCustomerBudgets] = useState<CustomerBudgetRow[]>(CUSTOMER_BUDGETS);

  // Modals & Drawers State
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [csvImportModalOpen, setCsvImportModalOpen] = useState(false);
  const [whyCostDrawerOpen, setWhyCostDrawerOpen] = useState(false);
  const [selectedWhyCostOdc, setSelectedWhyCostOdc] = useState<ODCRecord | null>(null);
  const [selectedWhyCostLine, setSelectedWhyCostLine] = useState<ODCCostLine | null>(null);

  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [detailEntityType, setDetailEntityType] = useState<string | null>(null);
  const [detailEntityData, setDetailEntityData] = useState<any>(null);

  // Keyboard shortcut for Command+K search
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenWhyThisCost = (odc: ODCRecord, line?: ODCCostLine) => {
    setSelectedWhyCostOdc(odc);
    setSelectedWhyCostLine(line || null);
    setWhyCostDrawerOpen(true);
  };

  const handleInspectEntity = (type: string, data: any) => {
    setDetailEntityType(type);
    setDetailEntityData(data);
    setDetailDrawerOpen(true);
  };

  const handleFinishWizard = (newOdc: ODCRecord) => {
    setOdcsList([newOdc, ...odcsList]);
    setActiveView('odc-review');
    handleOpenWhyThisCost(newOdc);
  };

  const handleImportTrips = (trips: ShipmentTrip[]) => {
    setShipmentTrips((prev) => [...trips, ...prev]);
  };

  const handleImportBudgets = (budgets: CustomerBudgetRow[]) => {
    setCustomerBudgets((prev) => [...budgets, ...prev]);
  };

  const handleImportSegments = (segments: RouteTripSegment[]) => {
    // Update shipment trips with the new segments
    setShipmentTrips((prev) =>
      prev.map((trip) => ({
        ...trip,
        segments: [...(trip.segments || []), ...segments.filter((s) => s.tripId === trip.id)],
      }))
    );
  };

  const handleDeleteTrip = (tripId: string) => {
    setShipmentTrips((prev) => prev.filter((t) => t.id !== tripId));
  };

  const handleUpdateBudget = (updatedBudget: CustomerBudgetRow) => {
    setCustomerBudgets((prev) =>
      prev.map((b) => (b.customerId === updatedBudget.customerId ? updatedBudget : b))
    );
  };

  const getViewTitle = () => {
    switch (activeView) {
      case 'dashboard':
        return 'Executive Overview Dashboard';
      case 'odc-wizard':
        return 'Frictionless ODC Smart Wizard';
      case 'odc-review':
        return 'ODC Review & Similarity Benchmarks';
      case 'route-intelligence':
        return 'Route Master & KM Validation Engine';
      case 'cost-intelligence':
        return 'Cost Intelligence & Formation Engine';
      case 'cost-rules':
        return 'No-Code Cost Rules Builder';
      case 'cost-leakage':
        return 'Cost Leakage & Unbilled Reconciliation';
      case 'master-explorer':
        return 'Master Data Inventory & Explorer';
      case 'master-rationalization':
        return 'Master Data 2×2 Rationalization Matrix';
      case 'what-if':
        return 'What-If Scenario & Impact Simulator';
      case 'data-quality':
        return 'Master Data Quality & Hygiene Auditor';
      case 'bpmn-analyzer':
        return 'BPMN Process Flow & AS-IS vs TO-BE';
      case 'shipment-activity':
        return 'Shipment Activity & MoboDrive Timeline';
      case 'executive-reports':
        return 'Transformation Roadmap & Reports';
      case 'data-management':
        return 'Data Management & Cost Reconciliation';
      case 'ai-assistant':
        return 'ODC Intelligence Copilot (Gemini)';
      default:
        return 'ODC Control Tower';
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex overflow-hidden font-sans antialiased text-slate-900">
      {/* Responsive Left Navigation Sidebar */}
      <Sidebar
        activeView={activeView}
        onSelectView={(viewId) => {
          setActiveView(viewId);
          setIsMobileSidebarOpen(false);
        }}
        userRole={userRole}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header Bar */}
        <TopNav
          userRole={userRole}
          onChangeRole={setUserRole}
          onOpenSearch={() => setSearchModalOpen(true)}
          onOpenWizard={() => setActiveView('odc-wizard')}
          onOpenAssistant={() => setActiveView('ai-assistant')}
          onOpenCSVImport={() => setCsvImportModalOpen(true)}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          activeViewTitle={getViewTitle()}
        />

        {/* Scrollable View Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {activeView === 'dashboard' && (
              <OverviewDashboard
                userRole={userRole}
                onNavigate={setActiveView}
                onOpenODC={(odc) => handleInspectEntity('ODC', odc)}
                onWhyThisCost={handleOpenWhyThisCost}
                onOpenRecommendation={(rec) => {
                  if (rec.id === 'rec-01') setActiveView('data-quality');
                  else if (rec.id === 'rec-02') setActiveView('cost-rules');
                  else if (rec.id === 'rec-03') setActiveView('route-intelligence');
                  else setActiveView('master-rationalization');
                }}
                shipmentTrips={shipmentTrips}
                customerBudgets={customerBudgets}
              />
            )}

            {activeView === 'odc-wizard' && (
              <ODCWizard
                onFinish={handleFinishWizard}
                onCancel={() => setActiveView('dashboard')}
                onWhyThisCost={handleOpenWhyThisCost}
              />
            )}

            {activeView === 'odc-review' && (
              <ODCReviewList
                odcs={odcsList}
                onOpenODC={(odc) => handleInspectEntity('ODC', odc)}
                onWhyThisCost={handleOpenWhyThisCost}
                onCreateNew={() => setActiveView('odc-wizard')}
              />
            )}

            {activeView === 'route-intelligence' && (
              <RouteIntelligence
                onInspectRoute={(route) => handleInspectEntity('ROUTE', route)}
                onInspectLocator={(loc) => handleInspectEntity('LOCATOR', loc)}
                shipmentTrips={shipmentTrips}
              />
            )}

            {activeView === 'cost-intelligence' && (
              <CostIntelligence
                onNavigateToRules={() => setActiveView('cost-rules')}
                onNavigateToLeakage={() => setActiveView('cost-leakage')}
              />
            )}

            {activeView === 'cost-rules' && (
              <CostRulesBuilder
                onInspectRule={(rule) => handleInspectEntity('COST_RULE', rule)}
              />
            )}

            {activeView === 'cost-leakage' && (
              <CostLeakageView onWhyThisCost={handleOpenWhyThisCost} />
            )}

            {activeView === 'master-explorer' && (
              <MasterDataExplorer
                onInspectEntity={handleInspectEntity}
                onNavigateToMatrix={() => setActiveView('master-rationalization')}
              />
            )}

            {activeView === 'master-rationalization' && (
              <MasterRationalizationView
                onInspectItem={(item) => handleInspectEntity('RATIONALIZATION', item)}
                onSimulateWhatIf={() => setActiveView('what-if')}
              />
            )}

            {activeView === 'what-if' && <WhatIfSimulator />}

            {activeView === 'data-quality' && <DataQualityView />}

            {activeView === 'bpmn-analyzer' && <BPMNAnalyzerView />}

            {activeView === 'shipment-activity' && <ShipmentActivityTimeline />}

            {activeView === 'executive-reports' && <ExecutiveReportsView />}

            {activeView === 'ai-assistant' && (
              <AIAssistantView
                userRole={userRole}
                onWhyThisCost={handleOpenWhyThisCost}
              />
            )}

            {activeView === 'data-management' && (
              <DataManagement
                trips={shipmentTrips}
                budgets={customerBudgets}
                routes={ROUTE_MASTERS}
                onDeleteTrip={handleDeleteTrip}
                onUpdateBudget={handleUpdateBudget}
                onRefresh={() => {
                  // Trigger any refresh logic if needed
                }}
              />
            )}
          </div>
        </main>
      </div>

      {/* Global Quick Search Modal (Command+K) */}
      <GlobalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectEntity={handleInspectEntity}
      />

      {/* "Why This Cost?" Traceability Explainer Drawer */}
      <WhyThisCostDrawer
        isOpen={whyCostDrawerOpen}
        onClose={() => setWhyCostDrawerOpen(false)}
        odc={selectedWhyCostOdc}
        selectedLine={selectedWhyCostLine}
      />

      {/* Generic Contextual Entity Inspector Drawer */}
      <DetailDrawer
        isOpen={detailDrawerOpen}
        onClose={() => setDetailDrawerOpen(false)}
        entityType={detailEntityType}
        data={detailEntityData}
        onTriggerWhatIf={() => setActiveView('what-if')}
        onWhyThisCost={handleOpenWhyThisCost}
      />

      {/* CSV Import Modal */}
      <CSVImportModal
        isOpen={csvImportModalOpen}
        onClose={() => setCsvImportModalOpen(false)}
        onImportTrips={handleImportTrips}
        onImportBudgets={handleImportBudgets}
        onImportSegments={handleImportSegments}
      />
    </div>
  );
}
