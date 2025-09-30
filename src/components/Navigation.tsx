import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navigation: React.FC = () => {
	const { isAuthenticated, user } = useAuth();
	const location = useLocation();

	if (!isAuthenticated) {
		return null;
	}

	const navItems = [
		{ path: '/home', label: 'Trang chủ', icon: '🏠' },
		{ path: '/', label: 'Thanh toán', icon: '💳' },
		{ path: '/upload', label: 'Upload', icon: '📷' },
	];

	return (
		<nav className='navigation'>
			<div className='nav-container'>
				<div className='nav-brand'>
					<span className='nav-logo'>⚡</span>
					<span className='nav-title'>ECM</span>
				</div>

				<div className='nav-links'>
					{navItems.map((item) => (
						<Link
							key={item.path}
							to={item.path}
							className={`nav-link ${
								location.pathname === item.path ? 'active' : ''
							}`}>
							<span className='nav-icon'>{item.icon}</span>
							<span className='nav-label'>{item.label}</span>
						</Link>
					))}
				</div>

				<div className='nav-user'>
					<span className='nav-user-name'>{user?.full_name}</span>
					<span className='nav-user-role'>{user?.role}</span>
				</div>
			</div>
		</nav>
	);
};

export default Navigation;
