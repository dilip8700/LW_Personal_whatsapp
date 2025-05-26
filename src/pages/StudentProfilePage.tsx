import React from 'react';
import Header from '../components/layout/Header';
import PageContainer from '../components/layout/PageContainer';
import Profile from '../components/student/Profile';

const StudentProfilePage: React.FC = () => {
  return (
    <>
      <Header />
      <PageContainer title="Your Profile">
        <Profile />
      </PageContainer>
    </>
  );
};

export default StudentProfilePage;