import { useState } from 'react';
import { createPayment } from '../utils/payment.service';

const PaymentForm = () => {
	const [amount, setAmount] = useState<number>(0);
	const [description, setDescription] = useState<string>('');
	const [error, setError] = useState<string>('');
	const [loading, setLoading] = useState(false);

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');

		if (!amount || amount <= 0) {
			setError('Số tiền phải lớn hơn 0');
			return;
		}

		setLoading(true);
		try {
			const url = await createPayment(amount, description);
			if (url) {
				window.location.href = url;
			} else {
				setError('Không tìm thấy URL thanh toán trong phản hồi');
			}
		} catch (err: any) {
			setError(err?.message || 'Tạo link thanh toán thất bại');
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={onSubmit} className='card'>
			<label>
				Số tiền (VND)
				<input
					type='number'
					value={amount}
					onChange={(e) => setAmount(Number(e.target.value))}
					min={1}
					required
				/>
			</label>

			<label>
				Mô tả (tùy chọn)
				<input
					type='text'
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					placeholder='Thanh toán đơn hàng'
				/>
			</label>

			{error && <div className='error'>{error}</div>}

			<button type='submit' disabled={loading}>
				{loading ? 'Đang tạo link...' : 'Tạo liên kết thanh toán'}
			</button>
		</form>
	);
};

export default PaymentForm;
