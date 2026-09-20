import { apiClient } from '../../api/axios';

export interface AuthenticationRequest {
    email: string;
    password: string;
}

export interface AuthenticationResponse {
    token: string;
}

export const loginUser = async (data: AuthenticationRequest): Promise<AuthenticationResponse> => {
    const response = await apiClient.post<AuthenticationResponse>('/auth/authenticate', data);
    return response.data;
};
