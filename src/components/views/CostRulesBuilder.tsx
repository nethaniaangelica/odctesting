import React, { useState } from 'react';
import {
  Sliders,
  Plus,
  Play,
  CheckCircle2,
  AlertTriangle,
  History,
  ShieldCheck,
  Code,
  Save,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { COST_RULES, VEHICLE_CATEGORIES } from '../../data/mockData';
import { CostRule } from '../../types';

interface CostRulesBuilderProps {
  onInspectRule: (rule: CostRule) => void;
}

export const CostRulesBuilder: React.FC<CostRulesBuilderProps> = ({
  onInspectRule,
}) => {
  const [rules, setRules] = useState<CostRule[]>(COST_RULES);
  const [selectedRule, setSelectedRule] = useState<CostRule>(COST_RULES[0]);
  const [testResult, setTestResult] = useState<number | null>(null);

  // New Rule draft state
  const [isEditing, setIsEditing] = useState(false);
  const [ruleName, setRuleName] = useState(selectedRule.name);
  const [formulaDescription, setFormulaDescription] = useState(selectedRule.formulaDescription);
  const [testDistance, setTestDistance] = useState(350);
  const [testRate, setTestRate] = useState(14000);

  const handleSelectRule = (r: CostRule) => {
    setSelectedRule(r);
    setRuleName(r.name);
    setFormulaDescription(r.formulaDescription);
    setTestResult(null);
  };

  const handleRunTest = () => {
    // Dynamic formula evaluator simulation
    if (selectedRule.ruleCode.includes('BASE')) {
      setTestResult(testDistance * testRate);
    } else if (selectedRule.ruleCode.includes('SOLAR')) {
      setTestResult((testDistance / 2.8) * 1.05 * 6800);
    } else if (selectedRule.ruleCode.includes('DEPO')) {
      setTestResult(250000);
    } else {
      setTestResult(testDistance * 15000);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
              NO-CODE RULE ENGINE
            </span>
            <span className="text-xs text-slate-400">
              Governance & Parameterized Rules
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Cost Rules Configuration & Builder
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Define dynamic cost formulas (WHEN / AND / THEN / CALCULATION) replacing thousands of static ERP items.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsEditing(true);
              setRuleName('New Dynamic Cost Rule');
              setFormulaDescription('WHEN Distance > 0 THEN RatePerKm * DistanceKm');
            }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Rule</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Rules List, Right Visual Builder & Tester */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Active Rules List */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
              Parameterized Rules ({rules.length})
            </h3>
            <span className="text-[11px] text-slate-400">Version Controlled</span>
          </div>

          <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
            {rules.map((rule) => {
              const isSelected = selectedRule.id === rule.id;
              return (
                <div
                  key={rule.id}
                  onClick={() => handleSelectRule(rule)}
                  className={`p-3.5 transition-colors cursor-pointer space-y-1.5 ${
                    isSelected ? 'bg-indigo-50/70 border-l-4 border-indigo-600' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-indigo-900 text-xs">
                      {rule.ruleCode}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                      {rule.version}
                    </span>
                  </div>
                  <h4 className="font-semibold text-slate-800 text-xs">{rule.name}</h4>
                  <p className="font-mono text-[11px] text-slate-500 line-clamp-1">
                    {rule.formulaDescription}
                  </p>
                  <div className="flex items-center justify-between text-[10.5px] text-slate-400 pt-1">
                    <span>Priority: {rule.priority}</span>
                    <span className="text-emerald-700 font-semibold">{rule.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Visual Rule Builder & Live Test Sandbox */}
        <div className="lg:col-span-2 space-y-6">
          {/* Rule Visual Builder Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">
                  Rule Definition Sandbox
                </span>
                <h3 className="font-bold text-slate-900 text-base">{selectedRule.name}</h3>
              </div>
              <button
                onClick={() => onInspectRule(selectedRule)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
              >
                Audit Metadata
              </button>
            </div>

            {/* Visual Condition Blocks: WHEN -> AND -> THEN */}
            <div className="space-y-3 text-xs">
              {/* WHEN */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                <span className="px-2 py-1 rounded bg-blue-600 text-white font-bold font-mono text-[10px] shrink-0">
                  WHEN
                </span>
                <div className="flex-1">
                  <span className="font-bold text-slate-700 block">Condition Criteria</span>
                  <p className="text-slate-600 text-[11px] mt-0.5">
                    Vehicle is mapped in Vehicle Master AND Distance KM &gt; 0
                  </p>
                </div>
              </div>

              {/* AND */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                <span className="px-2 py-1 rounded bg-indigo-600 text-white font-bold font-mono text-[10px] shrink-0">
                  AND
                </span>
                <div className="flex-1">
                  <span className="font-bold text-slate-700 block">Operational Driver</span>
                  <p className="text-slate-600 text-[11px] mt-0.5">
                    Driver Type = <span className="font-mono text-indigo-900 font-bold">{selectedRule.costComponent}</span>
                  </p>
                </div>
              </div>

              {/* THEN CALCULATION */}
              <div className="p-3.5 bg-indigo-50/60 rounded-xl border border-indigo-200 flex items-start gap-3">
                <span className="px-2 py-1 rounded bg-emerald-600 text-white font-bold font-mono text-[10px] shrink-0">
                  THEN
                </span>
                <div className="flex-1 space-y-1">
                  <span className="font-bold text-indigo-950 block">Mathematical Formula</span>
                  <div className="p-2.5 bg-slate-900 text-emerald-400 font-mono text-xs rounded-lg">
                    {selectedRule.formulaDescription}
                  </div>
                </div>
              </div>
            </div>

            {/* Live Testing Sandbox */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                  Rule Evaluation Test Sandbox
                </span>
                <span className="text-slate-400 text-[11px]">Simulate formula execution</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 block mb-1 font-medium">Test Distance (KM)</label>
                  <input
                    type="number"
                    value={testDistance}
                    onChange={(e) => setTestDistance(parseInt(e.target.value) || 0)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-1 font-medium">Test Base Rate (Rp/KM)</label>
                  <input
                    type="number"
                    value={testRate}
                    onChange={(e) => setTestRate(parseInt(e.target.value) || 0)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={handleRunTest}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Execute Formula Test</span>
                </button>

                {testResult !== null && (
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block uppercase">
                      Evaluated Result
                    </span>
                    <span className="text-base font-bold font-mono text-emerald-800">
                      Rp {Math.round(testResult).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Governance Info */}
            <div className="grid grid-cols-3 gap-3 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
              <div>
                <span>Owner:</span>{' '}
                <strong className="text-slate-800">{selectedRule.owner}</strong>
              </div>
              <div>
                <span>Approver:</span>{' '}
                <strong className="text-slate-800">{selectedRule.approver}</strong>
              </div>
              <div>
                <span>Effective:</span>{' '}
                <strong className="text-slate-800">{selectedRule.effectiveDate}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
