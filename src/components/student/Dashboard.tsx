import React, { useState, useEffect } from 'react';
import { getAnnouncementsForGroups } from '../../firebase/announcements';
import { getUserGroups } from '../../firebase/groups';
import { getAllUsers } from '../../firebase/users';
import { Announcement, Group, User } from '../../types';
import { useAuth } from '../../context/AuthContext';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Alert from '../ui/Alert';
import { format } from 'date-fns';

const StudentDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;
      
      setLoading(true);
      try {
        // Get all groups the student belongs to
        const fetchedGroups = await getUserGroups(currentUser.id);
        setGroups(fetchedGroups);
        
        // Get all users (for displaying names in announcements)
        const fetchedUsers = await getAllUsers();
        setUsers(fetchedUsers);
        
        // Get announcements for all groups
        const groupIds = fetchedGroups.map(group => group.id);
        if (groupIds.length > 0) {
          const fetchedAnnouncements = await getAnnouncementsForGroups(groupIds);
          setAnnouncements(fetchedAnnouncements);
        }
      } catch (err) {
        setError('Failed to fetch dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

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

  // Group announcements by group
  const groupedAnnouncements: Record<string, Announcement[]> = {};
  
  announcements.forEach(announcement => {
    if (!groupedAnnouncements[announcement.groupId]) {
      groupedAnnouncements[announcement.groupId] = [];
    }
    groupedAnnouncements[announcement.groupId].push(announcement);
  });

  return (
    <div className="space-y-8">
      <Card title="Your Groups">
        {groups.length === 0 ? (
          <p className="text-gray-500 py-4">
            You haven't been added to any groups yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map(group => (
              <a
                key={group.id}
                href={`/groups/${group.id}`}
                className="block p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors duration-200"
              >
                <h3 className="font-medium text-gray-900">{group.groupName}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {group.memberIds.length} members
                </p>
                <p className="text-sm text-primary-600 mt-2">
                  {groupedAnnouncements[group.id]?.length || 0} announcements
                </p>
              </a>
            ))}
          </div>
        )}
      </Card>

      <Card title="Recent Announcements">
        {announcements.length === 0 ? (
          <p className="text-gray-500 py-4">
            No announcements available.
          </p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {announcements.slice(0, 5).map(announcement => {
              const postedBy = users.find(user => user.id === announcement.postedBy);
              const group = groups.find(group => group.id === announcement.groupId);
              
              return (
                <li key={announcement.id} className="py-4 animate-slide-up">
                  <div className="flex flex-wrap justify-between mb-1">
                    <span className="font-medium">{postedBy?.name || 'Unknown'}</span>
                    <div className="flex items-center space-x-2">
                      <Badge variant="primary">{group?.groupName}</Badge>
                      <Badge variant="gray">
                        {format(announcement.timestamp, 'MMM d, yyyy')}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-gray-700 whitespace-pre-line">{announcement.message}</p>
                  <div className="mt-2 text-right">
                    <a 
                      href={`/groups/${announcement.groupId}`} 
                      className="text-sm text-primary-600 hover:text-primary-700"
                    >
                      View Group
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        {announcements.length > 5 && (
          <div className="mt-4 text-center">
            <a 
              href="/groups" 
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              View All Announcements
            </a>
          </div>
        )}
      </Card>
    </div>
  );
};

export default StudentDashboard;