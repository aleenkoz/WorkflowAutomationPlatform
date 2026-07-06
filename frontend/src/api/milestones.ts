/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { axiosInstance, getApiMode, getMockDb, saveMockDb } from './config';
import { Milestone } from '../types';

export const getMilestones = async (projectId: string): Promise<Milestone[]> => {
  if (getApiMode() === 'mock') {
    return getMockDb().milestones.filter((m) => m.project_id === projectId);
  }
  const response = await axiosInstance.get<Milestone[]>(`/projects/${projectId}/milestones`);
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
  const response = await axiosInstance.post<Milestone>(`/projects/${projectId}/milestones`, milestoneData);
  return response.data;
};

export const toggleMilestone = async (milestoneId: string): Promise<Milestone> => {
  if (getApiMode() === 'mock') {
    const db = getMockDb();
    const index = db.milestones.findIndex((m) => m.id === milestoneId);
    if (index === -1) throw new Error('Milestone not found');
    db.milestones[index].completed = !db.milestones[index].completed;
    saveMockDb(db);
    return db.milestones[index];
  }
  const response = await axiosInstance.put<Milestone>(`/milestones/${milestoneId}/toggle`);
  return response.data;
};

export const deleteMilestone = async (milestoneId: string): Promise<void> => {
  if (getApiMode() === 'mock') {
    const db = getMockDb();
    db.milestones = db.milestones.filter((m) => m.id !== milestoneId);
    saveMockDb(db);
    return;
  }
  await axiosInstance.delete(`/milestones/${milestoneId}`);
};
