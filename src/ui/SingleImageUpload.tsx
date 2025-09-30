import { useState, useRef } from 'react';
import { uploadSingleImage } from '../utils/upload.service';

interface SingleUploadProps {
	onUploadSuccess?: (url: string) => void;
}

const SingleImageUpload: React.FC<SingleUploadProps> = ({
	onUploadSuccess,
}) => {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string>('');
	const [uploadedUrl, setUploadedUrl] = useState<string>('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string>('');
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			// Validate file type
			if (!file.type.startsWith('image/')) {
				setError('Vui lòng chọn file ảnh!');
				return;
			}

			// Validate file size (max 5MB)
			if (file.size > 5 * 1024 * 1024) {
				setError('File quá lớn! Vui lòng chọn file dưới 5MB.');
				return;
			}

			setError('');
			setSelectedFile(file);
			setUploadedUrl('');

			// Create preview
			const reader = new FileReader();
			reader.onload = (e) => {
				setPreviewUrl(e.target?.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleUpload = async () => {
		if (!selectedFile) {
			setError('Vui lòng chọn file!');
			return;
		}

		setLoading(true);
		setError('');

		try {
			const response = await uploadSingleImage(selectedFile);
			setUploadedUrl(response.url);
			onUploadSuccess?.(response.url);
		} catch (err: any) {
			setError(err?.response?.data?.message || 'Upload thất bại!');
		} finally {
			setLoading(false);
		}
	};

	const handleReset = () => {
		setSelectedFile(null);
		setPreviewUrl('');
		setUploadedUrl('');
		setError('');
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	return (
		<div className='upload-container'>
			<h3>Upload 1 ảnh</h3>

			<div className='file-input-wrapper'>
				<input
					ref={fileInputRef}
					type='file'
					accept='image/*'
					onChange={handleFileSelect}
					className='file-input'
				/>
			</div>

			{error && <div className='error'>{error}</div>}

			{previewUrl && (
				<div className='preview-section'>
					<h4>Preview:</h4>
					<img
						src={previewUrl}
						alt='Preview'
						className='preview-image'
					/>
				</div>
			)}

			<div className='upload-actions'>
				<button
					onClick={handleUpload}
					disabled={!selectedFile || loading}
					className='upload-btn'>
					{loading ? 'Đang upload...' : 'Upload'}
				</button>

				<button
					onClick={handleReset}
					disabled={loading}
					className='reset-btn'>
					Reset
				</button>
			</div>

			{uploadedUrl && (
				<div className='success-section'>
					<h4>✅ Upload thành công!</h4>
					<div className='uploaded-image'>
						<img
							src={uploadedUrl}
							alt='Uploaded'
							className='result-image'
						/>
					</div>
					<div className='url-result'>
						<label>URL:</label>
						<input
							type='text'
							value={uploadedUrl}
							readOnly
							className='url-input'
						/>
						<button
							onClick={() =>
								navigator.clipboard.writeText(uploadedUrl)
							}
							className='copy-btn'>
							Copy
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default SingleImageUpload;
