/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Decision } from '../types';
import { CheckSquare, X, Plus } from 'lucide-react';

interface DecisionFormProps {
  onSubmit: (data: Omit<Decision, 'id' | 'project_id'>) => void;
  onClose: () => void;
  isLoading?: boolean;
}

export default function DecisionForm({ onSubmit, onClose, isLoading = false }: DecisionFormProps) {
  const [formData, setFormData] = useState<Omit<Decision, 'id' | 'project_id'>>({
    title: '',
    description: '',
    decided_by: '',
    decision_date: '',
    reference: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Decision Title is required';
    if (!formData.decided_by.trim()) newErrors.decided_by = 'Decision Maker is required';
    if (!formData.decision_date) newErrors.decision_date = 'Decision Date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
            <CheckSquare className="h-5 w-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-900">Add Project Decision</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Decision Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Decision Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Approved switch to slag concrete"
              className={`w-full rounded-lg border px-3.5 py-2 text-sm text-gray-900 shadow-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden transition-colors ${
                errors.title ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300'
              }`}
            />
            {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
          </div>

          {/* Decided By & Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="decided_by" className="block text-sm font-medium text-gray-700 mb-1">
                Decided By <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="decided_by"
                name="decided_by"
                value={formData.decided_by}
                onChange={handleChange}
                placeholder="e.g. Elena Rostova"
                className={`w-full rounded-lg border px-3.5 py-2 text-sm text-gray-900 shadow-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden transition-colors ${
                  errors.decided_by ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300'
                }`}
              />
              {errors.decided_by && <p className="mt-1 text-xs text-red-600">{errors.decided_by}</p>}
            </div>

            <div>
              <label htmlFor="decision_date" className="block text-sm font-medium text-gray-700 mb-1">
                Decision Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="decision_date"
                name="decision_date"
                value={formData.decision_date}
                onChange={handleChange}
                className={`w-full rounded-lg border px-3.5 py-2 text-sm text-gray-900 shadow-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden transition-colors bg-white ${
                  errors.decision_date ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300'
                }`}
              />
              {errors.decision_date && <p className="mt-1 text-xs text-red-600">{errors.decision_date}</p>}
            </div>
          </div>

          {/* Reference Link / Code */}
          <div>
            <label htmlFor="reference" className="block text-sm font-medium text-gray-700 mb-1">
              Reference Code / Document ID
            </label>
            <input
              type="text"
              id="reference"
              name="reference"
              value={formData.reference}
              onChange={handleChange}
              placeholder="e.g. DEC-2026-004 or meeting minute URL"
              className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-900 shadow-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Decision Details & Implications
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide a complete description of why this decision was reached and its implications on the project scope/budget."
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
              Add Decision
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
