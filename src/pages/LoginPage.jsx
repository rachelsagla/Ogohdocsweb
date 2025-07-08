import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Typography, Row, Col, Card, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../pages/Auth.css';

const { Title, Text } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('email', values.email);
      formData.append('password', values.password);

      const response = await axios.post('http://localhost:5000/login', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Handle successful login
      message.success('Login berhasil!');
      
      // Save tokens and user data
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Redirect to dashboard
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message;
      if (errorMessage) {
        message.error(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage);
      } else {
        message.error('Login gagal. Periksa kembali email dan password Anda');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Row justify="center" align="middle" style={{ width: '100%' }}>
        <Col xs={24} sm={22} md={20} lg={18} xl={16}>
          <Card className="auth-container">
            <Title level={2} className="auth-title">Masuk ke OgohDocs</Title>
            <Text type="secondary" className="auth-subtitle">
              Sistem dokumentasi yang memudahkan pengelolaan dokumen Anda
            </Text>
            
            <Form
              name="login_form"
              layout="vertical"
              onFinish={onFinish}
              className="auth-form"
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: 'Silakan masukkan email Anda!' },
                  { type: 'email', message: 'Email tidak valid!' }
                ]}
              >
                <Input 
                  size="large" 
                  placeholder="nama@email.com" 
                  autoFocus
                />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: 'Silakan masukkan password Anda!' },
                  { min: 8, message: 'Password minimal 8 karakter' }
                ]}
              >
                <Input.Password 
                  size="large" 
                  placeholder="Password" 
                />
              </Form.Item>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Form.Item name="remember" valuePropName="checked" style={{ marginBottom: 0 }}>
                  <Checkbox>Ingat saya</Checkbox>
                </Form.Item>
                
                <Link to="/forgot-password" style={{ float: 'right' }}>
                  Lupa password?
                </Link>
              </div>

              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  block 
                  size="large"
                  className="submit-btn"
                  loading={loading}
                >
                  Masuk
                </Button>
              </Form.Item>
            </Form>

            <div className="auth-footer">
              Belum punya akun? <Link to="/signup">Daftar sekarang</Link>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default LoginPage;