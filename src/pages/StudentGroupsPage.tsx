import React from 'react';
import Header from '../components/layout/Header';
import PageContainer from '../components/layout/PageContainer';
import GroupList from '../components/student/GroupList';

const StudentGroupsPage: React.FC = () => {
  return (
    <>
      <Header />
      <PageContainer title="Your Groups">
        <GroupList />
      </PageContainer>
    </>
  );
};

export default StudentGroupsPage;