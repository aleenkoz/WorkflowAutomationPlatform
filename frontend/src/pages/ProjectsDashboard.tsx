/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Project } from '../types';
import { getProjects, deleteProject } from '../api/projects';
import { getApiMode, setApiMode, getApiUrl, setApiUrl } from '../api/config';
import ProjectTable from '../components/ProjectTable';
import AIIntelligenceCenter from '../components/AIIntelligenceCenter';
import { 
  Plus, 
  Search, 
  Filter, 
  HardHat, 
  Database, 
  Settings, 
  Check, 
  RefreshCw,
  Info,
  AlertCircle
} from 'lucide-react';

interface ProjectsDashboardProps {
  onCreateProjectClick: () => void;
  onViewProjectClick: (id: string) => void;
  onEditProjectClick: (project: Project) => void;
}

export default function ProjectsDashboard({ 
  onCreateProjectClick, 
  onViewProjectClick,
  onEditProjectClick
}: ProjectsDashboardProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // API Configuration state
  const [apiMode, setApiModeState] = useState<'mock' | 'api'>(getApiMode());
  const [apiUrl, setApiUrlState] = useState<string>(getApiUrl());
  const [showApiSettings, setShowApiSettings] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const loadProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Could not fetch projects. Is the backend offline?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [apiMode]); // Reload whenever API mode changes

  const handleDelete = async (id: string) => {
    try {
      await deleteProject(id);
      loadProjects();
    } catch (err: any) {
      alert('Error deleting project: ' + err.message);
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setApiMode(apiMode);
    setApiUrl(apiUrl);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
    // Trigger reload
    loadProjects();
  };

  // Filtered projects list
  const filteredProjects = projects.filter((project) => {
    const matchesSearch = 
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Banner / Header */}
      <div className="bg-slate-900 rounded border border-slate-800 p-6 sm:p-8 text-white relative overflow-hidden shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-blue-500 rounded-sm flex items-center justify-center">
                <HardHat className="h-3 w-3 text-white" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Construction Intelligence</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-100">Project Portfolio</h1>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xl leading-relaxed">
              Track project milestones, budget spending, materials issues, strategic change decisions, and risk registries in real-time.
            </p>
          </div>

          <button
            onClick={onCreateProjectClick}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded text-sm transition-all shadow-sm shadow-blue-500/20 whitespace-nowrap self-start sm:self-auto cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Create Project
          </button>
        </div>
      </div>

      {/* API Source Switcher Panel */}
      <div className="bg-slate-50 border border-slate-200 rounded px-5 py-3 flex flex-wrap items-center justify-between gap-4 text-xs font-medium text-slate-700 shadow-sm">
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-slate-500" />
          <span>
            API Mode:{' '}
            <span className={`font-bold capitalize ${apiMode === 'api' ? 'text-blue-600' : 'text-slate-800'}`}>
              {apiMode === 'mock' ? 'In-Browser Local Demo' : 'Real Local FastAPI Backend'}
            </span>
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500 font-normal">
            {apiMode === 'mock' 
              ? 'Previewing offline-ready data' 
              : `Connected to ${apiUrl}`}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowApiSettings(!showApiSettings)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 rounded text-slate-700 shadow-xs border border-slate-200 transition-colors cursor-pointer"
          >
            <Settings className="h-3.5 w-3.5 text-slate-500" />
            {showApiSettings ? 'Hide API Config' : 'Configure API Link'}
          </button>
          <button
            onClick={loadProjects}
            className="p-1.5 bg-white hover:bg-slate-100 rounded text-slate-700 shadow-xs border border-slate-200 transition-colors cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className="h-3.5 w-3.5 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Interactive API Settings Form */}
      {showApiSettings && (
        <form 
          onSubmit={handleSaveSettings}
          className="bg-white rounded border border-slate-200 p-5 space-y-4 shadow-sm"
        >
          <div className="flex items-center gap-1.5 text-sm font-bold text-slate-800 border-b border-slate-100 pb-2.5">
            <Settings className="h-4 w-4 text-blue-600" />
            <h4>Developer API Link Setup</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Data Fetching Mode
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setApiModeState('mock')}
                  className={`flex-1 px-3 py-2 text-xs font-semibold rounded border transition-colors cursor-pointer ${
                    apiMode === 'mock' 
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs' 
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  In-Browser Demo Mode (Recommended)
                </button>
                <button
                  type="button"
                  onClick={() => setApiModeState('api')}
                  className={`flex-1 px-3 py-2 text-xs font-semibold rounded border transition-colors cursor-pointer ${
                    apiMode === 'api' 
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs' 
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Local FastAPI (Port 8000)
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="apiUrl" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Backend API Base URL
              </label>
              <input
                type="text"
                id="apiUrl"
                value={apiUrl}
                onChange={(e) => setApiUrlState(e.target.value)}
                placeholder="http://localhost:8000"
                disabled={apiMode === 'mock'}
                className="w-full text-xs rounded border border-slate-200 px-3 py-2 text-slate-800 shadow-xs focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-hidden transition-colors bg-white disabled:bg-slate-50 disabled:text-slate-400"
              />
            </div>
          </div>

          {apiMode === 'api' && (
            <div className="bg-slate-50 border border-slate-200 rounded p-3 flex gap-2 text-xs text-slate-700">
              <Info className="h-4.5 w-4.5 text-blue-500 flex-shrink-0" />
              <p>
                <strong>Cross-Origin Resource Sharing (CORS):</strong> Ensure your FastAPI backend has CORS headers enabled for <code>{window.location.origin}</code>, and is actively running on your machine.
              </p>
            </div>
          )}

          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
            <button
              type="submit"
              className="inline-flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded transition-colors cursor-pointer"
            >
              {saveSuccess ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  Configuration Saved!
                </>
              ) : (
                'Apply Settings'
              )}
            </button>
          </div>
        </form>
      )}

      {/* AI Intelligence Desk */}
      <div key={apiMode}>
        <AIIntelligenceCenter onViewProject={onViewProjectClick} projects={projects} />
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-4 rounded border border-slate-200 shadow-sm">
        {/* Search input */}
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects by name, client, address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-hidden transition-colors bg-white text-slate-800"
          />
        </div>

        {/* Status Select Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-slate-400 flex-shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-44 rounded border border-slate-200 px-3 py-2 text-sm text-slate-700 shadow-xs focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-hidden transition-colors bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="Planning">Planning</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="On Hold">On Hold</option>
          </select>
        </div>
      </div>

      {/* Project Grid / Table Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <RefreshCw className="h-8 w-8 text-blue-600 animate-spin mb-3" />
          <p className="text-gray-500 font-medium text-sm">Loading project logs...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-lg mx-auto shadow-sm">
          <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
          <p className="text-red-700 font-semibold">Backend Connection Issue</p>
          <p className="text-red-600 text-xs mt-2 leading-relaxed">{error}</p>
          <div className="mt-5 flex gap-3 justify-center">
            <button
              onClick={loadProjects}
              className="px-4 py-2 bg-white border border-red-200 rounded text-xs font-semibold text-red-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Retry Connection
            </button>
            <button
              onClick={() => {
                setApiModeState('mock');
                setApiMode('mock');
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold transition-colors cursor-pointer"
            >
              Use In-Browser Demo Mode
            </button>
          </div>
        </div>
      ) : (
        <ProjectTable
          projects={filteredProjects}
          onView={onViewProjectClick}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
