import React from 'react';
import { Layout, Menu, Image, Typography } from 'antd';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  HomeOutlined,
  PlayCircleOutlined,
  FileTextOutlined,
  HeartOutlined,
  UserOutlined,
} from '@ant-design/icons';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

// Color Palette
const colors = {
  cream: '#F8E0B2',  // Solid cream
  brown: '#8B4513',  // Primary brown
};

const MainLayout = () => {
  const location = useLocation();

  return (
    <Layout style={{ minHeight: '100vh', background: colors.cream }}>
      <Header
        style={{
          background: colors.brown,
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          height: '64px',
        }}
      >
        {/* Logo and Title Container */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          height: '100%',
          gap: '8px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            height: '100%'
          }}>
            <Image
              src="/logo.png"
              alt="OgohDocs Logo"
              preview={false}
              width={60}
              height={50}
              style={{ 
                objectFit: 'contain',
                display: 'block',
                verticalAlign: 'middle'
              }}
            />
          </div>
          <Title level={4} style={{ 
            color: colors.cream, 
            margin: 0,
            fontWeight: 600,
            lineHeight: '64px',
            verticalAlign: 'middle'
          }}>
            OgohDocs
          </Title>
        </div>
        
        {/* Navigation Menu - Right Aligned */}
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          style={{ 
            background: 'transparent',
            borderBottom: 'none',
            marginLeft: 'auto',
            lineHeight: '62px'
          }}
        >
          <Menu.Item key="/dashboard" icon={<HomeOutlined />}>
            <Link to="/dashboard">Home</Link>
          </Menu.Item>
          <Menu.Item key="/playlist" icon={<PlayCircleOutlined />}>
            <Link to="/playlist">Playlist</Link>
          </Menu.Item>
          <Menu.Item key="/post" icon={<FileTextOutlined />}>
            <Link to="/post">Post</Link>
          </Menu.Item>
          <Menu.Item key="/donation" icon={<HeartOutlined />}>
            <Link to="/donation">Donation</Link>
          </Menu.Item>
          <Menu.Item key="/profile" icon={<UserOutlined />}>
            <Link to="/profile">Profile</Link>
          </Menu.Item>
        </Menu>
      </Header>

      <Content style={{ padding: '24px', minHeight: 'calc(100vh - 128px)' }}>
        <Outlet />
      </Content>

      <Footer style={{ 
        textAlign: 'center', 
        background: colors.brown, 
        color: colors.cream,
        padding: '16px',
        lineHeight: '1.5'
      }}>
        OgohDocs ©2025 Created by SCARD Team 4IKI 🤍
      </Footer>
    </Layout>
  );
};

export default MainLayout;