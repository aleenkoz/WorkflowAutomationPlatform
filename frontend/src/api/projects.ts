/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { axiosInstance, getApiMode, getMockDb, saveMockDb } from './config';
import { Project } from '../types';

export const getProjects = async (): Promise<Project[]> => {
  if (getApiMode() === 'mock') {
    return getMockDb().projects;
  }
  const response = await axiosInstance.get<Project[]>('/projects');
  return response.data;
};

export const getProject = async (id: string): Promise<Project> => {
  if (getApiMode() === 'mock') {
    const project = getMockDb().projects.find((p) => p.id === id);
    if (!project) throw new Error('Project not found');
    return project;
  }
  const response = await axiosInstance.get<Project>(`/projects/${id}`);
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
  const response = await axiosInstance.post<Project>('/projects', projectData);
  return response.data;
};

export const updateProject = async (id: string, projectData: Omit<Project, 'id'>): Promise<Project> => {
  if (getApiMode() === 'mock') {
    const db = getMockDb();
    const index = db.projects.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Project not found');
    db.projects[index] = { ...projectData, id };
    saveMockDb(db);
    return db.projects[index];
  }
  const response = await axiosInstance.put<Project>(`/projects/${id}`, projectData);
  return response.data;
};

export const deleteProject = async (id: string): Promise<void> => {
  if (getApiMode() === 'mock') {
    const db = getMockDb();
    db.projects = db.projects.filter((p) => p.id !== id);
    db.phases = db.phases.filter((p) => p.project_id !== id);
    db.milestones = db.milestones.filter((m) => m.project_id !== id);
    db.budgets = db.budgets.filter((b) => b.project_id !== id);
    db.risks = db.risks.filter((r) => r.project_id !== id);
    db.issues = db.issues.filter((i) => i.project_id !== id);
    db.decisions = db.decisions.filter((d) => d.project_id !== id);
    saveMockDb(db);
    return;
  }
  await axiosInstance.delete(`/projects/${id}`);
};
