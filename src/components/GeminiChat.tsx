import React, { useState, useRef, useEffect } from 'react';
import {
	askGemini,
	ChatMessage,
	formatChatMessage,
	formatTimestamp,
} from '../utils/gemini.service';

interface GeminiChatProps {
	isOpen: boolean;
	onClose: () => void;
}

const GeminiChat: React.FC<GeminiChatProps> = ({ isOpen, onClose }) => {
	const [messages, setMessages] = useState<ChatMessage[]>([
		formatChatMessage(
			'Xin chào! Tôi là Gemini AI. Tôi có thể giúp bạn trả lời các câu hỏi về xe điện, công nghệ, hoặc bất kỳ điều gì bạn muốn biết. Hãy đặt câu hỏi cho tôi!',
			'gemini',
		),
	]);
	const [input, setInput] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	useEffect(() => {
		if (isOpen && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isOpen]);

	const handleSendMessage = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!input.trim() || isLoading) return;

		const userMessage = formatChatMessage(input.trim(), 'user');
		const loadingMessage = formatChatMessage(
			'Đang suy nghĩ...',
			'gemini',
			true,
		);

		setMessages((prev) => [...prev, userMessage, loadingMessage]);
		setInput('');
		setIsLoading(true);

		try {
			const response = await askGemini(input.trim());

			// Remove loading message and add real response
			setMessages((prev) => {
				const withoutLoading = prev.slice(0, -1);
				const geminiMessage = formatChatMessage(
					response.answer,
					'gemini',
				);
				return [...withoutLoading, geminiMessage];
			});
		} catch (error: any) {
			// Remove loading message and add error message
			setMessages((prev) => {
				const withoutLoading = prev.slice(0, -1);
				const errorMessage = formatChatMessage(
					'Xin lỗi, tôi gặp lỗi khi xử lý câu hỏi của bạn. Vui lòng thử lại sau.',
					'gemini',
				);
				return [...withoutLoading, errorMessage];
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleClearChat = () => {
		setMessages([
			formatChatMessage(
				'Cuộc trò chuyện đã được xóa. Tôi có thể giúp gì cho bạn?',
				'gemini',
			),
		]);
	};

	const quickQuestions = [
		'Ưu điểm của xe điện là gì?',
		'Cách sạc xe điện như thế nào?',
		'Xe điện có thân thiện môi trường không?',
		'Giá xe điện hiện tại ra sao?',
	];

	const handleQuickQuestion = (question: string) => {
		setInput(question);
		inputRef.current?.focus();
	};

	if (!isOpen) return null;

	return (
		<div className='gemini-chat-overlay'>
			<div className='gemini-chat-container'>
				{/* Header */}
				<div className='gemini-chat-header'>
					<div className='gemini-header-info'>
						<div className='gemini-avatar'>🤖</div>
						<div>
							<h3>Gemini AI Assistant</h3>
							<span className='gemini-status'>
								Đang hoạt động
							</span>
						</div>
					</div>
					<div className='gemini-header-actions'>
						<button
							onClick={handleClearChat}
							className='gemini-clear-btn'
							title='Xóa cuộc trò chuyện'>
							🗑️
						</button>
						<button
							onClick={onClose}
							className='gemini-close-btn'
							title='Đóng chat'>
							✕
						</button>
					</div>
				</div>

				{/* Messages */}
				<div className='gemini-chat-messages'>
					{messages.map((message) => (
						<div
							key={message.id}
							className={`gemini-message ${message.type}`}>
							<div className='gemini-message-avatar'>
								{message.type === 'user' ? '👤' : '🤖'}
							</div>
							<div className='gemini-message-content'>
								<div
									className={`gemini-message-bubble ${
										message.isLoading ? 'loading' : ''
									}`}>
									{message.isLoading ? (
										<div className='gemini-loading-dots'>
											<span></span>
											<span></span>
											<span></span>
										</div>
									) : (
										<div className='gemini-message-text'>
											{message.content}
										</div>
									)}
								</div>
								<div className='gemini-message-time'>
									{formatTimestamp(message.timestamp)}
								</div>
							</div>
						</div>
					))}
					<div ref={messagesEndRef} />
				</div>

				{/* Quick Questions */}
				{messages.length <= 1 && (
					<div className='gemini-quick-questions'>
						<p>Câu hỏi gợi ý:</p>
						<div className='gemini-quick-grid'>
							{quickQuestions.map((question, index) => (
								<button
									key={index}
									onClick={() =>
										handleQuickQuestion(question)
									}
									className='gemini-quick-btn'>
									{question}
								</button>
							))}
						</div>
					</div>
				)}

				{/* Input */}
				<form
					onSubmit={handleSendMessage}
					className='gemini-chat-input'>
					<div className='gemini-input-container'>
						<input
							ref={inputRef}
							type='text'
							value={input}
							onChange={(e) => setInput(e.target.value)}
							placeholder='Nhập câu hỏi của bạn...'
							disabled={isLoading}
							className='gemini-input-field'
						/>
						<button
							type='submit'
							disabled={!input.trim() || isLoading}
							className='gemini-send-btn'>
							{isLoading ? '⏳' : '🚀'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default GeminiChat;
