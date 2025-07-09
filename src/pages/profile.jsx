// import React, { useState, useEffect } from 'react';
// import {
//   Typography,
//   Avatar,
//   Button,
//   Form,
//   Input,
//   Drawer,
//   Spin,
//   Space,
//   Upload,
//   notification,
//   Popconfirm,
//   Row,
//   Col,
//   Divider,
//   Image
// } from 'antd';
// import {
//   EditOutlined,
//   UserOutlined,
//   CameraOutlined,
//   MailOutlined,
//   DeleteOutlined
// } from '@ant-design/icons';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const { Title, Text } = Typography;

// const Profile = () => {
//   const [user, setUser] = useState(null);
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [postsLoading, setPostsLoading] = useState(false);
//   const [isEditOpen, setIsEditOpen] = useState(false);
//   const [isPostEditOpen, setIsPostEditOpen] = useState(false);
//   const [editingPost, setEditingPost] = useState(null);
//   const [editForm] = Form.useForm();
//   const [postEditForm] = Form.useForm();
//   const [fileList, setFileList] = useState([]);
//   const [api, contextHolder] = notification.useNotification();
//   const navigate = useNavigate();

//   const API_URL = 'http://localhost:5000';

//   const showAlert = (type, title, description) => {
//     api[type]({
//       message: title,
//       description: description,
//     });
//   };

//   useEffect(() => {
//     fetchUserProfile();
//     fetchUserPosts();
//   }, []);

//   const fetchUserProfile = async () => {
//     try {
//       setLoading(true);
      
//       const token = localStorage.getItem('access_token');
//       if (!token || token.split('.').length !== 3) {
//         showAlert('error', 'Authentication Error', 'Please login to access your profile');
//         navigate('/login');
//         return;
//       }

//       const response = await axios.get(`${API_URL}/me`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         }
//       });

//       if (response.data?.data?.user) {
//         const userData = response.data.data.user;
//         // Tambahkan URL lengkap untuk gambar profil jika belum ada
//         const profilePicture = userData.profile_picture 
//           ? userData.profile_picture.startsWith('http') 
//             ? userData.profile_picture 
//             : `${API_URL}/uploads/profile/${userData.profile_picture}`
//           : null;
        
//         setUser({
//           ...userData,
//           profile_picture: profilePicture
//         });
        
