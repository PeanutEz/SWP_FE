import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from 'react';
import {
	User,
	getStoredUser,
	getStoredTokens,
	saveUser,
	saveTokens,
	clearStorage,
	isAuthenticated as checkAuth,
} from '../utils/auth.service';

interface AuthContextType {
	user: User | null;
	isAuthenticated: boolean;
	login: (user: User, tokens: any) => void;
	logout: () => void;
	updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

	useEffect(() => {
		// Check if user is already logged in on app start
		const storedUser = getStoredUser();
		const authenticated = checkAuth();

		if (authenticated && storedUser) {
			setUser(storedUser);
			setIsAuthenticated(true);
		}
	}, []);

	const login = (userData: User, tokens: any) => {
		setUser(userData);
		setIsAuthenticated(true);
		saveUser(userData);
		saveTokens(tokens);
	};

	const logout = () => {
		setUser(null);
		setIsAuthenticated(false);
		clearStorage();
	};

	const updateUser = (userData: User) => {
		setUser(userData);
		saveUser(userData);
	};

	const value = {
		user,
		isAuthenticated,
		login,
		logout,
		updateUser,
	};

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
};
