import React from 'react';
import Header from '../components/layout/Header';
import PageContainer from '../components/layout/PageContainer';
import AdminDashboard from '../components/admin/Dashboard';

const AdminDashboardPage: React.FC = () => {
  return (
    <>
      <Header />
      <PageContainer title="Admin Dashboard">
        <AdminDashboard />
      </PageContainer>
    </>
  );
};

export default AdminDashboardPage;