//         editForm.setFieldsValue({
//           name: userData.name,
//           email: userData.email
//         });
//       }
//     } catch (error) {
//       console.error('Error fetching profile:', error);
//       showAlert(
//         'error',
//         'Error Loading Profile',
//         error?.response?.data?.message || 'Failed to load profile data'
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchUserPosts = async () => {
//     try {
//       setPostsLoading(true);
//       const token = localStorage.getItem('access_token');

//       if (!token) {
//         showAlert('error', 'Authentication Error', 'Please login to view your posts');
//         navigate('/login');
//         return;
//       }

//       const response = await axios.get(`${API_URL}/user/posts`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.data?.success) {
//         const fetchedPosts = response.data.data || [];

//         const formattedPosts = fetchedPosts.map(post => {
//           // Handle images properly
//           const images = post.images?.length > 0 
//             ? post.images.map(img => ({
//                 ...img,
//                 url: img.url || `${API_URL}/uploads/posts/${img.filename}`,
//                 placeholder: '/placeholderogohdocs.jpg'
//               }))
//             : [{
//                 url: '/placeholderogohdocs.jpg',
//                 filename: 'placeholder.jpg',
//                 isPlaceholder: true
//               }];

//           return {
//             ...post,
//             images: images,
//             main_image: images[0]?.url || '/placeholderogohdocs.jpg',
//             comments: post.comments || [],
//             like_count: post.like_count || post.likes?.length || 0,
//             comment_count: post.comment_count || post.comments?.length || 0,
//           };
//         });

//         setPosts(formattedPosts);
//       }
//     } catch (error) {
//       console.error('Error fetching posts:', error);
//       showAlert(
//         'error',
//         'Error Loading Posts',
//         error?.response?.data?.message || 'Failed to load posts data'
//       );
//     } finally {
//       setPostsLoading(false);
//     }
//   };

//   const handleEditPost = (post) => {
//     setEditingPost(post);
//     postEditForm.setFieldsValue({
//       title: post.title,
//       location: post.location,
//       year: post.year,
//       description: post.description
//     });
//     setIsPostEditOpen(true);
//   };

//   const handleUpdatePost = async (values) => {
//   try {
//     const token = localStorage.getItem('access_token');
//     if (!token) {
//       showAlert('error', 'Authentication Required', 'Please login to update your post');
//       navigate('/login');
//       return;
//     }

//     setPostsLoading(true);
//     const response = await axios.put(
//       `${API_URL}/posts/${editingPost.id}`,
//       values,
//       {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     // Modifikasi bagian ini untuk handle response
//     if (response.data) {
//       // Update the posts state with the edited post
//       const updatedPost = {
//         ...editingPost,
//         ...values,
//         // Pastikan kita tidak mencoba mengakses like.to_dict()
//         likes: editingPost.likes || [] // Gunakan array likes yang ada atau array kosong
//       };
      
//       setPosts(posts.map(post => 
//         post.id === editingPost.id ? updatedPost : post
//       ));
      
//       showAlert('success', 'Berhasil', 'Post berhasil diperbarui');
//       setIsPostEditOpen(false);
//       setEditingPost(null);
//     }
//   } catch (error) {
//     console.error('Update error:', error);
//     showAlert(
//       'error', 
//       'Gagal', 
//       error.response?.data?.message || 'Gagal memperbarui post. Silakan coba lagi.'
//     );
//   } finally {
//     setPostsLoading(false);
//   }
// };


//   const handleDeletePost = async (postId) => {
//   try {
//     const token = localStorage.getItem('access_token');
//     if (!token) {
//       showAlert('error', 'Authentication Error', 'Please login to delete posts');
//       return;
//     }

//     setPostsLoading(true);
    
//     const response = await axios.delete(`${API_URL}/posts/${postId}`, {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       }
//     });

//     if (response.data.success) {
//       setPosts(posts.filter(post => post.id !== postId));
//       showAlert('success', 'Success', 'Post deleted successfully');
//     } else {
//       showAlert('error', 'Error', response.data.message || 'Failed to delete post');
//     }
    
//   } catch (error) {
//     console.error('Delete error:', error);
    
//     // Error handling lebih detail
//     if (error.response) {
//       // Error dari server (400, 401, 500, etc)
//       const serverMessage = error.response.data?.message || error.response.statusText;
//       showAlert('error', `Server Error (${error.response.status})`, serverMessage);
//     } else if (error.request) {
//       // Request dibuat tapi tidak ada response
//       showAlert('error', 'Network Error', 'No response from server');
//     } else {
//       // Error lainnya
//       showAlert('error', 'Error', error.message);
//     }
//   } finally {
//     setPostsLoading(false);
//   }
// };

//   const handleEditProfile = async (values) => {
//     const token = localStorage.getItem('access_token');
//     if (!token) {
//       showAlert('error', 'Authentication Required', 'Please login to update your profile');
//       navigate('/login');
//       return;
//     }

//     try {
//       setLoading(true);
//       const formData = new FormData();
//       formData.append('name', values.name);
//       formData.append('email', values.email);
      
//       if (fileList.length > 0) {
//         formData.append('profile_picture', fileList[0].originFileObj);
//       }

//       const response = await axios.put(`${API_URL}/profile`, formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         }
//       });

//       if (response.data?.data) {
//         // Update user data in state
//         setUser(prev => ({
//           ...prev,
//           ...response.data.data,
//           // Preserve profile picture if not changed
//           profile_picture: response.data.data.profile_picture || prev.profile_picture
//         }));
        
//         showAlert('success', 'Berhasil', 'Profil berhasil diperbarui');
//         setIsEditOpen(false);
//         setFileList([]);
//       }
//     } catch (error) {
//       console.error('Update error:', error);
//       showAlert(
//         'error',
//         'Gagal',
//         error?.response?.data?.message || 'Gagal memperbarui profil'
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const beforeUpload = (file) => {
//     const isImage = file.type.startsWith('image/');
//     const isSizeOk = file.size / 1024 / 1024 < 2;

//     if (!isImage) {
//       showAlert('error', 'Invalid File Type', 'Only image files are allowed (JPEG, PNG)');
//       return Upload.LIST_IGNORE;
//     }
//     if (!isSizeOk) {
//       showAlert('error', 'File Too Large', 'Image must be smaller than 2MB');
//       return Upload.LIST_IGNORE;
//     }

//     return true;
//   };

//   const handleAvatarChange = ({ fileList: newFileList }) => {
//     setFileList(newFileList);
//   };

//   if (loading && !user) {
//     return (
//       <div style={{ textAlign: 'center', padding: 50 }}>
//         <Spin size="large" />
//         <Text style={{ display: 'block', marginTop: 16 }}>Loading profile...</Text>
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <div style={{ textAlign: 'center', padding: 50 }}>
//         <Text type="danger">Failed to load profile data</Text>
//         <Button 
//           type="primary" 
//           onClick={fetchUserProfile}
//           style={{ marginTop: 16 }}
//         >
//           Try Again
//         </Button>
//       </div>
//     );
//   }

//   return (
//     <>
//       {contextHolder}
//       <div style={{ maxWidth: '100%', margin: '0 auto', padding: 20 }}>
//         {/* Profile Section */}
//         <div style={{
//           background: 'var(--cream)',
//           borderRadius: 12,
//           padding: 20,
//           border: '1px solid var(--brown)',
//           marginBottom: 20
//         }}>
//           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//             <div style={{ display: 'flex', alignItems: 'center' }}>
//               <Avatar
//                 size={100}
//                 src={user.profile_picture || null}
//                 icon={<UserOutlined />}
//               />
//               <div style={{ marginLeft: 16 }}>
//                 <Title level={4} style={{ color: 'var(--brown)', margin: 0 }}>
//                   {user.name || 'No name provided'}
//                 </Title>
//                 <div style={{ display: 'flex', alignItems: 'center', marginTop: 4 }}>
//                   <MailOutlined style={{ marginRight: 8, color: 'var(--brown)' }} />
//                   <Text>{user.email || 'No email provided'}</Text>
//                 </div>
//               </div>
//             </div>
//             <Button
//               type="primary"
//               icon={<EditOutlined />}
//               onClick={() => setIsEditOpen(true)}
//               style={{
//                 backgroundColor: 'var(--brown)',
//                 color: 'white',
//                 borderRadius: 8,
//               }}
//             >
//               Edit Profile
//             </Button>
//           </div>
//         </div>

//         {/* Posts Section */}
//         <div style={{ marginTop: '32px' }}>
//           <Title level={3} style={{ marginBottom: '24px', color: 'var(--brown)' }}>
//             My Posts
//           </Title>

//           {postsLoading ? (
//             <div style={{ textAlign: 'center', padding: 20 }}>
//               <Spin size="large" />
//               <Text style={{ display: 'block', marginTop: 16 }}>Loading posts...</Text>
//             </div>
//           ) : posts.length > 0 ? (
//             <Row gutter={[16, 16]}>
//               {posts.map(post => (
//               <Col xs={24} sm={12} key={post.id}>
//                 <div style={{
//                   background: 'var(--cream)',
//                   borderRadius: '8px',
//                   padding: '16px',
//                   border: '1px solid var(--brown)'
//                 }}>
//                   <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//                       <div style={{ display: 'flex', alignItems: 'center' }}>
//                         <Avatar
//                 size={50}
//                 src={user.profile_picture || null}
//                 icon={<UserOutlined />}
//               />
//                         <div style={{ marginLeft: 12 }}>
//                           <Text strong>{post.user?.name || 'Unknown'}</Text>
//                         </div>
//                       </div>
//                       <Space>
//                         <Button 
//                           type="text" 
//                           icon={<EditOutlined />}
//                           onClick={() => handleEditPost(post)}
//                         />
//                         <Popconfirm
//                           title="Delete Post"
//                           description="Are you sure to delete this post?"
//                           onConfirm={() => handleDeletePost(post.id)}
//                           okText="Yes"
//                           cancelText="No"
//                         >
//                           <Button 
//                             type="text" 
//                             icon={<DeleteOutlined />}
//                             danger
//                           />
//                         </Popconfirm>
//                       </Space>
//                     </div>

//                     {post.images && post.images.length > 0 && (
//         <div style={{ margin: '12px 0', position: 'relative', paddingTop: '56.25%' }}>
//           <img 
//             src={post.main_image}
//             alt={post.title}
//             style={{
//               position: 'absolute',
//               top: 0,
//               left: 0,
//               width: '100%',
//               height: '100%',
//               objectFit: 'cover',
//               borderRadius: '4px',
//             }}
//             onError={(e) => {
//               e.target.onerror = null;
//               e.target.src = '/placeholderogohdocs.jpg';
//             }}
//           />
//         </div>
//       )}


//                     {post.image && (
//                       <img 
//                         src={post.image} 
//                         alt={post.title} 
//                         style={{
//                           width: '100%',
//                           height: '200px',
//                           objectFit: 'cover',
//                           borderRadius: '4px',
//                           margin: '12px 0'
//                         }}
//                       />
//                     )}

//                     <Title level={5} style={{ color: 'var(--brown)', marginBottom: '8px' }}>
//                       {post.title}
//                     </Title>
//                     <Text style={{ color: 'var(--brown)', display: 'block', marginBottom: '4px' }}>
//                       Location: {post.location}
//                     </Text>
//                     <Text style={{ color: 'var(--brown)', display: 'block', marginBottom: '4px' }}>
//                       Year: {post.year}
//                     </Text>
//                     <Text style={{ color: 'var(--brown)' }}>
//                       {post.description}
//                     </Text>
//                   </div>
//                 </Col>
//               ))}
//             </Row>
//           ) : (
//             <Text style={{ color: 'var(--brown)' }}>No posts yet</Text>
//           )}
//         </div>

//         {/* Edit Profile Drawer */}
//         <Drawer
//           title="Edit Profile"
//           placement="right"
//           open={isEditOpen}
//           onClose={() => {
//             setIsEditOpen(false);
//             setFileList([]);
//           }}
//           width={400}
//           headerStyle={{ background: 'var(--cream)', borderBottom: '1px solid var(--brown)' }}
//           bodyStyle={{ background: 'var(--cream)' }}
//         >
//           <Form
//             layout="vertical"
//             form={editForm}
//             onFinish={handleEditProfile}
//           >
//             <div style={{ textAlign: 'center', marginBottom: 20 }}>
//               <Upload
//                 listType="picture-circle"
//                 fileList={fileList}
//                 onChange={handleAvatarChange}
//                 beforeUpload={beforeUpload}
//                 showUploadList={{ showPreviewIcon: false }}
//                 accept="image/*"
//                 maxCount={1}
//               >
//                 {fileList.length < 1 && (
//                   <div>
//                     <CameraOutlined style={{ fontSize: 24 }} />
//                     <div style={{ marginTop: 8 }}>Upload Photo</div>
//                   </div>
//                 )}
//               </Upload>
//             </div>

//             <Form.Item
//               label="Name"
//               name="name"
//               rules={[{ required: true, message: 'Please enter your name' }]}
//             >
//               <Input />
//             </Form.Item>

//             <Form.Item
//               label="Email"
//               name="email"
//               rules={[
//                 { required: true, message: 'Please enter your email' },
//                 { type: 'email', message: 'Please enter a valid email' }
//               ]}
//             >
//               <Input prefix={<MailOutlined />} />
//             </Form.Item>

//             <Form.Item>
//               <Space>
//                 <Button
//                   type="primary"
//                   htmlType="submit"
//                   loading={loading}
//                   style={{
//                     backgroundColor: 'var(--brown)',
//                     color: 'white',
//                     borderRadius: 8,
//                   }}
//                 >
//                   Save Changes
//                 </Button>
//                 <Button onClick={() => {
//                   setIsEditOpen(false);
//                   setFileList([]);
//                 }}>
//                   Cancel
//                 </Button>
//               </Space>
//             </Form.Item>
//           </Form>
//         </Drawer>

//         {/* Edit Post Drawer */}
//         <Drawer
//           title="Edit Post"
//           placement="right"
//           open={isPostEditOpen}
//           onClose={() => {
//             setIsPostEditOpen(false);
//             setEditingPost(null);
//           }}
//           width={400}
//           headerStyle={{ background: 'var(--cream)', borderBottom: '1px solid var(--brown)' }}
//           bodyStyle={{ background: 'var(--cream)' }}
//         >
//           <Form
//             layout="vertical"
//             form={postEditForm}
//             onFinish={handleUpdatePost}
//           >
//             <Form.Item
//               label="Title"
//               name="title"
//               rules={[{ required: true, message: 'Please enter title' }]}
//             >
//               <Input />
//             </Form.Item>

//             <Form.Item
//               label="Location"
//               name="location"
//               rules={[{ required: true, message: 'Please enter location' }]}
//             >
//               <Input />
//             </Form.Item>

//             <Form.Item
//               label="Year"
//               name="year"
//               rules={[{ required: true, message: 'Please enter year' }]}
//             >
//               <Input type="number" />
//             </Form.Item>

//             <Form.Item
//               label="Description"
//               name="description"
//               rules={[{ required: true, message: 'Please enter description' }]}
//             >
//               <Input.TextArea rows={4} />
//             </Form.Item>

//             <Form.Item>
//               <Space>
//                 <Button
//                   type="primary"
//                   htmlType="submit"
//                   loading={postsLoading}
//                   style={{
//                     backgroundColor: 'var(--brown)',
//                     color: 'white',
//                     borderRadius: 8,
//                   }}
//                 >
//                   Update Post
//                 </Button>
//                 <Button onClick={() => {
//                   setIsPostEditOpen(false);
//                   setEditingPost(null);
//                 }}>
//                   Cancel
//                 </Button>
//               </Space>
//             </Form.Item>
//           </Form>
//         </Drawer>
//       </div>
//     </>
//   );
// };

// export default Profile;


















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
  Popconfirm,
  Row,
  Col,
  Divider,
  Image,
  Card,
  Tooltip
} from 'antd';
import {
  EditOutlined,
  UserOutlined,
  CameraOutlined,
  MailOutlined,
  DeleteOutlined,
  EnvironmentOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const { Title, Text } = Typography;

const Profile = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPostEditOpen, setIsPostEditOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [editForm] = Form.useForm();
  const [postEditForm] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();

  const API_URL = 'http://localhost:5000';

  const showAlert = (type, title, description) => {
    api[type]({
      message: title,
      description: description,
    });
  };

  useEffect(() => {
    fetchUserProfile();
    fetchUserPosts();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      
      const token = localStorage.getItem('access_token');
      if (!token || token.split('.').length !== 3) {
        showAlert('error', 'Authentication Error', 'Please login to access your profile');
        navigate('/login');
        return;
      }

      const response = await axios.get(`${API_URL}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      if (response.data?.data?.user) {
        const userData = response.data.data.user;
        const profilePicture = userData.profile_picture 
          ? userData.profile_picture.startsWith('http') 
            ? userData.profile_picture 
            : `${API_URL}/uploads/profile/${userData.profile_picture}`
          : null;
        
        setUser({
          ...userData,
          profile_picture: profilePicture
        });
        
        editForm.setFieldsValue({
          name: userData.name,
          email: userData.email
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      showAlert(
        'error',
        'Error Loading Profile',
        error?.response?.data?.message || 'Failed to load profile data'
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    try {
      setPostsLoading(true);
      const token = localStorage.getItem('access_token');

      if (!token) {
        showAlert('error', 'Authentication Error', 'Please login to view your posts');
        navigate('/login');
        return;
      }

      const response = await axios.get(`${API_URL}/user/posts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data?.success) {
        const fetchedPosts = response.data.data || [];

        const formattedPosts = fetchedPosts.map(post => {
          const images = post.images?.length > 0 
            ? post.images.map(img => ({
                ...img,
                url: img.url || `${API_URL}/uploads/posts/${img.filename}`,
                placeholder: '/placeholderogohdocs.jpg'
              }))
            : [];

          return {
            ...post,
            images: images,
            main_image: images[0]?.url || '/placeholderogohdocs.jpg',
            comments: post.comments || [],
            like_count: post.like_count || post.likes?.length || 0,
            comment_count: post.comment_count || post.comments?.length || 0,
            created_at: post.created_at || new Date().toISOString()
          };
        });

        setPosts(formattedPosts);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      showAlert(
        'error',
        'Error Loading Posts',
        error?.response?.data?.message || 'Failed to load posts data'
      );
    } finally {
      setPostsLoading(false);
    }
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    postEditForm.setFieldsValue({
      title: post.title,
      location: post.location,
      year: post.year,
      description: post.description
    });
    setIsPostEditOpen(true);
  };

  const handleUpdatePost = async (values) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        showAlert('error', 'Authentication Required', 'Please login to update your post');
        navigate('/login');
        return;
      }

      setPostsLoading(true);
      const response = await axios.put(
        `${API_URL}/posts/${editingPost.id}`,
        values,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        const updatedPost = {
          ...editingPost,
          ...values,
          likes: editingPost.likes || []
        };
        
        setPosts(posts.map(post => 
          post.id === editingPost.id ? updatedPost : post
        ));
        
        showAlert('success', 'Berhasil', 'Post berhasil diperbarui');
        setIsPostEditOpen(false);
        setEditingPost(null);
      }
    } catch (error) {
      console.error('Update error:', error);
      showAlert(
        'error', 
        'Gagal', 
        error.response?.data?.message || 'Gagal memperbarui post. Silakan coba lagi.'
      );
    } finally {
      setPostsLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        showAlert('error', 'Authentication Error', 'Please login to delete posts');
        return;
      }

      setPostsLoading(true);
      
      const response = await axios.delete(`${API_URL}/posts/${postId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setPosts(posts.filter(post => post.id !== postId));
        showAlert('success', 'Success', 'Post deleted successfully');
      } else {
        showAlert('error', 'Error', response.data.message || 'Failed to delete post');
      }
      
    } catch (error) {
      console.error('Delete error:', error);
      if (error.response) {
        const serverMessage = error.response.data?.message || error.response.statusText;
        showAlert('error', `Server Error (${error.response.status})`, serverMessage);
      } else if (error.request) {
        showAlert('error', 'Network Error', 'No response from server');
      } else {
        showAlert('error', 'Error', error.message);
      }
    } finally {
      setPostsLoading(false);
    }
  };

  const handleEditProfile = async (values) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      showAlert('error', 'Authentication Required', 'Please login to update your profile');
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
        }
      });

      if (response.data?.data) {
        setUser(prev => ({
          ...prev,
          ...response.data.data,
          profile_picture: response.data.data.profile_picture || prev.profile_picture
        }));
        
        showAlert('success', 'Berhasil', 'Profil berhasil diperbarui');
        setIsEditOpen(false);
        setFileList([]);
      }
    } catch (error) {
      console.error('Update error:', error);
      showAlert(
        'error',
        'Gagal',
        error?.response?.data?.message || 'Gagal memperbarui profil'
      );
    } finally {
      setLoading(false);
    }
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    const isSizeOk = file.size / 1024 / 1024 < 2;

    if (!isImage) {
      showAlert('error', 'Invalid File Type', 'Only image files are allowed (JPEG, PNG)');
      return Upload.LIST_IGNORE;
    }
    if (!isSizeOk) {
      showAlert('error', 'File Too Large', 'Image must be smaller than 2MB');
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
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: 20 }}>
        {/* Profile Section */}
        <Card
          style={{
            background: 'var(--cream)',
            borderRadius: 12,
            border: '1px solid var(--brown)',
            marginBottom: 20
          }}
          bodyStyle={{ padding: 24 }}
        >
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
        </Card>

        {/* Posts Section */}
        <div style={{ marginTop: '32px' }}>
          <Title level={3} style={{ marginBottom: '24px', color: 'var(--brown)' }}>
            My Posts
          </Title>

          {postsLoading ? (
            <div style={{ textAlign: 'center', padding: 20 }}>
              <Spin size="large" />
              <Text style={{ display: 'block', marginTop: 16 }}>Loading posts...</Text>
            </div>
          ) : posts.length > 0 ? (
            <Row gutter={[16, 16]}>
              {posts.map(post => (
                <Col xs={24} sm={12} lg={8} key={post.id}>
                  <Card
                    style={{
                      borderRadius: '8px',
                      border: '1px solid var(--brown)',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                    bodyStyle={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column' }}
                    cover={
                      post.images?.length > 0 ? (
                        <div style={{ height: '200px', overflow: 'hidden' }}>
                          <Image
                            src={post.images[0].url}
                            alt={post.title}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                            preview={false}
                            fallback="/placeholderogohdocs.jpg"
                          />
                        </div>
                      ) : null
                    }
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                        <Space>
                          <Text>
                            <EnvironmentOutlined style={{ marginRight: 4 }} />
                            {post.location}
                          </Text>
                          <Text>
                            <CalendarOutlined style={{ marginRight: 4 }} />
                            {post.year}
                          </Text>
                        </Space>
                        <Space>
                          <Tooltip title="Edit">
                            <Button 
                              type="text" 
                              icon={<EditOutlined />}
                              onClick={() => handleEditPost(post)}
                            />
                          </Tooltip>
                          <Popconfirm
                            title="Delete Post"
                            description="Are you sure to delete this post?"
                            onConfirm={() => handleDeletePost(post.id)}
                            okText="Yes"
                            cancelText="No"
                          >
                            <Tooltip title="Delete">
                              <Button 
                                type="text" 
                                icon={<DeleteOutlined />}
                                danger
                              />
                            </Tooltip>
                          </Popconfirm>
                        </Space>
                      </div>

                      <Title level={5} style={{ color: 'var(--brown)', marginBottom: '8px' }}>
                        {post.title}
                      </Title>
                      <Text style={{ color: 'var(--brown)' }}>
                        {post.description.length > 100 
                          ? `${post.description.substring(0, 100)}...` 
                          : post.description}
                      </Text>
                    </div>

                    <div style={{ marginTop: 'auto', paddingTop: 12 }}>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        Posted {moment(post.created_at).fromNow()}
                      </Text>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <Card style={{ textAlign: 'center', padding: 40 }}>
              <Text style={{ color: 'var(--brown)', fontSize: 16 }}>No posts yet</Text>
            </Card>
          )}
        </div>

        {/* Edit Profile Drawer */}
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

        {/* Edit Post Drawer */}
        <Drawer
          title="Edit Post"
          placement="right"
          open={isPostEditOpen}
          onClose={() => {
            setIsPostEditOpen(false);
            setEditingPost(null);
          }}
          width={400}
          headerStyle={{ background: 'var(--cream)', borderBottom: '1px solid var(--brown)' }}
          bodyStyle={{ background: 'var(--cream)' }}
        >
          <Form
            layout="vertical"
            form={postEditForm}
            onFinish={handleUpdatePost}
          >
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: 'Please enter title' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Location"
              name="location"
              rules={[{ required: true, message: 'Please enter location' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Year"
              name="year"
              rules={[{ required: true, message: 'Please enter year' }]}
            >
              <Input type="number" />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: 'Please enter description' }]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={postsLoading}
                  style={{
                    backgroundColor: 'var(--brown)',
                    color: 'white',
                    borderRadius: 8,
                  }}
                >
                  Update Post
                </Button>
                <Button onClick={() => {
                  setIsPostEditOpen(false);
                  setEditingPost(null);
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