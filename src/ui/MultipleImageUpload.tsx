import { useState, useRef } from 'react';
import { uploadMultipleImages } from '../utils/upload.service';

interface MultipleUploadProps {
	onUploadSuccess?: (urls: string[]) => void;
}

interface FileWithPreview {
	file: File;
	preview: string;
	id: string;
}

const MultipleImageUpload: React.FC<MultipleUploadProps> = ({
	onUploadSuccess,
}) => {
	const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([]);
	const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string>('');
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || []);

		if (files.length === 0) return;

		// Validate total number of files
		if (selectedFiles.length + files.length > 5) {
			setError('Tối đa chỉ được chọn 5 ảnh!');
			return;
		}

		const validFiles: FileWithPreview[] = [];
		let hasError = false;

		files.forEach((file, index) => {
			// Validate file type
			if (!file.type.startsWith('image/')) {
				setError(`File "${file.name}" không phải là ảnh!`);
				hasError = true;
				return;
			}

			// Validate file size (max 5MB)
			if (file.size > 5 * 1024 * 1024) {
				setError(
					`File "${file.name}" quá lớn! Vui lòng chọn file dưới 5MB.`,
				);
				hasError = true;
				return;
			}

			const reader = new FileReader();
			reader.onload = (e) => {
				validFiles.push({
					file,
					preview: e.target?.result as string,
					id: `${Date.now()}-${index}`,
				});

				// When all files are processed
				if (validFiles.length === files.length && !hasError) {
					setSelectedFiles((prev) => [...prev, ...validFiles]);
					setError('');
				}
			};
			reader.readAsDataURL(file);
		});

		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	const removeFile = (id: string) => {
		setSelectedFiles((prev) => prev.filter((f) => f.id !== id));
		setError('');
	};

	const handleUpload = async () => {
		if (selectedFiles.length === 0) {
			setError('Vui lòng chọn ít nhất 1 file!');
			return;
		}

		setLoading(true);
		setError('');

		try {
			const files = selectedFiles.map((f) => f.file);
			const response = await uploadMultipleImages(files);
			const urls = response.files.map((f) => f.url);
			setUploadedUrls(urls);
			onUploadSuccess?.(urls);
		} catch (err: any) {
			setError(err?.response?.data?.message || 'Upload thất bại!');
		} finally {
			setLoading(false);
		}
	};

	const handleReset = () => {
		setSelectedFiles([]);
		setUploadedUrls([]);
		setError('');
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	const copyAllUrls = () => {
		const urlsText = uploadedUrls.join('\n');
		navigator.clipboard.writeText(urlsText);
	};

	return (
		<div className='upload-container'>
			<h3>Upload nhiều ảnh (tối đa 5)</h3>

			<div className='file-input-wrapper'>
				<input
					ref={fileInputRef}
					type='file'
					accept='image/*'
					multiple
					onChange={handleFileSelect}
					className='file-input'
				/>
				<p className='help-text'>
					Đã chọn: {selectedFiles.length}/5 ảnh
				</p>
			</div>

			{error && <div className='error'>{error}</div>}

			{selectedFiles.length > 0 && (
				<div className='preview-section'>
					<h4>Preview:</h4>
					<div className='preview-grid'>
						{selectedFiles.map((fileItem) => (
							<div key={fileItem.id} className='preview-item'>
								<img
									src={fileItem.preview}
									alt={fileItem.file.name}
									className='preview-image'
								/>
								<div className='preview-info'>
									<p className='file-name'>
										{fileItem.file.name}
									</p>
									<button
										onClick={() => removeFile(fileItem.id)}
										className='remove-btn'
										disabled={loading}>
										Xóa
									</button>
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			<div className='upload-actions'>
				<button
					onClick={handleUpload}
					disabled={selectedFiles.length === 0 || loading}
					className='upload-btn'>
					{loading
						? 'Đang upload...'
						: `Upload ${selectedFiles.length} ảnh`}
				</button>

				<button
					onClick={handleReset}
					disabled={loading}
					className='reset-btn'>
					Reset
				</button>
			</div>

			{uploadedUrls.length > 0 && (
				<div className='success-section'>
					<h4>✅ Upload thành công {uploadedUrls.length} ảnh!</h4>

					<div className='uploaded-grid'>
						{uploadedUrls.map((url, index) => (
							<div key={index} className='uploaded-item'>
								<img
									src={url}
									alt={`Uploaded ${index + 1}`}
									className='result-image'
								/>
								<div className='url-result'>
									<input
										type='text'
										value={url}
										readOnly
										className='url-input'
									/>
									<button
										onClick={() =>
											navigator.clipboard.writeText(url)
										}
										className='copy-btn'>
										Copy
									</button>
								</div>
							</div>
						))}
					</div>

					<div className='all-urls-section'>
						<button onClick={copyAllUrls} className='copy-all-btn'>
							Copy tất cả URLs
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default MultipleImageUpload;
