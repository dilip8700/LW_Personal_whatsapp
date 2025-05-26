import React from 'react';
import Header from '../components/layout/Header';
import PageContainer from '../components/layout/PageContainer';
import UserManagement from '../components/admin/UserManagement';

const AdminUsersPage: React.FC = () => {
  return (
    <>
      <Header />
      <PageContainer title="User Management">
        <UserManagement />
      </PageContainer>
    </>
  );
};

export default AdminUsersPage;