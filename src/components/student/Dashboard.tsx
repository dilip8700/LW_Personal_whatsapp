import React, { useState, useEffect } from 'react';
import {
  Settings,
  Users,
  Clock,
  Layers,
  Search,
  UserCheck,
  UserX,
  Plus,
  Edit3,
  Trash2,
  MoreVertical,
  MessageSquare,
  Send,
} from 'lucide-react';
import { getAnnouncementsForGroups, getGroupAnnouncements } from '../../firebase/announcements';
import { getUserGroups, getAllGroups } from '../../firebase/groups';
import { getAllUsers, getPendingUsers } from '../../firebase/users';
import { Announcement, Group, User } from '../../types';

const WhatsAppAdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'groups' | 'users' | 'pending'>('groups');
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [fetchedUsers, fetchedPendingUsers, fetchedGroups] = await Promise.all([
          getAllUsers(),
          getPendingUsers(),
          getAllGroups(),
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

  useEffect(() => {
    const fetchAnnouncements = async () => {
      if (selectedGroup) {
        const groupAnnouncements = await getGroupAnnouncements(selectedGroup.id);
        setAnnouncements(groupAnnouncements);
      }
    };
    fetchAnnouncements();
  }, [selectedGroup]);

  // Replace 'STUDENT' with the correct enum or constant value, e.g., UserRole.STUDENT
    const studentCount = users.filter(user => user.role === 'STUDENT' as any && user.status === 'approved').length;

  const formatTime = (date: Date | string) => {
    const today = new Date();
    const messageDate = new Date(date);
    if (messageDate.toDateString() === today.toDateString()) {
      return messageDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } else {
      return messageDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedGroup) {
      const newAnnouncement: Announcement = {
        id: Date.now().toString(),
        groupId: selectedGroup.id,
        message: newMessage,
        postedBy: 'admin',
        timestamp: new Date(),
      };
      setAnnouncements([...announcements, newAnnouncement]);
      setNewMessage('');
    }
  };

  const filteredItems = () => {
    switch (activeTab) {
      case 'groups':
        return groups.filter(group =>
          group.groupName?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      case 'users':
        return users.filter(user =>
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) && user.status === 'approved'
        );
      case 'pending':
        return pendingUsers.filter(user =>
          user.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      default:
        return [];
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar and group/user list */}
      <div className="w-1/3 bg-white border-r overflow-y-auto">
        <div className="p-4 font-semibold text-lg border-b">Admin Dashboard</div>
        <div className="flex justify-around border-b py-2">
          {['groups', 'users', 'pending'].map((tab) => (
            <button
              key={tab}
              className={`px-3 py-1 rounded ${activeTab === tab ? 'bg-green-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              onClick={() => setActiveTab(tab as 'groups' | 'users' | 'pending')}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <div className="p-2">
          <input
            type="text"
            className="w-full border px-3 py-1 rounded"
            placeholder={`Search ${activeTab}`}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          {filteredItems().map(item => (
            <div
              key={item.id}
              onClick={() => {
                if (activeTab === 'groups') {
                  setSelectedGroup(item as Group);
                }
              }}
              className={`p-3 cursor-pointer hover:bg-gray-100 ${selectedGroup?.id === item.id ? 'bg-green-100' : ''}`}
            >
              {activeTab === 'groups'
                ? 'groupName' in item
                  ? item.groupName
                  : ''
                : 'name' in item
                  ? item.name
                  : ''}
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {selectedGroup ? (
          <>
            <div className="p-4 border-b flex justify-between">
              <div>
                <h2 className="text-xl font-semibold">{selectedGroup.groupName}</h2>
                <p className="text-sm text-gray-600">{selectedGroup.memberIds.length} members</p>
              </div>
              <div className="flex gap-2">
                <button><Edit3 size={18} /></button>
                <button><Trash2 size={18} /></button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {announcements.map(announcement => (
                <div key={announcement.id} className="bg-white p-3 rounded shadow">
                  <div className="text-sm font-semibold">Admin</div>
                  <div className="text-xs text-gray-500">{formatTime(announcement.timestamp)}</div>
                  <p className="mt-1 text-gray-800">{announcement.message}</p>
                </div>
              ))}
            </div>
            <div className="p-4 border-t flex gap-2">
              <input
                type="text"
                className="flex-1 border px-3 py-2 rounded"
                placeholder="Type a message..."
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a group to view announcements
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatsAppAdminDashboard;
