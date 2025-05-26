import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { UserPlus, UserMinus, SendHorizontal } from 'lucide-react';
import { getGroup } from '../../firebase/groups';
import { getAllUsers, addUserToGroup, removeUserFromGroup } from '../../firebase/users';
import { createAnnouncement, getGroupAnnouncements } from '../../firebase/announcements';
import { Group, User, UserRole, Announcement } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Alert from '../ui/Alert';
import Badge from '../ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';

const GroupDetail: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const { currentUser } = useAuth();
  const [group, setGroup] = useState<Group | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [announcementMessage, setAnnouncementMessage] = useState('');

  const fetchGroupData = async () => {
    if (!groupId) return;
    
    setLoading(true);
    try {
      const [fetchedGroup, fetchedUsers, fetchedAnnouncements] = await Promise.all([
        getGroup(groupId),
        getAllUsers(),
        getGroupAnnouncements(groupId)
      ]);
      
      setGroup(fetchedGroup);
      setUsers(fetchedUsers);
      setAnnouncements(fetchedAnnouncements);
    } catch (err) {
      setError('Failed to fetch group data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupData();
  }, [groupId]);

  const handleAddUserToGroup = async (userId: string) => {
    if (!groupId) return;
    
    try {
      await addUserToGroup(userId, groupId);
      
      // Update the local state
      setGroup(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          memberIds: [...prev.memberIds, userId]
        };
      });
      
      setSuccess('User added to group successfully');
    } catch (err) {
      setError('Failed to add user to group');
      console.error(err);
    }
  };

  const handleRemoveUserFromGroup = async (userId: string) => {
    if (!groupId) return;
    
    try {
      await removeUserFromGroup(userId, groupId);
      
      // Update the local state
      setGroup(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          memberIds: prev.memberIds.filter(id => id !== userId)
        };
      });
      
      setSuccess('User removed from group successfully');
    } catch (err) {
      setError('Failed to remove user from group');
      console.error(err);
    }
  };

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupId || !currentUser) return;
    
    if (!announcementMessage.trim()) {
      setError('Announcement message cannot be empty');
      return;
    }
    
    try {
      await createAnnouncement(groupId, announcementMessage, currentUser.id);
      
      // Refresh announcements
      const fetchedAnnouncements = await getGroupAnnouncements(groupId);
      setAnnouncements(fetchedAnnouncements);
      
      setAnnouncementMessage('');
      setSuccess('Announcement posted successfully');
    } catch (err) {
      setError('Failed to post announcement');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4"></div>
        <div className="h-16 bg-gray-200 rounded mb-2"></div>
        <div className="h-16 bg-gray-200 rounded mb-2"></div>
      </div>
    );
  }

  if (!group) {
    return (
      <Alert
        variant="error"
        title="Group not found"
        message="The requested group could not be found."
      />
    );
  }

  const groupMembers = users.filter(user => group.memberIds.includes(user.id));
  const nonGroupMembers = users.filter(
    user => !group.memberIds.includes(user.id) && user.role !== UserRole.ADMIN && user.status === 'approved'
  );

  return (
    <div className="space-y-6">
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

      <Card title={`Group: ${group.groupName}`}>
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Group Members ({groupMembers.length})</h3>
          {groupMembers.length === 0 ? (
            <p className="text-gray-500">No members in this group yet.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {groupMembers.map(member => (
                <li key={member.id} className="py-3 flex justify-between items-center">
                  <div>
                    <span className="font-medium">{member.name}</span>
                    <span className="ml-2 text-sm text-gray-500">{member.email}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveUserFromGroup(member.id)}
                    icon={<UserMinus size={16} />}
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Add Members</h3>
          {nonGroupMembers.length === 0 ? (
            <p className="text-gray-500">No available users to add.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {nonGroupMembers.map(user => (
                <li key={user.id} className="py-3 flex justify-between items-center">
                  <div>
                    <span className="font-medium">{user.name}</span>
                    <span className="ml-2 text-sm text-gray-500">{user.email}</span>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleAddUserToGroup(user.id)}
                    icon={<UserPlus size={16} />}
                  >
                    Add to Group
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Card>

      <Card title="Post Announcement">
        <form onSubmit={handleCreateAnnouncement}>
          <div className="mb-4">
            <Input
              label="Announcement Message"
              value={announcementMessage}
              onChange={(e) => setAnnouncementMessage(e.target.value)}
              placeholder="Enter your announcement"
              fullWidth
              required
              as="textarea"
              rows={4}
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            icon={<SendHorizontal size={16} />}
          >
            Post Announcement
          </Button>
        </form>
      </Card>

      <Card title="Announcements">
        {announcements.length === 0 ? (
          <p className="text-gray-500">No announcements in this group yet.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {announcements.map(announcement => {
              const postedBy = users.find(user => user.id === announcement.postedBy);
              
              return (
                <li key={announcement.id} className="py-4">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{postedBy?.name || 'Unknown'}</span>
                    <Badge variant="gray">
                      {format(announcement.timestamp, 'MMM d, yyyy - h:mm a')}
                    </Badge>
                  </div>
                  <p className="text-gray-700 whitespace-pre-line">{announcement.message}</p>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
};

export default GroupDetail;