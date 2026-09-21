import {apiClient} from '../../api/axios';

export interface Issue {
    id: number;
    issueKey: string;
    title: string;
    description: string;
    type: 'EPIC' | 'STORY' | 'TASK' | 'BUG' | 'SUBTASK';
    status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'TESTING' | 'DONE' | 'CLOSED';
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface IssueActivity {
    id: number;
    actionType: string;
    oldValue: string;
    newValue: string;
    createdAt: string;
    actor: { firstName: string, lastName: string };
}

export interface IssueDetailsResponse {
    issue: Issue;
    comments: { id: number, content: string, createdAt: string, author: { firstName: string, lastName: string } }[];
    activities: IssueActivity[];
}

export interface CreateIssueRequest {
    title: string;
    description?: string;
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

export const getIssueDetails = async (issueId: number): Promise<IssueDetailsResponse> => {
    const response = await apiClient.get<IssueDetailsResponse>(`/issues/${issueId}`);
    return response.data;
};
export const updateIssueStatus = async (issueId: number, status: string): Promise<Issue> => {
    const response = await apiClient.patch<Issue>(`/issues/${issueId}/status?status=${status}`);
    return response.data;
};

export const addComment = async (issueId: number, content: string): Promise<any> => {
    const response = await apiClient.post(`/issues/${issueId}/comments`, content, {
        headers: {'Content-Type': 'text/plain'} // We are just sending plain text!
    });
    return response.data;
};
