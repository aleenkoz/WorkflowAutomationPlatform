/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { apiClient, getApiMode, getMockDb, saveMockDb } from './config';
import { Milestone } from '../types';

export const getMilestones = async (projectId: string): Promise<Milestone[]> => {
  if (getApiMode() === 'mock') {
    return getMockDb().milestones.filter((m) => m.project_id === projectId);
  }
  const response = await apiClient.get<Milestone[]>(`/api/v1/projects/${projectId}/milestones`);
  return response.data;
};

export const addMilestone = async (projectId: string, milestoneData: Omit<Milestone, 'id' | 'project_id'>): Promise<Milestone> => {
  if (getApiMode() === 'mock') {
    const db = getMockDb();
    const newMilestone: Milestone = {
      ...milestoneData,
      id: 'm_' + Date.now(),
      project_id: projectId,
    };
    db.milestones.push(newMilestone);
    saveMockDb(db);
    return newMilestone;
  }
  const response = await apiClient.post<Milestone>(`/api/v1/projects/${projectId}/milestones`, milestoneData);
  return response.data;
};

export const toggleMilestone = async (projectId: string | number, milestoneId: string): Promise<Milestone> => {
  if (getApiMode() === 'mock') {
    const db = getMockDb();
    const index = db.milestones.findIndex((m) => m.id === milestoneId);
    if (index === -1) throw new Error('Milestone not found');
    db.milestones[index].completed = !db.milestones[index].completed;
    saveMockDb(db);
    return db.milestones[index];
  }
  const response = await apiClient.put<Milestone>(`/api/v1/projects/${projectId}/milestones/${milestoneId}/toggle`);
  return response.data;
};

export const deleteMilestone = async (projectId: string | number, milestoneId: string): Promise<void> => {
  if (getApiMode() === 'mock') {
    const db = getMockDb();
    db.milestones = db.milestones.filter((m) => m.id !== milestoneId);
    saveMockDb(db);
    return;
  }
  await apiClient.delete(`/api/v1/projects/${projectId}/milestones/${milestoneId}`);
};
