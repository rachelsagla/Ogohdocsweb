import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Typography, Row, Col, Card, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../pages/Auth.css';

const { Title, Text } = Typography;

const SignupPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        role: 'regular' // atau hilangkan jika backend tidak membutuhkan role
      };

      const response = await axios.post('https://api.anda.com/auth/register', payload);

      message.success('Pendaftaran berhasil!');
      navigate('/login');
    } catch (error) {
      console.error('Error:', error);
      message.error(
        error.response?.data?.message || 
        'Gagal mendaftar. Silakan coba lagi atau hubungi admin'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Row justify="center" align="middle" style={{ width: '100%' }}>
        <Col xs={24} sm={22} md={20} lg={18} xl={16}>
          <Card className="auth-container">
            <Title level={2} className="auth-title">Buat Akun OgohDocs</Title>
            <Text type="secondary" className="auth-subtitle">
              Bergabung untuk mulai mengelola dokumen Anda
            </Text>
            
            <Form
              name="signup_form"
              layout="vertical"
              onFinish={onFinish}
              className="auth-form"
              scrollToFirstError
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: 'Silakan masukkan email Anda!' },
                  { type: 'email', message: 'Email tidak valid!' }
                ]}
              >
                <Input size="large" placeholder="nama@institusi.com" />
              </Form.Item>

              <Form.Item
                label="Username"
                name="username"
                rules={[
                  { required: true, message: 'Silakan buat username!' },
                  { min: 3, message: 'Minimal 3 karakter!' }
                ]}
              >
                <Input size="large" placeholder="Buat username Anda" />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: 'Silakan buat password!' },
                  { min: 8, message: 'Minimal 8 karakter!' }
                ]}
                hasFeedback
              >
                <Input.Password size="large" placeholder="Minimal 8 karakter" />
              </Form.Item>

              <Form.Item
                label="Konfirmasi Password"
                name="confirm"
                dependencies={['password']}
                hasFeedback
                rules={[
                  { required: true, message: 'Silakan konfirmasi password!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject('Password tidak sama!');
                    },
                  }),
                ]}
              >
                <Input.Password size="large" placeholder="Ulangi password Anda" />
              </Form.Item>

              <Form.Item
                name="agreement"
                valuePropName="checked"
                rules={[
                  {
                    validator: (_, value) =>
                      value ? Promise.resolve() : Promise.reject('Anda harus menyetujui syarat dan ketentuan'),
                  },
                ]}
              >
                <Checkbox>
                  Saya menyetujui Syarat & Ketentuan dan Kebijakan Privasi OgohDocs
                </Checkbox>
              </Form.Item>

              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  block 
                  size="large"
                  className="submit-btn"
                  loading={loading}
                  disabled={loading}
                >
                  Daftar
                </Button>
              </Form.Item>
            </Form>

            <div className="auth-footer">
              Sudah punya akun? <Link to="/login">Masuk disini</Link>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SignupPage;
