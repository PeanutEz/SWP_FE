import { api } from './api';

export interface GeminiRequest {
	prompt: string;
}

export interface GeminiResponse {
	answer: string;
}

export interface ChatMessage {
	id: string;
	type: 'user' | 'gemini';
	content: string;
	timestamp: Date;
	isLoading?: boolean;
}

export const askGemini = async (prompt: string): Promise<GeminiResponse> => {
	const response = await api.post('http://localhost:3000/api/gemini/ask', { prompt });
	return response.data;
};

export const formatChatMessage = (
	content: string,
	type: 'user' | 'gemini',
	isLoading = false,
): ChatMessage => {
	return {
		id: `${type}-${Date.now()}-${Math.random()}`,
		type,
		content,
		timestamp: new Date(),
		isLoading,
	};
};

export const formatTimestamp = (timestamp: Date): string => {
	return timestamp.toLocaleTimeString('vi-VN', {
		hour: '2-digit',
		minute: '2-digit',
	});
};
