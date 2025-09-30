import axios from 'axios';
import { getStoredTokens, refreshToken, clearStorage } from './auth.service';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export const api = axios.create({
	baseURL,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Request interceptor to add auth token
api.interceptors.request.use(
	(config) => {
		const tokens = getStoredTokens();
		if (tokens.access_token) {
			config.headers.Authorization = `Bearer ${tokens.access_token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
	(response) => {
		return response;
	},
	async (error) => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				const tokens = getStoredTokens();
				if (tokens.refresh_token) {
					const newTokens = await refreshToken(tokens.refresh_token);

					// Update the stored token
					localStorage.setItem(
						'access_token',
						newTokens.access_token,
					);

					// Retry the original request with new token
					originalRequest.headers.Authorization = `Bearer ${newTokens.access_token}`;
					return api(originalRequest);
				}
			} catch (refreshError) {
				// Refresh failed, clear storage and redirect to login
				clearStorage();
				window.location.href = '/login';
				return Promise.reject(refreshError);
			}
		}

		return Promise.reject(error);
	},
);
