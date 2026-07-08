/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { getApiMode, setApiMode, getApiUrl, setApiUrl } from '../api/config';
import { Database, Settings, RefreshCw, CheckCircle, Wifi, AlertTriangle } from 'lucide-react';

export default function ApiSourceSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'mock' | 'api'>(getApiMode());
  const [baseUrl, setBaseUrl] = useState<string>(getApiUrl());
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setApiMode(mode);
    setApiUrl(baseUrl.trim());
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      setIsOpen(false);
      window.location.reload();
    }, 800);
  };

  return (
    <div className="relative">
      {/* Trigger Badge */}
      <button
        id="api-switcher-trigger"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all uppercase tracking-wider cursor-pointer ${
          mode === 'api'
            ? 'bg-emerald-950 text-emerald-450 border border-emerald-800 hover:bg-emerald-900'
            : 'bg-slate-800 text-slate-350 border border-slate-700 hover:bg-slate-750'
        }`}
      >
        <Database className="h-3.5 w-3.5" />
        <span>Source: {mode === 'api' ? 'Real API' : 'Demo Mode'}</span>
        <Settings className="h-3 w-3 opacity-60 ml-0.5" />
      </button>

      {/* Popover Settings Panel */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-lg shadow-xl p-4 z-50 text-slate-200 animate-fade-in text-sm">
            <h4 className="font-bold text-slate-100 border-b border-slate-800 pb-2 mb-3 flex items-center gap-2">
              <Database className="h-4 w-4 text-blue-500" />
              <span>Data Engine Config</span>
            </h4>

            {/* Toggle Mode */}
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest mb-1.5">
                  Select Data Source
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setMode('mock')}
                    className={`px-3 py-2 rounded text-xs font-semibold text-center transition-all cursor-pointer border ${
                      mode === 'mock'
                        ? 'bg-blue-600/10 border-blue-500 text-blue-400 font-bold'
                        : 'bg-slate-800/50 border-slate-750 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    Demo Mode
                  </button>
                  <button
                    onClick={() => setMode('api')}
                    className={`px-3 py-2 rounded text-xs font-semibold text-center transition-all cursor-pointer border ${
                      mode === 'api'
                        ? 'bg-emerald-600/10 border-emerald-500 text-emerald-400 font-bold'
                        : 'bg-slate-800/50 border-slate-750 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    Real Backend
                  </button>
                </div>
              </div>

              {/* API Base URL Field */}
              {mode === 'api' && (
                <div className="space-y-1.5 animate-fade-in">
                  <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest">
                    FastAPI Server URL
                  </label>
                  <input
                    type="text"
                    value={baseUrl}
                    onChange={(e) => setBaseUrl(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-hidden focus:border-blue-500 font-mono"
                    placeholder="http://localhost:8000"
                  />
                  <div className="flex items-center gap-1 text-[10px] text-slate-500">
                    <Wifi className="h-3 w-3" />
                    <span>Endpoints call `/api/v1/` prefix</span>
                  </div>
                </div>
              )}

              {/* Informational Warning */}
              {mode === 'api' && (
                <div className="bg-amber-950/30 border border-amber-900/50 rounded p-2.5 flex items-start gap-2 text-amber-500 text-xs">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>Ensure your local FastAPI server is active at this port.</span>
                </div>
              )}

              {/* Action Buttons */}
              <button
                onClick={handleSave}
                disabled={isSaved}
                className="w-full mt-2 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:bg-emerald-600"
              >
                {isSaved ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-white animate-pulse" />
                    <span>Saved! Soft-reloading...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Save & Soft-Reload</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
