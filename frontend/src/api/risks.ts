/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { axiosInstance, getApiMode, getMockDb, saveMockDb } from './config';
import { Risk } from '../types';

export const getRisks = async (projectId: string): Promise<Risk[]> => {
  if (getApiMode() === 'mock') {
    return getMockDb().risks.filter((r) => r.project_id === projectId);
  }
  const response = await axiosInstance.get<Risk[]>(`/projects/${projectId}/risks`);
  return response.data;
};

export const addRisk = async (projectId: string, riskData: Omit<Risk, 'id' | 'project_id'>): Promise<Risk> => {
  if (getApiMode() === 'mock') {
    const db = getMockDb();
    const newRisk: Risk = {
      ...riskData,
      id: 'r_' + Date.now(),
      project_id: projectId,
    };
    db.risks.push(newRisk);
    saveMockDb(db);
    return newRisk;
  }
  const response = await axiosInstance.post<Risk>(`/projects/${projectId}/risks`, riskData);
  return response.data;
};

export const deleteRisk = async (riskId: string): Promise<void> => {
  if (getApiMode() === 'mock') {
    const db = getMockDb();
    db.risks = db.risks.filter((r) => r.id !== riskId);
    saveMockDb(db);
    return;
  }
  await axiosInstance.delete(`/risks/${riskId}`);
};
