/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { axiosInstance, getApiMode, getMockDb, saveMockDb } from './config';
import { Decision } from '../types';

export const getDecisions = async (projectId: string): Promise<Decision[]> => {
  if (getApiMode() === 'mock') {
    return getMockDb().decisions.filter((d) => d.project_id === projectId);
  }
  const response = await axiosInstance.get<Decision[]>(`/projects/${projectId}/decisions`);
  return response.data;
};

export const addDecision = async (projectId: string, decisionData: Omit<Decision, 'id' | 'project_id'>): Promise<Decision> => {
  if (getApiMode() === 'mock') {
    const db = getMockDb();
    const newDecision: Decision = {
      ...decisionData,
      id: 'd_' + Date.now(),
      project_id: projectId,
    };
    db.decisions.push(newDecision);
    saveMockDb(db);
    return newDecision;
  }
  const response = await axiosInstance.post<Decision>(`/projects/${projectId}/decisions`, decisionData);
  return response.data;
};

export const deleteDecision = async (decisionId: string): Promise<void> => {
  if (getApiMode() === 'mock') {
    const db = getMockDb();
    db.decisions = db.decisions.filter((d) => d.id !== decisionId);
    saveMockDb(db);
    return;
  }
  await axiosInstance.delete(`/decisions/${decisionId}`);
};
