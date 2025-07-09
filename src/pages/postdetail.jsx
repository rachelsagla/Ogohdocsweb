// // PostDetail.js
// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { 
//   Row, 
//   Col, 
//   Card, 
//   Typography, 
//   Space, 
//   Avatar, 
//   Button, 
//   Image, 
//   Spin, 
//   message 
// } from 'antd';
// import { 
//   UserOutlined, 
//   EnvironmentOutlined,
//   HeartOutlined,
//   HeartFilled,
//   CommentOutlined,
//   ShareAltOutlined
// } from '@ant-design/icons';
// import axios from 'axios';
// import moment from 'moment';

// const { Title, Text } = Typography;
// const BASE_URL = 'http://localhost:5000';

// const PostDetail = () => {
//   const { postId } = useParams();
//   const [post, setPost] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [liked, setLiked] = useState(false);
//   const [likeCount, setLikeCount] = useState(0);
  

//   useEffect(() => {
//     const fetchPostDetail = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(`${BASE_URL}/posts/${postId}`);
//         setPost(response.data.data);
//         setLiked(response.data.data.liked || false);
//         setLikeCount(response.data.data.like_count || 0);
//       } catch (error) {
//         console.error('Error fetching post:', error);
//         message.error('Failed to load post details');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPostDetail();
//   }, [postId]);

//   const handleLike = async () => {
//     try {
//       const token = localStorage.getItem('access_token');
//       if (!token) {
//         message.error('Please login first');
//         return;
//       }

//       const response = await axios({
//         method: liked ? 'delete' : 'post',
//         url: `${BASE_URL}/posts/${postId}/like`,
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });

//       setLiked(!liked);
//       setLikeCount(response.data.data?.like_count || likeCount + (liked ? -1 : 1));
//     } catch (error) {
//       console.error('Error handling like:', error);
//       message.error('Failed to update like');
//     }
//   };

//   if (loading) {
//     return (
//       <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
//         <Spin size="large" />
//       </div>
//     );
//   }

//   if (!post) {
//     return (
//       <div style={{ textAlign: 'center', padding: '50px' }}>
//         <Text>Post not found</Text>
//       </div>
//     );
//   }

//   return (
//     <div style={{ padding: '24px' }}>
//       <Row justify="center">
//         <Col xs={24} md={18} lg={12}>
//           <Card>
//             <div style={{ marginBottom: '16px' }}>
//               <Avatar 
//                 size={64}
//                 src={post.author?.profile_picture}
//                 icon={<UserOutlined />}
//               />
//               <div style={{ display: 'inline-block', marginLeft: '12px' }}>
//                 <Title level={4} style={{ marginBottom: 0 }}>{post.author?.name || 'Anonymous'}</Title>
//                 <Text type="secondary">{moment(post.created_at).fromNow()}</Text>
//               </div>
//             </div>

//             <Title level={3}>{post.title}</Title>
//             <Text>
//               <EnvironmentOutlined /> {post.location} • {post.year}
//             </Text>

//             {post.images && post.images.length > 0 && (
//               <div style={{ margin: '16px 0' }}>
//                 <Image.PreviewGroup>
//                   {post.images.map((img, idx) => (
//                     <Image
//                       key={idx}
//                       src={img.url}
//                       alt={`${post.title} - ${idx + 1}`}
//                       style={{
//                         width: '100%',
//                         borderRadius: '8px',
//                         marginBottom: '8px'
//                       }}
//                     />
//                   ))}
//                 </Image.PreviewGroup>
//               </div>
//             )}

//             <Text style={{ whiteSpace: 'pre-line', fontSize: '16px' }}>
//               {post.description}
//             </Text>

//             <div style={{ marginTop: '24px' }}>
//               <Space size="large">
//                 <Button 
//                   type="text" 
//                   icon={liked ? <HeartFilled style={{ color: 'red' }} /> : <HeartOutlined />}
//                   onClick={handleLike}
//                 >
//                   {likeCount} Likes
//                 </Button>
//                 <Button 
//                   type="text" 
//                   icon={<CommentOutlined />}
//                 >
//                   {post.comment_count || 0} Comments
//                 </Button>
//                 <Button 
//                   type="text" 
//                   icon={<ShareAltOutlined />}
//                   onClick={() => {
//                     navigator.clipboard.writeText(window.location.href);
//                     message.success('Link copied to clipboard!');
//                   }}
//                 />
//               </Space>
//             </div>
//           </Card>

//           {/* Comments section can be added here */}
//         </Col>
//       </Row>
//     </div>
//   );
// };

// export default PostDetail;


