import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, fullWidth = false, className = '', ...props }, ref) => {
    const inputClasses = `px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 
      focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 
      block rounded-md text-sm ${error ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}
      ${fullWidth ? 'w-full' : ''}
      ${className}`;

    return (
      <div className={`mb-4 ${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <input ref={ref} className={inputClasses} {...props} />
        {error && (
          <p className="mt-1 text-sm text-error-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;