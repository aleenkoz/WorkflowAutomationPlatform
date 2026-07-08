/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Project, Phase, Milestone, Budget, Risk, Issue, Decision } from '../types';
import { getProject } from '../api/projects';
import { setApiMode } from '../api/config';
import { getPhases, addPhase, deletePhase } from '../api/phases';
import { getMilestones, addMilestone, toggleMilestone, deleteMilestone } from '../api/milestones';
import { getBudgets, addBudget, deleteBudget } from '../api/budgets';
import { getRisks, addRisk, deleteRisk } from '../api/risks';
import { getIssues, addIssue, deleteIssue } from '../api/issues';
import { getDecisions, addDecision, deleteDecision } from '../api/decisions';

import PhaseForm from './PhaseForm';
import MilestoneForm from './MilestoneForm';
import BudgetForm from './BudgetForm';
import RiskForm from './RiskForm';
import IssueForm from './IssueForm';
import DecisionForm from './DecisionForm';
import WeeklyMeetingSummary from './WeeklyMeetingSummary';
import ProjectIntelligence from './ProjectIntelligence';
import ProjectMemory from './ProjectMemory';

import {
  Briefcase,
  MapPin,
  Calendar,
  Layers,
  CheckCircle2,
  DollarSign,
  AlertTriangle,
  AlertCircle,
  HelpCircle,
  Plus,
  Trash2,
  Loader2,
  TrendingUp,
  FileText,
  User,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface ProjectDetailsProps {
  projectId: string;
  onBack: () => void;
  onEdit: (project: Project) => void;
}

type TabType = 'overview' | 'phases' | 'milestones' | 'budgets' | 'risks' | 'issues' | 'decisions' | 'weekly_summary';

export default function ProjectDetails({ projectId, onBack, onEdit }: ProjectDetailsProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [phases, setPhases] = useState<Phase[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [risks, setRisks] = useState<Risk[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [decisions, setDecisions] = useState<Decision[]>([]);

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Trigger state to coordinate intelligence regeneration with memory layer refresh
  const [memoryRefreshTrigger, setMemoryRefreshTrigger] = useState(0);

  // Modal display states
  const [showPhaseModal, setShowPhaseModal] = useState(false);
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showRiskModal, setShowRiskModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showDecisionModal, setShowDecisionModal] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const loadAllData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [projData, phasesData, milestonesData, budgetsData, risksData, issuesData, decisionsData] = await Promise.all([
        getProject(projectId),
        getPhases(projectId),
        getMilestones(projectId),
        getBudgets(projectId),
        getRisks(projectId),
        getIssues(projectId),
        getDecisions(projectId)
      ]);
      
      setProject(projData);
      setPhases(phasesData);
      setMilestones(milestonesData);
      setBudgets(budgetsData);
      setRisks(risksData);
      setIssues(issuesData);
      setDecisions(decisionsData);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to fetch project data. Please verify the API is accessible.');
    } finally {
      setIsLoading(false);
    }
  };

  const [tabLoading, setTabLoading] = useState(false);

  const fetchActiveTabData = async (targetTab: TabType) => {
    if (!projectId) return;
    setTabLoading(true);
    try {
      switch (targetTab) {
        case 'phases': {
          const data = await getPhases(projectId);
          setPhases(data);
          break;
        }
        case 'milestones': {
          const data = await getMilestones(projectId);
          setMilestones(data);
          break;
        }
        case 'budgets': {
          const data = await getBudgets(projectId);
          setBudgets(data);
          break;
        }
        case 'risks': {
          const data = await getRisks(projectId);
          setRisks(data);
          break;
        }
        case 'issues': {
          const data = await getIssues(projectId);
          setIssues(data);
          break;
        }
        case 'decisions': {
          const data = await getDecisions(projectId);
          setDecisions(data);
          break;
        }
        case 'overview': {
          const results = await Promise.allSettled([
            getPhases(projectId),
            getMilestones(projectId),
            getBudgets(projectId),
            getRisks(projectId),
            getIssues(projectId),
            getDecisions(projectId)
          ]);
          if (results[0].status === 'fulfilled') setPhases(results[0].value);
          if (results[1].status === 'fulfilled') setMilestones(results[1].value);
          if (results[2].status === 'fulfilled') setBudgets(results[2].value);
          if (results[3].status === 'fulfilled') setRisks(results[3].value);
          if (results[4].status === 'fulfilled') setIssues(results[4].value);
          if (results[5].status === 'fulfilled') setDecisions(results[5].value);
          break;
        }
      }
    } catch (err: any) {
      console.error('Error loading tab data:', err);
    } finally {
      setTabLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      setIsLoading(true);
      setError(null);
      getProject(projectId)
        .then((projData) => {
          setProject(projData);
          // Initial fetch of active tab
          fetchActiveTabData(activeTab);
        })
        .catch((err: any) => {
          console.error(err);
          setError(err.message || 'Failed to fetch project data. Please verify the API is accessible.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [projectId]);

  useEffect(() => {
    if (project) {
      fetchActiveTabData(activeTab);
    }
  }, [activeTab]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Synchronizing site intelligence...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-lg mx-auto">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-red-900">Synchronization Error</h3>
        <p className="text-red-700 text-sm mt-1">{error || 'Project data could not be retrieved.'}</p>
        <div className="mt-5 flex gap-3 justify-center">
          <button
            onClick={onBack}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Return to Dashboard
          </button>
          <button
            onClick={() => {
              setIsLoading(true);
              setError(null);
              getProject(projectId)
                .then((projData) => {
                  setProject(projData);
                  fetchActiveTabData(activeTab);
                })
                .catch((err: any) => {
                  setError(err.message);
                })
                .finally(() => {
                  setIsLoading(false);
                });
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors cursor-pointer"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  // Helper values for calculations
  const allocatedVal = budgets?.reduce((sum, b: any) => sum + Number(b.amount !== undefined ? b.amount : (b.allocated || 0)), 0) || 0;
  const allocated = isNaN(allocatedVal) ? 0 : allocatedVal;
  const spent = 0; // until expenditures table exists
  const remainingVal = allocated - spent;
  const remaining = isNaN(remainingVal) ? 0 : remainingVal;
  const utilizationVal = allocated > 0 ? (spent / allocated) * 100 : 0;
  const utilization = isNaN(utilizationVal) ? 0 : utilizationVal;

  const totalAllocated = allocated;
  const totalSpent = spent;
  const budgetUtilization = utilization;

  const openRisksCount = risks.filter((r) => r.status === 'Open').length;
  const openIssuesCount = issues.filter((i) => i.status === 'Open').length;
  const completedMilestonesCount = milestones.filter((m) => m.completed).length;

  // Form submission handlers
  const handleAddPhase = async (data: Omit<Phase, 'id' | 'project_id'>) => {
    setSubmitting(true);
    try {
      await addPhase(projectId, data);
      await fetchActiveTabData('phases');
      setShowPhaseModal(false);
    } catch (err: any) {
      alert('Error adding phase: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddMilestone = async (data: Omit<Milestone, 'id' | 'project_id'>) => {
    setSubmitting(true);
    try {
      await addMilestone(projectId, data);
      await fetchActiveTabData('milestones');
      setShowMilestoneModal(false);
    } catch (err: any) {
      alert('Error adding milestone: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleMilestone = async (id: string) => {
    try {
      await toggleMilestone(projectId, id);
      // Fast optimistic state update, then re-load
      setMilestones((prev) =>
        prev.map((m) => (m.id === id ? { ...m, completed: !m.completed } : m))
      );
    } catch (err: any) {
      alert('Error updating milestone: ' + err.message);
    }
  };

  const handleAddBudget = async (data: Omit<Budget, 'id' | 'project_id'>) => {
    setSubmitting(true);
    try {
      await addBudget(projectId, data);
      await fetchActiveTabData('budgets');
      setShowBudgetModal(false);
    } catch (err: any) {
      alert('Error adding budget: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddRisk = async (data: Omit<Risk, 'id' | 'project_id'>) => {
    setSubmitting(true);
    try {
      await addRisk(projectId, data);
      await fetchActiveTabData('risks');
      setShowRiskModal(false);
    } catch (err: any) {
      alert('Error adding risk: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddIssue = async (data: Omit<Issue, 'id' | 'project_id'>) => {
    setSubmitting(true);
    try {
      await addIssue(projectId, data);
      await fetchActiveTabData('issues');
      setShowIssueModal(false);
    } catch (err: any) {
      alert('Error adding issue: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddDecision = async (data: Omit<Decision, 'id' | 'project_id'>) => {
    setSubmitting(true);
    try {
      await addDecision(projectId, data);
      await fetchActiveTabData('decisions');
      setShowDecisionModal(false);
    } catch (err: any) {
      alert('Error adding decision: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Deletion Handlers
  const handleDeletePhase = async (id: string) => {
    if (confirm('Delete this project phase?')) {
      try {
        await deletePhase(projectId, id);
        await fetchActiveTabData('phases');
      } catch (err: any) {
        alert('Failed to delete phase: ' + err.message);
      }
    }
  };

  const handleDeleteMilestone = async (id: string) => {
    if (confirm('Delete this milestone?')) {
      try {
        await deleteMilestone(projectId, id);
        await fetchActiveTabData('milestones');
      } catch (err: any) {
        alert('Failed to delete milestone: ' + err.message);
      }
    }
  };

  const handleDeleteBudget = async (id: string) => {
    if (confirm('Delete this budget item?')) {
      try {
        await deleteBudget(projectId, id);
        await fetchActiveTabData('budgets');
      } catch (err: any) {
        alert('Failed to delete budget: ' + err.message);
      }
    }
  };

  const handleDeleteRisk = async (id: string) => {
    if (confirm('Delete this risk record?')) {
      try {
        await deleteRisk(projectId, id);
        await fetchActiveTabData('risks');
      } catch (err: any) {
        alert('Failed to delete risk: ' + err.message);
      }
    }
  };

  const handleDeleteIssue = async (id: string) => {
    if (confirm('Delete this issue record?')) {
      try {
        await deleteIssue(projectId, id);
        await fetchActiveTabData('issues');
      } catch (err: any) {
        alert('Failed to delete issue: ' + err.message);
      }
    }
  };

  const handleDeleteDecision = async (id: string) => {
    if (confirm('Delete this decision record?')) {
      try {
        await deleteDecision(projectId, id);
        await fetchActiveTabData('decisions');
      } catch (err: any) {
        alert('Failed to delete decision: ' + err.message);
      }
    }
  };

  const getStatusStyle = (status: Project['status']) => {
    switch (status) {
      case 'Planning':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Active':
        return 'bg-emerald-100 text-emerald-850 border-emerald-200';
      case 'Completed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'On Hold':
        return 'bg-amber-100 text-amber-850 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* breadcrumb & action header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4">
        <nav className="flex text-xs text-slate-400 gap-2 items-center">
          <button onClick={onBack} className="hover:text-slate-800 transition-colors font-medium cursor-pointer">Projects</button>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-slate-800 font-medium">{project.name}</span>
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded border border-slate-200 hover:bg-slate-200 transition-colors cursor-pointer shadow-xs"
          >
            Back to List
          </button>
          <button
            onClick={() => onEdit(project)}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors cursor-pointer shadow-sm shadow-blue-200"
          >
            Edit Project Scope
          </button>
        </div>
      </div>

      {/* Main Project Card Banner */}
      <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-3">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getStatusStyle(project.status)}`}>
                ● {project.status}
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">{project.name}</h1>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4 text-slate-400" />
                  <span className="font-semibold text-slate-600">Client:</span>
                  <span>{project.client_name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  <span className="font-semibold text-slate-600">Site:</span>
                  <span>{project.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span className="font-semibold text-slate-600">Timeline:</span>
                  <span>
                    {new Date(project.start_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    {' '}—{' '}
                    {new Date(project.end_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick KPI stats banner inside project header */}
            <div className="flex items-center gap-4 flex-shrink-0 bg-slate-50 border border-slate-200 p-4 rounded h-fit self-start md:self-center">
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Open Issues</span>
                <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded text-xs font-bold ${openIssuesCount > 0 ? 'bg-red-100 text-red-700' : 'bg-slate-200 text-slate-600'}`}>
                  {openIssuesCount}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Selection Row */}
        <div className="bg-slate-50/50 border-t border-slate-200 px-6 overflow-x-auto flex">
          <nav className="flex space-x-1" aria-label="Tabs">
            {[
              { id: 'overview', label: 'Overview', icon: Briefcase },
              { id: 'phases', label: `Phases (${phases.length})`, icon: Layers },
              { id: 'milestones', label: `Milestones (${completedMilestonesCount}/${milestones.length})`, icon: CheckCircle2 },
              { id: 'budgets', label: 'Budgets & Costs', icon: DollarSign },
              { id: 'risks', label: `Risks (${risks.length})`, icon: AlertTriangle },
              { id: 'issues', label: `Issues (${issues.length})`, icon: AlertCircle },
              { id: 'decisions', label: `Decisions (${decisions.length})`, icon: FileText },
              { id: 'weekly_summary', label: 'Weekly Summary', icon: Sparkles }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center gap-2 px-4 py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'border-blue-600 text-blue-650'
                      : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Panels */}
      <div className="space-y-6">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-6 space-y-4">
                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">Project Overview</h3>
                <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">{project.description || 'No description provided.'}</p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-6 space-y-4">
                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">Core Parameters</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-150">
                    <span className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-0.5">Project Name</span>
                    <span className="text-gray-800 font-semibold">{project.name}</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-150">
                    <span className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-0.5">Client / Developer</span>
                    <span className="text-gray-800 font-semibold">{project.client_name}</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-150 col-span-1 sm:col-span-2">
                    <span className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-0.5">Construction Address</span>
                    <span className="text-gray-800 font-semibold flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      {project.location}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-150">
                    <span className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-0.5">Commencement Date</span>
                    <span className="text-gray-800 font-semibold">{new Date(project.start_date).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-150">
                    <span className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-0.5">Completion Date</span>
                    <span className="text-gray-800 font-semibold">{new Date(project.end_date).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                  </div>
                </div>
              </div>

              {/* Project Intelligence section */}
              <ProjectIntelligence 
                projectId={projectId} 
                onRegenerated={() => setMemoryRefreshTrigger(prev => prev + 1)} 
              />

              {/* Enterprise Memory Layer section */}
              <ProjectMemory 
                projectId={projectId} 
                refreshTrigger={memoryRefreshTrigger} 
              />

              {/* Weekly Meeting Summary section */}
              <WeeklyMeetingSummary projectId={projectId} />
            </div>

            {/* Quick dashboard right column summary */}
            <div className="space-y-6">
              {/* Financial Health Widget */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h3 className="font-bold text-gray-900">Financial Utilization</h3>
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Allocated Budget</span>
                    <span className="font-bold text-gray-900">${Number(totalAllocated || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Remaining Cash</span>
                    <span className={`font-bold ${totalAllocated - totalSpent >= 0 ? 'text-emerald-700' : 'text-red-650'}`}>
                      ${Number((totalAllocated - totalSpent) || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="border-t border-gray-100 pt-3">
                    <div className="flex items-center justify-between text-xs font-bold uppercase text-gray-400 mb-1.5">
                      <span>Utilization %</span>
                      <span>{(isNaN(budgetUtilization) ? 0 : budgetUtilization).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-150 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${(isNaN(budgetUtilization) ? 0 : budgetUtilization) > 90 ? 'bg-red-500' : (isNaN(budgetUtilization) ? 0 : budgetUtilization) > 75 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                        style={{ width: `${Math.min((isNaN(budgetUtilization) ? 0 : budgetUtilization), 100)}%` }} 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Security & Risk Summary */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-6 space-y-4">
                <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-3">Site Intelligence Summary</h3>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-150">
                    <span className="block text-2xl font-bold text-gray-900">{phases.filter(p => p.status === 'In Progress').length}</span>
                    <span className="text-xs text-gray-500 font-medium">Active Phases</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-150">
                    <span className="block text-2xl font-bold text-emerald-600">{completedMilestonesCount}</span>
                    <span className="text-xs text-gray-500 font-medium">Milestones Met</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-150">
                    <span className="block text-2xl font-bold text-amber-600">{openRisksCount}</span>
                    <span className="text-xs text-gray-500 font-medium">Open Risks</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-150">
                    <span className="block text-2xl font-bold text-red-500">{openIssuesCount}</span>
                    <span className="text-xs text-gray-500 font-medium">Unresolved Issues</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PHASES TAB */}
        {activeTab === 'phases' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Project Phases</h3>
                <p className="text-sm text-gray-500 mt-0.5">Sequence of structural, installation, and architectural development cycles.</p>
              </div>
              <button
                onClick={() => setShowPhaseModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Add Phase
              </button>
            </div>

            {phases.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 border border-gray-150 rounded-xl">
                <Layers className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 font-semibold">No phases logged for this project</p>
                <p className="text-xs text-gray-400 mt-1">Add a phase to establish timelines for core construction milestones.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <th className="px-4 py-3">Phase Name</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Start Date</th>
                      <th className="px-4 py-3">End Date</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {phases.map((phase) => (
                      <tr key={phase.id} className="hover:bg-gray-50/50">
                        <td className="px-4 py-3.5 font-semibold text-gray-900">{phase.name}</td>
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${
                            phase.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                            phase.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                            phase.status === 'Delayed' ? 'bg-red-50 text-red-700 border-red-100' :
                            'bg-gray-50 text-gray-650 border-gray-150'
                          }`}>
                            {phase.status}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">{new Date(phase.start_date).toLocaleDateString(undefined, { dateStyle: 'medium' })}</td>
                        <td className="px-4 py-3.5">{new Date(phase.end_date).toLocaleDateString(undefined, { dateStyle: 'medium' })}</td>
                        <td className="px-4 py-3.5 text-right">
                          <button
                            onClick={() => handleDeletePhase(phase.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Phase"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* MILESTONES TAB */}
        {activeTab === 'milestones' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Project Milestones</h3>
                <p className="text-sm text-gray-500 mt-0.5">Identify key indicators of project progression, inspection approvals, or client sign-offs.</p>
              </div>
              <button
                onClick={() => setShowMilestoneModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Add Milestone
              </button>
            </div>

            {milestones.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 border border-gray-150 rounded-xl">
                <CheckCircle2 className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 font-semibold">No milestones logged</p>
                <p className="text-xs text-gray-400 mt-1">Establish critical target dates to monitor workflow delivery.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {milestones.map((milestone) => (
                  <div
                    key={milestone.id}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                      milestone.completed
                        ? 'bg-emerald-50/40 border-emerald-150'
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={milestone.completed}
                        onChange={() => handleToggleMilestone(milestone.id)}
                        className="h-5 w-5 rounded-sm border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                      <div>
                        <span className={`text-sm font-semibold block ${milestone.completed ? 'line-through text-gray-400' : 'text-gray-850'}`}>
                          {milestone.name}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                          <Calendar className="h-3.5 w-3.5" />
                          Due: {new Date(milestone.due_date).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-xs font-bold rounded-md border ${
                        milestone.completed
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          : 'bg-gray-50 text-gray-500 border-gray-150'
                      }`}>
                        {milestone.completed ? 'Met' : 'Pending'}
                      </span>
                      <button
                        onClick={() => handleDeleteMilestone(milestone.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Milestone"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* BUDGETS TAB */}
        {activeTab === 'budgets' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Budget Allocations</h3>
                <p className="text-sm text-gray-500 mt-0.5">Track financial divisions, subcontractor payouts, and material expenditures.</p>
              </div>
              <button
                onClick={() => setShowBudgetModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Add Budget Item
              </button>
            </div>

            {budgets.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 border border-gray-150 rounded-xl">
                <DollarSign className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 font-semibold">No budget categories configured</p>
                <p className="text-xs text-gray-400 mt-1">Start tracking material, labor, and consulting charges.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Financial KPI stats under Budget Tab */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 border border-gray-150 rounded-xl">
                    <span className="block text-xs font-bold text-gray-450 uppercase mb-1">Total Allocation</span>
                    <span className="text-xl font-bold text-gray-900">${Number(totalAllocated || 0).toLocaleString()}</span>
                  </div>
                  <div className="bg-gray-50 p-4 border border-gray-150 rounded-xl">
                    <span className="block text-xs font-bold text-gray-455 uppercase mb-1">Total Expensed</span>
                    <span className="text-xl font-bold text-gray-900">${Number(totalSpent || 0).toLocaleString()}</span>
                  </div>
                  <div className="bg-gray-50 p-4 border border-gray-150 rounded-xl">
                    <span className="block text-xs font-bold text-gray-450 uppercase mb-1">Variance remaining</span>
                    <span className={`text-xl font-bold ${totalAllocated - totalSpent >= 0 ? 'text-emerald-700' : 'text-red-650'}`}>
                      ${Number((totalAllocated - totalSpent) || 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <th className="px-4 py-3">Category</th>
                        <th className="px-4 py-3">Notes</th>
                        <th className="px-4 py-3 text-right">Allocated</th>
                        <th className="px-4 py-3 text-right">Spent</th>
                        <th className="px-4 py-3 text-right">Balance</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700">
                      {budgets.map((budget) => {
                        const budgetAllocatedVal = Number((budget as any).amount !== undefined ? (budget as any).amount : (budget.allocated || 0));
                        const budgetAllocated = isNaN(budgetAllocatedVal) ? 0 : budgetAllocatedVal;
                        const budgetSpentVal = Number(budget.spent || 0);
                        const budgetSpent = isNaN(budgetSpentVal) ? 0 : budgetSpentVal;
                        const balanceVal = budgetAllocated - budgetSpent;
                        const balance = isNaN(balanceVal) ? 0 : balanceVal;
                        return (
                          <tr key={budget.id} className="hover:bg-gray-50/50">
                            <td className="px-4 py-3.5 font-semibold text-gray-900">{budget.category}</td>
                            <td className="px-4 py-3.5 text-xs text-gray-500 max-w-xs truncate" title={budget.description}>
                              {budget.description || '—'}
                            </td>
                            <td className="px-4 py-3.5 text-right font-medium">${Number(budgetAllocated || 0).toLocaleString()}</td>
                            <td className="px-4 py-3.5 text-right font-medium text-gray-600">${Number(budgetSpent || 0).toLocaleString()}</td>
                            <td className={`px-4 py-3.5 text-right font-bold ${balance >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                              ${Number(balance || 0).toLocaleString()}
                            </td>
                            <td className="px-4 py-3.5 text-right">
                              <button
                                onClick={() => handleDeleteBudget(budget.id)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                title="Delete Budget Item"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* RISKS TAB */}
        {activeTab === 'risks' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Risk Mitigation Registry</h3>
                <p className="text-sm text-gray-500 mt-0.5">Outline structural hazards, scheduling impediments, and materials delays.</p>
              </div>
              <button
                onClick={() => setShowRiskModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Add Risk
              </button>
            </div>

            {risks.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 border border-gray-150 rounded-xl">
                <AlertTriangle className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 font-semibold">No risks registered</p>
                <p className="text-xs text-gray-400 mt-1">Register potential site hazards or material shortfalls proactively.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <th className="px-4 py-3">Risk Title & Description</th>
                      <th className="px-4 py-3">Likelihood</th>
                      <th className="px-4 py-3">Impact</th>
                      <th className="px-4 py-3">Owner</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {risks.map((risk) => (
                      <tr key={risk.id} className="hover:bg-gray-50/50">
                        <td className="px-4 py-3.5 max-w-sm">
                          <div className="font-semibold text-gray-900">{risk.title}</div>
                          <div className="text-xs text-gray-400 mt-1 leading-relaxed">{risk.description || 'No description provided.'}</div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-md border ${
                            risk.likelihood === 'High' ? 'bg-red-50 text-red-700 border-red-100' :
                            risk.likelihood === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                            'bg-blue-50 text-blue-700 border-blue-100'
                          }`}>
                            {risk.likelihood}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-md border ${
                            risk.impact === 'High' ? 'bg-red-50 text-red-700 border-red-100' :
                            risk.impact === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                            'bg-blue-50 text-blue-700 border-blue-100'
                          }`}>
                            {risk.impact}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                            <User className="h-3.5 w-3.5 text-gray-400" />
                            <span>{risk.owner}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold border ${
                            risk.status === 'Mitigated' ? 'bg-emerald-50 text-emerald-700 border-emerald-150' :
                            risk.status === 'Closed' ? 'bg-gray-50 text-gray-600 border-gray-150' :
                            'bg-red-50 text-red-700 border-red-150'
                          }`}>
                            {risk.status}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <button
                            onClick={() => handleDeleteRisk(risk.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Risk"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ISSUES TAB */}
        {activeTab === 'issues' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Issues & Blockers</h3>
                <p className="text-sm text-gray-500 mt-0.5">Review active onsite malfunctions, machinery breakdowns, or labor shortages.</p>
              </div>
              <button
                onClick={() => setShowIssueModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Add Issue
              </button>
            </div>

            {issues.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 border border-gray-150 rounded-xl">
                <AlertCircle className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 font-semibold">No issues currently logged</p>
                <p className="text-xs text-gray-400 mt-1">Add an issue if you encounter roadblocks during construction.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <th className="px-4 py-3">Issue Title & Details</th>
                      <th className="px-4 py-3">Owner / Assignee</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {issues.map((issue) => (
                      <tr key={issue.id} className="hover:bg-gray-50/50">
                        <td className="px-4 py-3.5 max-w-md">
                          <div className="font-semibold text-gray-900">{issue.title}</div>
                          <div className="text-xs text-gray-400 mt-1 leading-relaxed">{issue.description || 'No description provided.'}</div>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5 text-xs text-gray-600 font-semibold">
                            <User className="h-3.5 w-3.5 text-gray-400" />
                            <span>{issue.owner}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold border ${
                            issue.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700 border-emerald-150' :
                            issue.status === 'Closed' ? 'bg-gray-50 text-gray-605 border-gray-150' :
                            'bg-red-50 text-red-700 border-red-150'
                          }`}>
                            {issue.status}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <button
                            onClick={() => handleDeleteIssue(issue.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Issue"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* DECISIONS TAB */}
        {activeTab === 'decisions' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Change & Scope Decisions</h3>
                <p className="text-sm text-gray-500 mt-0.5">Permanent change orders, layout re-routes, and structural approval documents.</p>
              </div>
              <button
                onClick={() => setShowDecisionModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Add Decision
              </button>
            </div>

            {decisions.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 border border-gray-150 rounded-xl">
                <FileText className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 font-semibold">No critical decisions logged</p>
                <p className="text-xs text-gray-400 mt-1">Keep a durable trail of change-orders and approval logs.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {decisions.map((decision) => (
                  <div key={decision.id} className="bg-gray-50/50 border border-gray-200 rounded-xl p-5 space-y-3.5 relative hover:shadow-xs transition-shadow">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <span className="inline-block text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded">
                          {decision.reference || 'REF-N/A'}
                        </span>
                        <h4 className="text-sm font-bold text-gray-900">{decision.title}</h4>
                      </div>
                      <button
                        onClick={() => handleDeleteDecision(decision.id)}
                        className="text-gray-400 hover:text-red-600 p-1 rounded-lg hover:bg-white border border-transparent hover:border-gray-150 transition-colors cursor-pointer"
                        title="Delete Decision"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <p className="text-xs text-gray-600 leading-relaxed">{decision.description || 'No decision description provided.'}</p>

                    <div className="border-t border-gray-200/60 pt-3 flex items-center justify-between text-[11px] text-gray-450 font-medium">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>By: <span className="text-gray-700 font-semibold">{decision.decided_by}</span></span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(decision.decision_date).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* WEEKLY SUMMARY TAB */}
        {activeTab === 'weekly_summary' && (
          <div className="space-y-6">
            <WeeklyMeetingSummary projectId={projectId} />
          </div>
        )}
      </div>

      {/* Modal overlays */}
      {showPhaseModal && (
        <PhaseForm
          onSubmit={handleAddPhase}
          onClose={() => setShowPhaseModal(false)}
          isLoading={submitting}
        />
      )}
      {showMilestoneModal && (
        <MilestoneForm
          onSubmit={handleAddMilestone}
          onClose={() => setShowMilestoneModal(false)}
          isLoading={submitting}
        />
      )}
      {showBudgetModal && (
        <BudgetForm
          onSubmit={handleAddBudget}
          onClose={() => setShowBudgetModal(false)}
          isLoading={submitting}
        />
      )}
      {showRiskModal && (
        <RiskForm
          onSubmit={handleAddRisk}
          onClose={() => setShowRiskModal(false)}
          isLoading={submitting}
        />
      )}
      {showIssueModal && (
        <IssueForm
          onSubmit={handleAddIssue}
          onClose={() => setShowIssueModal(false)}
          isLoading={submitting}
        />
      )}
      {showDecisionModal && (
        <DecisionForm
          onSubmit={handleAddDecision}
          onClose={() => setShowDecisionModal(false)}
          isLoading={submitting}
        />
      )}
    </div>
  );
}
