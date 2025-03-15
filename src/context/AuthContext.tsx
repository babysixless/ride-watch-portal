
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type UserRole = 'driver' | 'passenger' | null;
type AuthStatus = 'authenticated' | 'unauthenticated' | 'loading';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  status: AuthStatus;
  role: UserRole;
  setRole: (role: UserRole) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [role, setRole] = useState<UserRole>(null);

  useEffect(() => {
    // Check for saved role in localStorage
    const savedRole = localStorage.getItem('userRole') as UserRole;
    if (savedRole) {
      setRole(savedRole);
    }

    // Check for saved user in localStorage (for demo purposes)
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setStatus('authenticated');
    } else {
      setStatus('unauthenticated');
    }
  }, []);

  // Save role to localStorage whenever it changes
  useEffect(() => {
    if (role) {
      localStorage.setItem('userRole', role);
    }
  }, [role]);

  const login = async (email: string, password: string) => {
    try {
      // Mock login for demo purposes
      // In a real app, you'd make an API call here
      setStatus('loading');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demonstration, we'll create a mock user
      const mockUser = {
        id: '1',
        name: 'Demo Driver',
        email,
        role: 'driver' as UserRole
      };
      
      setUser(mockUser);
      setStatus('authenticated');
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      return Promise.resolve();
    } catch (error) {
      setStatus('unauthenticated');
      return Promise.reject(error);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      // Mock registration for demo purposes
      setStatus('loading');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser = {
        id: Date.now().toString(),
        name,
        email,
        role: 'driver' as UserRole
      };
      
      setUser(mockUser);
      setStatus('authenticated');
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      return Promise.resolve();
    } catch (error) {
      setStatus('unauthenticated');
      return Promise.reject(error);
    }
  };

  const logout = () => {
    setUser(null);
    setStatus('unauthenticated');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
  };

  return (
    <AuthContext.Provider value={{ user, status, role, setRole, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
