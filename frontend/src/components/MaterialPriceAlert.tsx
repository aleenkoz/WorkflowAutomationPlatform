/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MaterialPriceIntelligenceResponse } from '../api/projectIntelligence';
import { 
  X, 
  TrendingUp, 
  TrendingDown, 
  Percent, 
  Info,
  AlertTriangle,
  Database,
  Activity,
  CheckCircle,
  XCircle,
  Code,
  Layers,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface MaterialPriceAlertProps {
  data: MaterialPriceIntelligenceResponse | null;
  onClose: () => void;
}

export default function MaterialPriceAlert({ data, onClose }: MaterialPriceAlertProps) {
  const [showRawJson, setShowRawJson] = useState(false);

  if (!data) return null;

  // Helper to format confidence percentage
  const formatConfidence = (val: number): number => {
    return Math.round(val * (val <= 1 ? 100 : 1));
  };

  // Helper to style prediction badges
  const getPredictionBadge = (pred: string) => {
    const change = pred?.toLowerCase() || '';
    if (change === 'increase') {
      return {
        className: 'bg-red-50 text-red-700 border-red-200',
        icon: TrendingUp,
        text: 'Increase'
      };
    } else if (change === 'decrease') {
      return {
        className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        icon: TrendingDown,
        text: 'Decrease'
      };
    }
    return {
      className: 'bg-slate-50 text-slate-600 border-slate-200',
      icon: Activity,
      text: 'Stable'
    };
  };

  // Helper to style volatility badges
  const getVolatilityColor = (vol: string) => {
    const v = vol?.toLowerCase() || '';
    if (v === 'high') return 'text-red-600 bg-red-50/50 border-red-100';
    if (v === 'medium') return 'text-amber-600 bg-amber-50/50 border-amber-100';
    return 'text-emerald-600 bg-emerald-50/50 border-emerald-100';
  };

  return (
    <div id="material-price-alert-overlay" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div 
        id="material-price-alert-modal" 
        className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Modal Header */}
        <div className="bg-slate-50 px-6 py-4.5 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 text-slate-800">
            <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg border border-purple-100">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 tracking-tight leading-none">Material Price Alert</h3>
              <p className="text-[11px] text-slate-500 font-medium mt-1">Hermes Predictive Pricing Intelligence Engine</p>
            </div>
          </div>
          <button 
            id="close-price-alert-top-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-150 hover:text-slate-700 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Section: Execution Status */}
          <div className="space-y-2">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Execution Status</span>
            {data.sql_executed ? (
              <div className="bg-emerald-50 border border-emerald-200/80 rounded-lg px-4 py-3 flex items-start gap-3">
                <div className="p-1 bg-emerald-100 text-emerald-700 rounded-full mt-0.5">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-emerald-850">SQL Alert successfully saved</h4>
                  <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
                    Recommended price change alerts have been successfully committed to the database audit logs.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-200/80 rounded-lg px-4 py-3 flex items-start gap-3">
                <div className="p-1 bg-amber-100 text-amber-700 rounded-full mt-0.5">
                  <XCircle className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-amber-850">SQL alert was NOT saved</h4>
                  <p className="text-[11px] text-amber-600 font-medium mt-0.5">
                    Alert rules were analyzed, but the SQL insert statement was bypassed or could not execute on the current instance.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Section: Material Analysis */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
              <Activity className="h-4 w-4 text-purple-600" />
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Material Analysis</h4>
            </div>

            {data.analysis && data.analysis.length > 0 ? (
              <div className="space-y-4">
                {data.analysis.map((item, idx) => {
                  const badge = getPredictionBadge(item.predicted_change);
                  const BadgeIcon = badge.icon;
                  const confidenceVal = formatConfidence(item.confidence);
                  const volClass = getVolatilityColor(item.volatility);

                  return (
                    <div 
                      key={idx} 
                      className="bg-slate-50 border border-slate-200/80 rounded-lg p-4 space-y-3.5 hover:shadow-xs transition-shadow"
                    >
                      {/* Name & Badge Row */}
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="text-sm font-bold text-slate-800">{item.material}</span>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[11px] text-slate-500">
                              Trend: <span className="text-slate-700 font-medium">{item.trend}</span>
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${volClass}`}>
                              Volatility: {item.volatility}
                            </span>
                          </div>
                        </div>

                        <div className={`px-2 py-0.5 rounded-md text-[11px] font-bold border flex items-center gap-1 shrink-0 ${badge.className}`}>
                          <BadgeIcon className="h-3 w-3" />
                          <span>{badge.text}</span>
                        </div>
                      </div>

                      {/* Confidence Score Gauge */}
                      <div className="space-y-1 pt-1 border-t border-slate-150/60">
                        <div className="flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-1 text-slate-500 font-medium">
                            <Percent className="h-3 w-3 text-purple-500" />
                            <span>Confidence Score</span>
                          </div>
                          <span className="font-bold text-slate-850">{confidenceVal}%</span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-purple-600 h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(confidenceVal, 100)}%` }}
                          />
                        </div>
                      </div>

                      {/* Reason paragraph */}
                      <div className="bg-white border border-slate-150 rounded px-3 py-2 text-[11px] text-slate-600 leading-relaxed">
                        <div className="flex items-center gap-1 mb-1 font-bold text-slate-400 text-[9px] uppercase tracking-wider">
                          <Info className="h-2.5 w-2.5" />
                          <span>Hermes Predictive Insight</span>
                        </div>
                        {item.reason}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic p-3 bg-slate-50 border border-slate-150 rounded-lg text-center">
                No individual material trends were found in this analysis block.
              </p>
            )}
          </div>

          {/* Section: SQL Alerts */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
              <Database className="h-4 w-4 text-purple-600" />
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">SQL Alerts</h4>
            </div>

            {data.sql_alerts && data.sql_alerts.length > 0 ? (
              <div className="grid grid-cols-1 gap-3">
                {data.sql_alerts.map((alert, idx) => {
                  const badge = getPredictionBadge(alert.predicted_change);
                  const BadgeIcon = badge.icon;
                  const confidenceVal = formatConfidence(alert.confidence);

                  return (
                    <div key={idx} className="bg-slate-50 border border-slate-150 rounded-lg px-4 py-3 flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-slate-800">{alert.material}</span>
                        <p className="text-[11px] text-slate-500 max-w-sm">{alert.reason}</p>
                        <div className="flex items-center gap-1 pt-1 text-[10px] text-slate-400">
                          <Percent className="h-2.5 w-2.5 text-purple-400" />
                          <span>Confidence: <span className="font-semibold text-slate-600">{confidenceVal}%</span></span>
                        </div>
                      </div>
                      <div className={`px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1 shrink-0 ${badge.className}`}>
                        <BadgeIcon className="h-3.5 w-3.5" />
                        <span>{badge.text}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic p-3 bg-slate-50 border border-slate-150 rounded-lg text-center">
                No recommended database SQL alerts were created during this assessment.
              </p>
            )}
          </div>

          {/* Collapsible raw JSON duplicate block */}
          {data.json && (
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => setShowRawJson(!showRawJson)}
                className="w-full px-4 py-2.5 bg-slate-50 hover:bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-700 select-none cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <Code className="h-3.5 w-3.5 text-slate-500" />
                  <span>View Raw Analysis Payload</span>
                </div>
                {showRawJson ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
              </button>
              {showRawJson && (
                <div className="p-3 bg-slate-900 overflow-x-auto max-h-[160px] text-[10px] font-mono text-slate-200">
                  <pre>{JSON.stringify(data.json, null, 2)}</pre>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end shrink-0">
          <button
            id="close-price-alert-bottom-btn"
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg shadow-sm hover:shadow transition-all cursor-pointer"
          >
            Close Alert
          </button>
        </div>
      </div>
    </div>
  );
}
