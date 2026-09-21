import {apiClient} from "../../api/axios.ts";

export interface Project {
    id: number;
    name: string;
    projectKey: string;
    description: string;
}

export interface CreateProjectRequest {
    name: string;
    projectKey: string;
    description: string;
    organizationId: number;
}

export const getProjects = async (): Promise<Project[]> => {
    const response = await apiClient.get<Project[]>('/projects');
    return response.data;
};

export const createProject = async (data: CreateProjectRequest): Promise<Project> => {
    const response = await apiClient.post<Project>('/projects', data);
    return response.data;
};