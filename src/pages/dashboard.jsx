// import React, { useState, useEffect } from 'react';
// import { 
//   Drawer, 
//   Form, 
//   Input, 
//   Button, 
//   Upload, 
//   DatePicker,
//   message,
//   Steps,
//   Divider,
//   Row,
//   Col,
//   Card,
//   Typography,
//   Space,
//   Carousel,
//   notification,
//   Spin,
//   Avatar,
//   Skeleton,
//   Empty,
//   Image
// } from 'antd';
// import { 
//   PlusOutlined,
//   UserOutlined,
//   EnvironmentOutlined,
//   CameraOutlined,
//   HeartOutlined,
//   HeartFilled,
//   CommentOutlined,
//   ShareAltOutlined,
//   LoadingOutlined,
//   SendOutlined
// } from '@ant-design/icons';
// import moment from 'moment';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import './Dashboard.css';

// const { Title, Text } = Typography;
// const { Step } = Steps;

// const BASE_URL = 'http://localhost:5000';

// const Dashboard = () => {
//   const [formVisible, setFormVisible] = useState(false);
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentUser, setCurrentUser] = useState(null);
//   const [newComment, setNewComment] = useState('');
//   const [commentingOn, setCommentingOn] = useState(null);
//   const [api, contextHolder] = notification.useNotification();
//   const navigate = useNavigate();

  
//   useEffect(() => {
//   const load = async () => {
//     await fetchCurrentUser();
//     await fetchPosts();
//   };
//   load();
// }, []);

//   const fetchCurrentUser = async () => {
//     try {
//       const token = localStorage.getItem('access_token');
//       if (!token) {
//         message.error('Please login first');
//         return;
//       }

//       const response = await axios.get(`${BASE_URL}/me`, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });
//       setCurrentUser(response.data.user);
//     } catch (error) {
//       console.error('Error fetching current user:', error);
//       message.error('Failed to fetch user data');
//     }
//   };

//   const fetchPosts = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`${BASE_URL}/posts`);
      
//       const postsData = response.data?.data?.posts || response.data?.posts || [];
      
//       const formattedPosts = postsData.map(post => ({
//         ...post,
//         liked: post.likes?.some(like => like.user_id === currentUser?.id) || false,
//         showComments: false,
//         images: post.images?.map(img => ({
//           ...img,
//           url: img.url || `${BASE_URL}/uploads/posts/${img.filename}`,
//           placeholder: '/placeholderogohdocs.jpg'
//         })) || [],
//         comments: post.comments || [],
//         like_count: post.like_count || post.likes?.length || 0,
//         comment_count: post.comment_count || post.comments?.length || 0,
//         main_image: post.images?.[0]?.url || '/placeholderogohdocs.jpg'
//       }));
      
//       setPosts(formattedPosts);
//     } catch (error) {
//       console.error('Error fetching posts:', error);
//       message.error('Failed to fetch posts');
//       setPosts([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const showNotification = (type, message, description) => {
//     api[type]({
//       message,
//       description,
//       placement: 'topRight'
//     });
//   };

//   const handleLike = async (postId, e) => {
//     e?.stopPropagation(); // Prevent event bubbling to parent elements
//     try {
//       const token = localStorage.getItem('access_token');
//       if (!token) {
//         message.error('Please login first');
//         return;
//       }

//       const postIndex = posts.findIndex(post => post.id === postId);
//       const post = posts[postIndex];
      
//       const response = await axios({
//         method: post.liked ? 'delete' : 'post',
//         url: `${BASE_URL}/posts/${postId}/like`,
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });

//       const updatedPosts = [...posts];
//       updatedPosts[postIndex] = {
//         ...post,
//         liked: !post.liked,
//         like_count: response.data.data?.like_count || response.data.like_count
//       };
      
//       setPosts(updatedPosts);
//     } catch (error) {
//       console.error('Error handling like:', error);
//       showNotification('error', 'Error', 'Failed to update like');
//     }
//   };

//   const handleAddComment = async (postId, e) => {
//     e?.stopPropagation(); // Prevent event bubbling to parent elements
//     if (!newComment.trim()) return;
    
//     try {
//       const token = localStorage.getItem('access_token');
//       if (!token) {
//         message.error('Please login first');
//         return;
//       }

//       const response = await axios.post(
//         `${BASE_URL}/posts/${postId}/comments`,
//         { content: newComment },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`
//           }
//         }
//       );

