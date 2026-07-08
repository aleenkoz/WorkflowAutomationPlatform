/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import ProjectsDashboard from './pages/ProjectsDashboard';
import CreateProject from './pages/CreateProject';
import ProjectView from './pages/ProjectView';
import ProjectForm from './components/ProjectForm';
import ApiSourceSwitcher from './components/ApiSourceSwitcher';
import { updateProject } from './api/projects';
import { Project } from './types';
import { HardHat, User } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'create' | 'view' | 'edit'>('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [updating, setUpdating] = useState(false);

  const handleEditSubmit = async (data: Omit<Project, 'id'>) => {
    if (!selectedProjectId) return;
    setUpdating(true);
    try {
      await updateProject(selectedProjectId, data);
      setCurrentView('view');
    } catch (err: any) {
      console.error(err);
      alert('Failed to update project: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col antialiased">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-850 text-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div 
            onClick={() => {
              setCurrentView('dashboard');
              setSelectedProjectId(null);
              setEditingProject(null);
            }}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-xs flex items-center justify-center font-bold text-white text-xs transition-colors group-hover:bg-blue-500">
              CI
            </div>
            <div>
              <span className="font-semibold tracking-tight uppercase text-sm text-slate-100 block">
                ConstructIntel
              </span>
              <span className="text-[10px] text-slate-450 font-bold uppercase tracking-widest block -mt-1">
                Projects Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Dynamic API Source switcher toggle */}
            <ApiSourceSwitcher />

            {/* User profile identifier from metadata */}
            <div className="hidden sm:flex items-center gap-2 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded text-xs font-semibold text-slate-200">
              <User className="h-3.5 w-3.5 text-slate-450" />
              <span>aleen0617@hotmail.com</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dashboard' && (
          <ProjectsDashboard
            onCreateProjectClick={() => setCurrentView('create')}
            onViewProjectClick={(id) => {
              setSelectedProjectId(id);
              setCurrentView('view');
            }}
            onEditProjectClick={(project) => {
              setSelectedProjectId(project.id);
              setEditingProject(project);
              setCurrentView('edit');
            }}
          />
        )}

        {currentView === 'create' && (
          <CreateProject
            onCancel={() => setCurrentView('dashboard')}
            onSuccess={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'view' && selectedProjectId && (
          <ProjectView
            projectId={selectedProjectId}
            onBack={() => {
              setCurrentView('dashboard');
              setSelectedProjectId(null);
            }}
            onEdit={(project) => {
              setEditingProject(project);
              setCurrentView('edit');
            }}
          />
        )}

        {currentView === 'edit' && editingProject && (
          <div className="py-4 animate-fade-in">
            <ProjectForm
              initialValues={editingProject}
              onSubmit={handleEditSubmit}
              onCancel={() => setCurrentView('view')}
              isLoading={updating}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 text-center text-xs text-slate-400 font-medium mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} ConstructIntel Corporation. All rights reserved.</p>
          <p className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 px-2.5 py-1 rounded text-slate-300">
            <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
            Active Preview System
          </p>
        </div>
      </footer>
    </div>
  );
}
