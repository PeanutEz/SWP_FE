import React from 'react';
import { Link } from 'react-router-dom';

const SuccessPage: React.FC = () => {
	return (
		<div className='page-layout'>
			<div className='container container-sm page-content'>
				<div className='success-card'>
					<div className='success-icon'>✅</div>
					<h1>Thanh toán thành công!</h1>
					<p>
						Cảm ơn bạn đã thanh toán. Giao dịch của bạn đã được xử
						lý thành công.
					</p>
					<div className='success-actions'>
						<Link to='/' className='btn btn-primary'>
							Thanh toán mới
						</Link>
						<Link to='/home' className='btn btn-secondary'>
							Về trang chủ
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SuccessPage;