import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Row, 
  Col, 
  Card, 
  Typography, 
  Space, 
  Avatar, 
  Button, 
  Image, 
  Spin, 
  message,
  Input,
  List,
  Divider,
  Tooltip
} from 'antd';
import { 
  UserOutlined, 
  EnvironmentOutlined,
  HeartOutlined,
  HeartFilled,
  CommentOutlined,
  ShareAltOutlined,
  SendOutlined,
  ArrowLeftOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import './PostDetail.css';

const { Title, Text } = Typography;
const BASE_URL = 'http://localhost:5000';

const PostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) return;

        const response = await axios.get(`${BASE_URL}/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setCurrentUser(response.data.user);
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    const fetchPostData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/posts/${postId}`);
        const postData = response.data.data?.post || response.data.data;
        setPost(postData);
        setLiked(postData.liked || false);
        setLikeCount(postData.like_count || 0);
        
        // Fetch comments separately if needed
        const commentsResponse = await axios.get(`${BASE_URL}/posts/${postId}/comments`);
        setComments(commentsResponse.data.data?.comments || []);
      } catch (error) {
        console.error('Error fetching post:', error);
        message.error('Failed to load post details');
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
    fetchPostData();
  }, [postId]);

  const handleLike = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        message.error('Please login first');
        return;
      }

      const response = await axios({
        method: liked ? 'delete' : 'post',
        url: `${BASE_URL}/posts/${postId}/like`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setLiked(!liked);
      setLikeCount(response.data.data?.like_count || likeCount + (liked ? -1 : 1));
      message.success(liked ? 'Removed like' : 'Post liked!');
    } catch (error) {
      console.error('Error handling like:', error);
      message.error('Failed to update like');
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      message.warning('Comment cannot be empty');
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        message.error('Please login to comment');
        return;
      }

      setCommentLoading(true);
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

      const newCommentData = {
        ...response.data.data,
        user: currentUser || { name: 'You', profile_picture: null }
      };

      setComments([newCommentData, ...comments]);
      setNewComment('');
      message.success('Comment added successfully!');
    } catch (error) {
      console.error('Error adding comment:', error);
      message.error(error.response?.data?.message || 'Failed to add comment');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => message.success('Link copied to clipboard!'))
      .catch(() => message.error('Failed to copy link'));
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Text>Post not found</Text>
        <Button type="primary" onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* <Button 
        type="text" 
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: '20px' }}
      >
        Back
      </Button> */}

      <Card
        style={{ borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
        bodyStyle={{ padding: '24px' }}
      >
        {/* Author Info */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <Avatar 
            size={64}
            src={post.author?.profile_picture}
            icon={<UserOutlined />}
            style={{ marginRight: '16px' }}
          />
          <div>
            <Title level={4} style={{ marginBottom: '4px' }}>{post.author?.name || 'Anonymous'}</Title>
            <Text type="secondary">{moment(post.created_at).fromNow()}</Text>
          </div>
        </div>

        {/* Post Content */}
        <Title level={3} style={{ marginBottom: '12px' }}>{post.title}</Title>
        
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <Space size="middle">
            <Text>
              <EnvironmentOutlined style={{ marginRight: '8px' }} />
              {post.location}
            </Text>
            <Text>
              <CalendarOutlined style={{ marginRight: '8px' }} />
              {post.year}
            </Text>
          </Space>
        </div>

        {/* Images */}
        {post.images && post.images.length > 0 && (
          <div style={{ margin: '20px 0' }}>
            <Image.PreviewGroup>
              {post.images.map((img, idx) => (
                <Image
                  key={idx}
                  src={img.url}
                  alt={`${post.title} - ${idx + 1}`}
                  style={{
                    width: '100%',
                    borderRadius: '8px',
                    marginBottom: '8px',
                    maxHeight: '500px',
                    objectFit: 'cover'
                  }}
                />
              ))}
            </Image.PreviewGroup>
          </div>
        )}

        <Text style={{ 
          whiteSpace: 'pre-line', 
          fontSize: '16px', 
          lineHeight: '1.6',
          marginBottom: '24px',
          display: 'block'
        }}>
          {post.description}
        </Text>

        {/* Action Buttons */}
        <Divider style={{ margin: '16px 0' }} />
        
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <Tooltip title={liked ? "Unlike" : "Like"}>
            <Button 
              type="text" 
              icon={liked ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />}
              onClick={handleLike}
              style={{ fontSize: '16px' }}
            >
              {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
            </Button>
          </Tooltip>
          
          <Tooltip title="Comment">
            <Button 
              type="text" 
              icon={<CommentOutlined />}
              style={{ fontSize: '16px' }}
            >
              {comments.length} Comments
            </Button>
          </Tooltip>
          
          <Tooltip title="Share">
            <Button 
              type="text" 
              icon={<ShareAltOutlined />}
              onClick={handleShare}
              style={{ fontSize: '16px' }}
            >
              Share
            </Button>
          </Tooltip>
        </div>

        {/* Comments Section */}
        <Divider style={{ margin: '24px 0' }} />
        
        <Title level={5} style={{ marginBottom: '16px' }}>Comments ({comments.length})</Title>
        
        {/* Comment Input */}
        <div style={{ display: 'flex', marginBottom: '24px' }}>
          <Avatar 
            size={40}
            src={currentUser?.profile_picture}
            icon={<UserOutlined />}
            style={{ marginRight: '12px' }}
          />
          <Input
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onPressEnter={handleAddComment}
            style={{ borderRadius: '20px', padding: '8px 16px' }}
            suffix={
              <Button
                type="text"
                icon={<SendOutlined />}
                onClick={handleAddComment}
                loading={commentLoading}
                disabled={!newComment.trim()}
              />
            }
          />
        </div>

        {/* Comments List */}
        <List
          itemLayout="horizontal"
          dataSource={comments}
          renderItem={comment => (
            <List.Item style={{ padding: '12px 0' }}>
              <List.Item.Meta
                avatar={
                  <Avatar 
                    src={comment.user?.profile_picture} 
                    icon={<UserOutlined />}
                  />
                }
                title={
                  <Space>
                    <Text strong>{comment.user?.name || 'User'}</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {moment(comment.created_at).fromNow()}
                    </Text>
                  </Space>
                }
                description={<Text style={{ fontSize: '15px' }}>{comment.content}</Text>}
              />
            </List.Item>
          )}
          locale={{ 
            emptyText: (
              <div style={{ textAlign: 'center', padding: '24px' }}>
                <Text type="secondary">No comments yet. Be the first to comment!</Text>
              </div>
            ) 
          }}
        />
      </Card>
    </div>
  );
};

export default PostDetail;