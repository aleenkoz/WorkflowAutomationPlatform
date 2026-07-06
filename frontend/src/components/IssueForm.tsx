/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Issue } from '../types';
import { AlertCircle, X, Plus } from 'lucide-react';

interface IssueFormProps {
  onSubmit: (data: Omit<Issue, 'id' | 'project_id'>) => void;
  onClose: () => void;
  isLoading?: boolean;
}

export default function IssueForm({ onSubmit, onClose, isLoading = false }: IssueFormProps) {
  const [formData, setFormData] = useState<Omit<Issue, 'id' | 'project_id'>>({
    title: '',
    description: '',
    owner: '',
    status: 'Open',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Issue Title is required';
    if (!formData.owner.trim()) newErrors.owner = 'Owner is required';
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
      <div className="bg-white rounded-xl border border-gray-200 shadow-xl max-w-md w-full overflow-hidden transform transition-all">
        <div className="border-b border-gray-100 bg-gray-50/75 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <h3 className="text-lg font-semibold text-gray-900">Add Project Issue</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Issue Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Issue Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Discrepancy in foundation depth plan"
              className={`w-full rounded-lg border px-3.5 py-2 text-sm text-gray-900 shadow-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden transition-colors ${
                errors.title ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300'
              }`}
            />
            {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
          </div>

          {/* Owner & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="owner" className="block text-sm font-medium text-gray-700 mb-1">
                Owner <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="owner"
                name="owner"
                value={formData.owner}
                onChange={handleChange}
                placeholder="e.g. Marcus Aurelius"
                className={`w-full rounded-lg border px-3.5 py-2 text-sm text-gray-900 shadow-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden transition-colors ${
                  errors.owner ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300'
                }`}
              />
              {errors.owner && <p className="mt-1 text-xs text-red-600">{errors.owner}</p>}
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-900 shadow-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden transition-colors bg-white"
              >
                <option value="Open">Open</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Issue Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the current issue, roadblocks, and direct impacts on construction timeline."
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
              Add Issue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
