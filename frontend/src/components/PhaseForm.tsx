/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Phase } from '../types';
import { Layers, X, Plus } from 'lucide-react';

interface PhaseFormProps {
  onSubmit: (data: Omit<Phase, 'id' | 'project_id'>) => void;
  onClose: () => void;
  isLoading?: boolean;
}

export default function PhaseForm({ onSubmit, onClose, isLoading = false }: PhaseFormProps) {
  const [formData, setFormData] = useState<Omit<Phase, 'id' | 'project_id'>>({
    name: '',
    status: 'Not Started',
    start_date: '',
    end_date: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Phase Name is required';
    if (!formData.start_date) newErrors.start_date = 'Start Date is required';
    if (!formData.end_date) newErrors.end_date = 'End Date is required';
    if (formData.start_date && formData.end_date && formData.start_date > formData.end_date) {
      newErrors.end_date = 'End Date must be after Start Date';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      <div className="bg-white rounded-xl border border-gray-200 shadow-xl max-w-md w-full overflow-hidden transform transition-all">
        <div className="border-b border-gray-100 bg-gray-50/75 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-emerald-600" />
            <h3 className="text-lg font-semibold text-gray-900">Add Project Phase</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Phase Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Phase Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Interior Drywall & Plastering"
              className={`w-full rounded-lg border px-3.5 py-2 text-sm text-gray-900 shadow-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden transition-colors ${
                errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300'
              }`}
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Phase Status <span className="text-red-500">*</span>
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-900 shadow-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden transition-colors bg-white"
            >
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Delayed">Delayed</option>
            </select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="start_date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className={`w-full rounded-lg border px-3.5 py-2 text-sm text-gray-900 shadow-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden transition-colors bg-white ${
                  errors.start_date ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300'
                }`}
              />
              {errors.start_date && <p className="mt-1 text-xs text-red-600">{errors.start_date}</p>}
            </div>

            <div>
              <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-1">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="end_date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className={`w-full rounded-lg border px-3.5 py-2 text-sm text-gray-900 shadow-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden transition-colors bg-white ${
                  errors.end_date ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300'
                }`}
              />
              {errors.end_date && <p className="mt-1 text-xs text-red-600">{errors.end_date}</p>}
            </div>
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
              Add Phase
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
