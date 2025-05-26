import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { getGroup } from '../../firebase/groups';
import { getGroupAnnouncements } from '../../firebase/announcements';
import { getAllUsers } from '../../firebase/users';
import { Group, User, Announcement } from '../../types';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Alert from '../ui/Alert';
import { useAuth } from '../../context/AuthContext';

const StudentGroupDetail: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const { currentUser } = useAuth();
  const [group, setGroup] = useState<Group | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!groupId || !currentUser) return;
      
      // Check if student belongs to this group
      if (!currentUser.groupIds.includes(groupId)) {
        setError('You do not have access to this group');
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const [fetchedGroup, fetchedAnnouncements, fetchedUsers] = await Promise.all([
          getGroup(groupId),
          getGroupAnnouncements(groupId),
          getAllUsers()
        ]);
        
        setGroup(fetchedGroup);
        setAnnouncements(fetchedAnnouncements);
        setUsers(fetchedUsers);
      } catch (err) {
        setError('Failed to fetch group data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [groupId, currentUser]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4"></div>
        <div className="h-16 bg-gray-200 rounded mb-2"></div>
        <div className="h-16 bg-gray-200 rounded mb-2"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        variant="error"
        title="Error"
        message={error}
      />
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

  return (
    <div className="space-y-6">
      <Card title={`Group: ${group.groupName}`}>
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Members ({groupMembers.length})</h3>
          <ul className="divide-y divide-gray-200">
            {groupMembers.map(member => (
              <li key={member.id} className="py-3">
                <span className="font-medium">{member.name}</span>
                {member.id === currentUser?.id && (
                  <Badge variant="primary" className="ml-2">You</Badge>
                )}
              </li>
            ))}
          </ul>
        </div>
      </Card>

      <Card title="Announcements">
        {announcements.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No announcements in this group yet.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {announcements.map(announcement => {
              const postedBy = users.find(user => user.id === announcement.postedBy);
              
              return (
                <li key={announcement.id} className="py-4 animate-slide-up">
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

export default StudentGroupDetail;