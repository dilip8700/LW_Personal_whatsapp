import React, { createContext, useState, useEffect, useContext } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import { signIn, signOut, registerUser, getCurrentUser } from '../firebase/auth';
import { AuthContextType, User } from '../types';

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Register function
  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      await registerUser(name, email, password);
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const user = await signIn(email, password);
      setCurrentUser(user);
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    try {
      await signOut();
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Update user function
  const updateUser = (user: User) => {
    setCurrentUser(user);
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      try {
        if (firebaseUser) {
          const userData = await getCurrentUser(firebaseUser);
          setCurrentUser(userData);
        } else {
          setCurrentUser(null);
        }
      } finally {
        setLoading(false);
      }
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  const value: AuthContextType = {
    currentUser,
    loading,
    login,
    register,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-pulse-slow text-primary-600 text-xl">
            Loading...
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};