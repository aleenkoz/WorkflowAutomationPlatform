/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Budget } from '../types';
import { DollarSign, X, Plus } from 'lucide-react';

interface BudgetFormProps {
  onSubmit: (data: Omit<Budget, 'id' | 'project_id'>) => void;
  onClose: () => void;
  isLoading?: boolean;
}

export default function BudgetForm({ onSubmit, onClose, isLoading = false }: BudgetFormProps) {
  const [formData, setFormData] = useState({
    category: '',
    allocated: '',
    spent: '',
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.category.trim()) newErrors.category = 'Budget Category is required';
    if (!formData.allocated) {
      newErrors.allocated = 'Allocated Budget is required';
    } else if (isNaN(Number(formData.allocated)) || Number(formData.allocated) < 0) {
      newErrors.allocated = 'Must be a valid positive number';
    }
    if (formData.spent && (isNaN(Number(formData.spent)) || Number(formData.spent) < 0)) {
      newErrors.spent = 'Must be a valid positive number';
    }
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
      onSubmit({
        category: formData.category,
        allocated: Number(formData.allocated),
        spent: formData.spent ? Number(formData.spent) : 0,
        description: formData.description,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white rounded-xl border border-gray-200 shadow-xl max-w-md w-full overflow-hidden transform transition-all">
        <div className="border-b border-gray-100 bg-gray-50/75 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-emerald-600" />
            <h3 className="text-lg font-semibold text-gray-900">Add Budget Item</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Budget Category <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g. Electrical Contracting, Foundation"
              className={`w-full rounded-lg border px-3.5 py-2 text-sm text-gray-900 shadow-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden transition-colors ${
                errors.category ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300'
              }`}
            />
            {errors.category && <p className="mt-1 text-xs text-red-600">{errors.category}</p>}
          </div>

          {/* Allocated & Spent */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="allocated" className="block text-sm font-medium text-gray-700 mb-1">
                Allocated Budget ($) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="allocated"
                name="allocated"
                value={formData.allocated}
                onChange={handleChange}
                placeholder="e.g. 50000"
                className={`w-full rounded-lg border px-3.5 py-2 text-sm text-gray-900 shadow-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden transition-colors ${
                  errors.allocated ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300'
                }`}
              />
              {errors.allocated && <p className="mt-1 text-xs text-red-600">{errors.allocated}</p>}
            </div>

            <div>
              <label htmlFor="spent" className="block text-sm font-medium text-gray-700 mb-1">
                Amount Spent ($)
              </label>
              <input
                type="text"
                id="spent"
                name="spent"
                value={formData.spent}
                onChange={handleChange}
                placeholder="e.g. 12000"
                className={`w-full rounded-lg border px-3.5 py-2 text-sm text-gray-900 shadow-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden transition-colors ${
                  errors.spent ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300'
                }`}
              />
              {errors.spent && <p className="mt-1 text-xs text-red-600">{errors.spent}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description / Notes
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Detail what is included in this category and specify subcontractors if applicable."
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
              Add Budget
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
