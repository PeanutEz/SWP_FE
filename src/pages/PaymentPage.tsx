import React from 'react';
import PaymentForm from '../ui/PaymentForm';
import Navigation from '../components/Navigation';
import GeminiChatButton from '../components/GeminiChatButton';

const PaymentPage: React.FC = () => {
	return (
		<div className='page-layout'>
			<Navigation />
			<div className='container container-sm page-content'>
				<h1 style={{ color: '#1f2937', marginTop: '2rem' }}>PayOS Payment</h1>
				<p style={{ color: '#4b5563' }}>Nhập số tiền và mô tả, sau đó tạo liên kết thanh toán.</p>
				<PaymentForm />
			</div>

			{/* Gemini Chat Button */}
			<GeminiChatButton />
		</div>
	);
};

export default PaymentPage;
