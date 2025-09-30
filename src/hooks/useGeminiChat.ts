import { useState, useCallback } from 'react';

interface UseGeminiChatReturn {
	isChatOpen: boolean;
	openChat: () => void;
	closeChat: () => void;
	toggleChat: () => void;
}

export const useGeminiChat = (): UseGeminiChatReturn => {
	const [isChatOpen, setIsChatOpen] = useState(false);

	const openChat = useCallback(() => {
		setIsChatOpen(true);
	}, []);

	const closeChat = useCallback(() => {
		setIsChatOpen(false);
	}, []);

	const toggleChat = useCallback(() => {
		setIsChatOpen((prev) => !prev);
	}, []);

	return {
		isChatOpen,
		openChat,
		closeChat,
		toggleChat,
	};
};
