import React from 'react';
import LoginForm from '../components/auth/LoginForm';

const Login: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center mb-8">
        <div className=" p-3 rounded-full mb-4">
          <img
                  src="page/assets/LW-log.png"  // <-- update with your actual logo path
                  alt="Logo"
                  className="h-16 w-full w-auto"
                />
        </div>
        {/* <h1 className="text-4xl font-bold text-[#ff0000]">LinuxWorld</h1> */}
        <p className="mt-2 text-center text-gray-600 max-w-md">
          A centralized platform for educational announcements and group management.
        </p>
      </div>
      <div className="w-full max-w-md bg-[#ff0000]">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;