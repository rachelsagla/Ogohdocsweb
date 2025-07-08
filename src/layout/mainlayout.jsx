import React from 'react';
import { Layout, Menu, Image, Typography, Button, Space } from 'antd';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  HomeOutlined,
  PlayCircleOutlined,
  UserOutlined,
  LoginOutlined,
  UserAddOutlined
} from '@ant-design/icons';
import './mainlayout.css';

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Layout className="main-layout">
      <Header className="main-header">
        <div className="logo-container">
          <Image
            src="/logo.png"
            alt="OgohDocs Logo"
            preview={false}
            width={60}
            height={50}
            className="logo-image"
          />
          <Text className="site-title">OgohDocs</Text>
        </div>
        
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          className="main-menu"
        >
          <Menu.Item key="/dashboard" icon={<HomeOutlined />}>
            <Link to="/dashboard">Beranda</Link>
          </Menu.Item>
          <Menu.Item key="/playlist" icon={<PlayCircleOutlined />}>
            <Link to="/playlist">Playlist</Link>
          </Menu.Item>
          <Menu.Item key="/profile" icon={<UserOutlined />}>
            <Link to="/profile">Profile</Link>
          </Menu.Item>
        </Menu>

        {/* Tambahkan tombol Login dan Signup di sini */}
        <Space className="auth-buttons">
          <Button 
            type="default" 
            icon={<LoginOutlined />}
            onClick={() => navigate('/login')}
            className="login-btn"
          >
            Masuk
          </Button>
        </Space>
      </Header>

      <Content className="main-content">
        <Outlet />
      </Content>

      <Footer className="main-footer">
        OgohDocs ©2025 Created by SCARD Team 4IKI 🤍
      </Footer>
    </Layout>
  );
};

export default MainLayout;