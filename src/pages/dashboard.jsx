import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

const Dashboard = () => {
  return (
    <div>
      <Title level={2}>Halaman Beranda</Title>
      <p>Ini adalah halaman beranda</p>
    </div>
  );
};

export default Dashboard;