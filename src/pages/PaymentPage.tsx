import React from 'react';
import PaymentForm from '../ui/PaymentForm';

const PaymentPage: React.FC = () => {
	return (
		<div className='container'>
			<h1>PayOS Payment</h1>
			<p>Nhập số tiền và mô tả, sau đó tạo liên kết thanh toán.</p>
			<PaymentForm />
		</div>
	);
};

export default PaymentPage;
