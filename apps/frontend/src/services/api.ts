import { AIInsights, AskAIResponse, Employee } from '../types';

const request = async <T>(input: RequestInfo, init?: RequestInit): Promise<T> => {
  const response = await fetch(input, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {})
    },
    ...init
  });

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => ({ message: 'Request failed' }))) as { message?: string };
    throw new Error(errorBody.message ?? 'Request failed');
  }

  return response.json() as Promise<T>;
};

export const api = {
  getEmployees: (managerId = 'mgr-001') => request<Employee[]>(`/api/employees?managerId=${managerId}`),
  getEmployee: (id: string) => request<Employee>(`/api/employees/${id}`),
  getJourneySummary: (id: string) => request<{ employeeId: string; summary: string }>(`/api/employees/${id}/journey-summary`),
  getAIInsights: (employeeId: string) =>
    request<AIInsights>('/api/ai/insights', {
      method: 'POST',
      body: JSON.stringify({ employeeId })
    }),
  askAI: (payload: { question: string; employeeId?: string; managerId?: string }) =>
    request<AskAIResponse>('/api/ai/ask', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
};