//       const updatedPosts = posts.map(post => {
//         if (post.id === postId) {
//           return {
//             ...post,
//             comments: [...(post.comments || []), response.data.data || response.data],
//             comment_count: (post.comment_count || 0) + 1,
//             showComments: true
//           };
//         }
//         return post;
//       });
      
//       setPosts(updatedPosts);
//       setNewComment('');
//       showNotification('success', 'Comment Added', 'Your comment was posted!');
//     } catch (error) {
//       console.error('Error adding comment:', error);
//       showNotification('error', 'Error', 'Failed to add comment');
//     }
//   };

//   const handleShare = (postId, e) => {
//     e?.stopPropagation(); // Prevent event bubbling to parent elements
//     const postLink = `${window.location.origin}/postdetail/${postId}`;
//     navigator.clipboard.writeText(postLink);
//     message.success('Link copied to clipboard!');
//   };

//   const handleToggleComments = (postId, e) => {
//     e?.stopPropagation(); // Prevent event bubbling to parent elements
//     setPosts(posts.map(post => {
//       if (post.id === postId) {
//         return {
//           ...post,
//           showComments: !post.showComments
//         };
//       }
//       return post;
//     }));
//     setCommentingOn(commentingOn === postId ? null : postId);
//   };

//   const handlePostClick = (postId) => {
//     navigate(`/postdetail/${postId}`);
//   };

//   const DocumentationForm = ({ visible, onClose }) => {
//     const [form] = Form.useForm();
//     const [currentStep, setCurrentStep] = useState(0);
//     const [fileList, setFileList] = useState([]);
//     const [uploading, setUploading] = useState(false);

//     const steps = [
//       {
//         title: 'Basic Info',
//         content: (
//           <>
//             <Form.Item
//               name="title"
//               label="Title"
//               rules={[{ required: true, message: 'Please enter title' }]}
//             >
//               <Input placeholder="Ogoh-ogoh name" />
//             </Form.Item>
//             <Form.Item
//               name="location"
//               label="Location"
//               rules={[{ required: true, message: 'Please enter location' }]}
//             >
//               <Input placeholder="Banjar Kaja, Gianyar" />
//             </Form.Item>
//             <Form.Item
//   name="year"
//   label="Year"
//   rules={[
//     { 
//       required: true, 
//       message: 'Please select year' 
//     },
//     () => ({
//       validator(_, value) {
//         if (!value || !value.isValid()) {
//           return Promise.reject(new Error('Please select a valid year'));
//         }
//         return Promise.resolve();
//       },
//     }),
//   ]}
// >
//   <DatePicker 
//     picker="year"
//     format="YYYY"
//     style={{ width: '100%' }}
//     disabledDate={current => current && current > moment().endOf('year')}
//   />
// </Form.Item>
//           </>
//         ),
//       },
//       {
//         title: 'Content',
//         content: (
//           <>
//             <Form.Item
//               name="description"
//               label="Description"
//               rules={[{ required: true, message: 'Please enter description' }]}
//             >
//               <Input.TextArea rows={4} />
//             </Form.Item>
//             <Form.Item
//               name="images"
//               label="Images"
//               rules={[{ required: true, message: 'Please upload at least one image' }]}
//               valuePropName="fileList"
//               getValueFromEvent={e => {
//                 if (Array.isArray(e)) {
//                   return e;
//                 }
//                 return e?.fileList;
//               }}
//             >
//               <Upload
//                 listType="picture-card"
//                 beforeUpload={(file) => {
//   const wrappedFile = {
//     ...file,
//     originFileObj: file, // penting
//     uid: file.uid || Date.now() + '-' + file.name, // pastikan unique uid
//   };
//   setFileList(prev => [...prev, wrappedFile]);
//   return false;
// }}

//                 maxCount={10}
//                 multiple
//                 fileList={fileList}
//                 onRemove={(file) => {
//                   setFileList(prev => prev.filter(f => f.uid !== file.uid));
//                 }}
//               >
//                 {fileList.length < 10 && (
//                   <div>
//                     <PlusOutlined />
//                     <div style={{ marginTop: 8 }}>Upload</div>
//                   </div>
//                 )}
//               </Upload>
//             </Form.Item>
//           </>
//         ),
//       }
//     ];

