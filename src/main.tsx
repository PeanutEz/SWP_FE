import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PaymentPage from './pages/PaymentPage';
import SuccessPage from './pages/SuccessPage';
import CancelPage from './pages/CancelPage';
import UploadPage from './pages/UploadPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import './styles.css';

const router = createBrowserRouter([
	{ path: '/login', element: <LoginPage /> },
	{ path: '/register', element: <RegisterPage /> },
	{
		path: '/home',
		element: (
			<ProtectedRoute>
				<HomePage />
			</ProtectedRoute>
		),
	},
	{
		path: '/',
		element: (
			<ProtectedRoute>
				<PaymentPage />
			</ProtectedRoute>
		),
	},
	{
		path: '/upload',
		element: (
			<ProtectedRoute>
				<UploadPage />
			</ProtectedRoute>
		),
	},
	{ path: '/payment-success', element: <SuccessPage /> },
	{ path: '/payment-cancel', element: <CancelPage /> },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<AuthProvider>
			<RouterProvider router={router} />
		</AuthProvider>
	</React.StrictMode>,
);
