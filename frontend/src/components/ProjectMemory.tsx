/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { searchMemory, MemoryEntry } from '../api/memory';
import { 
  Database, 
  Search, 
  RefreshCw, 
  AlertCircle, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Tag, 
  FileText, 
  AlertTriangle, 
  Sparkles,
  Link2
} from 'lucide-react';

interface ProjectMemoryProps {
  projectId: string | number;
  refreshTrigger?: number; // Prop to force automatic re-fetching
}

export default function ProjectMemory({ projectId, refreshTrigger }: ProjectMemoryProps) {
  const [entries, setEntries] = useState<MemoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter state: 'all' | 'summary' | 'risk' | 'intelligence'
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Track which items are expanded
  const [expandedIds, setExpandedIds] = useState<Set<string | number>>(new Set());

  // Handle keyword input debounce (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch memory records based on parameters
  const fetchMemory = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await searchMemory(projectId, debouncedQuery, activeFilter);
      setEntries(data);
      
      // Auto-expand intelligence or high-severity entries by default
      const defaultExpanded = new Set<string | number>();
      data.forEach(entry => {
        if (entry.entry_type === 'intelligence' || entry.entry_type === 'risk') {
          defaultExpanded.add(entry.id);
        }
      });
      setExpandedIds(defaultExpanded);
    } catch (err: any) {
      console.error('Error fetching memory records:', err);
      setError('Failed to scan enterprise memory records. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetch when parameters or the manual refresh trigger changes
  useEffect(() => {
    if (projectId) {
      fetchMemory();
    }
  }, [projectId, activeFilter, debouncedQuery, refreshTrigger]);

  const toggleExpand = (id: string | number) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const getEntryBadge = (type: string) => {
    switch (type.toLowerCase()) {
      case 'risk':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertTriangle className="h-3 w-3" /> Risk
          </span>
        );
      case 'summary':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <FileText className="h-3 w-3" /> Summary
          </span>
        );
      case 'intelligence':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
            <Sparkles className="h-3 w-3 animate-pulse" /> Intelligence
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-50 text-slate-700 border border-slate-200">
            <Tag className="h-3 w-3" /> {type}
          </span>
        );
    }
  };

  const getEntryColors = (type: string) => {
    switch (type.toLowerCase()) {
      case 'risk':
        return {
          border: 'border-l-rose-500 border-rose-100',
          bg: 'bg-rose-50/10 hover:bg-rose-50/25',
          text: 'text-rose-900',
          dot: 'bg-rose-500 ring-rose-100'
        };
      case 'summary':
        return {
          border: 'border-l-blue-500 border-blue-100',
          bg: 'bg-blue-50/10 hover:bg-blue-50/25',
          text: 'text-blue-900',
          dot: 'bg-blue-500 ring-blue-100'
        };
      case 'intelligence':
        return {
          border: 'border-l-purple-500 border-purple-100',
          bg: 'bg-purple-50/10 hover:bg-purple-50/25',
          text: 'text-purple-900',
          dot: 'bg-purple-500 ring-purple-100'
        };
      default:
        return {
          border: 'border-l-slate-400 border-slate-100',
          bg: 'bg-slate-50/20 hover:bg-slate-50/40',
          text: 'text-slate-800',
          dot: 'bg-slate-400 ring-slate-100'
        };
    }
  };

  const formatLocalTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short'
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-150 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Database className="h-4.5 w-4.5 text-slate-700" />
          <span className="text-sm font-bold text-slate-800">Enterprise Memory Layer</span>
          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-bold uppercase rounded border border-emerald-200">
            Durable Ledger
          </span>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: 'All Entries' },
            { id: 'summary', label: 'Summaries' },
            { id: 'risk', label: 'Risks' },
            { id: 'intelligence', label: 'Intelligence' }
          ].map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                activeFilter === filter.id 
                  ? 'bg-slate-850 border-slate-900 text-white shadow-2xs' 
                  : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="px-4 py-3 border-b border-slate-100 bg-white flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search enterprise ledger by keywords (e.g. framing, plumbing)..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs font-sans text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-slate-400 focus:border-slate-400 focus:bg-white transition-all"
          />
        </div>
        <button
          onClick={fetchMemory}
          disabled={loading}
          className="p-2 border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
          title="Manual Reload"
        >
          <RefreshCw className={`h-3.5 w-3.5 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-3">
            <RefreshCw className="h-7 w-7 text-slate-500 animate-spin" />
            <p className="text-xs font-semibold text-slate-500">Querying project timeline ledger...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center text-center py-6">
            <AlertCircle className="h-9 w-9 text-rose-500 mb-2" />
            <h5 className="text-xs font-bold text-slate-800">Ledger Scan Interrupted</h5>
            <p className="text-[11px] text-slate-500 mt-1 max-w-sm">{error}</p>
            <button
              onClick={fetchMemory}
              className="mt-3 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 transition-colors cursor-pointer"
            >
              Retry Connection
            </button>
          </div>
        ) : entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-12 space-y-2">
            <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
              <Database className="h-5 w-5 text-slate-400" />
            </div>
            <p className="text-xs font-bold text-slate-600">No Historical Memory Records Found</p>
            <p className="text-[11px] text-slate-450 max-w-xs">
              No matching ledger entries were retrieved for the current filter/search combination.
            </p>
          </div>
        ) : (
          /* Timeline Ledger Cards */
          <div className="relative pl-6 border-l-2 border-slate-100 space-y-5">
            {entries.map((entry) => {
              const colors = getEntryColors(entry.entry_type);
              const isExpanded = expandedIds.has(entry.id);
              
              return (
                <div key={entry.id} className="relative">
                  {/* Timeline circular dot indicator */}
                  <span className={`absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full ring-4 ring-white ${colors.dot}`} />
                  
                  {/* Collapsible Card */}
                  <div className={`border border-l-4 rounded-xl transition-all shadow-2xs ${colors.border} ${colors.bg}`}>
                    
                    {/* Header trigger */}
                    <div 
                      onClick={() => toggleExpand(entry.id)}
                      className="p-3.5 flex items-center justify-between gap-4 cursor-pointer select-none"
                    >
                      <div className="flex flex-wrap items-center gap-2.5">
                        {getEntryBadge(entry.entry_type)}
                        <span className="text-[10px] font-semibold text-slate-400 font-mono flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatLocalTime(entry.created_at)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {/* Source attribution tag */}
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider bg-white/80 border border-slate-200 px-1.5 py-0.5 rounded flex items-center gap-1">
                          <Link2 className="h-2.5 w-2.5 text-slate-400" />
                          Source: {entry.source_type} #{entry.source_id}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-slate-400" />
                        )}
                      </div>
                    </div>

                    {/* Collapsible Details Body */}
                    {isExpanded && (
                      <div className="px-4 pb-4 border-t border-slate-100/60 pt-3 bg-white/45 rounded-b-xl">
                        <p className={`text-xs leading-relaxed font-sans ${colors.text}`}>
                          {entry.content}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
