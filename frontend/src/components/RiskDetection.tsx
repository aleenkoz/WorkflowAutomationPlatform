/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { detectRisks } from '../api/ai';
import { RiskDetectionResponse, DetectedRisk } from '../types';
import { 
  ShieldAlert, 
  RefreshCw, 
  AlertOctagon, 
  Mail, 
  CheckCircle2, 
  AlertTriangle,
  X 
} from 'lucide-react';
import { getApiMode, setApiMode } from '../api/config';

interface RiskDetectionProps {
  onViewProject?: (id: string) => void;
}

export default function RiskDetection({ onViewProject }: RiskDetectionProps) {
  const [risksData, setRisksData] = useState<RiskDetectionResponse | null>(() => {
    const cached = localStorage.getItem('construction_ai_risks');
    if (!cached) return null;
    try {
      return JSON.parse(cached);
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRisk, setSelectedRisk] = useState<DetectedRisk | null>(null);

  const handleScan = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await detectRisks();
      setRisksData(response);
      localStorage.setItem('construction_ai_risks', JSON.stringify(response));
    } catch (err: any) {
      console.error('Error scanning risks:', err);
      // Catch error and show requested banner "Ledger Scan Interrupted"
      setError('Ledger Scan Interrupted');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!risksData) {
      handleScan();
    }
  }, []);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-150 bg-slate-50/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4.5 w-4.5 text-purple-600 animate-pulse" />
          <span className="text-sm font-bold text-slate-800">Email Risk Detection</span>
          <span className="px-2 py-0.5 bg-purple-50 text-purple-600 text-[9px] font-bold uppercase rounded border border-purple-200">
            NLP scan
          </span>
        </div>
        <button
          onClick={handleScan}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold rounded-lg shadow-2xs transition-all disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`h-3 w-3 text-white ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Scanning...' : risksData ? 'Re-Run Scan' : 'Run Scan'}
        </button>
      </div>

      {/* Content */}
      <div className="p-5 min-h-[180px] flex flex-col justify-center">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-3">
            <RefreshCw className="h-8 w-8 text-purple-600 animate-spin" />
            <p className="text-xs font-semibold text-slate-600 font-sans">Scanning contract documents and email backlogs...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-md mx-auto my-2">
            <AlertOctagon className="h-10 w-10 text-red-600 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-red-900 uppercase tracking-wide">Ledger Scan Interrupted</h4>
            <p className="text-xs text-red-700 mt-1">
              Hermes communication ledger scanning was interrupted due to a server connection failure.
            </p>
            <div className="mt-4 flex gap-2.5 justify-center">
              <button
                onClick={handleScan}
                className="px-3.5 py-1.5 bg-red-650 hover:bg-red-700 text-white text-xs font-bold rounded-md transition-colors cursor-pointer"
              >
                Retry Scan
              </button>
              <button
                onClick={() => {
                  setApiMode('mock');
                  setError(null);
                  handleScan();
                }}
                className="px-3 py-1.5 bg-white border border-red-200 hover:bg-red-100/50 text-red-800 text-xs font-bold rounded-md transition-colors cursor-pointer"
              >
                Use Demo Mode
              </button>
            </div>
          </div>
        ) : risksData ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 border border-slate-150 p-2.5 rounded-lg text-center">
                <span className="block text-[9px] font-bold text-slate-400 uppercase">Scanned Emails</span>
                <span className="text-lg font-extrabold text-slate-700">{risksData.total_emails}</span>
              </div>
              <div className="bg-red-50/50 border border-red-100 p-2.5 rounded-lg text-center">
                <span className="block text-[9px] font-bold text-red-400 uppercase">Risks Found</span>
                <span className="text-lg font-extrabold text-red-600">{risksData.risks_detected}</span>
              </div>
            </div>

            <div className="border border-slate-100 rounded-lg divide-y divide-slate-100 overflow-hidden bg-slate-50/10 max-h-[220px] overflow-y-auto">
              {risksData.risks.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400">No communication risks detected.</div>
              ) : (
                risksData.risks.map((risk) => (
                  <div key={risk.id} className="p-3 hover:bg-slate-50/80 transition-colors text-xs">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-bold text-slate-800">{risk.risk_type}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold border ${
                        risk.severity === 'High' ? 'bg-red-50 text-red-700 border-red-150' : 'bg-amber-50 text-amber-700 border-amber-150'
                      }`}>
                        {risk.severity}
                      </span>
                    </div>
                    <p className="text-slate-600 line-clamp-2 leading-relaxed mb-2">{risk.description}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Detected: {new Date(risk.detected_at).toLocaleDateString()}</span>
                      <button
                        onClick={() => setSelectedRisk(risk)}
                        className="text-blue-600 hover:text-blue-800 font-bold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Mail className="h-3 w-3" /> Source Email
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <button
              onClick={handleScan}
              className="px-4 py-2 bg-purple-600 text-white text-xs font-bold rounded-lg hover:bg-purple-700 cursor-pointer"
            >
              Scan Emails
            </button>
          </div>
        )}
      </div>

      {/* Simulated Mail Source Modal */}
      {selectedRisk && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-md w-full overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Mail className="h-4 w-4 text-blue-500" />
                Source Communication Archive
              </span>
              <button onClick={() => setSelectedRisk(null)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-4 space-y-3 text-xs leading-relaxed">
              <div className="bg-slate-50 border border-slate-100 p-2.5 rounded text-slate-600">
                <div><span className="font-semibold text-slate-400">Subject:</span> <span className="text-slate-700 font-medium">Site update reports</span></div>
                <div><span className="font-semibold text-slate-400">Priority:</span> <span className="text-red-600 font-bold">{selectedRisk.severity}</span></div>
              </div>
              <div>
                <span className="block font-bold text-slate-400 mb-1 uppercase text-[9px]">Extracted Text</span>
                <p className="bg-slate-50 border border-slate-100 p-3 rounded font-mono text-slate-700 italic max-h-[140px] overflow-y-auto">
                  {selectedRisk.description}
                </p>
              </div>
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => {
                    if (onViewProject && selectedRisk.project_id) {
                      onViewProject(String(selectedRisk.project_id));
                    }
                    setSelectedRisk(null);
                  }}
                  className="px-3 py-1.5 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  Inspect Project Detail
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
