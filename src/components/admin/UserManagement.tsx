import React, { useState, useEffect } from 'react';
import { RefreshCw, UserCheck, UserX } from 'lucide-react';
import { getAllUsers, updateUserStatus } from '../../firebase/users';
import { User, UserStatus } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Alert from '../ui/Alert';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const fetchedUsers = await getAllUsers();
      setUsers(fetchedUsers);
    } catch (err) {
      setError('Failed to fetch users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleStatusChange = async (userId: string, status: UserStatus) => {
    try {
      await updateUserStatus(userId, status);
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, status } : user
        )
      );
      setActionSuccess(`User status updated to ${status}`);
    } catch (err) {
      setError('Failed to update user status');
      console.error(err);
    }
  };

  const getStatusBadge = (status: UserStatus) => {
    switch (status) {
      case 'approved':
        return <Badge variant="success">Approved</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'rejected':
        return <Badge variant="error">Rejected</Badge>;
      default:
        return <Badge variant="gray">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <Card className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4"></div>
        <div className="h-16 bg-gray-200 rounded mb-2"></div>
        <div className="h-16 bg-gray-200 rounded mb-2"></div>
      </Card>
    );
  }

  return (
    <Card 
      title="User Management" 
      footer={
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchUsers}
            icon={<RefreshCw size={16} />}
          >
            Refresh
          </Button>
        </div>
      }
    >
      {error && (
        <Alert
          variant="error"
          message={error}
          className="mb-4"
          onClose={() => setError('')}
        />
      )}
      
      {actionSuccess && (
        <Alert
          variant="success"
          message={actionSuccess}
          className="mb-4"
          onClose={() => setActionSuccess('')}
        />
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Groups
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={user.role === 'admin' ? 'primary' : 'secondary'}>
                    {user.role}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(user.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.groupIds.length || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {user.role !== 'admin' && (
                    <div className="flex justify-end space-x-2">
                      {user.status !== 'approved' && (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleStatusChange(user.id, 'approved')}
                          icon={<UserCheck size={16} />}
                        >
                          Approve
                        </Button>
                      )}
                      {user.status !== 'rejected' && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleStatusChange(user.id, 'rejected')}
                          icon={<UserX size={16} />}
                        >
                          Reject
                        </Button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default UserManagement;