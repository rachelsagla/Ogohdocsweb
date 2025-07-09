// import React, { useState } from 'react';
// import { Form, Input, Button, Checkbox, Typography, Row, Col, Card, message } from 'antd';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import '../pages/Auth.css';

// const { Title, Text } = Typography;

// const SignupPage = () => {
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const onFinish = async (values) => {
//     setLoading(true);
//     try {
//       const formData = new FormData();
//       formData.append('name', values.name);
//       formData.append('email', values.email);
//       formData.append('password', values.password);

//       const response = await axios.post('http://localhost:5000/register', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });

//       message.success('Pendaftaran berhasil!');
//       navigate('/login');
//     } catch (error) {
//       console.error('Error:', error);
//       const errorMessage = error.response?.data?.message;
//       if (errorMessage) {
//         message.error(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage);
//       } else {
//         message.error('Gagal mendaftar. Silakan coba lagi atau hubungi admin');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="auth-page">
//       <Row justify="center" align="middle" style={{ width: '100%' }}>
//         <Col xs={24} sm={22} md={20} lg={18} xl={16}>
//           <Card className="auth-container">
//             <Title level={2} className="auth-title">Buat Akun OgohDocs</Title>
//             <Text type="secondary" className="auth-subtitle">
//               Bergabung untuk mulai mengelola dokumen Anda
//             </Text>
            
//             <Form
//               name="signup_form"
//               layout="vertical"
//               onFinish={onFinish}
//               className="auth-form"
//               scrollToFirstError
//             >
//               <Form.Item
//                 label="Nama Lengkap"
//                 name="name"
//                 rules={[
//                   { required: true, message: 'Silakan masukkan nama lengkap!' },
//                 ]}
//               >
//                 <Input size="large" placeholder="Nama lengkap Anda" />
//               </Form.Item>

//               <Form.Item
//                 label="Email"
//                 name="email"
//                 rules={[
//                   { required: true, message: 'Silakan masukkan email Anda!' },
//                   { type: 'email', message: 'Email tidak valid!' }
//                 ]}
//               >
//                 <Input size="large" placeholder="nama@institusi.com" />
//               </Form.Item>

//               <Form.Item
//                 label="Password"
//                 name="password"
//                 rules={[
//                   { required: true, message: 'Silakan buat password!' },
//                   { min: 8, message: 'Minimal 8 karakter!' }
//                 ]}
//                 hasFeedback
//               >
//                 <Input.Password size="large" placeholder="Minimal 8 karakter" />
//               </Form.Item>

//               <Form.Item
//                 label="Konfirmasi Password"
//                 name="confirm"
//                 dependencies={['password']}
//                 hasFeedback
//                 rules={[
//                   { required: true, message: 'Silakan konfirmasi password!' },
//                   ({ getFieldValue }) => ({
//                     validator(_, value) {
//                       if (!value || getFieldValue('password') === value) {
//                         return Promise.resolve();
//                       }
//                       return Promise.reject('Password tidak sama!');
//                     },
//                   }),
//                 ]}
//               >
//                 <Input.Password size="large" placeholder="Ulangi password Anda" />
//               </Form.Item>

//               <Form.Item
//                 name="agreement"
//                 valuePropName="checked"
//                 rules={[
//                   {
//                     validator: (_, value) =>
//                       value ? Promise.resolve() : Promise.reject('Anda harus menyetujui syarat dan ketentuan'),
//                   },
//                 ]}
//               >
//                 <Checkbox>
//                   Saya menyetujui Syarat & Ketentuan dan Kebijakan Privasi OgohDocs
//                 </Checkbox>
//               </Form.Item>

//               <Form.Item>
//                 <Button 
//                   type="primary" 
//                   htmlType="submit" 
//                   block 
//                   size="large"
//                   className="submit-btn"
//                   loading={loading}
//                 >
//                   Daftar
//                 </Button>
//               </Form.Item>
//             </Form>

//             <div className="auth-footer">
//               Sudah punya akun? <Link to="/login">Masuk disini</Link>
//             </div>
//           </Card>
//         </Col>
//       </Row>
//     </div>
//   );
// };

// export default SignupPage;








import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Typography, Row, Col, Card, notification } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../pages/Auth.css';

const { Title, Text } = Typography;

const SignupPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();

  const showAlert = (type, title, description) => {
    api[type]({
      message: title,
      description: description,
    });
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('email', values.email);
      formData.append('password', values.password);

      const response = await axios.post('http://localhost:5000/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      showAlert('success', 'Pendaftaran Berhasil', 'Akun Anda telah berhasil dibuat. Silakan login untuk melanjutkan.');
      navigate('/login');
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error.response?.data?.message;
      if (errorMessage) {
        showAlert(
          'error',
          'Gagal Mendaftar',
          Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage
        );
      } else {
        showAlert(
          'error',
          'Gagal Mendaftar',
          'Terjadi kesalahan saat mendaftar. Silakan coba lagi atau hubungi admin.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {contextHolder}
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
                label="Nama Lengkap"
                name="name"
                rules={[
                  { required: true, message: 'Silakan masukkan nama lengkap!' },
                ]}
              >
                <Input size="large" placeholder="Nama lengkap Anda" />
              </Form.Item>

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