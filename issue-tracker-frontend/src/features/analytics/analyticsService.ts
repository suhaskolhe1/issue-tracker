import { apiClient } from '../../api/axios';

export interface ProjectAnalytics {
    totalIssues: number;
    todoCount: number;
    inProgressCount: number;
    doneCount: number;
}

export const getProjectAnalytics = async (projectId: number): Promise<ProjectAnalytics> => {
    const response = await apiClient.get<ProjectAnalytics>(`/analytics/project/${projectId}`);
    return response.data;
};
