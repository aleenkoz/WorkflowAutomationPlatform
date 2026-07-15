/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { apiClient, getApiMode } from './config';

export interface ChatInteraction {
  id?: number;
  project_id: number | string;
  user_message: string;
  hermes_answer: string;
  created_at?: string;
}

// In-memory chat store for mock mode
const mockChatStore: Record<string, ChatInteraction[]> = {};

/**
 * Normalizes a project ID to a number for strict backend requirements if needed,
 * while keeping original string representation for mock mode.
 */
function getNumericProjectId(projectId: number | string): number {
  if (typeof projectId === 'number') {
    return projectId;
  }
  const parsed = parseInt(projectId.replace(/\D/g, ''), 10);
  return isNaN(parsed) ? 1 : parsed;
}

/**
 * Sends a chat message to Hermes using query parameters
 */
export async function sendChatMessage(projectId: number | string, message: string): Promise<{ answer: string }> {
  if (getApiMode() === 'mock') {
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const lowerMessage = message.toLowerCase();
    let answer = '';

    if (lowerMessage.includes('risk') || lowerMessage.includes('issue')) {
      answer = `Based on my recent scans, there is a High Severity Coordination risk detected on this project. Specifically, the site framing milestone is threatened by a delay in structural drawing submittals. Also, the plumbing subcontractor reported layout mismatches in Zone B. Would you like me to draft an follow-up email to the engineering team?`;
    } else if (lowerMessage.includes('price') || lowerMessage.includes('material') || lowerMessage.includes('cost')) {
      answer = `My predictive intelligence model shows significant volatility in copper prices. I foresee a potential 12-15% price increase in Copper Wire over the next 30 days due to supply shortages at regional distribution centers. I recommend securing copper structural cabling orders immediately. Steel remains stable with a slight downward trend.`;
    } else if (lowerMessage.includes('meeting') || lowerMessage.includes('weekly')) {
      answer = `The last weekly meeting summary indicates that framing is 65% complete, but electrical and mechanical rough-ins are currently on hold pending inspector visits. The team is aiming to resolve the concrete core drill requirements by this Thursday to keep the secondary slab pour on track.`;
    } else {
      answer = `Hello! I am Hermes, your project intelligence assistant. I am currently monitoring all schedules, material costs, email logs, and weekly summaries for this project. How can I assist you with site risks or pricing trends today?`;
    }

    return { answer };
  }

  const numericId = getNumericProjectId(projectId);
  // POST /api/v1/chat with query parameters: project_id and message
  const response = await apiClient.post<any>(
    `/api/v1/chat?project_id=${numericId}&message=${encodeURIComponent(message)}`,
    {}
  );
  
  // Normalize the response text since the backend returns a raw text string
  if (!response.data) {
    return { answer: '' };
  }
  
  if (typeof response.data === 'string') {
    return { answer: response.data };
  }
  
  if (typeof response.data === 'object') {
    return { 
      answer: response.data.answer || response.data.message || response.data.response || JSON.stringify(response.data) 
    };
  }
  
  return { answer: String(response.data) };
}

/**
 * Fetches all chat interactions for a project
 */
export async function getChatHistory(projectId: number | string): Promise<ChatInteraction[]> {
  const projKey = String(projectId);
  
  if (getApiMode() === 'mock') {
    await new Promise((resolve) => setTimeout(resolve, 400));
    if (!mockChatStore[projKey]) {
      // Return a welcoming initial message from Hermes
      mockChatStore[projKey] = [
        {
          project_id: projectId,
          user_message: "Hello Hermes, can you help me?",
          hermes_answer: "Hello! I am Hermes, your AI project intelligence engine. I can help you analyze risks, review meeting logs, predict material price movements, and search through project memories. What would you like to discuss?",
          created_at: new Date(Date.now() - 3600000).toISOString()
        }
      ];
    }
    return mockChatStore[projKey];
  }

  const numericId = getNumericProjectId(projectId);
  const response = await apiClient.get<ChatInteraction[]>(`/api/v1/memory/chat/all/${numericId}`);
  
  // Ensure the response is parsed correctly as an array
  if (Array.isArray(response.data)) {
    return response.data;
  }
  return [];
}

/**
 * Stores a chat interaction in the memory layer
 */
export async function storeChatInteraction(
  projectId: number | string,
  userMessage: string,
  hermesAnswer: string
): Promise<{ success: boolean }> {
  const projKey = String(projectId);

  if (getApiMode() === 'mock') {
    if (!mockChatStore[projKey]) {
      mockChatStore[projKey] = [];
    }
    mockChatStore[projKey].push({
      project_id: projectId,
      user_message: userMessage,
      hermes_answer: hermesAnswer,
      created_at: new Date().toISOString()
    });
    return { success: true };
  }

  const numericId = getNumericProjectId(projectId);
  const response = await apiClient.post<any>('/api/v1/memory/chat/store', {
    project_id: numericId,
    user_message: userMessage,
    hermes_answer: hermesAnswer
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  return { success: response.status === 200 || response.status === 250 || response.data?.success || true };
}
