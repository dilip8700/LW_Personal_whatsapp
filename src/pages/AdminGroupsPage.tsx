import React from 'react';
import Header from '../components/layout/Header';
import PageContainer from '../components/layout/PageContainer';
import GroupManagement from '../components/admin/GroupManagement';

const AdminGroupsPage: React.FC = () => {
  return (
    <>
      <Header />
      <PageContainer title="Group Management">
        <GroupManagement />
      </PageContainer>
    </>
  );
};

export default AdminGroupsPage;