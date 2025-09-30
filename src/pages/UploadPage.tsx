import React, { useState } from 'react';
import SingleImageUpload from '../ui/SingleImageUpload';
import MultipleImageUpload from '../ui/MultipleImageUpload';
import Navigation from '../components/Navigation';
import GeminiChatButton from '../components/GeminiChatButton';

const UploadPage: React.FC = () => {
	const [activeTab, setActiveTab] = useState<'single' | 'multiple'>('single');
	const [singleUploadResult, setSingleUploadResult] = useState<string>('');
	const [multipleUploadResults, setMultipleUploadResults] = useState<
		string[]
	>([]);

	return (
		<div className='upload-page page-layout'>
			<Navigation />
			<div className='container page-content'>
				<h1>Image Upload Demo</h1>
				<p>Demo upload ảnh sử dụng Cloudinary</p>

				<div className='tab-navigation'>
					<button
						className={`tab-btn ${
							activeTab === 'single' ? 'active' : ''
						}`}
						onClick={() => setActiveTab('single')}>
						Upload 1 ảnh
					</button>
					<button
						className={`tab-btn ${
							activeTab === 'multiple' ? 'active' : ''
						}`}
						onClick={() => setActiveTab('multiple')}>
						Upload nhiều ảnh
					</button>
				</div>

				<div className='tab-content'>
					{activeTab === 'single' && (
						<SingleImageUpload
							onUploadSuccess={(url) => {
								setSingleUploadResult(url);
								console.log('Single upload success:', url);
							}}
						/>
					)}

					{activeTab === 'multiple' && (
						<MultipleImageUpload
							onUploadSuccess={(urls) => {
								setMultipleUploadResults(urls);
								console.log('Multiple upload success:', urls);
							}}
						/>
					)}
				</div>

				{/* Results Summary */}
				<div className='results-summary'>
					{singleUploadResult && (
						<div className='result-item'>
							<h4>Last Single Upload:</h4>
							<p className='result-url'>{singleUploadResult}</p>
						</div>
					)}

					{multipleUploadResults.length > 0 && (
						<div className='result-item'>
							<h4>
								Last Multiple Upload (
								{multipleUploadResults.length} files):
							</h4>
							<ul className='result-list'>
								{multipleUploadResults.map((url, index) => (
									<li key={index} className='result-url'>
										{index + 1}. {url}
									</li>
								))}
							</ul>
						</div>
					)}
				</div>
			</div>

			{/* Gemini Chat Button */}
			<GeminiChatButton />
		</div>
	);
};

export default UploadPage;
