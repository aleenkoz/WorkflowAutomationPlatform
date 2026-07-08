/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { apiClient, getApiMode, getMockDb, saveMockDb } from './config';
import { Budget } from '../types';

export const getBudgets = async (projectId: string): Promise<Budget[]> => {
  if (getApiMode() === 'mock') {
    return getMockDb().budgets.filter((b) => b.project_id === projectId);
  }
  const response = await apiClient.get<Budget[]>(`/api/v1/projects/${projectId}/budgets`);
  return response.data;
};

export const addBudget = async (projectId: string, budgetData: Omit<Budget, 'id' | 'project_id'>): Promise<Budget> => {
  if (getApiMode() === 'mock') {
    const db = getMockDb();
    const newBudget: Budget = {
      ...budgetData,
      id: 'b_' + Date.now(),
      project_id: projectId,
    };
    db.budgets.push(newBudget);
    saveMockDb(db);
    return newBudget;
  }
  const response = await apiClient.post<Budget>(`/api/v1/projects/${projectId}/budgets`, budgetData);
  return response.data;
};

export const deleteBudget = async (projectId: string | number, budgetId: string): Promise<void> => {
  if (getApiMode() === 'mock') {
    const db = getMockDb();
    db.budgets = db.budgets.filter((b) => b.id !== budgetId);
    saveMockDb(db);
    return;
  }
  await apiClient.delete(`/api/v1/projects/${projectId}/budgets/${budgetId}`);
};
