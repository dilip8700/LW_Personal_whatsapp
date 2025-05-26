import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { getPendingUsers, updateUserStatus } from '../../firebase/users';
import { User } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Alert from '../ui/Alert';

const PendingUsersList: React.FC = () => {
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        const users = await getPendingUsers();
        setPendingUsers(users);
      } catch (err) {
        setError('Failed to fetch pending users');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingUsers();
  }, []);

  const handleApprove = async (userId: string) => {
    try {
      await updateUserStatus(userId, 'approved');
      setPendingUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      setActionSuccess('User has been approved successfully');
    } catch (err) {
      setError('Failed to approve user');
      console.error(err);
    }
  };

  const handleReject = async (userId: string) => {
    try {
      await updateUserStatus(userId, 'rejected');
      setPendingUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      setActionSuccess('User has been rejected');
    } catch (err) {
      setError('Failed to reject user');
      console.error(err);
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
    <Card title="Pending User Approvals">
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

      {pendingUsers.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          No pending users to approve
        </div>
      ) : (
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
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pendingUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant="warning">Pending</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleApprove(user.id)}
                        icon={<CheckCircle size={16} />}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleReject(user.id)}
                        icon={<XCircle size={16} />}
                      >
                        Reject
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};

export default PendingUsersList;