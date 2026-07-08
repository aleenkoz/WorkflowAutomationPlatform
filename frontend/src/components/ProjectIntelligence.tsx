/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { getProjectIntelligence, regenerateProjectIntelligence } from '../api/projectIntelligence';
import { Sparkles, RefreshCw, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';

interface ProjectIntelligenceProps {
  projectId: string | number;
  onRegenerated?: () => void;
}

export default function ProjectIntelligence({ projectId, onRegenerated }: ProjectIntelligenceProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchIntelligence = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProjectIntelligence(projectId);
      setSummary(data.summary);
      setUpdatedAt(data.updated_at);
    } catch (err: any) {
      console.error('Error fetching project intelligence:', err);
      setError('Project Intelligence temporarily unavailable. Ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    setRegenerating(true);
    setError(null);
    try {
      const data = await regenerateProjectIntelligence(projectId);
      setSummary(data.summary);
      setUpdatedAt(data.updated_at);
      if (onRegenerated) {
        onRegenerated();
      }
    } catch (err: any) {
      console.error('Error regenerating project intelligence:', err);
      setError('Could not regenerate intelligence. Please retry.');
    } finally {
      setRegenerating(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchIntelligence();
    }
  }, [projectId]);

  // Support basic markdown bolding & bullets
  const formatBoldText = (text: string) => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return <strong key={i} className="font-bold text-slate-900">{part}</strong>;
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
          <h5 key={idx} className="text-xs font-bold text-purple-900 mt-4 mb-2 uppercase tracking-wider">
            {formatBoldText(content)}
          </h5>
        );
      }
      if (trimmed.startsWith('###')) {
        const content = trimmed.replace(/^###\s*/, '');
        return (
          <h4 key={idx} className="text-sm font-extrabold text-purple-950 mt-5 mb-3 border-b border-purple-100 pb-1.5 uppercase tracking-wide">
            {formatBoldText(content)}
          </h4>
        );
      }

      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const content = trimmed.substring(2);
        return (
          <div key={idx} className="flex items-start gap-2.5 text-slate-700 text-xs leading-relaxed my-2 pl-1">
            <span className="mt-2 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-purple-500" />
            <span className="flex-1">{formatBoldText(content)}</span>
          </div>
        );
      }

      return (
        <p key={idx} className="text-xs text-slate-700 leading-relaxed my-2">
          {formatBoldText(trimmed)}
        </p>
      );
    });
  };

  const formatLocalTime = (isoString: string | null) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-purple-200 shadow-sm flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-purple-150 bg-purple-50/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4.5 w-4.5 text-purple-600 animate-pulse" />
          <span className="text-sm font-bold text-slate-800">Project Intelligence</span>
          <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-[9px] font-bold uppercase rounded border border-purple-200">
            Hermes Engine v2
          </span>
        </div>
        <button
          onClick={handleRegenerate}
          disabled={loading || regenerating}
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold rounded-lg shadow-sm shadow-purple-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <RefreshCw className={`h-3 w-3 text-white ${(loading || regenerating) ? 'animate-spin' : ''}`} />
          {regenerating ? 'Regenerating...' : 'Regenerate Intelligence'}
        </button>
      </div>

      {/* Body */}
      <div className="p-6 min-h-[160px] flex flex-col justify-center bg-purple-50/5">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-6 space-y-3">
            <RefreshCw className="h-8 w-8 text-purple-600 animate-spin" />
            <p className="text-xs font-semibold text-slate-600">Retrieving intelligence analysis...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-md mx-auto my-2">
            <AlertCircle className="h-10 w-10 text-red-650 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-red-900 uppercase tracking-wide">Intelligence Error</h4>
            <p className="text-xs text-red-700 mt-1">
              Hermes project intelligence stream was interrupted due to a server connection failure.
            </p>
            <div className="mt-4 flex gap-2.5 justify-center">
              <button
                onClick={fetchIntelligence}
                className="px-3.5 py-1.5 bg-red-650 hover:bg-red-700 text-white text-xs font-bold rounded-md transition-colors cursor-pointer"
              >
                Retry Load
              </button>
            </div>
          </div>
        ) : summary ? (
          <div className="space-y-4">
            <div className="border border-purple-100/60 rounded-xl p-4 bg-purple-50/10 font-sans">
              {parseAndFormatMarkdown(summary)}
            </div>
            
            {/* Footer Details */}
            {updatedAt && (
              <div className="flex items-center justify-between gap-2 text-[10px] text-slate-400 border-t border-slate-100 pt-3">
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  <span>Last Updated: {formatLocalTime(updatedAt)}</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-600 font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  <span>AI Grounding Active</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-6 space-y-2.5">
            <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-xs font-bold text-slate-750">No Intelligence Analysis Loaded</p>
            <button
              onClick={fetchIntelligence}
              className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Analyze Project
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
