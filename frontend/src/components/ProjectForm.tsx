/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Project } from '../types';
import { Briefcase, ArrowLeft, Loader2, Save } from 'lucide-react';

interface ProjectFormProps {
  initialValues?: Project;
  onSubmit: (data: Omit<Project, 'id'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ProjectForm({ initialValues, onSubmit, onCancel, isLoading = false }: ProjectFormProps) {
  const [formData, setFormData] = useState<Omit<Project, 'id'>>({
    name: initialValues?.name || '',
    client_name: initialValues?.client_name || '',
    location: initialValues?.location || '',
    start_date: initialValues?.start_date || '',
    end_date: initialValues?.end_date || '',
    status: initialValues?.status || 'Planning',
    description: initialValues?.description || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Project Name is required';
    if (!formData.client_name.trim()) newErrors.client_name = 'Client Name is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.start_date) newErrors.start_date = 'Start Date is required';
    if (!formData.end_date) newErrors.end_date = 'End Date is required';
    if (formData.start_date && formData.end_date && formData.start_date > formData.end_date) {
      newErrors.end_date = 'End Date must be after Start Date';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
    <div className="bg-white rounded-xl border border-gray-200 shadow-xs max-w-3xl mx-auto overflow-hidden">
      <div className="border-b border-gray-100 bg-gray-50/75 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            {initialValues ? 'Modify Construction Project' : 'Create Construction Project'}
          </h2>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Project Name */}
          <div className="md:col-span-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Grand Horizon Hotel & Suites"
              className={`w-full rounded-lg border px-3.5 py-2 text-sm text-gray-900 shadow-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden transition-colors ${
                errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300'
              }`}
            />
            {errors.name && <p className="mt-1.5 text-xs text-red-600">{errors.name}</p>}
          </div>

          {/* Client Name */}
          <div>
            <label htmlFor="client_name" className="block text-sm font-medium text-gray-700 mb-1.5">
              Client Name / Entity <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="client_name"
              name="client_name"
              value={formData.client_name}
              onChange={handleChange}
              placeholder="e.g. Horizon Developers Group"
              className={`w-full rounded-lg border px-3.5 py-2 text-sm text-gray-900 shadow-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden transition-colors ${
                errors.client_name ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300'
              }`}
            />
            {errors.client_name && <p className="mt-1.5 text-xs text-red-600">{errors.client_name}</p>}
          </div>

          {/* Status Select */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1.5">
              Project Status <span className="text-red-500">*</span>
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-900 shadow-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden transition-colors bg-white"
            >
              <option value="Planning">Planning</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>

          {/* Location */}
          <div className="md:col-span-2">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1.5">
              Site Location Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. 742 Evergreen Terrace, Springfield"
              className={`w-full rounded-lg border px-3.5 py-2 text-sm text-gray-900 shadow-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden transition-colors ${
                errors.location ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300'
              }`}
            />
            {errors.location && <p className="mt-1.5 text-xs text-red-600">{errors.location}</p>}
          </div>

          {/* Start Date */}
          <div>
            <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1.5">
              Target Start Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="start_date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              className={`w-full rounded-lg border px-3.5 py-2 text-sm text-gray-900 shadow-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden transition-colors ${
                errors.start_date ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300'
              }`}
            />
            {errors.start_date && <p className="mt-1.5 text-xs text-red-600">{errors.start_date}</p>}
          </div>

          {/* End Date */}
          <div>
            <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-1.5">
              Target Completion Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="end_date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              className={`w-full rounded-lg border px-3.5 py-2 text-sm text-gray-900 shadow-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden transition-colors ${
                errors.end_date ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300'
              }`}
            />
            {errors.end_date && <p className="mt-1.5 text-xs text-red-600">{errors.end_date}</p>}
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
              Project Scope & Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Outline the construction scope, parameters, resource details, and other critical background information."
              className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-900 shadow-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden transition-colors resize-y"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="border-t border-gray-100 pt-5 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {initialValues ? 'Save Changes' : 'Create Project'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