//     const next = () => {
//       form.validateFields().then(() => {
//         setCurrentStep(currentStep + 1);
//       }).catch(err => {
//         console.error('Validation error:', err);
//       });
//     };

//     const prev = () => {
//       setCurrentStep(currentStep - 1);
//     };

//   const onFinish = async () => {
//   try {
//     const values = form.getFieldsValue(true);
// await form.validateFields();

// console.log("values.year = ", values.year); 

    
//     if (fileList.length === 0) {
//       message.error('Please upload at least one image');
//       return;
//     }

//     setUploading(true);
    
//     const formData = new FormData();
//     formData.append('title', values.title);
//     formData.append('location', values.location);
    
//     // Pastikan year adalah moment object yang valid
//     const selectedYear = values.year;

// if (!selectedYear || typeof selectedYear.year !== 'function') {
//   message.error('Please select a valid year');
//   setCurrentStep(0);
//   return;
// }

// formData.append('year', selectedYear.year());


//     formData.append('description', values.description);
    
//     fileList.forEach(file => {
//   if (file.originFileObj) {
//     formData.append('images', file.originFileObj);
//   }
// });


//     const token = localStorage.getItem('access_token');
//     if (!token) {
//       message.error('Please login first');
//       return;
//     }

//     const response = await axios.post(`${BASE_URL}/posts`, formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//         'Authorization': `Bearer ${token}`
//       }
//     });

//     if (response.data.success) {
//       showNotification('success', 'Success', 'Post created successfully!');
//       fetchPosts();
//       onClose();
//       form.resetFields();
//       setFileList([]);
//       setCurrentStep(0);
//     } else {
//       showNotification('error', 'Error', response.data.message || 'Failed to create post');
//     }
//   } catch (error) {
//     console.error('Error creating post:', error);
//     const errorMessage = error.response?.data?.message || error.message || 'Failed to create post';
//     showNotification('error', 'Error', errorMessage);
    
//     // Kembali ke step pertama jika error
//     setCurrentStep(0);
//   } finally {
//     setUploading(false);
//   }
// };

//     return (
//       <Drawer
//         title="Create Post"
//         visible={visible}
//         onClose={() => {
//           onClose();
//           form.resetFields();
//           setFileList([]);
//           setCurrentStep(0);
//         }}
//         width={600}
//         footer={
//           <div style={{ textAlign: 'right' }}>
//             <Button 
//               onClick={() => {
//                 onClose();
//                 form.resetFields();
//                 setFileList([]);
//                 setCurrentStep(0);
//               }} 
//               style={{ marginRight: 8 }}
//             >
//               Cancel
//             </Button>
// {currentStep === steps.length - 1 && (
//   <Button 
//     onClick={onFinish}
//     type="primary"
//     loading={uploading}
//   >
//     {uploading ? 'Submitting...' : 'Submit'}
//   </Button>
// )}


//           </div>
//         }
//       >
//         <Steps current={currentStep} style={{ marginBottom: 24 }}>
//           {steps.map(step => (
//             <Step key={step.title} title={step.title} />
//           ))}
//         </Steps>
//         <Form form={form} layout="vertical">
//           {steps[currentStep].content}
//         </Form>
//         <div style={{ marginTop: 24, textAlign: 'right' }}>
//           {currentStep > 0 && (
//             <Button style={{ marginRight: 8 }} onClick={prev}>
//               Previous
//             </Button>
//           )}
//           {currentStep < steps.length - 1 && (
//             <Button type="primary" onClick={next}>
//               Next
//             </Button>
//           )}
//         </div>
//       </Drawer>
//     );
//   };


//   const formatDate = (dateString) => {
//     if (!dateString) return '';
//     return moment(dateString).fromNow();
//   };

//   const formatYear = (year) => {
//     if (!year) return '';
//     return year.toString();
//   };

//   if (loading && posts.length === 0) {
//     return (
//       <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//         <Spin size="large" />
//       </div>
//     );
//   }

//   return (
//     <div className="dashboard-container">
//       {contextHolder}
      
//       <div className="dashboard-hero">
//         <div className="hero-content">
//           <Title level={1} className="hero-title">✨ Welcome to OgohDocs!</Title>
          
//           <div className="logo-container">
//             <img src="/logo.png" alt="OgohDocs Logo" className="animated-logo" />
//           </div>
          
//           <Text className="hero-subtitle">
//             Explore the beauty and philosophy of Balinese Ogoh-ogoh in one interactive platform.
//           </Text>
          
