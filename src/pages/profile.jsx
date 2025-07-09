import React, { useState, useEffect } from 'react';
import {
  Typography,
  Avatar,
  Button,
  Form,
  Input,
  Drawer,
  Spin,
  Space,
  Upload,
  notification,
} from 'antd';
import {
  EditOutlined,
  UserOutlined,
  CameraOutlined,
  MailOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();

  const API_URL = 'http://localhost:5000';

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
  try {
    setLoading(true);
    
    const token = localStorage.getItem('access_token');
    console.log("Token from localStorage:", token);

    // Validasi format token
    if (!token || token.split('.').length !== 3) {
      console.warn("Invalid JWT format or missing token");
      navigate('/login');
      return;
    }

    const response = await axios.get(`${API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    console.log("Response from /me:", response.data);

    if (response.data && response.data.data && response.data.data.user) {
  const userData = response.data.data.user;
  setUser(userData);
  editForm.setFieldsValue({
    name: userData.name,
    email: userData.email
  });
}else {
      console.warn("No user data found in response");
      api.error({
        message: 'Error',
        description: 'No user data returned from server',
        duration: 4,
      });
    }
  } catch (error) {
    console.error('Error fetching profile:', error?.response?.data || error.message || error);
    api.error({
      message: 'Error',
      description: error?.response?.data?.message || 'Failed to load profile data',
      duration: 4,
    });
  } finally {
    setLoading(false);
  }
};


  const handleEditProfile = async (values) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      api.error({
        message: 'Authentication Required',
        description: 'Please login to update your profile',
        duration: 4,
      });
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('email', values.email);
      
      if (fileList.length > 0) {
        formData.append('profile_picture', fileList[0].originFileObj);
      }

      const response = await axios.put(`${API_URL}/profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        validateStatus: (status) => {
          return status < 500;
        }
      });

      if (response.status === 422) {
        throw new Error('Invalid data format sent to server');
      }

      const updatedUser = response.data?.data || {};
      setUser(prev => ({
        ...prev,
        name: updatedUser.name || prev.name,
        email: updatedUser.email || prev.email,
        profile_picture: updatedUser.profile_picture || prev.profile_picture
      }));

      api.success({
        message: 'Success',
        description: 'Profile updated successfully',
        duration: 3,
      });

    } catch (error) {
      console.error('Update error:', error);
      let errorMsg = 'Failed to update profile';
      
      if (error.response) {
        if (error.response.status === 422) {
          errorMsg = 'Invalid data format. Please check your inputs.';
        } else if (error.response.data?.message) {
          errorMsg = error.response.data.message;
        }
      } else if (error.message) {
        errorMsg = error.message;
      }

      api.error({
        message: 'Update Failed',
        description: errorMsg,
        duration: 5,
      });
    } finally {
      setIsEditOpen(false);
      setLoading(false);
      setFileList([]);
    }
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    const isSizeOk = file.size / 1024 / 1024 < 2;

    if (!isImage) {
      api.error({
        message: 'Invalid File Type',
        description: 'Only image files are allowed (JPEG, PNG)',
        duration: 3,
      });
      return Upload.LIST_IGNORE;
    }
    if (!isSizeOk) {
      api.error({
        message: 'File Too Large',
        description: 'Image must be smaller than 2MB',
        duration: 3,
      });
      return Upload.LIST_IGNORE;
    }

    return true;
  };

  const handleAvatarChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  if (loading && !user) {
    return (
      <div style={{ textAlign: 'center', padding: 50 }}>
        <Spin size="large" />
        <Text style={{ display: 'block', marginTop: 16 }}>Loading profile...</Text>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: 50 }}>
        <Text type="danger">Failed to load profile data</Text>
        <Button 
          type="primary" 
          onClick={fetchUserProfile}
          style={{ marginTop: 16 }}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <>
      {contextHolder}
      <div style={{ maxWidth: '100%', margin: '0 auto', padding: 20 }}>
        <div style={{
          background: 'var(--cream)',
          borderRadius: 12,
          padding: 20,
          border: '1px solid var(--brown)',
          marginBottom: 20
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Avatar
                size={100}
                src={user.profile_picture || null}

                icon={<UserOutlined />}
              />
              <div style={{ marginLeft: 16 }}>
                <Title level={4} style={{ color: 'var(--brown)', margin: 0 }}>
                  {user.name || 'No name provided'}
                </Title>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: 4 }}>
                  <MailOutlined style={{ marginRight: 8, color: 'var(--brown)' }} />
                  <Text>{user.email || 'No email provided'}</Text>
                </div>
              </div>
            </div>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => setIsEditOpen(true)}
              style={{
                backgroundColor: 'var(--brown)',
                color: 'white',
                borderRadius: 8,
              }}
            >
              Edit Profile
            </Button>
          </div>
        </div>

        <Drawer
          title="Edit Profile"
          placement="right"
          open={isEditOpen}
          onClose={() => {
            setIsEditOpen(false);
            setFileList([]);
          }}
          width={400}
          headerStyle={{ background: 'var(--cream)', borderBottom: '1px solid var(--brown)' }}
          bodyStyle={{ background: 'var(--cream)' }}
        >
          <Form
            layout="vertical"
            form={editForm}
            onFinish={handleEditProfile}
          >
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <Upload
                listType="picture-circle"
                fileList={fileList}
                onChange={handleAvatarChange}
                beforeUpload={beforeUpload}
                showUploadList={{ showPreviewIcon: false }}
                accept="image/*"
                maxCount={1}
              >
                {fileList.length < 1 && (
                  <div>
                    <CameraOutlined style={{ fontSize: 24 }} />
                    <div style={{ marginTop: 8 }}>Upload Photo</div>
                  </div>
                )}
              </Upload>
            </div>

            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: 'Please enter your name' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' }
              ]}
            >
              <Input prefix={<MailOutlined />} />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  style={{
                    backgroundColor: 'var(--brown)',
                    color: 'white',
                    borderRadius: 8,
                  }}
                >
                  Save Changes
                </Button>
                <Button onClick={() => {
                  setIsEditOpen(false);
                  setFileList([]);
                }}>
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Drawer>
      </div>
    </>
  );
};

export default Profile;