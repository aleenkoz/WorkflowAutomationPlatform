/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Project } from '../types';
import { createProject } from '../api/projects';
import ProjectForm from '../components/ProjectForm';

interface CreateProjectProps {
  onCancel: () => void;
  onSuccess: () => void;
}

export default function CreateProject({ onCancel, onSuccess }: CreateProjectProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: Omit<Project, 'id'>) => {
    setLoading(true);
    try {
      await createProject(data);
      onSuccess();
    } catch (err: any) {
      console.error(err);
      alert('Failed to log project: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-4 animate-fade-in">
      <ProjectForm 
        onSubmit={handleSubmit} 
        onCancel={onCancel} 
        isLoading={loading} 
      />
    </div>
  );
}
