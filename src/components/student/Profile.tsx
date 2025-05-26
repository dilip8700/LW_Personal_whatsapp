import React, { useState } from 'react';
import { User, Check } from 'lucide-react';
import { updateUserProfile } from '../../firebase/users';
import { useAuth } from '../../context/AuthContext';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Alert from '../ui/Alert';

const Profile: React.FC = () => {
  const { currentUser, updateUser } = useAuth();
  
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setName(currentUser?.name || '');
    setEmail(currentUser?.email || '');
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    setError('');
    setSuccess('');
    setIsLoading(true);
    
    try {
      await updateUserProfile(currentUser.id, { name, email });
      
      // Update the local state
      updateUser({
        ...currentUser,
        name,
        email
      });
      
      setIsEditing(false);
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError('Failed to update profile');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser) return null;

  return (
    <Card title="Your Profile">
      {error && (
        <Alert
          variant="error"
          message={error}
          className="mb-4"
          onClose={() => setError('')}
        />
      )}
      
      {success && (
        <Alert
          variant="success"
          message={success}
          className="mb-4"
          onClose={() => setSuccess('')}
        />
      )}

      <div className="flex items-center mb-6">
        <div className="h-20 w-20 rounded-full bg-primary-200 flex items-center justify-center">
          <User className="h-10 w-10 text-primary-600" />
        </div>
        <div className="ml-4">
          <h2 className="text-xl font-bold">{currentUser.name}</h2>
          <p className="text-gray-500">{currentUser.email}</p>
          <div className="mt-1">
            <Badge variant={currentUser.role === 'admin' ? 'primary' : 'secondary'}>
              {currentUser.role}
            </Badge>
          </div>
        </div>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            fullWidth
          />
          
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
          />
          
          <div className="flex space-x-3">
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              icon={<Check size={18} />}
            >
              Save Changes
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700">
              {currentUser.name}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700">
              {currentUser.email}
            </div>
          </div>
          
          <Button
            type="button"
            variant="primary"
            onClick={handleEdit}
          >
            Edit Profile
          </Button>
        </div>
      )}
    </Card>
  );
};

export default Profile;