/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Project } from '../types';
import { Briefcase, MapPin, Calendar, Trash2, Eye, ExternalLink } from 'lucide-react';

interface ProjectTableProps {
  projects: Project[];
  onView: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function ProjectTable({ projects, onView, onDelete }: ProjectTableProps) {
  const getStatusStyle = (status: Project['status']) => {
    switch (status) {
      case 'Planning':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Active':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Completed':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'On Hold':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-150 text-slate-700 border-slate-200';
    }
  };

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 bg-slate-50 rounded border border-slate-200 shadow-xs">
        <Briefcase className="h-12 w-12 text-slate-300 mb-3" />
        <p className="text-slate-500 font-semibold text-lg">No projects found</p>
        <p className="text-slate-400 text-xs mt-1">Get started by creating your first construction project.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <th className="px-6 py-4">Project Details</th>
              <th className="px-6 py-4">Client</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Duration</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs sm:text-sm text-slate-700">
            {projects.map((project) => (
              <tr 
                key={project.id} 
                className="hover:bg-slate-50/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="font-semibold text-slate-800 text-sm sm:text-base">{project.name}</div>
                  <div className="flex items-center gap-1.5 text-slate-450 text-xs mt-1">
                    <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                    <span>{project.location}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-medium text-slate-800">{project.client_name}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getStatusStyle(project.status)}`}>
                    {project.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1 text-slate-500 text-xs">
                    <Calendar className="h-3.5 w-3.5 text-slate-450" />
                    <span>
                      {new Date(project.start_date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                    </span>
                    <span className="text-slate-350">→</span>
                    <span>
                      {new Date(project.end_date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onView(project.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors border border-transparent hover:border-blue-100"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete "${project.name}"? This will remove all associated sub-records.`)) {
                          onDelete(project.id);
                        }
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors border border-transparent hover:border-red-100"
                      title="Delete Project"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
