import React, { useState } from 'react';
import GeminiChat from './GeminiChat';

interface GeminiChatButtonProps {
	position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
	className?: string;
}

const GeminiChatButton: React.FC<GeminiChatButtonProps> = ({
	position = 'bottom-right',
	className = '',
}) => {
	const [isChatOpen, setIsChatOpen] = useState(false);

	const positionClasses = {
		'bottom-right': 'bottom-2 right-2',
		'bottom-left': 'bottom-2 left-2',
		'top-right': 'top-2 right-2',
		'top-left': 'top-2 left-2',
	};

	return (
		<>
			<button
				className={`gemini-chat-trigger ${positionClasses[position]} ${className}`}
				onClick={() => setIsChatOpen(true)}
				title='Chat với Gemini AI'
				style={{
					position: 'fixed',
					zIndex: 999,
				}}>
				🤖
			</button>

			<GeminiChat
				isOpen={isChatOpen}
				onClose={() => setIsChatOpen(false)}
			/>
		</>
	);
};

export default GeminiChatButton;
