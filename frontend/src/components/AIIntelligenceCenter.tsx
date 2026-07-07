/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { detectRisks, getProjectsSummary } from '../api/ai';
import { RiskDetectionResponse, DetectedRisk, Project } from '../types';
import { 
  Sparkles, 
  RefreshCw, 
  ShieldAlert, 
  Mail, 
  FileText, 
  ChevronRight, 
  AlertCircle, 
  CheckCircle2, 
  HardHat, 
  AlertTriangle,
  ExternalLink,
  X,
  Info
} from 'lucide-react';

interface AIIntelligenceCenterProps {
  onViewProject: (id: string) => void;
  projects: Project[];
}

export default function AIIntelligenceCenter({ onViewProject, projects }: AIIntelligenceCenterProps) {
  // AI Portfolio Summary States
  const [summary, setSummary] = useState<string | null>(() => {
    return localStorage.getItem('construction_ai_summary');
  });
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  // AI Email Risk Detection States
  const [risksData, setRisksData] = useState<RiskDetectionResponse | null>(() => {
    const cached = localStorage.getItem('construction_ai_risks');
    if (!cached) return null;
    try {
      const parsed = JSON.parse(cached);
      if (parsed && Array.isArray(parsed.risks)) {
        // Clear stale cache if there are old camelCase or missing project_id fields
        const isStale = parsed.risks.some(
          (r: any) => !r.project_id || r.projectId !== undefined || r.emailId !== undefined
        );
        if (isStale) {
          localStorage.removeItem('construction_ai_risks');
          return null;
        }
      }
      return parsed;
    } catch {
      localStorage.removeItem('construction_ai_risks');
      return null;
    }
  });
  const [risksLoading, setRisksLoading] = useState(false);
  const [risksError, setRisksError] = useState<string | null>(null);

  // Modal State for viewing simulated original email body
  const [selectedEmailRisk, setSelectedEmailRisk] = useState<DetectedRisk | null>(null);

  // Collapsible panels
  const [isSummaryCollapsed, setIsSummaryCollapsed] = useState(false);
  const [isRisksCollapsed, setIsRisksCollapsed] = useState(false);

  // Run AI Summary Generation
  const handleGenerateSummary = async () => {
    setSummaryLoading(true);
    setSummaryError(null);
    try {
      const response = await getProjectsSummary();
      setSummary(response.summary);
      localStorage.setItem('construction_ai_summary', response.summary);
    } catch (err: any) {
      console.error(err);
      setSummaryError('AI module temporarily unavailable. Please verify the backend is active.');
    } finally {
      setSummaryLoading(false);
    }
  };

  // Run AI Email Risk Detection
  const handleDetectRisks = async () => {
    setRisksLoading(true);
    setRisksError(null);
    try {
      const response = await detectRisks();
      setRisksData(response);
      localStorage.setItem('construction_ai_risks', JSON.stringify(response));
    } catch (err: any) {
      console.error(err);
      setRisksError('AI risk detector temporarily unavailable. Please retry.');
    } finally {
      setRisksLoading(false);
    }
  };

  // Resolve Project Name by ID (handling both string and numeric types)
  const getProjectName = (projId: string | number): string => {
    const idStr = String(projId);
    const found = projects.find(p => String(p.id) === idStr);
    return found ? found.name : `Project ID: ${projId}`;
  };

  // Custom text formatter to support simple markdown syntax (headers, bold, bullet points)
  const formatBoldText = (text: string) => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return <strong key={i} className="font-bold text-slate-800">{part}</strong>;
      }
      return part;
    });
  };

  const parseAndFormatMarkdown = (text: string | null) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={idx} className="h-2" />;

      if (trimmed.startsWith('####')) {
        const content = trimmed.replace(/^####\s*/, '');
        return (
          <h5 key={idx} className="text-xs font-bold text-slate-800 mt-4 mb-1 uppercase tracking-wider">
            {formatBoldText(content)}
          </h5>
        );
      }
      if (trimmed.startsWith('###')) {
        const content = trimmed.replace(/^###\s*/, '');
        return (
          <h4 key={idx} className="text-sm font-bold text-slate-900 mt-5 mb-2.5 border-b border-slate-100 pb-1">
            {formatBoldText(content)}
          </h4>
        );
      }

      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const content = trimmed.substring(2);
        return (
          <div key={idx} className="flex items-start gap-2 text-slate-600 text-xs leading-relaxed my-1.5 pl-1">
            <span className="text-blue-500 mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span>{formatBoldText(content)}</span>
          </div>
        );
      }

      return (
        <p key={idx} className="text-xs text-slate-600 leading-relaxed my-1.5">
          {formatBoldText(trimmed)}
        </p>
      );
    });
  };

  return (
    <div className="space-y-6">
      {/* AI Intelligence Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600 animate-pulse" />
          <h2 className="text-lg font-bold text-slate-800">AI Intelligence Center</h2>
          <span className="px-2 py-0.5 bg-purple-50 text-purple-600 text-[10px] font-bold uppercase rounded tracking-wider border border-purple-200">
            Hermes Engine Active
          </span>
        </div>
      </div>

      {/* Two Columns Grid for AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Module 1: AI Project Summarizer */}
        <div className="bg-white rounded border border-slate-200 shadow-xs flex flex-col h-full overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-bold text-slate-800">Portfolio AI Summary</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleGenerateSummary}
                disabled={summaryLoading}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-slate-50 text-[11px] font-semibold text-slate-700 border border-slate-200 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
              >
                <RefreshCw className={`h-3 w-3 text-slate-500 ${summaryLoading ? 'animate-spin' : ''}`} />
                {summary ? 'Refresh Summary' : 'Generate Summary'}
              </button>
            </div>
          </div>

          <div className="p-5 flex-1 flex flex-col justify-between min-h-[250px]">
            {summaryLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center py-10 space-y-3">
                <RefreshCw className="h-7 w-7 text-purple-600 animate-spin" />
                <p className="text-xs font-semibold text-slate-600">Hermes is compiling portfolio metadata...</p>
                <p className="text-[10px] text-slate-400">Analyzing Active & On Hold schedules (takes 3-10s)</p>
              </div>
            ) : summaryError ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
                <h5 className="text-xs font-bold text-slate-800">AI Module Unavailable</h5>
                <p className="text-[11px] text-slate-500 mt-1 max-w-xs">{summaryError}</p>
                <button
                  onClick={handleGenerateSummary}
                  className="mt-3 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-[10px] font-bold text-slate-700 rounded border border-slate-200 transition-colors cursor-pointer"
                >
                  Retry Summary Generation
                </button>
              </div>
            ) : summary ? (
              <div className="flex-1 flex flex-col">
                <div className="max-h-[320px] overflow-y-auto pr-2 border border-slate-100 rounded p-3.5 bg-slate-50/20 font-sans custom-scrollbar">
                  {parseAndFormatMarkdown(summary)}
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-400">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Cached in local storage. Last updated {new Date().toLocaleTimeString(undefined, {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-10 text-center space-y-2.5">
                <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                </div>
                <p className="text-xs font-semibold text-slate-700">No Portfolio Summary Generated</p>
                <p className="text-[11px] text-slate-400 max-w-xs">
                  Run Hermes AI to extract statuses, timelines, and highlight items across active projects.
                </p>
                <button
                  onClick={handleGenerateSummary}
                  className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded shadow-sm shadow-purple-100 transition-colors cursor-pointer"
                >
                  Run Summary Generator
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Module 2: AI Email Risk Detection */}
        <div className="bg-white rounded border border-slate-200 shadow-xs flex flex-col h-full overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-bold text-slate-800">Email Risk Detector</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDetectRisks}
                disabled={risksLoading}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm shadow-purple-100"
              >
                <RefreshCw className={`h-3 w-3 text-white ${risksLoading ? 'animate-spin' : ''}`} />
                {risksData ? 'Re-Run Detection' : 'Run Risk Detection'}
              </button>
            </div>
          </div>

          <div className="p-5 flex-1 flex flex-col justify-between min-h-[250px]">
            {risksLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center py-10 space-y-3">
                <RefreshCw className="h-7 w-7 text-purple-600 animate-spin" />
                <p className="text-xs font-semibold text-slate-600">Scanning document store logs...</p>
                <p className="text-[10px] text-slate-400">Hermes NLP is evaluating coordination, supply, & layout risks</p>
              </div>
            ) : risksError ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
                <h5 className="text-xs font-bold text-slate-800">Risk Detector Unavailable</h5>
                <p className="text-[11px] text-slate-500 mt-1 max-w-xs">{risksError}</p>
                <button
                  onClick={handleDetectRisks}
                  className="mt-3 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-[10px] font-bold text-slate-700 rounded border border-slate-200 transition-colors cursor-pointer"
                >
                  Retry Risk Scanning
                </button>
              </div>
            ) : risksData ? (
              <div className="flex-1 flex flex-col">
                {/* Risk Summary Row Cards */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-slate-50 border border-slate-150 p-3 rounded">
                    <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Emails Scanned</span>
                    <span className="text-xl font-extrabold text-slate-800">{risksData.total_emails}</span>
                  </div>
                  <div className="bg-red-50 border border-red-150 p-3 rounded">
                    <span className="block text-[9px] font-bold text-red-400 uppercase tracking-wider">Risks Identified</span>
                    <span className="text-xl font-extrabold text-red-600">{risksData.risks_detected}</span>
                  </div>
                </div>

                {/* Risks list */}
                <div className="max-h-[240px] overflow-y-auto border border-slate-100 rounded divide-y divide-slate-100 custom-scrollbar bg-slate-50/10">
                  {risksData.risks.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">Scan finished. No serious risks identified in current documents.</div>
                  ) : (
                    risksData.risks.map((risk) => {
                      const severityColors = {
                        High: 'bg-red-50 text-red-700 border-red-100 hover:bg-red-100/50',
                        Medium: 'bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100/50',
                        Low: 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100/50'
                      };
                      return (
                        <div 
                          key={risk.id} 
                          className={`p-3 text-xs transition-all border-l-3 ${
                            risk.severity === 'High' ? 'border-l-red-500' : risk.severity === 'Medium' ? 'border-l-amber-500' : 'border-l-emerald-500'
                          } hover:bg-slate-50`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="font-bold text-slate-800 tracking-tight">{risk.risk_type}</span>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                              risk.severity === 'High' ? 'bg-red-100 text-red-700 border-red-200' : risk.severity === 'Medium' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                            }`}>
                              {risk.severity}
                            </span>
                          </div>
                          
                          <p className="text-slate-600 line-clamp-2 leading-relaxed mb-2.5">{risk.description}</p>
                          
                          <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-400 border-t border-slate-100/60 pt-2">
                            <button
                              onClick={() => {
                                if (!risk.project_id) {
                                  console.warn("Risk missing project_id:", risk);
                                  return;
                                }
                                onViewProject(String(risk.project_id));
                              }}
                              className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                            >
                              <ExternalLink className="h-2.5 w-2.5" />
                              {getProjectName(risk.project_id)}
                            </button>
                            
                            <button
                              onClick={() => setSelectedEmailRisk(risk)}
                              className="inline-flex items-center gap-1 font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                            >
                              <Mail className="h-3 w-3" />
                              View Email Source
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-10 text-center space-y-2.5">
                <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center">
                  <ShieldAlert className="h-5 w-5 text-purple-600" />
                </div>
                <p className="text-xs font-semibold text-slate-700">No Email Risk Scan Executed</p>
                <p className="text-[11px] text-slate-400 max-w-xs">
                  Run Hermes NLP engine to scan all pending communications for critical on-site and alignment issues.
                </p>
                <button
                  onClick={handleDetectRisks}
                  className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded shadow-sm shadow-purple-100 transition-colors cursor-pointer"
                >
                  Initiate Risk Scan
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Simulated Email Details Modal */}
      {selectedEmailRisk && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-800">
                <Mail className="h-4.5 w-4.5 text-blue-500" />
                <span className="font-bold text-sm">Simulated Email Metadata</span>
              </div>
              <button 
                onClick={() => setSelectedEmailRisk(null)}
                className="p-1 rounded text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 text-xs">
              <div className="bg-slate-50 border border-slate-150 p-3 rounded space-y-1.5">
                <div>
                  <span className="text-slate-400 font-medium">Subject:</span>{' '}
                  <span className="text-slate-800 font-bold">Urgent: Review required for layout alignment and schedules</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Sender:</span>{' '}
                  <span className="text-slate-800 font-semibold">site-superintendent@construction-partner.com</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Recipient:</span>{' '}
                  <span className="text-slate-800 font-semibold">project-manager@oakwood-center.com</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Date:</span>{' '}
                  <span className="text-slate-500 font-mono">{new Date(selectedEmailRisk.detected_at).toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Email Body Extract</span>
                <p className="bg-slate-50 border border-slate-150 p-3 rounded text-slate-700 italic font-mono leading-relaxed max-h-[160px] overflow-y-auto">
                  {selectedEmailRisk.description}
                </p>
              </div>

              <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                    Type: {selectedEmailRisk.risk_type}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                    selectedEmailRisk.severity === 'High' ? 'bg-red-50 text-red-700 border-red-200' : selectedEmailRisk.severity === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    Severity: {selectedEmailRisk.severity}
                  </span>
                </div>
                <button
                  onClick={() => {
                    if (!selectedEmailRisk.project_id) {
                      console.warn("Risk missing project_id:", selectedEmailRisk);
                      return;
                    }
                    onViewProject(String(selectedEmailRisk.project_id));
                    setSelectedEmailRisk(null);
                  }}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded transition-colors cursor-pointer"
                >
                  Navigate to Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
