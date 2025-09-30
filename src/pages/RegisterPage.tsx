import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser, RegisterData } from '../utils/auth.service';
import { useAuth } from '../contexts/AuthContext';

const RegisterPage: React.FC = () => {
	const navigate = useNavigate();
	const { login } = useAuth();

	const [formData, setFormData] = useState<RegisterData>({
		full_name: '',
		email: '',
		password: '',
		phone: '',
	});

	const [confirmPassword, setConfirmPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

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
		if (!formData.full_name || !formData.email || !formData.password) {
			setError('Vui lòng điền đầy đủ thông tin bắt buộc!');
			return;
		}

		if (formData.password !== confirmPassword) {
			setError('Mật khẩu xác nhận không khớp!');
			return;
		}

		if (formData.password.length < 6) {
			setError('Mật khẩu phải có ít nhất 6 ký tự!');
			return;
		}

		setLoading(true);

		try {
			const response = await registerUser(formData);

			// Auto login after successful registration
			login(response.data.user, {
				access_token: response.data.access_token,
				refresh_token: response.data.refresh_token,
				expired_access_token: response.data.expired_access_token,
				expired_refresh_token: response.data.expired_refresh_token,
			});

			navigate('/home');
		} catch (err: any) {
			setError(err?.response?.data?.message || 'Đăng ký thất bại!');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='auth-page'>
			<div className='auth-container'>
				<div className='auth-card'>
					<h1>Đăng ký tài khoản</h1>
					<p className='auth-subtitle'>
						Tạo tài khoản mới để bắt đầu
					</p>

					<form onSubmit={handleSubmit} className='auth-form'>
						<div className='form-group'>
							<label htmlFor='full_name'>Họ và tên *</label>
							<input
								type='text'
								id='full_name'
								name='full_name'
								value={formData.full_name}
								onChange={handleChange}
								placeholder='Nhập họ và tên'
								required
							/>
						</div>

						<div className='form-group'>
							<label htmlFor='email'>Email *</label>
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
							<label htmlFor='phone'>Số điện thoại</label>
							<input
								type='tel'
								id='phone'
								name='phone'
								value={formData.phone}
								onChange={handleChange}
								placeholder='Nhập số điện thoại (tùy chọn)'
							/>
						</div>

						<div className='form-group'>
							<label htmlFor='password'>Mật khẩu *</label>
							<input
								type='password'
								id='password'
								name='password'
								value={formData.password}
								onChange={handleChange}
								placeholder='Nhập mật khẩu (ít nhất 6 ký tự)'
								minLength={6}
								required
							/>
						</div>

						<div className='form-group'>
							<label htmlFor='confirmPassword'>
								Xác nhận mật khẩu *
							</label>
							<input
								type='password'
								id='confirmPassword'
								value={confirmPassword}
								onChange={(e) =>
									setConfirmPassword(e.target.value)
								}
								placeholder='Nhập lại mật khẩu'
								required
							/>
						</div>

						{error && <div className='error-message'>{error}</div>}

						<button
							type='submit'
							className='auth-button'
							disabled={loading}>
							{loading ? 'Đang đăng ký...' : 'Đăng ký'}
						</button>
					</form>

					<div className='auth-footer'>
						<p>
							Đã có tài khoản?
							<Link to='/login' className='auth-link'>
								Đăng nhập ngay
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default RegisterPage;
