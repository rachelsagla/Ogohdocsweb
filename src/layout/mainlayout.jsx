// App.jsx (atau MainLayout.jsx tergantung penamaan kamu)

import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  HomeOutlined,
  PlayCircleOutlined,
  FileTextOutlined,
  HeartOutlined,
  UserOutlined,
} from '@ant-design/icons';

const { Header, Content, Footer } = Layout;

const MainLayout = () => {
  const location = useLocation();

  return (
    <Layout>
      <Header
        style={{
          backgroundColor: '#7B4C00',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 24px',
        }}
      >
        <div style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>OgohDocs</div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          style={{ backgroundColor: 'transparent' }}
        >
          <Menu.Item key="/dashboard">
            <Link to="/dashboard">Home</Link>
          </Menu.Item>
          <Menu.Item key="/playlist">
            <Link to="/playlist">Playlist</Link>
          </Menu.Item>
          <Menu.Item key="/post">
            <Link to="/post">Post</Link>
          </Menu.Item>
          <Menu.Item key="/donation">
            <Link to="/donation">Donation</Link>
          </Menu.Item>
          <Menu.Item key="/profile">
            <Link to="/profile">Profile</Link>
          </Menu.Item>
        </Menu>
      </Header>

      <Content style={{ padding: '24px', backgroundColor: '#DDBB7E', minHeight: '100vh' }}>
        <div style={{ backgroundColor: '#DDBB7E' }}>
          <Outlet />
        </div>
      </Content>

      <Footer style={{ textAlign: 'center', backgroundColor: '#7B4C00', color: 'white' }}>
        OgohDocs ©2025 Created by SCARD Team 4IKI
      </Footer>
    </Layout>
  );
};

export default MainLayout;