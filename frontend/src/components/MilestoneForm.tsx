/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Milestone } from '../types';
import { Calendar, X, Plus } from 'lucide-react';

interface MilestoneFormProps {
  onSubmit: (data: Omit<Milestone, 'id' | 'project_id'>) => void;
  onClose: () => void;
  isLoading?: boolean;
}

export default function MilestoneForm({ onSubmit, onClose, isLoading = false }: MilestoneFormProps) {
  const [formData, setFormData] = useState<Omit<Milestone, 'id' | 'project_id'>>({
    name: '',
    due_date: '',
    completed: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Milestone Name is required';
    if (!formData.due_date) newErrors.due_date = 'Due Date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
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
            <Calendar className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Add Project Milestone</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Milestone Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Milestone Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Rough Structural Framework Complete"
              className={`w-full rounded-lg border px-3.5 py-2 text-sm text-gray-900 shadow-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden transition-colors ${
                errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300'
              }`}
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
          </div>

          {/* Due Date */}
          <div>
            <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 mb-1">
              Target Due Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="due_date"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
              className={`w-full rounded-lg border px-3.5 py-2 text-sm text-gray-900 shadow-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden transition-colors bg-white ${
                errors.due_date ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300'
              }`}
            />
            {errors.due_date && <p className="mt-1 text-xs text-red-600">{errors.due_date}</p>}
          </div>

          {/* Completed Checkbox */}
          <div className="flex items-center gap-2.5 bg-gray-50 p-3 rounded-lg border border-gray-150">
            <input
              type="checkbox"
              id="completed"
              name="completed"
              checked={formData.completed}
              onChange={handleChange}
              className="h-4.5 w-4.5 rounded-sm border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor="completed" className="text-sm font-medium text-gray-800 cursor-pointer select-none">
              Mark as completed immediately
            </label>
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
              Add Milestone
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
