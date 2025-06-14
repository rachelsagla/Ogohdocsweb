import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

const Profile = () => {
  return (
    <div>
      <Title level={2}>Halaman Profile</Title>
      <p>Ini adalah halaman profile</p>
    </div>
  );
};

export default Profile;