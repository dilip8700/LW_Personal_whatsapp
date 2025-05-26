import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import Header from '../components/layout/Header';
import PageContainer from '../components/layout/PageContainer';
import GroupDetail from '../components/admin/GroupDetail';

const AdminGroupDetailPage: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();

  return (
    <>
      <Header />
      <PageContainer
        title="Group Details"
        action={
          <Link 
            to="/admin/groups" 
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Groups
          </Link>
        }
      >
        <GroupDetail />
      </PageContainer>
    </>
  );
};

export default AdminGroupDetailPage;