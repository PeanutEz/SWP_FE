import { api } from './api';

export interface UploadResponse {
	message: string;
	url: string;
}

export interface MultipleUploadResponse {
	message: string;
	files: Array<{
		url: string;
		public_id: string;
	}>;
}

export const uploadSingleImage = async (
	file: File,
): Promise<UploadResponse> => {
	const formData = new FormData();
	formData.append('file', file);

	const response = await api.post('http://localhost:3000/api/upload/file', formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	});

	return response.data;
};

export const uploadMultipleImages = async (
	files: File[],
): Promise<MultipleUploadResponse> => {
	const formData = new FormData();
	files.forEach((file) => {
		formData.append('file', file);
	});

	const response = await api.post('http://localhost:3000/api/upload/files', formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	});

	return response.data;
};
