import { api } from './api';

export interface User {
	id: number;
	status: string;
	full_name: string;
	email: string;
	phone?: string;
	reputation: number;
	total_credit: number;
	role: string;
}

export interface LoginResponse {
	message: string;
	data: {
		user: User;
		access_token: string;
		expired_access_token: string;
		refresh_token: string;
		expired_refresh_token: string;
	};
}

export interface RegisterResponse {
	message: string;
	data: {
		user: User;
		access_token: string;
		expired_access_token: string;
		refresh_token: string;
		expired_refresh_token: string;
	};
}

export interface RegisterData {
	full_name: string;
	email: string;
	password: string;
	phone?: string;
}

export interface LoginData {
	email: string;
	password: string;
}

// Register user
export const registerUser = async (
	userData: RegisterData,
): Promise<RegisterResponse> => {
	const response = await api.post('http://localhost:3000/api/user/register', userData);
	return response.data;
};

// Login user
export const loginUser = async (
	credentials: LoginData,
): Promise<LoginResponse> => {
	const response = await api.post('http://localhost:3000/api/user/login', credentials);
	return response.data;
};

// Refresh token
export const refreshToken = async (
	token: string,
): Promise<{ access_token: string }> => {
	const response = await api.post(
		'/api/user/refresh-token',
		{},
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	);
	return response.data.data;
};

// Logout user
export const logoutUser = async (token: string): Promise<void> => {
	await api.post(
		'/api/user/logout',
		{},
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	);
};

// Local storage helpers
export const saveTokens = (tokens: {
	access_token: string;
	refresh_token: string;
	expired_access_token: string;
	expired_refresh_token: string;
}) => {
	localStorage.setItem('access_token', tokens.access_token);
	localStorage.setItem('refresh_token', tokens.refresh_token);
	localStorage.setItem('expired_access_token', tokens.expired_access_token);
	localStorage.setItem('expired_refresh_token', tokens.expired_refresh_token);
};

export const saveUser = (user: User) => {
	localStorage.setItem('user', JSON.stringify(user));
};

export const getStoredTokens = () => {
	return {
		access_token: localStorage.getItem('access_token'),
		refresh_token: localStorage.getItem('refresh_token'),
		expired_access_token: localStorage.getItem('expired_access_token'),
		expired_refresh_token: localStorage.getItem('expired_refresh_token'),
	};
};

export const getStoredUser = (): User | null => {
	const userStr = localStorage.getItem('user');
	return userStr ? JSON.parse(userStr) : null;
};

export const clearStorage = () => {
	localStorage.removeItem('access_token');
	localStorage.removeItem('refresh_token');
	localStorage.removeItem('expired_access_token');
	localStorage.removeItem('expired_refresh_token');
	localStorage.removeItem('user');
};

export const isAuthenticated = (): boolean => {
	const tokens = getStoredTokens();
	return !!tokens.access_token;
};
