import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, LoginData } from '../utils/auth.service';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
	const navigate = useNavigate();
	const { login } = useAuth();

	const [formData, setFormData] = useState<LoginData>({
		email: '',
		password: '',
	});

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [rememberMe, setRememberMe] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');

		// Validation
		if (!formData.email || !formData.password) {
			setError('Vui lòng điền đầy đủ thông tin!');
			return;
		}

		setLoading(true);

		try {
			const response = await loginUser(formData);

			// Login user with context
			login(response.data.user, {
				access_token: response.data.access_token,
				refresh_token: response.data.refresh_token,
				expired_access_token: response.data.expired_access_token,
				expired_refresh_token: response.data.expired_refresh_token,
			});

			navigate('/home');
		} catch (err: any) {
			setError(err?.response?.data?.message || 'Đăng nhập thất bại!');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='auth-page'>
			<div className='auth-container'>
				<div className='auth-card'>
					<h1>Đăng nhập</h1>
					<p className='auth-subtitle'>Chào mừng bạn trở lại!</p>

					<form onSubmit={handleSubmit} className='auth-form'>
						<div className='form-group'>
							<label htmlFor='email'>Email</label>
							<input
								type='email'
								id='email'
								name='email'
								value={formData.email}
								onChange={handleChange}
								placeholder='Nhập địa chỉ email'
								required
							/>
						</div>

						<div className='form-group'>
							<label htmlFor='password'>Mật khẩu</label>
							<input
								type='password'
								id='password'
								name='password'
								value={formData.password}
								onChange={handleChange}
								placeholder='Nhập mật khẩu'
								required
							/>
						</div>

						<div className='form-options'>
							<label className='checkbox-label'>
								<input
									type='checkbox'
									checked={rememberMe}
									onChange={(e) =>
										setRememberMe(e.target.checked)
									}
								/>
								Ghi nhớ đăng nhập
							</label>
							<a href='#' className='forgot-password'>
								Quên mật khẩu?
							</a>
						</div>

						{error && <div className='error-message'>{error}</div>}

						<button
							type='submit'
							className='auth-button'
							disabled={loading}>
							{loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
						</button>
					</form>

					<div className='auth-footer'>
						<p>
							Chưa có tài khoản?
							<Link to='/register' className='auth-link'>
								Đăng ký ngay
							</Link>
						</p>
					</div>

					<div className='demo-accounts'>
						<h4>Demo Accounts:</h4>
						<div className='demo-item'>
							<strong>Admin:</strong> admin@example.com / admin123
						</div>
						<div className='demo-item'>
							<strong>User:</strong> user@example.com / user123
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