//           <Button 
//             type="primary" 
//             size="large" 
//             className="hero-button"
//             icon={<PlusOutlined />}
//             onClick={() => setFormVisible(true)}
//           >
//             Create Post
//           </Button>
//         </div>
//       </div>

//       <div className="stats-section">
//         <Row gutter={[24, 24]} justify="center">
//           {[
//             { number: posts.length, label: 'Documented Ogoh-ogoh' },
//             { number: '🏘️', label: 'Community Contributions' },
//             { number: '🏆', label: 'Local Artists' },
//             { number: '🗺️', label: 'Across Bali' }
//           ].map((stat, index) => (
//             <Col xs={24} sm={12} md={6} key={index}>
//               <Card className="stat-card">
//                 <Title level={2} className="stat-number">{stat.number}</Title>
//                 <Text className="stat-label">{stat.label}</Text>
//               </Card>
//             </Col>
//           ))}
//         </Row>
//       </div>

//       <div className="section">
//         <div style={{ textAlign: 'center' }}>
//           <Title level={2} className="section-title">Latest Activities</Title>
//           <Text className="section-subtitle">
//             See recent activities from the Ogoh-ogoh community
//           </Text>
//         </div>
        
//         <div className="posts-grid">
//         {loading ? (
//           Array.from({ length: 3 }).map((_, index) => (
//             <Card key={index} className="post-card">
//               <Skeleton active avatar paragraph={{ rows: 4 }} />
//             </Card>
//           ))
//         ) : posts.length > 0 ? (
//           posts.map(post => (
//             <Card 
//               key={post.id} 
//               className="post-card"
//               onClick={() => handlePostClick(post.id)}
//               hoverable
//             >
//               <div className="post-header">
//                 <Avatar 
//                   src={post.author?.profile_picture} 
//                   icon={<UserOutlined />}
//                 >
//                   {post.author?.name?.charAt(0) || 'A'}
//                 </Avatar>
//                 <div className="post-user-info">
//                   <Text strong className="post-username">{post.author?.name || 'Anonymous'}</Text>
//                   <Text className="post-date">{formatDate(post.created_at)}</Text>
//                 </div>
//               </div>
              
//               {post.images && post.images.length > 0 && (
//                 <div 
//                   className="post-image-container"
//                   onClick={(e) => e.stopPropagation()}
//                 >
//                   <Image.PreviewGroup>
//                     {post.images.slice(0, 1).map((img, idx) => ( // Only show first image in dashboard
//                       <Image
//                         key={idx}
//                         src={img.url}
//                         alt={`Post ${post.id}`}
//                         className="post-image"
//                         style={{
//                           width: '100%',
//                           maxHeight: '300px',
//                           objectFit: 'cover',
//                           borderRadius: '8px',
//                           marginBottom: '8px'
//                         }}
//                         fallback="/placeholderogohdocs.jpg"
//                         placeholder={
//                           <div className="image-placeholder">
//                             <LoadingOutlined />
//                           </div>
//                         }
//                         onError={(e) => {
//                           e.target.onerror = null;
//                           e.target.src = '/placeholderogohdocs.jpg';
//                         }}
//                       />
//                     ))}
//                   </Image.PreviewGroup>
//                 </div>
//               )}
              
//               <div className="post-content">
//                 <div className="post-caption-container">
//                   <Title level={4}>{post.title}</Title>
//                   <Text className="post-location">
//                     <EnvironmentOutlined /> {post.location} • {formatYear(post.year)}
//                   </Text>
//                     <Text className="post-description" style={{ whiteSpace: 'pre-line' }}>
//                       {post.description && post.description.length > 150 
//                         ? `${post.description.substring(0, 150)}...` 
//                         : post.description || 'No description'}
//                     </Text>

//                 </div>
                
//                 <div className="post-actions">
//                   <Space size="middle">
//                     <Button 
//                       type="text" 
//                       icon={post.liked ? <HeartFilled className="liked-icon" /> : <HeartOutlined />}
//                       onClick={(e) => handleLike(post.id, e)}
//                       className="post-action"
//                     >
//                       <span className="action-count">{post.like_count || 0}</span>
//                     </Button>
//                     <Button 
//                       type="text" 
//                       icon={<CommentOutlined />}
//                       onClick={(e) => handleToggleComments(post.id, e)}
//                       className="post-action"
//                     >
//                       <span className="action-count">{post.comment_count || 0}</span>
//                     </Button>
//                     <Button 
//                       type="text" 
//                       icon={<ShareAltOutlined />}
//                       className="post-action"
//                       onClick={(e) => handleShare(post.id, e)}
//                     />
//                   </Space>
//                 </div>
                
