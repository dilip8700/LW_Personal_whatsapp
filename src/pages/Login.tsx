import React from 'react';
import LoginForm from '../components/auth/LoginForm';
import { School } from 'lucide-react';

const Login: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center mb-8">
        <div className="bg-primary-600 p-3 rounded-full mb-4">
          <School className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900">EduConnect</h1>
        <p className="mt-2 text-center text-gray-600 max-w-md">
          A centralized platform for educational announcements and group management.
        </p>
      </div>
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;