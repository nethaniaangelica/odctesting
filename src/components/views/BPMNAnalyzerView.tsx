import React, { useState } from 'react';
import {
  Workflow,
  Upload,
  FileCode,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  Clock,
  Sparkles,
  Sliders,
  Layers,
  Code,
  FileText,
} from 'lucide-react';

export const BPMNAnalyzerView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'VISUAL' | 'XML_CODE' | 'AS_IS_TO_BE'>('VISUAL');
  const [selectedNode, setSelectedNode] = useState<string>('cost_rule_engine');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const [bpmnXml, setBpmnXml] = useState<string>(`<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" 
                  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" 
                  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" 
                  xmlns:di="http://www.omg.org/spec/DD/20100524/DI" 
                  id="Definitions_ODC_Tower" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Process_ODC_Formulated" isExecutable="true">
    <bpmn:startEvent id="Start_Inquiry" name="1. Customer Shipment Request"/>
    <bpmn:sequenceFlow id="Flow_1" sourceRef="Start_Inquiry" targetRef="Task_Route_Match"/>
    
    <bpmn:serviceTask id="Task_Route_Match" name="2. Auto Route &amp; PDCA KM Matching"/>
    <bpmn:sequenceFlow id="Flow_2" sourceRef="Task_Route_Match" targetRef="Task_Cost_Rules"/>
    
    <bpmn:businessRuleTask id="Task_Cost_Rules" name="3. Dynamic Cost Formation Rule Engine"/>
    <bpmn:sequenceFlow id="Flow_3" sourceRef="Task_Cost_Rules" targetRef="Gateway_Similarity"/>
    
    <bpmn:exclusiveGateway id="Gateway_Similarity" name="4. Historical Similarity &gt;95%?"/>
    <bpmn:sequenceFlow id="Flow_4a" name="Yes (Reuse)" sourceRef="Gateway_Similarity" targetRef="Task_Auto_Approve"/>
    <bpmn:sequenceFlow id="Flow_4b" name="No (Review)" sourceRef="Gateway_Similarity" targetRef="Task_Planner_Review"/>
    
    <bpmn:serviceTask id="Task_Auto_Approve" name="5. Auto-Approve ODC Record"/>
    <bpmn:userTask id="Task_Planner_Review" name="5b. Exception Approval &amp; PV Review"/>
    
    <bpmn:sequenceFlow id="Flow_5" sourceRef="Task_Auto_Approve" targetRef="Task_MoboDrive"/>
    <bpmn:sequenceFlow id="Flow_5b" sourceRef="Task_Planner_Review" targetRef="Task_MoboDrive"/>
    
    <bpmn:serviceTask id="Task_MoboDrive" name="6. MoboDrive Driver Execution &amp; Timestamps"/>
    <bpmn:sequenceFlow id="Flow_6" sourceRef="Task_MoboDrive" targetRef="Task_POD_Reconcile"/>
    
    <bpmn:serviceTask id="Task_POD_Reconcile" name="7. Automated POD &amp; Unbilled Leakage Recovery"/>
    <bpmn:sequenceFlow id="Flow_7" sourceRef="Task_POD_Reconcile" targetRef="End_Settled"/>
    
    <bpmn:endEvent id="End_Settled" name="8. Trip Settled &amp; Billed to Customer"/>
  </bpmn:process>
</bpmn:definitions>`);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setBpmnXml(event.target.result as string);
        }
      };
      reader.readAsText(file);
    }
  };

  const processNodes = [
    {
      id: 'inquiry',
      num: 1,
      title: 'Customer Inquiry',
      actor: 'Logistics Planner',
      asIsDuration: '15 mins',
      toBeDuration: '1 min',
      desc: 'Capture shipper requirements, weight, and delivery timeline.',
    },
    {
      id: 'route_match',
      num: 2,
      title: 'Route & PDCA KM Match',
      actor: 'System Engine',
      asIsDuration: '30 mins (Manual)',
      toBeDuration: 'Instant',
      desc: 'GPS verified corridor, standard distance, and toll gate calculation.',
    },
    {
      id: 'cost_rule_engine',
      num: 3,
      title: 'Dynamic Cost Rules',
      actor: 'Rule Engine',
      asIsDuration: '45 mins (PV manual)',
      toBeDuration: 'Instant',
      desc: 'Formulaic breakdown: Fuel, Toll, Meal, Depot Lift-Off auto-included.',
    },
    {
      id: 'similarity_check',
      num: 4,
      title: 'Similarity & Validation',
      actor: 'Control Tower',
      asIsDuration: '25 mins (BA Disputes)',
      toBeDuration: '2 mins',
      desc: 'Prevents duplicate ODC creation and checks historical rate consistency.',
    },
    {
      id: 'mobodrive_dispatch',
      num: 5,
      title: 'MoboDrive Execution',
      actor: 'Driver / Fleet',
      asIsDuration: 'Live Tracking',
      toBeDuration: 'Live Geofence',
      desc: 'Real-time GPS timestamps, lead-time tracking, and overnight flag.',
    },
    {
      id: 'pod_reconciliation',
      num: 6,
      title: 'POD & Leakage Settlement',
      actor: 'Finance / Invoicing',
      asIsDuration: '22 Days',
      toBeDuration: '1.8 Days',
      desc: 'Reconcile actual extra expenses and auto-generate customer debit notes.',
    },
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
              BPMN PROCESS INTELLIGENCE
            </span>
            <span className="text-xs text-slate-400">
              AS-IS vs TO-BE Workflow Analysis
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            BPMN Process Flow & Complexity Analyzer
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Visualize the end-to-end ODC lifecycle from inquiry to POD settlement. Compare manual legacy bottlenecks with automated rule execution.
          </p>
        </div>

        {/* Action Tabs & Upload */}
        <div className="flex items-center gap-2.5">
          <div className="flex p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('VISUAL')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'VISUAL' ? 'bg-white text-purple-700 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Interactive Flow
            </button>
            <button
              onClick={() => setActiveTab('AS_IS_TO_BE')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'AS_IS_TO_BE' ? 'bg-white text-purple-700 shadow-2xs' : 'text-slate-600'
              }`}
            >
              AS-IS vs TO-BE Metrics
            </button>
            <button
              onClick={() => setActiveTab('XML_CODE')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'XML_CODE' ? 'bg-white text-purple-700 shadow-2xs' : 'text-slate-600'
              }`}
            >
              BPMN 2.0 XML
            </button>
          </div>

          <label className="px-3.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5" />
            <span>{uploadedFileName ? uploadedFileName.substring(0, 12) + '...' : 'Upload BPMN'}</span>
            <input
              type="file"
              accept=".bpmn,.xml"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* AS-IS vs TO-BE Executive Benchmark Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 text-xs">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            ODC Cycle Time
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold font-mono text-purple-900">12 Mins</span>
            <span className="text-[11px] text-slate-400 line-through">145 Mins</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">-91.7% Touchpoint Reduction</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Manual Approval Steps
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold font-mono text-purple-900">1 Step</span>
            <span className="text-[11px] text-slate-400 line-through">8 Steps</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">Eliminated PV Extra loop</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Depot Lift-Off Rework
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold font-mono text-emerald-700">0 Mins</span>
            <span className="text-[11px] text-slate-400 line-through">35 Mins</span>
          </div>
          <span className="text-[11px] text-slate-500">Auto-mapped depot tariff</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Billing Dispute Rate
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold font-mono text-blue-900">&lt; 0.5%</span>
            <span className="text-[11px] text-slate-400 line-through">18.4%</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">Pre-validated similarity</span>
        </div>
      </div>

      {/* TAB 1: INTERACTIVE PROCESS FLOW DIAGRAM */}
      {activeTab === 'VISUAL' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  Target (TO-BE) Formulated ODC Process Pipeline
                </h3>
                <p className="text-xs text-slate-400">
                  Click any stage to inspect execution rules, cycle time, and RACI responsibilities
                </p>
              </div>
              <span className="px-2.5 py-1 rounded text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                BPMN 2.0 Compliant
              </span>
            </div>

            {/* Horizontal Step Cards Flow */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
              {processNodes.map((node) => {
                const isSelected = selectedNode === node.id;
                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNode(node.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                      isSelected
                        ? 'bg-purple-50/80 border-purple-600 ring-2 ring-purple-500/20 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[10px]">
                        {node.num}
                      </span>
                      <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded">
                        {node.toBeDuration}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 text-xs line-clamp-2">
                        {node.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {node.actor}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-100 text-[10.5px] text-slate-500 line-clamp-2">
                      {node.desc}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AS-IS VS TO-BE METRICS */}
      {activeTab === 'AS_IS_TO_BE' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">
              Detailed AS-IS vs TO-BE Complexity Comparison
            </h3>
            <p className="text-xs text-slate-500">
              Detailed operational metrics gathered from field logs, PV extra analysis, and planner interviews.
            </p>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-2.5 px-3.5">Process Dimension</th>
                  <th className="py-2.5 px-3">AS-IS Legacy State</th>
                  <th className="py-2.5 px-3">TO-BE Target Architecture</th>
                  <th className="py-2.5 px-3 text-right">Net Improvement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-3.5 font-bold text-slate-900">
                    Total Master Items in Catalog
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    3,798 Cost Items (2,840 zero-usage duplicates)
                  </td>
                  <td className="py-3 px-3 text-purple-900 font-semibold">
                    12 Parameterized Dynamic Rules + 412 Clean Masters
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-emerald-700">
                    -88.8% Master Overhead
                  </td>
                </tr>

                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-3.5 font-bold text-slate-900">
                    Route Distance & Fuel Allocation
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    ERP Static Distance (frequently inflated by 15-22%)
                  </td>
                  <td className="py-3 px-3 text-purple-900 font-semibold">
                    PDCA Validated GPS Engine + Automatic Toll Plaza Sum
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-emerald-700">
                    Saves Rp 840M Annual Fuel Leakage
                  </td>
                </tr>

                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-3.5 font-bold text-slate-900">
                    Container Depot Lift-Off Handling
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    Omitted from ODC → Added manually via PV Extra later
                  </td>
                  <td className="py-3 px-3 text-purple-900 font-semibold">
                    Depot Lift-Off Auto-Included from Depot Master Tariff
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-emerald-700">
                    100% Elimination of PV Rework
                  </td>
                </tr>

                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-3.5 font-bold text-slate-900">
                    Exception Expense Billing (Reefer, Escort)
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    Unbilled field receipts lost in WhatsApp threads
                  </td>
                  <td className="py-3 px-3 text-purple-900 font-semibold">
                    Automated Debit Note generator for client recharge
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-emerald-700">
                    Recovers Rp 1.48M+ per trip
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: BPMN 2.0 XML EDITOR */}
      {activeTab === 'XML_CODE' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">
              BPMN 2.0 Standard XML Specification
            </h3>
            <span className="text-[11px] font-mono text-slate-400">
              Compatible with Camunda, Signavio & Flowable
            </span>
          </div>

          <textarea
            value={bpmnXml}
            onChange={(e) => setBpmnXml(e.target.value)}
            rows={14}
            className="w-full p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      )}
    </div>
  );
};
