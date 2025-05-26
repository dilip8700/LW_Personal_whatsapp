import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';
import Alert from '../ui/Alert';

const RegisterForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      await register(name, email, password);
      setSuccess(true);
      // Redirect to login after a delay
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="max-w-md mx-auto">
        <Alert
          variant="success"
          title="Registration successful!"
          message="Your account has been created and is pending approval by an administrator. You will be redirected to the login page shortly."
          className="mb-4"
        />
        <Button
          variant="primary"
          fullWidth
          onClick={() => navigate('/login')}
        >
          Go to Login
        </Button>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Create a new account</h2>
        <p className="mt-2 text-sm text-gray-600">
          Or{' '}
          <a href="/login" className="font-medium text-primary-600 hover:text-primary-500">
            log in to your existing account
          </a>
        </p>
      </div>

      {error && (
        <Alert
          variant="error"
          message={error}
          className="mb-4"
          onClose={() => setError('')}
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Full Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          fullWidth
          placeholder="Enter your full name"
        />

        <Input
          label="Email address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
          placeholder="Enter your email"
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
          placeholder="Create a password"
        />

        <Input
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          fullWidth
          placeholder="Confirm your password"
        />

        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isLoading}
          icon={<UserPlus size={18} />}
        >
          Register
        </Button>

        <p className="text-xs text-gray-500 mt-4">
          By registering, you agree to our Terms of Service and Privacy Policy.
          Your account will be pending until approved by an administrator.
        </p>
      </form>
    </Card>
  );
};

export default RegisterForm;