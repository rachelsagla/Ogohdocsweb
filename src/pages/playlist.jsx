import React, { useState, useEffect } from "react";
import { 
  Col,
  Row,
  Typography,
  Card,
  Skeleton,
  Drawer,
  Form,
  Input,
  Button,
  notification,
  Space,
  Popconfirm,
  Select,
  Tag,
  Empty,
  Tooltip,
  Badge
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  SearchOutlined,
  DeleteOutlined,
  CustomerServiceOutlined,
  YoutubeOutlined,
  PlayCircleOutlined,
  HeartOutlined,
  ShareAltOutlined,
  SoundOutlined,
  PictureOutlined
} from '@ant-design/icons';
import { getData, sendData, deleteData } from "/src/utils/api";
import "./theme.css";
import "./playlist.css";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const Playlist = () => {
  // State management
  const [dataSources, setDataSources] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [idSelected, setIdSelected] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [activeFilter, setActiveFilter] = useState('all');

  // Constants
  const genreOptions = [
    { value: 'music', label: 'Music', icon: <SoundOutlined /> },
    { value: 'song', label: 'Song', icon: <PlayCircleOutlined /> },
    { value: 'movie', label: 'Movie', icon: <YoutubeOutlined /> },
    { value: 'education', label: 'Education', icon: <CustomerServiceOutlined /> },
    { value: 'others', label: 'Others', icon: <HeartOutlined /> }
  ];

  // API calls
  useEffect(() => {
    getPlaylistData();
  }, []);

  const getPlaylistData = async () => {
    setIsLoading(true);
    try {
      const resp = await getData("/api/playlist/31");
      if (resp && resp.datas) {
        setDataSources(Array.isArray(resp.datas) ? resp.datas : [resp.datas]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      showAlert("error", "Error", "Failed to fetch playlist data");
    } finally {
      setIsLoading(false);
    }
  };

  const [form] = Form.useForm();

  // Handler functions
  const showAlert = (type, title, description) => {
    api[type]({
      message: title,
      description: description,
      placement: 'topRight',
      duration: 3
    });
  };

  const onCloseDrawer = () => {
    setIsOpenDrawer(false);
    setIsEdit(false);
    setIdSelected(null);
    form.resetFields();
  };

  const handleDrawer = () => {
    setIsOpenDrawer(true);
    setIsEdit(false);
    form.resetFields();
  };

  const handleSubmit = async () => {
    try {
      setSubmitLoading(true);
      const values = await form.validateFields();

      const payload = {
        play_name: values.play_name,
        play_url: values.play_url,
        play_thumbnail: values.play_thumbnail,
        play_genre: values.play_genre,
        play_description: values.play_description || "",
        group_id: "31"
      };

      let url, method;
      
      if (isEdit && idSelected) {
        url = `/api/playlist/update/${idSelected}`;
        method = "POST";
      } else {
        url = "/api/playlist/31";
        method = "POST";
      }

      const resp = await sendData(url, payload, method);

      if (resp?.message === "OK") {
        onCloseDrawer();
        showAlert("success", "Success", isEdit ? "Playlist updated successfully" : "Playlist created successfully");
        await getPlaylistData();
      } else {
        showAlert("error", "Error", resp?.message || "Failed to save playlist");
      }
    } catch (err) {
      console.error("Submit error:", err);
      showAlert("error", "Error", err.message || "Failed to save playlist");
    } finally {
      setSubmitLoading(false);
    }
  };

  const confirmDelete = async (record) => {
    try {
      const resp = await deleteData(`/api/playlist/${record.id_play}`);
      console.log("Delete response:", resp);

      await getPlaylistData();
      showAlert("success", "Success", "Playlist deleted successfully");
    } catch (err) {
      console.error("Delete error:", err);
      showAlert("error", "Error", "Failed to delete playlist");
    }
  };

  const handleDrawerEdit = (record) => {
    setIsOpenDrawer(true);
    setIsEdit(true);
    setIdSelected(record.id_play);

    form.setFieldsValue({
      play_name: record.play_name,
      play_url: record.play_url,
      play_thumbnail: record.play_thumbnail,
      play_genre: record.play_genre,
      play_description: record.play_description
    });
  };

  const handleSearch = (search) => {
    setSearchText(search.toLowerCase());
  };

  // Data processing
  const dataSourceFiltered = dataSources.filter((item) => {
    if (!searchText) return true;
    return (
      (item.play_name && item.play_name.toLowerCase().includes(searchText)) ||
      (item.play_genre && item.play_genre.toLowerCase().includes(searchText)) ||
      (item.play_description && item.play_description.toLowerCase().includes(searchText))
    );
  });

  const filteredPlaylists = activeFilter === 'all' 
    ? dataSourceFiltered 
    : dataSourceFiltered.filter(item => item.play_genre === activeFilter);

  const getGenreInfo = (genre) => {
    return genreOptions.find(g => g.value === genre) || genreOptions[0];
  };

  const openInNewTab = (url) => {
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Component rendering
  const renderStatsCard = () => {
    const totalPlaylists = dataSources.length;

    return (
      <Card className="stats-card">
        <Text strong className="text-brown" style={{ fontSize: '16px' }}>TOTAL PLAYLISTS</Text>
        <Title level={2} className="text-brown" style={{ margin: '8px 0', fontSize: '36px' }}>
          {totalPlaylists}
        </Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={handleDrawer}
          style={{ 
            background: 'var(--brown)',
            borderColor: 'var(--brown)'
          }}
        >
          New Playlist
        </Button>
      </Card>
    );
  };

  const renderDrawer = () => (
    <Drawer
      width={500}
      title={
        <div className="text-brown">
          {isEdit ? "✏️ Edit Playlist" : "🎵 Add New Playlist"}
        </div>
      }
      onClose={onCloseDrawer}
      open={isOpenDrawer}
      destroyOnClose
      className="playlist-drawer"
      extra={
        <Space>
          <Button 
            onClick={onCloseDrawer} 
            disabled={submitLoading}
            style={{
              borderColor: 'var(--brown)',
              color: 'var(--brown)',
              background: 'var(--cream)'
            }}
          >
            Cancel
          </Button>
          <Button 
            type="primary" 
            onClick={handleSubmit}
            loading={submitLoading}
            style={{ 
              background: 'var(--brown)', 
              borderColor: 'var(--brown)',
              borderRadius: 'var(--border-radius-md)'
            }}
          >
            {isEdit ? "💾 Update" : "🚀 Create"}
          </Button>
        </Space>
      }
    >
      <Form form={form} layout="vertical" className="playlist-form">
        <Form.Item
          label={<span className="text-brown">Playlist Name</span>}
          name="play_name"
          rules={[
            { required: true, message: "Please input playlist name!" },
            { min: 2, message: "Name must be at least 2 characters!" }
          ]}
          className="playlist-form-item"
        >
          <Input 
            placeholder="Enter playlist name" 
            prefix={<CustomerServiceOutlined className="text-brown" />}
          />
        </Form.Item>

        <Form.Item
          label={<span className="text-brown">URL</span>}
          name="play_url"
          rules={[
            { required: true, message: "Please input playlist URL!" },
            { type: 'url', message: "Please enter a valid URL!" }
          ]}
          className="playlist-form-item"
        >
          <Input 
            placeholder="Enter URL (e.g., https://youtu.be/...)" 
            prefix={<YoutubeOutlined className="text-brown" />}
          />
        </Form.Item>

        <Form.Item
          label={<span className="text-brown">Thumbnail URL</span>}
          name="play_thumbnail"
          rules={[
            { required: true, message: "Please input thumbnail URL!" },
            { type: 'url', message: "Please enter a valid URL!" }
          ]}
          className="playlist-form-item"
        >
          <Input 
            placeholder="Enter image URL (e.g., https://img.youtube.com/...)" 
            prefix={<PictureOutlined className="text-brown" />}
          />
        </Form.Item>

        <Form.Item
          label={<span className="text-brown">Genre</span>}
          name="play_genre"
          rules={[{ required: true, message: "Please select genre!" }]}
          className="playlist-form-item"
        >
          <Select
            placeholder="Select genre"
            dropdownStyle={{
              background: 'var(--cream)',
              border: '1px solid var(--brown)'
            }}
          >
            {genreOptions.map(option => (
              <Option 
                key={option.value} 
                value={option.value}
                style={{ background: 'var(--cream)' }}
              >
                {option.icon} {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label={<span className="text-brown">Description (Optional)</span>}
          name="play_description"
          className="playlist-form-item"
        >
          <Input.TextArea 
            rows={4} 
            placeholder="Enter description (optional)" 
          />
        </Form.Item>
      </Form>
    </Drawer>
  );

  return (
    <div className="bg-cream" style={{ minHeight: '100vh', padding: 'var(--space-lg)' }}>
      {contextHolder}
      <div className="playlist-container">
        
        {/* Header */}
        <div className="playlist-header">
          <Title level={1} className="playlist-title">
            ⭐ Playlist Manager
          </Title>
          <Paragraph className="playlist-subtitle">
            Manage and enjoy your favorite content in one place
          </Paragraph>
        </div>

        {/* Stats Card */}
        {renderStatsCard()}

        {/* Filters */}
        <Card className="filter-card">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={12}>
              <Text strong style={{ 
                display: 'block', 
                marginBottom: 'var(--space-md)', 
                color: 'var(--brown)',
                fontSize: '16px'
              }}>
                Filter by Genre
              </Text>
              <Space wrap>
                <Tag 
                  onClick={() => setActiveFilter('all')}
                  className={`filter-tag ${activeFilter === 'all' ? 'active' : ''}`}
                >
                  🌟 All ({dataSources.length})
                </Tag>
                {genreOptions.map(option => {
                  const count = dataSources.filter(item => item.play_genre === option.value).length;
                  return (
                    <Tag
                      key={option.value}
                      onClick={() => setActiveFilter(option.value)}
                      className={`filter-tag ${activeFilter === option.value ? 'active' : ''}`}
                    >
                      {option.icon} {option.label} ({count})
                    </Tag>
                  );
                })}
              </Space>
            </Col>
            <Col xs={24} md={12}>
              <Text strong style={{ 
                display: 'block', 
                marginBottom: 'var(--space-md)', 
                color: 'var(--brown)',
                fontSize: '16px'
              }}>
                <SearchOutlined /> Search
              </Text>
              <Input
                prefix={<SearchOutlined className="text-brown" />}
                placeholder="Search playlists, genres, or descriptions..."
                allowClear
                size="large"
                onChange={(e) => handleSearch(e.target.value)}
                className="rounded-lg border-brown bg-cream"
              />
            </Col>
          </Row>
        </Card>

        {/* Content Grid */}
        {isLoading ? (
          <Card className="rounded-lg border-brown bg-cream">
            <Skeleton active paragraph={{ rows: 8 }} />
          </Card>
        ) : filteredPlaylists.length === 0 ? (
          <Card className="empty-state">
            <Empty
              description={
                <div>
                  <Title level={3} className="text-brown">
                    {searchText ? "🔍 No results found" : "📝 No playlists yet"}
                  </Title>
                  <Text className="text-brown" style={{ fontSize: '16px' }}>
                    {searchText 
                      ? `No playlists found matching "${searchText}"`
                      : "Create your first playlist to manage your favorite media"
                    }
                  </Text>
                </div>
              }
            />
            {!searchText && (
              <Button 
                type="primary"
                size="large"
                icon={<PlusOutlined />}
                onClick={handleDrawer}
                className="bg-brown"
                style={{ 
                  borderRadius: 'var(--border-radius-md)',
                  marginTop: 'var(--space-md)'
                }}
              >
                Create First Playlist
              </Button>
            )}
          </Card>
        ) : (
          <Row gutter={[24, 24]}>
            {filteredPlaylists.map((item) => {
              const genreInfo = getGenreInfo(item.play_genre);
              return (
                <Col xs={24} sm={12} lg={8} xl={6} key={item.id_play}>
                  <Card
                    hoverable
                    className="playlist-card"
                    cover={
                      <div className="playlist-card-cover">
                        <img
                          alt="playlist thumbnail"
                          src={item.play_thumbnail}
                          className="playlist-card-img"
                          onError={(e) => {
                            e.target.src = `https://via.placeholder.com/300x200/${colors.cream.substring(1)}/${colors.brown.substring(1)}?text=🎵+No+Image`;
                          }}
                        />
                        <div style={{
                          position: 'absolute',
                          top: '12px',
                          left: '12px'
                        }}>
                          <Tag 
                            className="text-brown"
                            style={{
                              borderRadius: '20px',
                              fontWeight: 'bold',
                              border: 'none',
                              background: 'var(--brown)',
                              color: 'var(--cream)'
                            }}
                          >
                            {genreInfo.icon} {genreInfo.label}
                          </Tag>
                        </div>
                        <div style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px'
                        }}>
                          <Tooltip title="Open in new tab">
                            <Button 
                              type="primary"
                              shape="circle"
                              icon={<YoutubeOutlined />}
                              style={{ 
                                background: 'var(--brown)',
                                border: 'none'
                              }}
                              onClick={() => openInNewTab(item.play_url)}
                            />
                          </Tooltip>
                        </div>
                        <div style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          background: `linear-gradient(transparent, var(--brown)80)`,
                          height: '60px'
                        }} />
                      </div>
                    }
                    actions={[
                      <Tooltip title="Edit playlist" key="edit">
                        <EditOutlined 
                          onClick={() => handleDrawerEdit(item)}
                          className="playlist-card-actions"
                        />
                      </Tooltip>,
                      <Tooltip title="Share" key="share">
                        <ShareAltOutlined 
                          className="playlist-card-actions"
                          onClick={() => {
                            navigator.clipboard.writeText(item.play_url);
                            showAlert("success", "Copied! 📋", "Link copied to clipboard");
                          }}
                        />
                      </Tooltip>,
                      <Popconfirm
                        key="delete"
                        title="Delete playlist"
                        description={`Are you sure to delete "${item.play_name}"?`}
                        onConfirm={() => confirmDelete(item)}
                        okText="Yes, Delete"
                        cancelText="Cancel"
                        okButtonProps={{ 
                          className: "bg-brown"
                        }}
                      >
                        <Tooltip title="Delete playlist">
                          <DeleteOutlined className="playlist-card-actions" />
                        </Tooltip>
                      </Popconfirm>
                    ]}
                  >
                    <div style={{ padding: 'var(--space-sm) 0' }}>
                      <Title 
                        level={4} 
                        className="playlist-card-title"
                        ellipsis={{ tooltip: item.play_name }}
                      >
                        {item.play_name}
                      </Title>
                      <Paragraph 
                        className="playlist-card-description"
                        ellipsis={{ rows: 2, tooltip: item.play_description }}
                      >
                        {item.play_description || "No description"}
                      </Paragraph>
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}

        {/* Render Drawer */}
        {renderDrawer()}
      </div>
    </div>
  );
};

export default Playlist;