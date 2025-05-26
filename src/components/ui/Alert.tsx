import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  message: string;
  className?: string;
  onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  message,
  className = '',
  onClose,
}) => {
  const variantClasses = {
    info: 'bg-primary-50 text-primary-800 border-primary-200',
    success: 'bg-success-50 text-success-800 border-success-200',
    warning: 'bg-warning-50 text-warning-800 border-warning-200',
    error: 'bg-error-50 text-error-800 border-error-200',
  };

  const icons = {
    info: <Info className="h-5 w-5 text-primary-500" />,
    success: <CheckCircle className="h-5 w-5 text-success-500" />,
    warning: <AlertCircle className="h-5 w-5 text-warning-500" />,
    error: <XCircle className="h-5 w-5 text-error-500" />,
  };

  return (
    <div className={`rounded-md border p-4 ${variantClasses[variant]} ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">{icons[variant]}</div>
        <div className="ml-3">
          {title && <h3 className="text-sm font-medium">{title}</h3>}
          <div className="text-sm mt-1">{message}</div>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <button
              type="button"
              className="inline-flex rounded-md bg-transparent text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <XCircle className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;