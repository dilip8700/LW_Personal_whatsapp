import React from 'react';
import Header from '../components/layout/Header';
import PageContainer from '../components/layout/PageContainer';
import StudentDashboard from '../components/student/Dashboard';

const StudentDashboardPage: React.FC = () => {
  return (
    <>
      <Header />
      <PageContainer title="Student Dashboard">
        <StudentDashboard />
      </PageContainer>
    </>
  );
};

export default StudentDashboardPage;