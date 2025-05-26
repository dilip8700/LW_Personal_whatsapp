import React, { useState, useEffect } from 'react';
import { MessageSquare, ChevronRight } from 'lucide-react';
import { getUserGroups } from '../../firebase/groups';
import { Group } from '../../types';
import Card from '../ui/Card';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const GroupList: React.FC = () => {
  const { currentUser } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGroups = async () => {
      if (!currentUser) return;
      
      setLoading(true);
      try {
        const fetchedGroups = await getUserGroups(currentUser.id);
        setGroups(fetchedGroups);
      } catch (err) {
        setError('Failed to fetch groups');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [currentUser]);

  if (loading) {
    return (
      <Card className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4"></div>
        <div className="h-16 bg-gray-200 rounded mb-2"></div>
        <div className="h-16 bg-gray-200 rounded mb-2"></div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <div className="text-center py-4 text-error-600">
          {error}
        </div>
      </Card>
    );
  }

  return (
    <Card title="Your Groups">
      {groups.length === 0 ? (
        <div className="text-center py-8">
          <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No Groups Yet</h3>
          <p className="text-gray-500">
            You haven't been added to any groups yet. Please check back later.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {groups.map((group) => (
            <li key={group.id}>
              <Link
                to={`/groups/${group.id}`}
                className="block hover:bg-gray-50 transition-colors duration-150"
              >
                <div className="px-4 py-4 sm:px-6 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{group.groupName}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {group.memberIds.length} members
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};

export default GroupList;