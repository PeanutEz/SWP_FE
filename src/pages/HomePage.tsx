import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { logoutUser, getStoredTokens } from '../utils/auth.service';
import Navigation from '../components/Navigation';

const HomePage: React.FC = () => {
	const navigate = useNavigate();
	const { user, logout, isAuthenticated } = useAuth();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	// Redirect to login if not authenticated
	React.useEffect(() => {
		if (!isAuthenticated) {
			navigate('/login');
		}
	}, [isAuthenticated, navigate]);

	const handleLogout = async () => {
		setLoading(true);
		setError('');

		try {
			const tokens = getStoredTokens();
			if (tokens.access_token) {
				await logoutUser(tokens.access_token);
			}
		} catch (err: any) {
			console.error('Logout API error:', err);
			// Continue with local logout even if API fails
		} finally {
			logout(); // Clear local storage and context
			setLoading(false);
			navigate('/login');
		}
	};

	if (!user) {
		return (
			<div className='loading-page'>
				<div className='loading-spinner'>Đang tải...</div>
			</div>
		);
	}

	return (
		<div className='home-page'>
			<Navigation />
			<div className='home-container'>
				{/* Header */}
				<header className='home-header'>
					<div className='header-content'>
						<h1>Electric Car Management</h1>
						<div className='header-actions'>
							<span className='user-greeting'>
								Xin chào, {user.full_name}!
							</span>
							<button
								onClick={handleLogout}
								disabled={loading}
								className='logout-button'>
								{loading ? 'Đang đăng xuất...' : 'Đăng xuất'}
							</button>
						</div>
					</div>
				</header>

				{/* Main Content */}
				<main className='home-main'>
					<div className='welcome-section'>
						<h2>Chào mừng đến với hệ thống quản lý xe điện</h2>
						<p>Bạn đã đăng nhập thành công vào hệ thống.</p>
					</div>

					{/* User Info Card */}
					<div className='user-info-card'>
						<h3>Thông tin tài khoản</h3>
						<div className='user-details'>
							<div className='detail-item'>
								<span className='label'>ID:</span>
								<span className='value'>{user.id}</span>
							</div>
							<div className='detail-item'>
								<span className='label'>Họ tên:</span>
								<span className='value'>{user.full_name}</span>
							</div>
							<div className='detail-item'>
								<span className='label'>Email:</span>
								<span className='value'>{user.email}</span>
							</div>
							<div className='detail-item'>
								<span className='label'>Số điện thoại:</span>
								<span className='value'>
									{user.phone || 'Chưa cập nhật'}
								</span>
							</div>
							<div className='detail-item'>
								<span className='label'>Vai trò:</span>
								<span className={`value role-${user.role}`}>
									{user.role}
								</span>
							</div>
							<div className='detail-item'>
								<span className='label'>Trạng thái:</span>
								<span className={`value status-${user.status}`}>
									{user.status}
								</span>
							</div>
							<div className='detail-item'>
								<span className='label'>Uy tín:</span>
								<span className='value'>
									{user.reputation} điểm
								</span>
							</div>
							<div className='detail-item'>
								<span className='label'>Tổng tín dụng:</span>
								<span className='value'>
									{user.total_credit.toLocaleString()} VND
								</span>
							</div>
						</div>
					</div>

					{/* Navigation Cards */}
					<div className='feature-grid'>
						<Link to='/upload' className='feature-card'>
							<div className='feature-icon'>📷</div>
							<h3>Upload Ảnh</h3>
							<p>Tải lên hình ảnh xe điện của bạn</p>
						</Link>

						<Link to='/' className='feature-card'>
							<div className='feature-icon'>💳</div>
							<h3>Thanh toán</h3>
							<p>Thực hiện thanh toán với PayOS</p>
						</Link>

						<div className='feature-card'>
							<div className='feature-icon'>🚗</div>
							<h3>Quản lý xe</h3>
							<p>Quản lý danh sách xe điện (Coming soon)</p>
						</div>

						<div className='feature-card'>
							<div className='feature-icon'>📊</div>
							<h3>Thống kê</h3>
							<p>Xem báo cáo và thống kê (Coming soon)</p>
						</div>
					</div>

					{error && <div className='error-message'>{error}</div>}
				</main>

				{/* Footer */}
				<footer className='home-footer'>
					<p>
						&copy; 2024 Electric Car Management System. All rights
						reserved.
					</p>
				</footer>
			</div>
		</div>
	);
};

export default HomePage;
