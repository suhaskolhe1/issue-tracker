
import { apiClient } from '../../api/axios';

export interface Issue {
    id: number;
    issueKey: string;
    title: string;
    description: string;
    type: 'EPIC' | 'STORY' | 'TASK' | 'BUG' | 'SUBTASK';
    status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'TESTING' | 'DONE' | 'CLOSED';
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface CreateIssueRequest {
    title: string;
    description: string;
    type: string;
    priority: string;
    projectId: number;
}

export const getIssuesByProject = async (projectId: number): Promise<Issue[]> => {
    const response = await apiClient.get<Issue[]>(`/issues/project/${projectId}`);
    return response.data;
};

export const createIssue = async (data: CreateIssueRequest): Promise<Issue> => {
    const response = await apiClient.post<Issue>('/issues', data);
    return response.data;
};
