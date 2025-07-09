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
  Tag,
  Carousel,
  notification,
  Spin,
  Avatar,
  Skeleton,
  Empty,
  Menu
} from 'antd';
import { 
  PlusOutlined,
  UploadOutlined,
  UserOutlined,
  EnvironmentOutlined,
  CameraOutlined,
  HeartOutlined,
  HeartFilled,
  CommentOutlined,
  ShareAltOutlined,
  RightOutlined,
  SendOutlined,
  CalendarOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import moment from 'moment';
import axios from 'axios';
import './Dashboard.css';

const { Title, Text } = Typography;
const { Step } = Steps;

const Dashboard = () => {
  const [formVisible, setFormVisible] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [commentingOn, setCommentingOn] = useState(null);
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    fetchCurrentUser();
    fetchPosts();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        message.error('Please login first');
        return;
      }

      const response = await axios.get('http://localhost:5000/me', {
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
      const response = await axios.get('http://localhost:5000/posts');
      
      // Extract posts from the nested API response
      const postsData = response.data?.data?.posts || [];
      
      const formattedPosts = postsData.map(post => ({
        ...post,
        liked: post.likes?.some(like => like.user_id === currentUser?.id) || false,
        showComments: false,
        images: post.images || [post.main_image].filter(Boolean), // Handle both images array and single main_image
        comments: post.comments || [],
        like_count: post.like_count || 0,
        comment_count: post.comment_count || 0
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

  // In your handleLike function
const handleLike = async (postId) => {
  try {
    const token = localStorage.getItem('access_token');
    const postIndex = posts.findIndex(post => post.id === postId);
    const post = posts[postIndex];
    
    const response = await axios({
      method: post.liked ? 'delete' : 'post',
      url: `http://localhost:5000/posts/${postId}/like`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const updatedPosts = [...posts];
    updatedPosts[postIndex] = {
      ...post,
      liked: !post.liked,
      like_count: response.data.like_count
    };
    
    setPosts(updatedPosts);
  } catch (error) {
    console.error('Error handling like:', error);
    showNotification('error', 'Error', 'Failed to update like');
  }
};

// In your handleAddComment function
const handleAddComment = async (postId) => {
  if (!newComment.trim()) return;
  
  try {
    const token = localStorage.getItem('access_token');
    const response = await axios.post(
      `http://localhost:5000/posts/${postId}/comments`,
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
          comments: [...(post.comments || []), response.data.data],
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

  const handleShare = (postId) => {
    const postLink = `https://ogohdocs.com/posts/${postId}`;
    navigator.clipboard.writeText(postLink);
    message.success('Link post berhasil disalin!');
  };

  const handleToggleComments = (postId) => {
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

  const DocumentationForm = ({ visible, onClose }) => {
    const [form] = Form.useForm();
    const [currentStep, setCurrentStep] = useState(0);
    const [fileList, setFileList] = useState([]);
    const [uploading, setUploading] = useState(false);

    const steps = [
      {
        title: 'Informasi Dasar',
        content: (
          <>
            <Form.Item
              name="title"
              label="Nama Ogoh-ogoh"
              rules={[{ required: true, message: 'Harap masukkan nama Ogoh-ogoh' }]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="Contoh: Barong Landung"
              />
            </Form.Item>
            
            <Form.Item
              name="location"
              label="Asal Banjar"
              rules={[{ required: true, message: 'Harap masukkan asal banjar' }]}
            >
              <Input 
                prefix={<EnvironmentOutlined />} 
                placeholder="Contoh: Banjar Kaja, Gianyar"
              />
            </Form.Item>

            <Form.Item
              name="year"
              label="Tahun Pembuatan"
              rules={[{ required: true, message: 'Harap pilih tahun' }]}
            >
              <DatePicker 
                picker="year" 
                style={{ width: '100%' }}
              />
            </Form.Item>
          </>
        ),
      },
      {
        title: 'Dokumentasi',
        content: (
          <>
            <Form.Item
              name="description"
              label="Deskripsi Ogoh-ogoh"
              rules={[{ required: true, message: 'Harap masukkan deskripsi' }]}
            >
              <Input.TextArea 
                rows={4} 
                placeholder="Ceritakan tentang Ogoh-ogoh ini"
              />
            </Form.Item>
            
            <Form.Item
              name="images"
              label="Upload Foto"
              rules={[{ required: true, message: 'Harap upload minimal 1 foto' }]}
            >
              <Upload
                listType="picture-card"
                beforeUpload={(file) => {
                  setFileList([...fileList, file]);
                  return false;
                }}
                maxCount={10}
                multiple
                fileList={fileList}
                onRemove={(file) => {
                  const index = fileList.indexOf(file);
                  const newFileList = fileList.slice();
                  newFileList.splice(index, 1);
                  setFileList(newFileList);
                }}
              >
                {fileList.length < 10 && (
                  <div>
                    <CameraOutlined />
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
      });
    };

    const prev = () => {
      setCurrentStep(currentStep - 1);
    };

    const onFinish = async () => {
      try {
        const values = await form.validateFields();
        if (fileList.length === 0) {
          message.error('Harap upload minimal 1 foto');
          return;
        }

        setUploading(true);
        
        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('location', values.location);
        formData.append('year', values.year.format('YYYY'));
        formData.append('description', values.description);
        
        fileList.forEach(file => {
          formData.append('images', file);
        });

        const token = localStorage.getItem('access_token');
        await axios.post('http://localhost:5000/posts', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        });

        showNotification('success', 'Posting Berhasil', 'Ogoh-ogoh Anda berhasil diposting!');
        fetchPosts();
        onClose();
        form.resetFields();
        setFileList([]);
      } catch (error) {
        console.error('Error creating post:', error);
        message.error(error.response?.data?.message || 'Failed to create post');
      } finally {
        setUploading(false);
      }
    };

    return (
      <Drawer
        title="Dokumentasi Ogoh-ogoh Baru"
        width={600}
        onClose={() => {
          onClose();
          form.resetFields();
          setFileList([]);
        }}
        open={visible}
        footer={null}
        className="documentation-drawer"
      >
        <Steps current={currentStep} style={{ marginBottom: 24 }}>
          {steps.map((item) => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        
        <Form form={form} layout="vertical">
          <div style={{ minHeight: '60vh' }}>
            {steps[currentStep].content}
          </div>
          
          <Divider />
          
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {currentStep > 0 && (
              <Button onClick={prev}>
                Kembali
              </Button>
            )}
            
            {currentStep < steps.length - 1 && (
              <Button 
                type="primary" 
                onClick={next}
              >
                Lanjut
              </Button>
            )}
            
            {currentStep === steps.length - 1 && (
              <Button 
                type="primary" 
                onClick={onFinish}
                loading={uploading}
              >
                {uploading ? <LoadingOutlined /> : 'Posting Sekarang'}
              </Button>
            )}
          </div>
        </Form>
      </Drawer>
    );
  };

  const formatDate = (dateString) => {
    return moment(dateString).fromNow();
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
      
      {/* Hero Section */}
      <div className="dashboard-hero">
        <div className="hero-content">
          <Title level={1} className="hero-title">✨ Selamat Datang di OgohDocs!</Title>
          
          <div className="logo-container">
            <img 
              src="/logo.png" 
              alt="OgohDocs Logo" 
              className="animated-logo"
            />
          </div>
          
          <Text className="hero-subtitle">
            Jelajahi pesona dan filosofi mendalam dari ogoh-ogoh Bali dalam satu platform digital yang interaktif dan memukau.
          </Text>
          
          <Button 
            type="primary" 
            size="large" 
            className="hero-button"
            icon={<PlusOutlined />}
            onClick={() => setFormVisible(true)}
          >
            Post Sekarang! �
          </Button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-section">
        <Row gutter={[24, 24]} justify="center">
          {[
            { number: posts.length, label: 'Koleksi Ogoh-ogoh yang Terdata' },
            { number: '🏘️', label: 'Kontribusi Komunitas Banjar' },
            { number: '🏆', label: 'Karya Seniman Lokal' },
            { number: '🗺️', label: 'Cakupan Luas di Bali' }
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

      {/* Features Section */}
      <div className="section">
        <div style={{ textAlign: 'center' }}>
          <Title level={2} className="section-title">Fitur Dokumentasi Lengkap</Title>
          <Text className="section-subtitle">
            Semua yang Anda butuhkan untuk mendokumentasikan Ogoh-ogoh secara profesional dan terstruktur
          </Text>
        </div>
        
        <Row gutter={[24, 24]} className="features-grid">
          {[
            {
              icon: '🖼️',
              title: "Galeri Foto",
              desc: "Upload gambar Ogoh-ogoh dari berbagai sudut dan momen terbaik."
            },
            {
              icon: '📝',
              title: "Deskripsi Lengkap",
              desc: "Tambahkan nama, asal, tahun pembuatan, serta cerita di balik Ogoh-ogoh."
            },
            {
              icon: '❤️',
              title: "Suka & Komentar",
              desc: "Fitur interaksi untuk memberi apresiasi dan membangun koneksi antar pengguna."
            },
            {
              icon: '🎞️',
              title: "Playlist Video Ogoh-ogoh",
              desc: "Kumpulan video pilihan berisi proses pembuatan, parade, dan liputan khas tentang Ogoh-ogoh."
            }
          ].map((feature, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card className="feature-card" hoverable>
                <Text className="feature-icon">{feature.icon}</Text>
                <Title level={4} className="feature-title">{feature.title}</Title>
                <Text className="feature-desc">{feature.desc}</Text>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Community Posts */}
      <div className="section">
        <div style={{ textAlign: 'center' }}>
          <Title level={2} className="section-title">Kegiatan Terbaru</Title>
          <Text className="section-subtitle">
            Lihat aktivitas terbaru dari komunitas Ogoh-ogoh Bali
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
              <Card key={post.id} className="post-card">
                <div className="post-header">
                  <Avatar 
                    src={post.author?.profile_picture} 
                    icon={<UserOutlined />}
                  >
                    {post.author?.name?.charAt(0) || 'A'}
                  </Avatar>
                  <div className="post-user-info">
                    <Text strong className="post-username">{post.author?.name || 'Anon'}</Text>
                    <Text className="post-date">{formatDate(post.created_at)}</Text>
                  </div>
                </div>
                
                {post.images && post.images.length > 0 && (
                  <>
                    <Carousel 
                      className="post-carousel"
                      dots={false}
                    >
                      {post.images.map((img, idx) => (
                        <div key={idx} className="post-image-container">
                          <img src={img.url} alt={`Post ${post.id}`} className="post-image" />
                        </div>
                      ))}
                    </Carousel>
                    
                    <div className="post-slide-indicator">
                      {post.images.map((_, idx) => (
                        <div 
                          key={idx} 
                          className={`slide-dot ${idx === 0 ? 'active' : ''}`}
                        />
                      ))}
                    </div>
                  </>
                )}
                
                <div className="post-content">
                  <div className="post-caption-container">
                    <Title level={4}>{post.title}</Title>
                    <Text className="post-location">
                      <EnvironmentOutlined /> {post.location} • {post.year}
                    </Text>
                    <Text className="post-description" style={{ whiteSpace: 'pre-line' }}>
                      {post.description}
                    </Text>
                  </div>
                  
                  <div className="post-actions">
                    <Space size="middle">
                      <Button 
                        type="text" 
                        icon={post.liked ? <HeartFilled className="liked-icon" /> : <HeartOutlined />}
                        onClick={() => handleLike(post.id)}
                        className="post-action"
                      >
                        <span className="action-count">{post.like_count || 0}</span>
                      </Button>
                      <Button 
                        type="text" 
                        icon={<CommentOutlined />}
                        onClick={() => handleToggleComments(post.id)}
                        className="post-action"
                      >
                        <span className="action-count">{post.comment_count || 0}</span>
                      </Button>
                      <Button 
                        type="text" 
                        icon={<ShareAltOutlined />}
                        className="post-action"
                        onClick={() => handleShare(post.id)}
                      />
                    </Space>
                  </div>
                  
                  {(commentingOn === post.id || post.showComments) && (
                    <div className="post-comments">
                      {post.comments?.map(comment => (
                        <div key={comment.id} className="comment">
                          <Avatar 
                            size="small" 
                            src={comment.user?.profile_picture}
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
                        placeholder="Tulis komentar..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onPressEnter={() => handleAddComment(post.id)}
                        className="comment-input"
                        suffix={
                          <Button 
                            type="text" 
                            onClick={() => handleAddComment(post.id)}
                            disabled={!newComment.trim()}
                            icon={<SendOutlined />}
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
              <Empty description="Belum ada postingan. Jadilah yang pertama berbagi!" />
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