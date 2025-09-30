import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
	children: ReactNode;
}
interface State {
	hasError: boolean;
	message?: string;
}

export class ErrorBoundary extends Component<Props, State> {
	state: State = { hasError: false };

	static getDerivedStateFromError(error: any): State {
		return {
			hasError: true,
			message: error?.message || 'Something went wrong',
		};
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
		console.error('ErrorBoundary caught:', error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return (
				<div className='container'>
					<h2>Đã có lỗi xảy ra</h2>
					<pre>{this.state.message}</pre>
					<a href='/'>Quay lại</a>
				</div>
			);
		}
		return this.props.children;
	}
}
