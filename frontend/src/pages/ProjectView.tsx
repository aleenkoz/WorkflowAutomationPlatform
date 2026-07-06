/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Project } from '../types';
import ProjectDetails from '../components/ProjectDetails';

interface ProjectViewProps {
  projectId: string;
  onBack: () => void;
  onEdit: (project: Project) => void;
}

export default function ProjectView({ projectId, onBack, onEdit }: ProjectViewProps) {
  return (
    <div className="py-2 animate-fade-in">
      <ProjectDetails 
        projectId={projectId} 
        onBack={onBack} 
        onEdit={onEdit} 
      />
    </div>
  );
}
