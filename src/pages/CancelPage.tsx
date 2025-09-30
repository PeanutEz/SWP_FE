import React from 'react';
import { Link } from 'react-router-dom';

const CancelPage: React.FC = () => {
	return (
		<div className='page-layout'>
			<div className='container container-sm page-content'>
				<div className='cancel-card'>
					<div className='cancel-icon'>❌</div>
					<h1>Thanh toán bị hủy</h1>
					<p>
						Bạn đã hủy giao dịch. Không có khoản phí nào được tính.
					</p>
					<div className='cancel-actions'>
						<Link to='/' className='btn btn-primary'>
							Thử lại
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

export default CancelPage;
