import React, { useState, useEffect } from 'react';
import { Users, Layers, MessageSquare, Clock } from 'lucide-react';
import { getAllUsers, getPendingUsers } from '../../firebase/users';
import { getAllGroups } from '../../firebase/groups';
import { User, UserRole, Group } from '../../types';
import Card from '../ui/Card';
import PendingUsersList from './PendingUsersList';
import Button from '../ui/Button';

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [fetchedUsers, fetchedPendingUsers, fetchedGroups] = await Promise.all([
          getAllUsers(),
          getPendingUsers(),
          getAllGroups()
        ]);
        
        setUsers(fetchedUsers);
        setPendingUsers(fetchedPendingUsers);
        setGroups(fetchedGroups);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const studentCount = users.filter(user => user.role === UserRole.STUDENT && user.status === 'approved').length;

  const DashboardCard = ({ title, value, icon, color, link }: { 
    title: string; 
    value: number; 
    icon: React.ReactNode; 
    color: string;
    link: string;
  }) => (
    <a
      href={link}
      className="block bg-white rounded-lg shadow-soft transition-transform duration-200 hover:transform hover:scale-105"
    >
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 w-12 h-12 rounded-full ${color} flex items-center justify-center`}>
            {icon}
          </div>
          <div className="ml-5">
            <h3 className="text-base font-medium text-gray-500">{title}</h3>
            <div className="mt-1 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">{value}</p>
            </div>
          </div>
        </div>
      </div>
    </a>
  );

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-3 animate-pulse">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-32 bg-gray-200 rounded"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-4">
        <DashboardCard
          title="Total Students"
          value={studentCount}
          icon={<Users className="h-6 w-6 text-primary-100" />}
          color="bg-primary-600"
          link="/admin/users"
        />
        <DashboardCard
          title="Pending Approvals"
          value={pendingUsers.length}
          icon={<Clock className="h-6 w-6 text-warning-100" />}
          color="bg-warning-600"
          link="/admin/users"
        />
        <DashboardCard
          title="Groups"
          value={groups.length}
          icon={<Layers className="h-6 w-6 text-secondary-100" />}
          color="bg-secondary-600"
          link="/admin/groups"
        />
        <DashboardCard
          title="Announcements"
          value={0} // This would need to be fetched from the database
          icon={<MessageSquare className="h-6 w-6 text-accent-100" />}
          color="bg-accent-600"
          link="/admin/groups"
        />
      </div>

      {pendingUsers.length > 0 && (
        <div className="animate-slide-up">
          <PendingUsersList />
        </div>
      )}

      <Card title="Quick Actions">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Button 
            variant="primary" 
            fullWidth
            onClick={() => window.location.href = '/admin/groups'}
          >
            Manage Groups
          </Button>
          <Button 
            variant="secondary" 
            fullWidth
            onClick={() => window.location.href = '/admin/users'}
          >
            Manage Users
          </Button>
          <Button 
            variant="outline" 
            fullWidth
            onClick={() => window.location.href = '/admin/profile'}
          >
            Admin Settings
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;