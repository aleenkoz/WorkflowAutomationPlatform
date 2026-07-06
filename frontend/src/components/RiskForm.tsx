/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Risk } from '../types';
import { AlertTriangle, X, Plus } from 'lucide-react';

interface RiskFormProps {
  onSubmit: (data: Omit<Risk, 'id' | 'project_id'>) => void;
  onClose: () => void;
  isLoading?: boolean;
}

export default function RiskForm({ onSubmit, onClose, isLoading = false }: RiskFormProps) {
  const [formData, setFormData] = useState<Omit<Risk, 'id' | 'project_id'>>({
    title: '',
    description: '',
    likelihood: 'Medium',
    impact: 'Medium',
    owner: '',
    status: 'Open',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Risk Title is required';
    if (!formData.owner.trim()) newErrors.owner = 'Risk Owner/Assignee is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white rounded-xl border border-gray-200 shadow-xl max-w-lg w-full overflow-hidden transform transition-all">
        <div className="border-b border-gray-100 bg-gray-50/75 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <h3 className="text-lg font-semibold text-gray-900">Add Project Risk</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Risk Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Risk Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Extreme weather postponing soil compacting"
              className={`w-full rounded-lg border px-3.5 py-2 text-sm text-gray-900 shadow-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden transition-colors ${
                errors.title ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300'
              }`}
            />
            {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
          </div>

          {/* Likelihood and Impact */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="likelihood" className="block text-sm font-medium text-gray-700 mb-1">
                Likelihood <span className="text-red-500">*</span>
              </label>
              <select
                id="likelihood"
                name="likelihood"
                value={formData.likelihood}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-900 shadow-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden transition-colors bg-white"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label htmlFor="impact" className="block text-sm font-medium text-gray-700 mb-1">
                Impact Level <span className="text-red-500">*</span>
              </label>
              <select
                id="impact"
                name="impact"
                value={formData.impact}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-900 shadow-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden transition-colors bg-white"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          {/* Owner and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="owner" className="block text-sm font-medium text-gray-700 mb-1">
                Risk Owner <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="owner"
                name="owner"
                value={formData.owner}
                onChange={handleChange}
                placeholder="e.g. John Doe"
                className={`w-full rounded-lg border px-3.5 py-2 text-sm text-gray-900 shadow-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden transition-colors ${
                  errors.owner ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300'
                }`}
              />
              {errors.owner && <p className="mt-1 text-xs text-red-600">{errors.owner}</p>}
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Mitigation Status <span className="text-red-500">*</span>
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-900 shadow-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden transition-colors bg-white"
              >
                <option value="Open">Open</option>
                <option value="Mitigated">Mitigated</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description / Mitigation Strategy
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="What makes this a risk, and how can we mitigate or avoid it?"
              className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-900 shadow-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden transition-colors resize-none"
            />
          </div>

          {/* Form Actions */}
          <div className="border-t border-gray-150 pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Add Risk
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
