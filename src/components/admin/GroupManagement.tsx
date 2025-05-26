import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, Users } from 'lucide-react';
import { getAllGroups, createGroup, updateGroup, deleteGroup } from '../../firebase/groups';
import { Group } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Alert from '../ui/Alert';

const GroupManagement: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newGroupName, setNewGroupName] = useState('');
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const fetchedGroups = await getAllGroups();
      setGroups(fetchedGroups);
    } catch (err) {
      setError('Failed to fetch groups');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newGroupName.trim()) {
      setError('Group name cannot be empty');
      return;
    }

    try {
      const newGroupId = await createGroup(newGroupName);
      setGroups([...groups, {
        id: newGroupId,
        groupName: newGroupName,
        memberIds: [],
        createdAt: new Date().toISOString()
      }]);
      setNewGroupName('');
      setSuccess('Group created successfully');
    } catch (err) {
      setError('Failed to create group');
      console.error(err);
    }
  };

  const handleUpdateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingGroup || !editingGroup.groupName.trim()) {
      setError('Group name cannot be empty');
      return;
    }

    try {
      await updateGroup(editingGroup.id, { groupName: editingGroup.groupName });
      setGroups(groups.map(group => 
        group.id === editingGroup.id ? editingGroup : group
      ));
      setEditingGroup(null);
      setSuccess('Group updated successfully');
    } catch (err) {
      setError('Failed to update group');
      console.error(err);
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (!confirm('Are you sure you want to delete this group?')) {
      return;
    }

    try {
      await deleteGroup(groupId);
      setGroups(groups.filter(group => group.id !== groupId));
      setSuccess('Group deleted successfully');
    } catch (err) {
      setError('Failed to delete group');
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
    <div className="space-y-6">
      <Card title="Create New Group">
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

        <form onSubmit={handleCreateGroup} className="flex items-end space-x-2">
          <div className="flex-grow">
            <Input
              label="Group Name"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="Enter group name"
              fullWidth
              required
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            icon={<Plus size={16} />}
          >
            Create Group
          </Button>
        </form>
      </Card>

      <Card title="Group Management">
        {editingGroup && (
          <div className="mb-6 p-4 bg-gray-50 rounded-md">
            <h3 className="text-lg font-medium mb-4">Edit Group</h3>
            <form onSubmit={handleUpdateGroup} className="flex items-end space-x-2">
              <div className="flex-grow">
                <Input
                  label="Group Name"
                  value={editingGroup.groupName}
                  onChange={(e) => setEditingGroup({...editingGroup, groupName: e.target.value})}
                  placeholder="Enter group name"
                  fullWidth
                  required
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  type="submit"
                  variant="success"
                  icon={<Edit size={16} />}
                >
                  Save
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingGroup(null)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Group Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Members
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {groups.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    No groups found. Create your first group above.
                  </td>
                </tr>
              ) : (
                groups.map((group) => (
                  <tr key={group.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{group.groupName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {group.memberIds.length} members
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(group.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.location.href = `/admin/groups/${group.id}`}
                          icon={<Users size={16} />}
                        >
                          Manage
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setEditingGroup(group)}
                          icon={<Edit size={16} />}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteGroup(group.id)}
                          icon={<Trash2 size={16} />}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default GroupManagement;