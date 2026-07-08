/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { getWeeklyMeetingSummary } from '../api/meetings';
import { 
  Sparkles, 
  RefreshCw, 
  AlertCircle, 
  Calendar, 
  CheckCircle2, 
  HelpCircle,
  TrendingUp,
  Inbox
} from 'lucide-react';

interface WeeklyMeetingSummaryProps {
  projectId: string | number;
}

export default function WeeklyMeetingSummary({ projectId }: WeeklyMeetingSummaryProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWeeklyMeetingSummary(projectId);
      setSummary(data.summary);
    } catch (err: any) {
      console.error('Error fetching weekly meeting summary:', err);
      setError('AI meeting summarization temporarily unavailable. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchSummary();
    }
  }, [projectId]);

  // Simple custom text formatter supporting basic markdown syntax
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
          <h5 key={idx} className="text-xs font-bold text-slate-850 mt-4 mb-2 uppercase tracking-wider flex items-center gap-1.5">
            {formatBoldText(content)}
          </h5>
        );
      }
      if (trimmed.startsWith('###')) {
        const content = trimmed.replace(/^###\s*/, '');
        return (
          <h4 key={idx} className="text-sm font-extrabold text-slate-900 mt-5 mb-3 border-b border-slate-100 pb-1.5 uppercase tracking-wide">
            {formatBoldText(content)}
          </h4>
        );
      }

      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const content = trimmed.substring(2);
        
        // Contextual icons for weekly meetings
        let bulletColor = "bg-blue-500";
        if (trimmed.includes('(Missing)')) bulletColor = "bg-rose-500";
        else if (trimmed.includes('📅') || trimmed.includes('Held')) bulletColor = "bg-amber-500";
        else if (trimmed.includes('✅') || trimmed.includes('Completed')) bulletColor = "bg-emerald-500";

        return (
          <div key={idx} className="flex items-start gap-2.5 text-slate-600 text-xs leading-relaxed my-2 pl-1">
            <span className={`mt-2 flex-shrink-0 w-1.5 h-1.5 rounded-full ${bulletColor}`} />
            <span className="flex-1">{formatBoldText(content)}</span>
          </div>
        );
      }

      return (
        <p key={idx} className="text-xs text-slate-600 leading-relaxed my-2">
          {formatBoldText(trimmed)}
        </p>
      );
    });
  };

  return (
    <div id="weekly-meeting-summary-section" className="bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-150 bg-slate-50/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4.5 w-4.5 text-purple-600 animate-pulse" />
          <span className="text-sm font-bold text-slate-800">Weekly Meeting Summary</span>
          <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[9px] font-bold uppercase rounded border border-blue-200">
            Hermes AI
          </span>
        </div>
        <button
          onClick={fetchSummary}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-slate-50 text-[11px] font-bold text-slate-700 border border-slate-200 rounded-lg shadow-2xs transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <RefreshCw className={`h-3 w-3 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
          {summary ? 'Refresh Summary' : 'Generate Summary'}
        </button>
      </div>

      {/* Main Content Area */}
      <div className="p-6 min-h-[180px] flex flex-col justify-center">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-3">
            <RefreshCw className="h-8 w-8 text-purple-600 animate-spin" />
            <p className="text-xs font-semibold text-slate-600">Hermes is compiling meeting transcripts & logs...</p>
            <p className="text-[10px] text-slate-400">Evaluating completed vs missing meeting schedules (takes 3-8s)</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center text-center py-6">
            <AlertCircle className="h-9 w-9 text-rose-500 mb-2" />
            <h5 className="text-xs font-bold text-slate-800">AI Module Error</h5>
            <p className="text-[11px] text-slate-500 mt-1 max-w-sm">{error}</p>
            <button
              onClick={fetchSummary}
              className="mt-3 px-3 py-1.5 bg-slate-150 hover:bg-slate-200 text-xs font-bold text-slate-700 rounded-lg border border-slate-200 transition-colors cursor-pointer"
            >
              Retry Weekly Fetch
            </button>
          </div>
        ) : summary ? (
          <div className="space-y-4">
            <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/20 font-sans">
              {parseAndFormatMarkdown(summary)}
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 border-t border-slate-100 pt-3">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              <span>Report successfully compiled from weekly documents and subcontractor logs.</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-8 space-y-2.5">
            <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-xs font-bold text-slate-700">No Weekly Meeting Summary Compiled</p>
            <p className="text-[11px] text-slate-400 max-w-sm">
              Trigger Hermes AI to inspect and build a structural overview of weekly schedules, safety briefings, and critical action items.
            </p>
            <button
              onClick={fetchSummary}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg shadow-xs shadow-purple-100 transition-colors cursor-pointer"
            >
              Compile Weekly Report
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
