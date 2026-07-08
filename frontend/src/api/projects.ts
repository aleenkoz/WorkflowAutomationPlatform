/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { apiClient, getApiMode, getMockDb, saveMockDb, API_BASE_URL } from './config';
import { Project } from '../types';

export const getProjects = async (): Promise<Project[]> => {
  if (getApiMode() === 'mock') {
    return getMockDb().projects;
  }
  const response = await apiClient.get<Project[]>(`/api/v1/projects`);
  return response.data;
};

export const getProject = async (id: string | number): Promise<Project> => {
  if (getApiMode() === 'mock') {
    const project = getMockDb().projects.find((p) => String(p.id) === String(id));
    if (!project) throw new Error('Project not found');
    return project;
  }
  const response = await apiClient.get<Project>(`/api/v1/projects/${id}`);
  return response.data;
};

export const createProject = async (projectData: Omit<Project, 'id'>): Promise<Project> => {
  if (getApiMode() === 'mock') {
    const db = getMockDb();
    const newProject: Project = {
      ...projectData,
      id: 'p_' + Date.now(),
    };
    db.projects.push(newProject);
    saveMockDb(db);
    return newProject;
  }
  const response = await apiClient.post<Project>(`/api/v1/projects`, projectData);
  return response.data;
};

export const updateProject = async (id: string | number, projectData: Omit<Project, 'id'>): Promise<Project> => {
  if (getApiMode() === 'mock') {
    const db = getMockDb();
    const index = db.projects.findIndex((p) => String(p.id) === String(id));
    if (index === -1) throw new Error('Project not found');
    db.projects[index] = { ...projectData, id: String(id) };
    saveMockDb(db);
    return db.projects[index];
  }
  const response = await apiClient.put<Project>(`/api/v1/projects/${id}`, projectData);
  return response.data;
};

export const deleteProject = async (id: string | number): Promise<void> => {
  if (getApiMode() === 'mock') {
    const db = getMockDb();
    const idStr = String(id);
    db.projects = db.projects.filter((p) => String(p.id) !== idStr);
    db.phases = db.phases.filter((p) => String(p.project_id) !== idStr);
    db.milestones = db.milestones.filter((m) => String(m.project_id) !== idStr);
    db.budgets = db.budgets.filter((b) => String(b.project_id) !== idStr);
    db.risks = db.risks.filter((r) => String(r.project_id) !== idStr);
    db.issues = db.issues.filter((i) => String(i.project_id) !== idStr);
    db.decisions = db.decisions.filter((d) => String(d.project_id) !== idStr);
    saveMockDb(db);
    return;
  }
  await apiClient.delete(`/api/v1/projects/${id}`);
};
