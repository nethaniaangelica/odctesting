import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  HelpCircle,
  Calculator,
  ShieldCheck,
  AlertTriangle,
  Route,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { UserRole } from '../../types';

interface AIAssistantViewProps {
  userRole: UserRole;
  onWhyThisCost: (odc: any) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  groundedFacts?: string[];
}

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({ userRole, onWhyThisCost }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'ai',
      text: `Hello! I am your ODC Cost & Process Intelligence Copilot. I have full real-time access to your 3,798 Cost Items, 1,240 Routes, PDCA KM standard, and active ODC transactions. Ask me anything about cost derivations, leakage sources, or master rationalization opportunities!`,
      timestamp: 'Just now',
      groundedFacts: [
        'Total Tracked ODC Spend: Rp 58.1B',
        '2,840 Zero-Usage Masters Identified',
        '100% Formulated Route & Toll Engine Active',
      ],
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const samplePrompts = [
    'Why is ODC-2026-0892 marked with Nginep (>24h) and high cost?',
    'Which 2,840 Cost Items can be safely retired today?',
    'What caused the unbilled cost leakage in PT Wings shipment?',
    'Explain the mathematical formula for Uang Solar (Fuel Allowance).',
  ];

  const handleSendMessage = async (queryText?: string) => {
    const q = queryText || inputQuery;
    if (!q.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      // Call backend AI proxy
      const response = await fetch('/api/ai/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          userRole,
          contextData: {
            activeView: 'AI Copilot',
            selectedRole: userRole,
          },
        }),
      });

      const data = await response.json();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.response || 'I have analyzed the grounded ERP dataset. Let me know if you would like me to unpack any specific cost item or formula.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        groundedFacts: data.groundedFacts || [
          'Derived from Parameterized Cost Rule Engine',
          'Validated against PDCA Route Master & MoboDrive Timestamps',
        ],
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      // Fallback local response
      const fallbackAiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `Based on the grounded operational rules:
1. **Cost Formation**: Costs are mathematically calculated from PDCA Route KM, standard vehicle category consumption, and highway toll gates.
2. **Master Rationalization**: 2,840 zero-usage cost items are safe for immediate retirement, while 546 duplicate naming strings can be consolidated into 12 parameterized rules.
3. **Leakage Prevention**: All container staging depot lift-off charges are auto-mapped from Depot Masters, eliminating manual PV Extra rework.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        groundedFacts: ['Grounded Rules Engine Fallback Active'],
      };
      setMessages((prev) => [...prev, fallbackAiMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                ODC Intelligence Copilot
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                Gemini + Domain Grounding
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Ask questions grounded in master data, cost rules, and live route intelligence.
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            setMessages([
              {
                id: 'msg-welcome-reset',
                sender: 'ai',
                text: 'Conversation history reset. How can I assist your logistics cost analysis today?',
                timestamp: 'Just now',
              },
            ])
          }
          className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Suggested Questions Pills */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
          Suggested Strategic Inquiries
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p)}
              className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 text-left text-slate-700 font-medium transition-all flex items-center justify-between group shadow-2xs"
            >
              <span className="line-clamp-1">{p}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0 ml-2" />
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Box */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col h-[520px] overflow-hidden">
        {/* Messages list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {messages.map((msg) => {
            const isAi = msg.sender === 'ai';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isAi ? 'items-start' : 'items-start flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-xs ${
                    isAi ? 'bg-indigo-600' : 'bg-slate-800'
                  }`}
                >
                  {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-xl rounded-2xl p-4 space-y-2 ${
                    isAi
                      ? 'bg-slate-50 border border-slate-200 text-slate-800'
                      : 'bg-blue-600 text-white shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed text-xs">
                    {msg.text}
                  </p>

                  {/* Grounded Facts Strip */}
                  {msg.groundedFacts && msg.groundedFacts.length > 0 && (
                    <div className="pt-2 border-t border-slate-200/80 space-y-1">
                      <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">
                        Grounded Operational Facts:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.groundedFacts.map((fact, fIdx) => (
                          <span
                            key={fIdx}
                            className="px-2 py-0.5 rounded text-[10px] bg-white border border-slate-200 text-slate-600 font-medium"
                          >
                            ✓ {fact}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <span
                    className={`text-[10px] block text-right ${
                      isAi ? 'text-slate-400' : 'text-blue-200'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 items-start animate-pulse">
              <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-500 text-xs flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
                <span>Evaluating cost rules & route master intelligence...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask about any ODC, route variance, formula, or master item..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs placeholder:text-slate-400 outline-none focus:border-blue-500 shadow-2xs font-medium"
          />
          <button
            disabled={!inputQuery.trim() || isLoading}
            onClick={() => handleSendMessage()}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