//                 {(commentingOn === post.id || post.showComments) && (
//                   <div 
//                     className="post-comments"
//                     onClick={(e) => e.stopPropagation()}
//                   >
//                     {post.comments?.map(comment => (
//                       <div key={comment.id} className="comment">
//                         <Avatar 
//                           size="small" 
//                           src={comment.user?.profile_picture}
//                         >
//                           {comment.user?.name?.charAt(0) || 'U'}
//                         </Avatar>
//                         <div className="comment-content">
//                           <Text strong className="comment-user">{comment.user?.name || 'User'}</Text>
//                           <Text className="comment-text">{comment.content}</Text>
//                         </div>
//                       </div>
//                     ))}
                    
//                     <Input 
//                       placeholder="Write a comment..."
//                       value={newComment}
//                       onChange={(e) => setNewComment(e.target.value)}
//                       onPressEnter={(e) => handleAddComment(post.id, e)}
//                       className="comment-input"
//                       suffix={
//                         <Button 
//                           type="text" 
//                           onClick={(e) => handleAddComment(post.id, e)}
//                           disabled={!newComment.trim()}
//                           icon={<SendOutlined />}
//                         />
//                       }
//                     />
//                   </div>
//                 )}
//               </div>
//             </Card>
//           ))
//         ) : (
//           <Card className="empty-post-card">
//             <Empty description="No posts yet. Be the first to share!" />
//           </Card>
//         )}
//       </div>

//       <DocumentationForm 
//         visible={formVisible} 
//         onClose={() => setFormVisible(false)} 
//       />
//     </div></div>
//   );
// };

// export default Dashboard;






















