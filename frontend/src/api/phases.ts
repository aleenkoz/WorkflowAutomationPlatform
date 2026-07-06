/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { axiosInstance, getApiMode, getMockDb, saveMockDb } from './config';
import { Phase } from '../types';

export const getPhases = async (projectId: string): Promise<Phase[]> => {
  if (getApiMode() === 'mock') {
    return getMockDb().phases.filter((p) => p.project_id === projectId);
  }
  const response = await axiosInstance.get<Phase[]>(`/projects/${projectId}/phases`);
  return response.data;
};

export const addPhase = async (projectId: string, phaseData: Omit<Phase, 'id' | 'project_id'>): Promise<Phase> => {
  if (getApiMode() === 'mock') {
    const db = getMockDb();
    const newPhase: Phase = {
      ...phaseData,
      id: 'ph_' + Date.now(),
      project_id: projectId,
    };
    db.phases.push(newPhase);
    saveMockDb(db);
    return newPhase;
  }
  const response = await axiosInstance.post<Phase>(`/projects/${projectId}/phases`, phaseData);
  return response.data;
};

export const deletePhase = async (phaseId: string): Promise<void> => {
  if (getApiMode() === 'mock') {
    const db = getMockDb();
    db.phases = db.phases.filter((p) => p.id !== phaseId);
    saveMockDb(db);
    return;
  }
  await axiosInstance.delete(`/phases/${phaseId}`);
};