import React, { useState, useEffect } from 'react';
import { 
  Drawer, 
  Form, 
  Input, 
  Button, 
  Upload, 
  DatePicker,
  message,
  Steps,
  Divider,
  Row,
  Col,
  Card,
  Typography,
  Space,
  Carousel,
  notification,
  Spin,
  Avatar,
  Skeleton,
  Empty,
  Image,
  Tooltip
} from 'antd';
import { 
  PlusOutlined,
  UserOutlined,
  EnvironmentOutlined,
  CameraOutlined,
  HeartOutlined,
  HeartFilled,
  CommentOutlined,
  ShareAltOutlined,
  LoadingOutlined,
  SendOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import moment from 'moment';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const { Title, Text } = Typography;
const { Step } = Steps;

const BASE_URL = 'http://localhost:5000';

const Dashboard = () => {
  const [formVisible, setFormVisible] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [commentingOn, setCommentingOn] = useState(null);
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      await fetchCurrentUser();
      await fetchPosts();
    };
    load();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        message.error('Please login first');
        return;
      }

      const response = await axios.get(`${BASE_URL}/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCurrentUser(response.data.user);
    } catch (error) {
      console.error('Error fetching current user:', error);
      message.error('Failed to fetch user data');
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/posts`);
      
      const postsData = response.data?.data?.posts || response.data?.posts || [];
      
      const formattedPosts = postsData.map(post => ({
        ...post,
        liked: post.likes?.some(like => like.user_id === currentUser?.id) || false,
        showComments: false,
        images: post.images?.map(img => ({
          ...img,
          url: img.url || `${BASE_URL}/uploads/posts/${img.filename}`,
          placeholder: '/placeholderogohdocs.jpg'
        })) || [],
        comments: post.comments || [],
        like_count: post.like_count || post.likes?.length || 0,
        comment_count: post.comment_count || post.comments?.length || 0,
        main_image: post.images?.[0]?.url || '/placeholderogohdocs.jpg'
      }));
      
      setPosts(formattedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      message.error('Failed to fetch posts');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type, message, description) => {
    api[type]({
      message,
      description,
      placement: 'topRight'
    });
  };

  const handleLike = async (postId, e) => {
    e?.stopPropagation();
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        message.error('Please login first');
        return;
      }

      const postIndex = posts.findIndex(post => post.id === postId);
      const post = posts[postIndex];
      
      const response = await axios({
        method: post.liked ? 'delete' : 'post',
        url: `${BASE_URL}/posts/${postId}/like`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const updatedPosts = [...posts];
      updatedPosts[postIndex] = {
        ...post,
        liked: !post.liked,
        like_count: response.data.data?.like_count || response.data.like_count
      };
      
      setPosts(updatedPosts);
      showNotification('success', post.liked ? 'Like removed' : 'Post liked', '');
    } catch (error) {
      console.error('Error handling like:', error);
      showNotification('error', 'Error', 'Failed to update like');
    }
  };

  const handleAddComment = async (postId, e) => {
    e?.stopPropagation();
    if (!newComment.trim()) return;
    
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        message.error('Please login first');
        return;
      }

      const response = await axios.post(
        `${BASE_URL}/posts/${postId}/comments`,
        { content: newComment },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      const updatedPosts = posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...(post.comments || []), response.data.data || response.data],
            comment_count: (post.comment_count || 0) + 1,
            showComments: true
          };
        }
        return post;
      });
      
      setPosts(updatedPosts);
      setNewComment('');
      showNotification('success', 'Comment Added', 'Your comment was posted!');
    } catch (error) {
      console.error('Error adding comment:', error);
      showNotification('error', 'Error', 'Failed to add comment');
    }
  };

  const handleShare = (postId, e) => {
    e?.stopPropagation();
    const postLink = `${window.location.origin}/postdetail/${postId}`;
    navigator.clipboard.writeText(postLink);
    message.success('Link copied to clipboard!');
  };

  const handleToggleComments = (postId, e) => {
    e?.stopPropagation();
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          showComments: !post.showComments
        };
      }
      return post;
    }));
    setCommentingOn(commentingOn === postId ? null : postId);
  };

  const handlePostClick = (postId) => {
    navigate(`/postdetail/${postId}`);
  };

  const DocumentationForm = ({ visible, onClose }) => {
    const [form] = Form.useForm();
    const [currentStep, setCurrentStep] = useState(0);
    const [fileList, setFileList] = useState([]);
    const [uploading, setUploading] = useState(false);

    const steps = [
      {
        title: 'Basic Info',
        content: (
          <>
            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: 'Please enter title' }]}
            >
              <Input placeholder="Ogoh-ogoh name" />
            </Form.Item>
            <Form.Item
              name="location"
              label="Location"
              rules={[{ required: true, message: 'Please enter location' }]}
            >
              <Input placeholder="Banjar Kaja, Gianyar" />
            </Form.Item>
            <Form.Item
              name="year"
              label="Year"
              rules={[
                { 
                  required: true, 
                  message: 'Please select year' 
                },
                () => ({
                  validator(_, value) {
                    if (!value || !value.isValid()) {
                      return Promise.reject(new Error('Please select a valid year'));
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <DatePicker 
                picker="year"
                format="YYYY"
                style={{ width: '100%' }}
                disabledDate={current => current && current > moment().endOf('year')}
              />
            </Form.Item>
          </>
        ),
      },
      {
        title: 'Content',
        content: (
          <>
            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: 'Please enter description' }]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item
              name="images"
              label="Images"
              rules={[{ required: true, message: 'Please upload at least one image' }]}
              valuePropName="fileList"
              getValueFromEvent={e => {
                if (Array.isArray(e)) {
                  return e;
                }
                return e?.fileList;
              }}
            >
              <Upload
                listType="picture-card"
                beforeUpload={(file) => {
                  const wrappedFile = {
                    ...file,
                    originFileObj: file,
                    uid: file.uid || Date.now() + '-' + file.name,
                  };
                  setFileList(prev => [...prev, wrappedFile]);
                  return false;
                }}
                maxCount={10}
                multiple
                fileList={fileList}
                onRemove={(file) => {
                  setFileList(prev => prev.filter(f => f.uid !== file.uid));
                }}
              >
                {fileList.length < 10 && (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
          </>
        ),
      }
    ];

    const next = () => {
      form.validateFields().then(() => {
        setCurrentStep(currentStep + 1);
      }).catch(err => {
        console.error('Validation error:', err);
      });
    };

    const prev = () => {
      setCurrentStep(currentStep - 1);
    };

    const onFinish = async () => {
      try {
        const values = form.getFieldsValue(true);
        await form.validateFields();

        if (fileList.length === 0) {
          message.error('Please upload at least one image');
          return;
        }

        setUploading(true);
        
        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('location', values.location);
        
        const selectedYear = values.year;
        if (!selectedYear || typeof selectedYear.year !== 'function') {
          message.error('Please select a valid year');
          setCurrentStep(0);
          return;
        }
        formData.append('year', selectedYear.year());

        formData.append('description', values.description);
        
        fileList.forEach(file => {
          if (file.originFileObj) {
            formData.append('images', file.originFileObj);
          }
        });

        const token = localStorage.getItem('access_token');
        if (!token) {
          message.error('Please login first');
          return;
        }

        const response = await axios.post(`${BASE_URL}/posts`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data.success) {
          showNotification('success', 'Success', 'Post created successfully!');
          fetchPosts();
          onClose();
          form.resetFields();
          setFileList([]);
          setCurrentStep(0);
        } else {
          showNotification('error', 'Error', response.data.message || 'Failed to create post');
        }
      } catch (error) {
        console.error('Error creating post:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to create post';
        showNotification('error', 'Error', errorMessage);
        setCurrentStep(0);
      } finally {
        setUploading(false);
      }
    };

    return (
      <Drawer
        title="Create Post"
        visible={visible}
        onClose={() => {
          onClose();
          form.resetFields();
          setFileList([]);
          setCurrentStep(0);
        }}
        width={600}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Button 
              onClick={() => {
                onClose();
                form.resetFields();
                setFileList([]);
                setCurrentStep(0);
              }} 
              style={{ marginRight: 8 }}
            >
              Cancel
            </Button>
            {currentStep === steps.length - 1 && (
              <Button 
                onClick={onFinish}
                type="primary"
                loading={uploading}
              >
                {uploading ? 'Submitting...' : 'Submit'}
              </Button>
            )}
          </div>
        }
      >
        <Steps current={currentStep} style={{ marginBottom: 24 }}>
          {steps.map(step => (
            <Step key={step.title} title={step.title} />
          ))}
        </Steps>
        <Form form={form} layout="vertical">
          {steps[currentStep].content}
        </Form>
        <div style={{ marginTop: 24, textAlign: 'right' }}>
          {currentStep > 0 && (
            <Button style={{ marginRight: 8 }} onClick={prev}>
              Previous
            </Button>
          )}
          {currentStep < steps.length - 1 && (
            <Button type="primary" onClick={next}>
              Next
            </Button>
          )}
        </div>
      </Drawer>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return moment(dateString).fromNow();
  };

  const formatYear = (year) => {
    if (!year) return '';
    return year.toString();
  };

  if (loading && posts.length === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {contextHolder}
      
      <div className="dashboard-hero">
        <div className="hero-content">
          <Title level={1} className="hero-title">✨ Welcome to OgohDocs!</Title>
          
          <div className="logo-container">
            <img src="/logo.png" alt="OgohDocs Logo" className="animated-logo" />
          </div>
          
          <Text className="hero-subtitle">
            Explore the beauty and philosophy of Balinese Ogoh-ogoh in one interactive platform.
          </Text>
          
          <Button 
            type="primary" 
            size="large" 
            className="hero-button"
            icon={<PlusOutlined />}
            onClick={() => setFormVisible(true)}
          >
            Create Post
          </Button>
        </div>
      </div>

      <div className="stats-section">
        <Row gutter={[24, 24]} justify="center">
          {[
            { number: posts.length, label: 'Documented Ogoh-ogoh' },
            { number: '🏘️', label: 'Community Contributions' },
            { number: '🏆', label: 'Local Artists' },
            { number: '🗺️', label: 'Across Bali' }
          ].map((stat, index) => (
            <Col xs={24} sm={12} md={6} key={index}>
              <Card className="stat-card">
                <Title level={2} className="stat-number">{stat.number}</Title>
                <Text className="stat-label">{stat.label}</Text>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      <div className="section">
        <div style={{ textAlign: 'center' }}>
          <Title level={2} className="section-title">Latest Activities</Title>
          <Text className="section-subtitle">
            See recent activities from the Ogoh-ogoh community
          </Text>
        </div>
        
        <div className="posts-grid">
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="post-card">
                <Skeleton active avatar paragraph={{ rows: 4 }} />
              </Card>
            ))
          ) : posts.length > 0 ? (
            posts.map(post => (
              <Card 
                key={post.id} 
                className="post-card"
                onClick={() => handlePostClick(post.id)}
                hoverable
              >
                {/* Post Header */}
                <div className="post-header">
                  <Avatar 
                    src={post.author?.profile_picture} 
                    icon={<UserOutlined />}
                    className="post-avatar"
                  >
                    {post.author?.name?.charAt(0) || 'A'}
                  </Avatar>
                  <div className="post-user-info">
                    <Text strong className="post-username">{post.author?.name || 'Anonymous'}</Text>
                    <Text className="post-date">{formatDate(post.created_at)}</Text>
                  </div>
                </div>
                
                {/* Post Image - Full Width */}
                {post.images && post.images.length > 0 && (
                  <div className="post-image-container" onClick={(e) => e.stopPropagation()}>
                    <Image.PreviewGroup>
                      {post.images.slice(0, 1).map((img, idx) => (
                        <Image
                          key={idx}
                          src={img.url}
                          alt={`Post ${post.id}`}
                          className="post-image"
                          style={{
                            width: '100%',
                            height: '300px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            marginBottom: '12px'
                          }}
                          fallback="/placeholderogohdocs.jpg"
                          placeholder={
                            <div className="image-placeholder">
                              <LoadingOutlined />
                            </div>
                          }
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/placeholderogohdocs.jpg';
                          }}
                        />
                      ))}
                    </Image.PreviewGroup>
                  </div>
                )}
                
                {/* Post Title and Location */}
                <div className="post-content">
                  <div className="post-caption-container">
                    <Title level={4} className="post-title">{post.title}</Title>
                    <Space size="small" className="post-meta">
                      <Text className="post-location">
                        <EnvironmentOutlined /> {post.location}
                      </Text>
                      <Text className="post-year">
                        <CalendarOutlined /> {formatYear(post.year)}
                      </Text>
                    </Space>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="post-actions">
                    <Space size="middle">
                      <Tooltip title={post.liked ? "Unlike" : "Like"}>
                        <Button 
                          type="text" 
                          icon={post.liked ? <HeartFilled className="liked-icon" /> : <HeartOutlined />}
                          onClick={(e) => handleLike(post.id, e)}
                          className={`post-action ${post.liked ? 'liked' : ''}`}
                        >
                          <span className="action-count">{post.like_count || 0}</span>
                        </Button>
                      </Tooltip>
                      <Tooltip title="Comments">
                        <Button 
                          type="text" 
                          icon={<CommentOutlined />}
                          onClick={(e) => handleToggleComments(post.id, e)}
                          className="post-action"
                        >
                          <span className="action-count">{post.comment_count || 0}</span>
                        </Button>
                      </Tooltip>
                      <Tooltip title="Share">
                        <Button 
                          type="text" 
                          icon={<ShareAltOutlined />}
                          className="post-action"
                          onClick={(e) => handleShare(post.id, e)}
                        />
                      </Tooltip>
                    </Space>
                  </div>
                  
                  {/* Comments Section */}
                  {(commentingOn === post.id || post.showComments) && (
                    <div className="post-comments" onClick={(e) => e.stopPropagation()}>
                      {post.comments?.map(comment => (
                        <div key={comment.id} className="comment">
                          <Avatar 
                            size="small" 
                            src={comment.user?.profile_picture}
                            className="comment-avatar"
                          >
                            {comment.user?.name?.charAt(0) || 'U'}
                          </Avatar>
                          <div className="comment-content">
                            <Text strong className="comment-user">{comment.user?.name || 'User'}</Text>
                            <Text className="comment-text">{comment.content}</Text>
                          </div>
                        </div>
                      ))}
                      
                      <Input 
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onPressEnter={(e) => handleAddComment(post.id, e)}
                        className="comment-input"
                        suffix={
                          <Button 
                            type="text" 
                            onClick={(e) => handleAddComment(post.id, e)}
                            disabled={!newComment.trim()}
                            icon={<SendOutlined />}
                            className="comment-submit"
                          />
                        }
                      />
                    </div>
                  )}
                </div>
              </Card>
            ))
          ) : (
            <Card className="empty-post-card">
              <Empty description="No posts yet. Be the first to share!" />
            </Card>
          )}
        </div>
      </div>

      <DocumentationForm 
        visible={formVisible} 
        onClose={() => setFormVisible(false)} 
      />
    </div>
  );
};

export default Dashboard;